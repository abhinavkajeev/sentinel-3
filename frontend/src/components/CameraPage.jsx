import React, { useRef, useState, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  ArrowLeft, 
  AlertTriangle,
  Eye,
  Wifi,
  Hash,
  Upload
} from 'lucide-react';

const CameraPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);
  const [lastDetection, setLastDetection] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);
  const [currentHash, setCurrentHash] = useState('');

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

  // Load face detection models on mount
  useEffect(() => {
    const loadModelsAndStart = async () => {
      try {
        // In real implementation: await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log('Face detection models loaded');
      } catch (err) {
        setError('Failed to load face detection models.');
      }
      startCamera();
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

  // Capture and upload to IPFS
  const captureAndUpload = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob for IPFS upload
      canvas.toBlob(async (blob) => {
        if (blob) {
          setUploadingToIPFS(true);
          
          try {
            // Simulate IPFS upload and hashing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15);
            const timestamp = new Date().toLocaleTimeString();
            
            setCurrentHash(mockHash);
            setLastDetection(timestamp);
            setDetectionCount(prev => prev + 1);
            
            // Here you would:
            // 1. Upload to IPFS: const hash = await ipfs.add(blob)
            // 2. Store hash in blockchain as transaction
            // 3. Check if person detected before (entry/exit logic)
            
            console.log('IPFS Hash:', mockHash);
            console.log('Detection count:', detectionCount + 1);
            
          } catch (error) {
            console.error('Failed to upload to IPFS:', error);
            setError('Failed to upload to IPFS');
          } finally {
            setUploadingToIPFS(false);
          }
        }
      }, 'image/jpeg', 0.8);
    }
  };

  // Auto face detection
  useEffect(() => {
    let interval;
    const detectFaceFromVideo = async () => {
      if (videoRef.current && streaming && !uploadingToIPFS) {
        setDetecting(true);
        
        // Simulate face detection
        setTimeout(async () => {
          setDetecting(false);
          // Simulate random face detection for demo
          if (Math.random() > 0.6) {
            await captureAndUpload();
          }
        }, 800);
      }
    };
    
    if (streaming) {
      interval = setInterval(detectFaceFromVideo, 3000);
    }
    
    return () => clearInterval(interval);
  }, [streaming, uploadingToIPFS]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '3s', animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-full mr-3">
              <Video className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Live Monitoring
            </h1>
          </div>
          <p className="text-gray-400 max-w-md mx-auto">
            Automatic face detection with IPFS storage and blockchain logging
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full max-w-4xl">
          {streaming ? (
            <div className="relative">
              {/* Camera Container */}
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
                <div className="relative overflow-hidden rounded-xl">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto rounded-xl"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  
                  {/* Detection Overlay */}
                  {detecting && (
                    <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center rounded-xl">
                      <div className="flex items-center space-x-3 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full">
                        <div className="animate-spin">
                          <Eye className="w-6 h-6 text-yellow-400" />
                        </div>
                        <span className="text-yellow-400 font-medium">Detecting Face...</span>
                      </div>
                    </div>
                  )}

                  {/* Upload Overlay */}
                  {uploadingToIPFS && (
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center rounded-xl">
                      <div className="flex items-center space-x-3 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full">
                        <div className="animate-spin">
                          <Upload className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-blue-400 font-medium">Uploading to IPFS...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between mt-4 px-2">
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
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-300">Latest IPFS Hash</span>
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
              </div>
            </div>
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
        </div>

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