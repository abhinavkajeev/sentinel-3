import React, { useState, useEffect } from 'react';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (formData.username === 'admin' && formData.password === 'sentinel123') {
      setShowLogin(false);
      if (onLogin) onLogin();
    } else {
      setError('Invalid admin credentials');
    }
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (formData.adminKey !== 'SENTINEL-ADMIN-2024') {
      setError('Invalid admin key');
      setIsLoading(false);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Admin account created successfully!');
    setShowSignup(false);
    setIsLoading(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
    setError('');
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      adminKey: ''
    });
  };

  return (
  <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6">
        <div className={`flex items-center space-x-3 transition-all duration-1000 ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-gray-900 font-bold text-lg">S3</span>
          </div>
          <span className="text-2xl font-bold">Sentinel-3</span>
        </div>
        
        <div className={`hidden md:flex items-center space-x-8 transition-all duration-1000 delay-200 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
        </div>
        
        <div className={`flex items-center space-x-4 transition-all duration-1000 delay-300 ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <button 
            onClick={() => setShowLogin(true)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Admin Login
          </button>
          <button 
            onClick={() => setShowSignup(true)}
            className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            Admin Signup
          </button>
        </div>
      </nav>

      {/* Background Effects */}
  {/* Background Effects removed as per user request */}

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] px-6">
        <div className="text-center max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
              <span className="block">Decentralized</span>
              <span className="block text-white">
                Security Event
              </span>
              <span className="block text-gray-400 text-4xl md:text-5xl lg:text-6xl mt-4">
                Monitoring
              </span>
            </h1>
          </div>

          <div className={`transition-all duration-1000 delay-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionary blockchain-powered security system that creates tamper-proof audit trails 
              for physical security events with automated threat response capabilities.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-900 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button 
              onClick={() => setShowLogin(true)}
              className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Access Dashboard
            </button>
            <button className="border border-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 hover:bg-gray-800/50 transition-all duration-300">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-1100 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400 text-sm">Tamper Proof</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">Real-time</div>
              <div className="text-gray-400 text-sm">Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">Blockchain</div>
              <div className="text-gray-400 text-sm">Secured</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-gray-500 text-sm mb-2">01/04 • Scroll down</div>
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Admin Login
              </h2>
              <button 
                onClick={closeModals}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 text-sm">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter admin username"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </div>

            <p className="text-gray-400 text-sm text-center mt-4">
              Demo: admin / sentinel123
            </p>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Admin Signup
              </h2>
              <button 
                onClick={closeModals}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 text-sm">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Choose admin username"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Create password"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2 text-sm">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Confirm password"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm">Admin Key</label>
                <input
                  type="password"
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter admin registration key"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Admin Account'
                )}
              </button>
            </div>

            <p className="text-gray-400 text-sm text-center mt-4">
              Demo admin key: SENTINEL-ADMIN-2024
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default LandingPage;