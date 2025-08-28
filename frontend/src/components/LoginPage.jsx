import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Shield, Building2, Lock, User, Phone, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    phoneNumber: '',
    email: '',
    password: '',
    companyPin: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, register, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Check URL parameter to determine initial mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      if (isLogin) {
        result = await login(formData.companyPin, formData.password);
      } else {
        result = await register(formData);
      }
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Authentication failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      companyName: '',
      phoneNumber: '',
      email: '',
      password: '',
      companyPin: '',
    });
    clearError();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] bg-green-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-3xl animation-delay-4000 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-400/90 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-black" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sentinel-3</h1>
          <p className="text-gray-400">Building Security Management</p>
        </div>

        {/* Form Card */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                      placeholder="security@company.com"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    name="companyPin"
                    value={formData.companyPin}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    placeholder="6-digit PIN"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400/90 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/25"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              onClick={toggleMode}
              className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
            
            {/* Beautiful Back Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-yellow-400/20 hover:to-yellow-500/20 border border-gray-600/50 hover:border-yellow-400/50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20"
              >
                <ArrowLeft size={18} className="text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
                <span className="text-gray-300 group-hover:text-yellow-400 font-medium transition-colors duration-300">Back to Landing Page</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
