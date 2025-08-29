import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
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
  const [companyPinResult, setCompanyPinResult] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, register, error, clearError, company, setCompany } = useAuth();
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

  // Custom login function using axios
  const handleLoginWithAxios = async (companyPin, password) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3040/api/company/login', {
        companyPin,
        password
      });
      if (response.data && response.data.ok && response.data.company) {
        localStorage.setItem('sentinel3_company', JSON.stringify(response.data.company));
        if (setCompany) setCompany(response.data.company);
        setLoginSuccess(true);
        setTimeout(() => {
          window.location.reload();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }, 1000);
        return true;
      } else {
        alert(response.data.error || 'Login failed');
        return false;
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCompanyPinResult('');
    if (isLogin) {
      const success = await handleLoginWithAxios(formData.companyPin, formData.password);
      if (success) {
        navigate('/dashboard');
      }
    } else {
      setLoading(true);
      try {
        let result = await register(formData);
        if (result.ok && result.companyPin) {
          setCompanyPinResult(result.companyPin);
        }
      } catch (err) {
        setCompanyPinResult('');
        alert('Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  // Clean redirect: if company context is set, use <Navigate />
  if (company) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      companyName: '',
      phoneNumber: '',
      email: '',
      password: '',
      companyPin: '',
    });
    setCompanyPinResult('');
    clearError();
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background effects */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div 
          className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] bg-green-500/20 rounded-full filter blur-3xl animate-pulse"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-3xl animation-delay-4000 animate-pulse"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.div>

      <motion.div 
        className="w-full max-w-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo and Title */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div 
            className="w-16 h-16 bg-yellow-400/90 rounded-2xl flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
          >
            <Shield className="text-black" size={32} />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Sentinel-3
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Building Security Management
          </motion.p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8"
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <AnimatePresence mode="wait">
            <motion.h2 
              key={isLogin ? 'login' : 'register'}
              className="text-2xl font-bold text-white text-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h2>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {loginSuccess && (
              <motion.div 
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-green-400 text-sm">Login successful! Redirecting to dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {companyPinResult && !isLogin && (
              <motion.div 
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-green-400 text-sm">Your company PIN: <span className="font-bold">{companyPinResult}</span></p>
                <p className="text-green-300 text-xs">Use this PIN to login to your dashboard.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <AnimatePresence>
              {!isLogin && (
                <>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <motion.div 
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
                        placeholder="Enter company name"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <motion.div 
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
                        placeholder="+1234567890"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <motion.div 
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
                        placeholder="security@company.com"
                        required
                      />
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company PIN
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      name="companyPin"
                      value={formData.companyPin}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
                      placeholder="6-character PIN (A-Z, 0-9)"
                      maxLength="6"
                      pattern="[A-Za-z0-9]{6}"
                      required
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
                  placeholder="Enter password"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400/90 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/25"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(250, 204, 21, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </motion.button>
          </motion.form>

          <motion.div 
            className="mt-6 text-center space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <motion.button
              onClick={toggleMode}
              className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </motion.button>
            
            {/* Beautiful Back Button */}
            <div className="pt-4 border-t border-white/10">
              <motion.button
                onClick={() => navigate('/')}
                className="group flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-yellow-400/20 hover:to-yellow-500/20 border border-gray-600/50 hover:border-yellow-400/50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(250, 204, 21, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={18} className="text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
                <span className="text-gray-300 group-hover:text-yellow-400 font-medium transition-colors duration-300">Back to Landing Page</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
