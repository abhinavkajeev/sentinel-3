import { create } from 'ipfs-http-client';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
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
    console.log(`IPFS Service initialized with ${config.host}:${config.port}`);
  }

  /**
   * Upload image to IPFS
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} filename - Original filename
   * @returns {Promise<{hash: string, url: string}>}
   */
  async uploadImage(imageBuffer, filename = 'image.jpg') {
    try {
      // Create form data for IPFS upload
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename,
        contentType: 'image/jpeg' // Adjust based on your image type
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
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload image to IPFS: ${error.message}`);
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
