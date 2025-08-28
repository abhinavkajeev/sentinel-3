import { create } from 'ipfs-http-client';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import {PinataSDK} from 'pinata';
import { getIPFSConfig } from '../config/ipfs.config.js';

class IPFSService {
  constructor() {
    // Initialize IPFS client using configuration
    const config = getIPFSConfig();
    
    this.ipfs = create({
      host: config.host,
      port: config.port,
      protocol: config.protocol,
      headers: {
        authorization: config.auth ? 
          (config.auth.startsWith('Bearer ') ? config.auth : `Basic ${config.auth}`) : 
          undefined
      }
    });
    
    this.gateway = config.gateway;
    this.provider = process.env.IPFS_PROVIDER || 'infura';
    
    // Initialize Pinata SDK if using Pinata
    if (this.provider === 'pinata') {
      this.pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway: process.env.GATEWAY_URL ? `https://${process.env.GATEWAY_URL}` : 'https://gateway.pinata.cloud'
      });
      console.log(`Pinata SDK initialized with JWT token`);
    }
    
    console.log(`IPFS Service initialized with ${this.provider} at ${config.host}:${config.port}`);
  }

  /**
   * Upload image to IPFS
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} filename - Original filename
   * @returns {Promise<{hash: string, url: string}>}
   */
  async uploadImage(imageBuffer, filename = 'image.jpg') {
    try {
      if (this.provider === 'pinata') {
        return await this.uploadToPinata(imageBuffer, filename);
      } else {
        return await this.uploadToStandardIPFS(imageBuffer, filename);
      }
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload image to IPFS: ${error.message}`);
    }
  }

  /**
   * Upload to Pinata IPFS
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} filename - Original filename
   * @returns {Promise<{hash: string, url: string}>}
   */
  async uploadToPinata(imageBuffer, filename = 'image.jpg') {
    try {
      const config = getIPFSConfig();
      
      // Create form data for Pinata
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename,
        contentType: 'image/jpeg'
      });

      // Add metadata
      formData.append('pinataMetadata', JSON.stringify({
        name: filename,
        keyvalues: {
          app: 'Sentinel-3',
          timestamp: new Date().toISOString(),
          type: 'security-camera'
        }
      }));

      // Upload to Pinata using HTTP API
      const response = await fetch(`https://${config.host}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinata upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const hash = result.IpfsHash;
      
      // Generate Pinata gateway URL
      const url = this.getGatewayUrl(hash);
      
      console.log(`Image uploaded to Pinata IPFS: ${hash}`);
      
      return {
        hash,
        url,
        cid: hash
      };
    } catch (error) {
      console.error('Pinata upload error:', error);
      throw new Error(`Failed to upload to Pinata: ${error.message}`);
    }
  }

  /**
   * Upload to standard IPFS
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} filename - Original filename
   * @returns {Promise<{hash: string, url: string}>}
   */
  async uploadToStandardIPFS(imageBuffer, filename = 'image.jpg') {
    try {
      // Create form data for IPFS upload
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename,
        contentType: 'image/jpeg'
      });

      // Upload to IPFS
      const result = await this.ipfs.add(formData);
      
      // Get the hash
      const hash = result.cid.toString();
      
      // Generate IPFS gateway URL
      const url = this.getGatewayUrl(hash);
      
      console.log(`Image uploaded to IPFS: ${hash}`);
      
      return {
        hash,
        url,
        cid: hash
      };
    } catch (error) {
      console.error('Standard IPFS upload error:', error);
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
  }

  /**
   * Upload image from base64 string
   * @param {string} base64String - Base64 encoded image
   * @param {string} filename - Filename
   * @returns {Promise<{hash: string, url: string}>}
   */
  async uploadBase64Image(base64String, filename = 'image.jpg') {
    try {
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Convert to buffer
      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      return await this.uploadImage(imageBuffer, filename);
    } catch (error) {
      console.error('Base64 upload error:', error);
      throw new Error(`Failed to upload base64 image: ${error.message}`);
    }
  }

  /**
   * Retrieve image from IPFS
   * @param {string} hash - IPFS hash/CID
   * @returns {Promise<Buffer>}
   */
  async getImage(hash) {
    try {
      const chunks = [];
      for await (const chunk of this.ipfs.cat(hash)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('IPFS retrieval error:', error);
      throw new Error(`Failed to retrieve image from IPFS: ${error.message}`);
    }
  }

  /**
   * Get IPFS gateway URL
   * @param {string} hash - IPFS hash/CID
   * @returns {string} Gateway URL
   */
  getGatewayUrl(hash) {
    return `${this.gateway}/${hash}`;
  }

  /**
   * Pin file to IPFS (keep it available)
   * @param {string} hash - IPFS hash/CID
   * @returns {Promise<boolean>}
   */
  async pinFile(hash) {
    try {
      await this.ipfs.pin.add(hash);
      console.log(`File pinned: ${hash}`);
      return true;
    } catch (error) {
      console.error('IPFS pin error:', error);
      return false;
    }
  }

  /**
   * Check if file exists on IPFS
   * @param {string} hash - IPFS hash/CID
   * @returns {Promise<boolean>}
   */
  async fileExists(hash) {
    try {
      const stat = await this.ipfs.files.stat(`/ipfs/${hash}`);
      return stat && stat.cid;
    } catch (error) {
      return false;
    }
  }
}

export default IPFSService;
