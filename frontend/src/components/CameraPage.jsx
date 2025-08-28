import React, { useRef, useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

const CameraPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [streaming, setStreaming] = useState(false);

  // Start camera
  const startCamera = async () => {
    setError('');
    setPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreaming(true);
    } catch (err) {
      setError('Unable to access camera.');
    }
  };

  // Load face-api.js models and start camera on mount
  useEffect(() => {
    const loadModelsAndStart = async () => {
      const MODEL_URL = '/models';
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        // Optionally load more models here if needed
      } catch (err) {
        setError('Failed to load face detection models.');
      }
      startCamera();
    };
    loadModelsAndStart();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line
  }, []);

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setStreaming(false);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setPhoto(dataUrl);
      stopCamera();
    }
  };


  // Detect face in video and auto-capture
  useEffect(() => {
    let interval;
    const detectFaceFromVideo = async () => {
      if (videoRef.current && streaming) {
        const result = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (result) {
          capturePhoto();
        }
      }
    };
    if (streaming && !photo) {
      interval = setInterval(detectFaceFromVideo, 700); // check every 0.7s
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [streaming, photo]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Camera & Face Detection</h1>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      <div className="flex flex-col items-center space-y-4">
        {streaming && !photo && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-lg border-4 border-gray-700 w-full max-w-md mb-4"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="flex space-x-4">
              <button
                onClick={capturePhoto}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 font-semibold"
              >
                Capture Photo
              </button>
              {/* Face detection is now automatic */}
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 font-semibold"
              >
                Stop Camera
              </button>
            </div>
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {photo && (
          <div className="flex flex-col items-center mt-6">
            <img src={photo} alt="Captured" className="rounded-lg border-4 border-blue-700 max-w-md" />
            <button
              onClick={() => setPhoto(null)}
              className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 font-semibold"
            >
              Retake Photo
            </button>
          </div>
        )}
      </div>
      <Link to="/dashboard">
        <button className="mt-8 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-800 font-semibold text-white">
          Back to Log
        </button>
      </Link>
      <p className="mt-8 text-gray-400 text-sm max-w-lg text-center">
        Note: Face detection is a placeholder. For real detection, integrate a library like <a href="https://github.com/justadudewhohacks/face-api.js/" className="underline text-blue-400" target="_blank" rel="noopener noreferrer">face-api.js</a>.
      </p>
    </div>
  );
};

export default CameraPage;
