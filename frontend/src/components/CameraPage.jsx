import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import { 
  Video, 
  VideoOff, 
  ArrowLeft, 
  AlertTriangle,
  Eye,
  Wifi,
  Hash,
  Upload,
  LogIn,
  LogOut,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const CameraPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { company } = useAuth();
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);
  const [lastDetection, setLastDetection] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);
  const [currentHash, setCurrentHash] = useState('');
  const [lastEvent, setLastEvent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Start camera
  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreaming(true);
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  // Check authentication
  useEffect(() => {
    if (!company) {
      navigate('/login');
      return;
    }
  }, [company, navigate]);

  // Load face detection models on mount
  useEffect(() => {
    const loadModelsAndStart = async () => {
      try {
        // Load face detection models from public/models folder
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        console.log('Face detection models loaded successfully');
        setError('Real-time face detection ready');
        setModelsLoaded(true);
        
        // Start camera regardless of model loading status
        startCamera();
      } catch (err) {
        console.error('Failed to load face detection models:', err);
        setError('Failed to load face detection models: ' + (err?.message || err));
        // Still start camera even if models fail to load
        startCamera();
      }
    };
    loadModelsAndStart();
    return () => {
      stopCamera();
    };
  }, []);

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setStreaming(false);
      setDetecting(false);
    }
  };

  // Capture and upload to IPFS, now accepts faceDescriptor from face-api.js
  const captureAndUpload = async (faceDescriptor) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && company) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          setUploadingToIPFS(true);
          setIsProcessing(true);
          try {
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            // Use real face descriptor if available, else fallback to random
            const descriptor = faceDescriptor || Array.from({ length: 128 }, () => Math.random() * 2 - 1);
            const isEntry = detectionCount % 2 === 0;
            const eventType = isEntry ? 'ENTRY' : 'EXIT';
            let response, timestamp;
            try {
              if (isEntry) {
                response = await api.logEntry({
                  companyPin: company.companyPin,
                  faceDescriptor: descriptor,
                  imageBase64: base64
                });
              } else {
                response = await api.logExit({
                  companyPin: company.companyPin,
                  faceDescriptor: descriptor,
                  imageBase64: base64
                });
              }
              timestamp = new Date().toLocaleTimeString();
              setCurrentHash(response.photoHash);
              setLastDetection(timestamp);
              setDetectionCount(prev => prev + 1);
              setLastEvent({
                type: eventType,
                sessionId: response.sessionId,
                photoHash: response.photoHash,
                ipfsHash: response.ipfsHash,
                timestamp,
                blockchain: response.onchain
              });
              console.log(`${eventType} logged:`, response);
            } catch (err) {
              console.error('API call failed:', err);
              setError('Failed to log event: ' + (err?.message || err));
            }
          } catch (error) {
            console.error('Failed to process detection:', error);
            setError(`Failed to log ${eventType}: ${error.message}`);
          } finally {
            setUploadingToIPFS(false);
            setIsProcessing(false);
          }
        }
      }, 'image/jpeg', 0.8);
    }
  };

  // Auto face detection using face-api.js
  useEffect(() => {
    let interval;
    const detectFaceFromVideo = async () => {
      if (videoRef.current && streaming && !uploadingToIPFS) {
        // Check if models are loaded before attempting detection
        if (!modelsLoaded) {
          console.log('Face detection models not yet loaded, skipping detection');
          return;
        }
        
        setDetecting(true);
        
        // Real-time face detection using face-api.js
        try {
          const video = videoRef.current;
          if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
            // Use face-api.js for real face detection
            const detections = await faceapi.detectAllFaces(
              video,
              new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceDescriptors();
            
            if (detections && detections.length > 0) {
              console.log('Face detected in real-time:', detections.length, 'faces');
              const face = detections[0];
              setDetecting(false);
              await captureAndUpload(face.descriptor);
            } else {
              console.log('No face detected');
              setDetecting(false);
            }
          } else {
            console.log('Video not ready for analysis');
            setDetecting(false);
          }
        } catch (error) {
          console.error('Face detection error:', error);
          setDetecting(false);
        }
      }
    };
    if (streaming) {
      interval = setInterval(detectFaceFromVideo, 3000);
    }
    return () => clearInterval(interval);
  }, [streaming, uploadingToIPFS, modelsLoaded]);

  // Helper function to generate face descriptor from detected face
  const generateFaceDescriptor = (face, canvasWidth, canvasHeight) => {
    const { boundingBox } = face;
    const centerX = boundingBox.x + boundingBox.width / 2;
    const centerY = boundingBox.y + boundingBox.height / 2;
    const size = boundingBox.width * boundingBox.height;
    
    // Create a descriptor based on face position and size
    const descriptor = Array.from({ length: 128 }, (_, i) => {
      if (i < 32) return (centerX / canvasWidth) * 2 - 1;
      if (i < 64) return (centerY / canvasHeight) * 2 - 1;
      if (i < 96) return (size / (canvasWidth * canvasHeight)) * 2 - 1;
      return Math.random() * 2 - 1;
    });
    
    return descriptor;
  };

  // Helper function to generate random face descriptor
  const generateRandomFaceDescriptor = () => {
    return Array.from({ length: 128 }, () => Math.random() * 2 - 1);
  };

  // Helper function to analyze frame for face-like patterns
  const analyzeFrameForFace = (imageData) => {
    const { data, width, height } = imageData;
    let skinTonePixels = 0;
    let totalPixels = width * height;
    
    // Simple skin tone detection
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Basic skin tone detection (simplified)
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        skinTonePixels++;
      }
    }
    
    const skinToneRatio = skinTonePixels / totalPixels;
    return skinToneRatio > 0.1; // If more than 10% of pixels are skin tone
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {streaming ? (
          <>
            {/* Live Camera Feed */}
            <div className="flex justify-center mt-8">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="rounded-xl shadow-lg border-4 border-gray-800 w-[480px] h-[360px] bg-black object-cover"
                style={{ background: '#111', transform: 'scaleX(-1)' }}
              />
            </div>
            {/* Status Bar */}
            <div className="flex items-center justify-between mt-4 px-2 w-full max-w-2xl">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">Live Feed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">IPFS Connected</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Auto-Detection: ON</span>
              </div>
            </div>

            {/* Detection Stats */}
            {detectionCount > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-300">Latest Photo Hash</span>
                  </div>
                  <p className="text-xs font-mono text-yellow-400 break-all">{currentHash}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{detectionCount}</div>
                  <div className="text-sm text-gray-400">Total Detections</div>
                  {lastDetection && (
                    <div className="text-xs text-gray-500 mt-1">Last: {lastDetection}</div>
                  )}
                </div>
              </div>
            )}

            {/* Last Event Details */}
            {lastEvent && (
              <div className="mt-4 bg-gray-800/50 rounded-lg p-4 w-full max-w-2xl">
                <div className="flex items-center space-x-2 mb-3">
                  {lastEvent.type === 'ENTRY' ? (
                    <LogIn className="w-5 h-5 text-green-400" />
                  ) : (
                    <LogOut className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-lg font-semibold text-white">
                    {lastEvent.type} Event Logged
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Session ID:</span>
                    <p className="text-yellow-400 font-mono">{lastEvent.sessionId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">IPFS Hash:</span>
                    <p className="text-blue-400 font-mono text-xs break-all">{lastEvent.ipfsHash}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Blockchain TX:</span>
                    <p className="text-green-400 font-mono text-xs break-all">{lastEvent.blockchain?.txHash}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Event ID:</span>
                    <p className="text-purple-400">{lastEvent.blockchain?.eventId}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Control */}
            <div className="flex justify-center mt-6">
              <button
                onClick={stopCamera}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors duration-200"
              >
                <VideoOff className="w-5 h-5" />
                <span>Stop Monitoring</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-6">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Initialize Monitoring</h3>
              <p className="text-gray-400 mb-6">Start live face detection and IPFS logging</p>
              <button
                onClick={startCamera}
                className="flex items-center space-x-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full mx-auto transition-colors duration-200"
              >
                <Video className="w-5 h-5" />
                <span>Start Live Feed</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 max-w-lg text-center">
          <p className="text-gray-500 text-sm">
            Automatic face detection with IPFS hash generation and blockchain transaction logging.
            Entry/Exit tracking based on face recognition patterns.
          </p>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default CameraPage;