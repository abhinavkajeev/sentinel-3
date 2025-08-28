import React, { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet } from '../blockchain/stacks';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { registerCompany } from '../services/companyService';
import { loginAdmin } from '../services/adminService';

import {
  Shield,
  Lock,
  Eye,
  Zap,
  Globe,
  ArrowRight,
  X,
  User,
  KeyRound,
  Activity,
  Database,
  Cpu,
  Network,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showCompanyReg, setShowCompanyReg] = useState(false);
  const [companyRegData, setCompanyRegData] = useState({ companyName: '', phoneNumber: '', email: '', password: '' });
  const [companyRegError, setCompanyRegError] = useState('');
  const [companyRegLoading, setCompanyRegLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Admin login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await loginAdmin(formData);
      if (result && result.ok) {
        console.log('Admin authenticated:', result);
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed.');
        console.log('Admin login failed:', result);
      }
    } catch (err) {
      setError('Login failed.');
      console.log('Admin login failed:', err);
    }
    setIsLoading(false);
  };
  // Admin login input change handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Track if company is registered
  const [companyRegistered, setCompanyRegistered] = useState(false);

  // Close all modals
  const closeModals = () => {
    setShowLogin(false);
    setShowCompanyReg(false);
  };
  // Navbar shrink state
  const [navShrink, setNavShrink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setNavShrink(true);
      } else {
        setNavShrink(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ...existing code...
  const handleCompanyRegChange = (e) => {
    setCompanyRegData({
      ...companyRegData,
      [e.target.name]: e.target.value
    });
  };
  

  const handleCompanyRegSubmit = async (e) => {
    e.preventDefault();
    setCompanyRegLoading(true);
    setCompanyRegError('');
    // Basic validation
    if (!companyRegData.companyName || !companyRegData.phoneNumber || !companyRegData.email || !companyRegData.password) {
      setCompanyRegError('All fields are required.');
      setCompanyRegLoading(false);
      return;
    }
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      // Here you would call registerCompany and check response
      // Example: const result = await registerCompany(companyRegData);
      // if (result.ok) { ... }
      alert('Company registered successfully!');
      setCompanyRegistered(true);
      console.log('Company registration data sent:', companyRegData);
    } catch (err) {
      setCompanyRegError('Registration failed.');
      console.log('Company registration failed:', err);
    }
    closeModals();
  };

  // Leather Wallet connect logic
  const handleConnectWallet = async () => {
    try {
      await connectWallet(({ stxAddress }) => {
        setWalletAddress(stxAddress);
        setWalletConnected(true);
        // Authenticate with backend
        fetch("/backend/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: stxAddress }),
        })
          .then((res) => res.json())
          .then((data) => {
            // Handle backend response (dummy)
            // You can set some state if needed
          });
      });
    } catch (err) {
      // Handle error
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setWalletAddress("");
    setWalletConnected(false);
  };

  const logoVariants = {
    hover: { rotate: 360 },
    tap: { scale: 0.95 }
  };

  const cardVariants = {
    hover: { 
      y: -10,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        className="flex items-center justify-between p-6 relative z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <Shield className="text-white w-8 h-8" />
          </div>
          <span className="text-xl font-bold">Sentinel-3</span>
        </div>

        {/* Fixed nav links only */}
        <motion.div
          className="fixed top-6 left-1/2 -translate-x-1/2 bg-black/50 rounded-full shadow-lg z-50 w-[60vw] max-w-xl backdrop-blur-md border border-gray-800 flex items-center justify-center px-6"
          style={{ boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)' }}
          animate={{
            scale: navShrink ? 0.85 : 1,
            paddingTop: navShrink ? '0.5rem' : '1rem',
            paddingBottom: navShrink ? '0.5rem' : '1rem',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        >
          {[
            { label: 'Home', href: '#home' },
            { label: 'Features', href: '#features' },
            { label: 'Security', href: '#security' },
            { label: 'About', href: '#about' }
          ].map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="mx-6 text-gray-300 hover:text-white transition-colors text-lg font-semibold cursor-pointer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -2 }}
              onClick={e => {
                e.preventDefault();
                if (item.label === 'Home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  const targetId = item.href.replace('#', '');
                  const section = document.getElementById(targetId);
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              {item.label}
            </motion.a>
          ))}
  </motion.div>

        <div className="flex items-center space-x-6">
          {/* Company Registration Button: always visible until registered */}
          {/* Company Registration Button: always visible until registered */}
          {!companyRegistered && (
            <button
              onClick={() => setShowCompanyReg(true)}
              className="px-6 py-2 border border-yellow-400 rounded-full bg-yellow-300 text-black font-semibold text-sm shadow-sm transition-all duration-200 transform hover:scale-105 hover:bg-yellow-200 hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              type="button"
            >
              Company Registration
            </button>
          )}
          {/* Admin Login Button: only visible after company is registered */}
          {companyRegistered && (
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 border border-gray-400 rounded-full bg-white text-black font-semibold text-sm shadow-sm transition-all duration-200 transform hover:scale-105 hover:bg-gray-100 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="button"
            >
              Admin Login
            </button>
          )}
        </div>
      {/* Company Registration Modal */}
      <AnimatePresence>
        {showCompanyReg && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-3xl p-8 w-full max-w-md border border-gray-800"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-white flex items-center space-x-3">
                  <KeyRound size={24} />
                  <span>Company Registration</span>
                </h2>
                <motion.button 
                  onClick={closeModals}
                  className="text-gray-400 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              <form className="space-y-4" onSubmit={handleCompanyRegSubmit}>
                <div>
                  <label className="text-gray-400 mb-2 text-sm flex items-center space-x-2">
                    <span>Company Name</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={companyRegData.companyName}
                    onChange={handleCompanyRegChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="text-gray-400 mb-2 text-sm flex items-center space-x-2">
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={companyRegData.phoneNumber}
                    onChange={handleCompanyRegChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="text-gray-400 mb-2 text-sm flex items-center space-x-2">
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={companyRegData.email}
                    onChange={handleCompanyRegChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="text-gray-400 mb-2 text-sm flex items-center space-x-2">
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={companyRegData.password}
                    onChange={handleCompanyRegChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Create password"
                  />
                </div>
                <AnimatePresence>
                  {companyRegError && (
                    <motion.div 
                      className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-sm flex items-center space-x-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertTriangle size={16} />
                      <span>{companyRegError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  disabled={companyRegLoading}
                  className="w-full bg-yellow-300 text-black py-3 rounded-xl font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50"
                >
                  {companyRegLoading ? 'Registering...' : 'Register Company'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.nav>

      {/* News Badge */}
      <motion.div 
        className="flex justify-center mt-8 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="bg-yellow-400 text-black px-6 py-2  rounded-full text-sm font-medium flex items-center space-x-3">
          <span className="bg-black text-yellow-400 px-2 py-0.5 rounded text-xs font-bold">News</span>
          <span>Blockchain Security Platform — Now Live</span>
          <ArrowRight size={16} />
        </div>
      </motion.div>

      {/* Main Content */}
  <main id="home" className="flex flex-col items-center justify-center px-6 relative">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            The Fastest Way To
            <br />
            <span className="font-light">Understand</span> Customer
          </motion.h1>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <p className="text-xl text-gray-400 mb-2 font-light">
              Revolutionary blockchain-powered security system that creates tamper-proof audit trails
            </p>
            <p className="text-xl text-gray-400 font-light">
              for physical security events with automated threat response capabilities.
            </p>
          </motion.div>

          <motion.button 
            onClick={() => setShowLogin(true)}
            className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-yellow-300 transition-all duration-300 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(250, 204, 21, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Access Dashboard — Admin Panel
          </motion.button>
        </div>

  {/* Feature Cards */}
  <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-20">
          {/* Left Card - Security Monitoring */}
          <motion.div
            className="bg-yellow-400 rounded-3xl p-8 relative overflow-hidden h-96"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="absolute top-6 left-6 flex space-x-3">
              <Shield className="text-black" size={24} />
              <Lock className="text-black" size={24} />
            </div>

            {/* Device Image - smaller and contained */}
            <div className="flex justify-center items-center z-6 w-full h-32 mt-8 mb-2 b-50">
                <img 
                  src="/img1.avif" 
                  alt="Sentinel-3 Device" 
                  className="object-contain z-6 max-h-64 w-auto h-full opacity-100 rounded-xl" 
                  style={{ maxWidth: '800px' }}
                />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-sm rounded-t-3xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Shield className="text-yellow-400" size={16} />
                </div>
                <div>
                  <p className="text-black font-medium text-sm">Sentinel-3</p>
                  <p className="text-black/70 text-xs">Real-time Security Monitoring 🔥</p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/50 to-yellow-500/50 rounded-3xl" />
            
            {/* Floating elements */}
            <motion.div
              className="absolute top-20 right-20 text-black/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Database size={32} />
            </motion.div>
            
            <motion.div
              className="absolute bottom-20 left-20 text-black/20"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Eye size={28} />
            </motion.div>
          </motion.div>

          {/* Right Card - Analytics Dashboard */}
          <motion.div
            className="bg-gray-200 rounded-3xl p-8 relative overflow-hidden h-96"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            variants={cardVariants}
            whileHover="hover"
          >
            {/* Dashboard mockup */}
            <div className="absolute top-6 right-6 flex space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
            </div>

            {/* Chat bubble */}
            <motion.div
              className="absolute top-16 right-8 bg-white rounded-2xl p-4 shadow-lg max-w-xs"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full" />
                <span className="text-black font-medium text-sm">Security Alert</span>
                <span className="text-gray-500 text-xs">2:30</span>
              </div>
              <p className="text-black text-sm">
                We are <span className="bg-yellow-300 px-1 rounded">monitoring tamper-proof</span> events 
                to move forward with your security team.
              </p>
            </motion.div>

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.path
                d="M50 200 Q150 150 250 180 T400 160"
                stroke="#666"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2, duration: 2 }}
              />
            </svg>

            {/* Floating icons */}
            <motion.div
              className="absolute bottom-8 left-8 bg-yellow-400 p-3 rounded-full shadow-lg"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Activity className="text-black" size={20} />
            </motion.div>

            <motion.div
              className="absolute bottom-20 right-12 bg-blue-400 p-2 rounded-full shadow-lg"
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Eye className="text-white" size={16} />
            </motion.div>

            <motion.div
              className="absolute top-1/2 left-12 bg-black p-3 rounded-full shadow-lg"
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="text-white" size={20} />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          {[
            { icon: Shield, value: '100%', label: 'Tamper Proof', color: 'text-green-400' },
            { icon: Eye, value: '24/7', label: 'Monitoring', color: 'text-blue-400' },
            { icon: Zap, value: 'Real-time', label: 'Alerts', color: 'text-yellow-400' },
            { icon: Database, value: 'Blockchain', label: 'Secured', color: 'text-purple-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="mb-4 flex justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="p-3 rounded-2xl bg-gray-800 shadow-lg">
                  <stat.icon className={stat.color} size={24} />
                </div>
              </motion.div>
              <div className={`text-3xl md:text-4xl font-light ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-light">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

  {/* Trusted By Section removed to fix syntax error */}
        {/* Feature Section */}
        <section id="features" className="w-full max-w-5xl mx-auto py-20 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-400">Features</h2>
          <ul className="grid md:grid-cols-2 gap-8 text-lg text-gray-200">
            <li className="bg-gray-900/70 rounded-2xl p-6 flex items-start space-x-4">
              <Shield className="text-yellow-400 mt-1" size={28} />
              <span>Blockchain-backed, tamper-proof event logging for physical security.</span>
            </li>
            <li className="bg-gray-900/70 rounded-2xl p-6 flex items-start space-x-4">
              <Eye className="text-blue-400 mt-1" size={28} />
              <span>24/7 live monitoring with AI-powered face detection and alerts.</span>
            </li>
            <li className="bg-gray-900/70 rounded-2xl p-6 flex items-start space-x-4">
              <Zap className="text-yellow-300 mt-1" size={28} />
              <span>Automated threat response and immutable audit trails.</span>
            </li>
            <li className="bg-gray-900/70 rounded-2xl p-6 flex items-start space-x-4">
              <Database className="text-purple-400 mt-1" size={28} />
              <span>Decentralized storage of security events and evidence.</span>
            </li>
            <li className="bg-gray-900/70 rounded-2xl p-6 flex items-start space-x-4">
              <Globe className="text-green-400 mt-1" size={28} />
              <span>Remote access and management from anywhere in the world, with secure mobile and web dashboards.</span>
            </li>
            <li className="bg-gray-900/70 rounded-2xl p-6 flex items-start space-x-4">
              <Cpu className="text-pink-400 mt-1" size={28} />
              <span>Edge AI processing for instant threat detection and minimal latency.</span>
            </li>
            <li className="bg-gray-900/70 rounded-2xl p-6 flex items-start space-x-4">
              <KeyRound className="text-orange-400 mt-1" size={28} />
              <span>Role-based access control and multi-factor authentication for all users.</span>
            </li>
            <li className="bg-gray-900/70 rounded-2xl p-6 flex items-start space-x-4">
              <Activity className="text-cyan-400 mt-1" size={28} />
              <span>Comprehensive analytics and reporting for actionable security insights.</span>
            </li>
          </ul>
        </section>

        {/* Security Section */}
        <section id="security" className="w-full max-w-5xl mx-auto py-20 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-400">Security</h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-200">
            <div className="bg-gray-900/70 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                <Lock className="text-blue-400" size={22} />
                <span>End-to-End Encryption</span>
              </h3>
              <p>All event data and media are encrypted in transit and at rest, ensuring privacy and integrity.</p>
            </div>
            <div className="bg-gray-900/70 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                <Cpu className="text-yellow-400" size={22} />
                <span>AI Threat Detection</span>
              </h3>
              <p>Advanced AI models detect suspicious activity and trigger real-time alerts for rapid response.</p>
            </div>
            <div className="bg-gray-900/70 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                <Network className="text-purple-400" size={22} />
                <span>Decentralized Storage</span>
              </h3>
              <p>Security events and evidence are stored on decentralized networks, preventing tampering or loss.</p>
            </div>
            <div className="bg-gray-900/70 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                <CheckCircle2 className="text-green-400" size={22} />
                <span>Auditability</span>
              </h3>
              <p>Every action is logged and auditable, providing a transparent record for compliance and investigation.</p>
            </div>
            <div className="bg-gray-900/70 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                <KeyRound className="text-orange-400" size={22} />
                <span>Multi-Factor Authentication</span>
              </h3>
              <p>All admin and user accounts are protected by multi-factor authentication, reducing the risk of unauthorized access.</p>
            </div>
            <div className="bg-gray-900/70 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                <AlertTriangle className="text-red-400" size={22} />
                <span>Intrusion Detection</span>
              </h3>
              <p>Continuous monitoring for unusual activity and instant alerts for potential breaches or tampering attempts.</p>
            </div>
            <div className="bg-gray-900/70 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                <User className="text-cyan-400" size={22} />
                <span>User Privacy Controls</span>
              </h3>
              <p>Granular privacy settings and audit logs ensure user data is only accessible by authorized personnel.</p>
            </div>
            <div className="bg-gray-900/70 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                <Database className="text-purple-400" size={22} />
                <span>Immutable Records</span>
              </h3>
              <p>All security events are written to an immutable blockchain ledger, guaranteeing evidence integrity.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full max-w-5xl mx-auto py-20 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-purple-400">About</h2>
          <div className="bg-gray-900/70 rounded-2xl p-8 text-lg text-gray-200">
            <p className="mb-4">Sentinel-3 is a next-generation security platform that leverages blockchain, AI, and decentralized storage to deliver tamper-proof, real-time monitoring for physical security events. Our mission is to empower organizations with transparent, automated, and immutable security solutions.</p>
            <p className="mb-4">Founded in 2024, Sentinel-3 was created by a team of engineers, security professionals, and blockchain experts who saw the need for a more trustworthy and automated approach to physical security. Our platform is built to serve critical infrastructure, enterprises, and organizations that demand the highest standards of accountability.</p>
            <ul className="list-disc pl-8 mb-4 space-y-2">
              <li>Combines blockchain, AI, and edge computing for a holistic security solution.</li>
              <li>Partners with leading technology providers to ensure robust, scalable deployments.</li>
              <li>Committed to privacy, transparency, and continuous innovation in the security space.</li>
              <li>24/7 support and ongoing updates to keep your security posture ahead of emerging threats.</li>
            </ul>
            <p>Sentinel-3 is trusted by global enterprises and is rapidly expanding its reach to new industries and markets. We believe in a future where every security event is verifiable, every response is automated, and every organization can operate with confidence.</p>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-3xl p-8 w-full max-w-md border border-gray-800"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-white flex items-center space-x-3">
                  <User size={24} />
                  <span>Admin Login</span>
                </h2>
                <motion.button 
                  onClick={closeModals}
                  className="text-gray-400 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 mb-2 text-sm flex items-center space-x-2">
                    <User size={16} />
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Enter admin username"
                  />
                </div>
                
                <div>
                  <label className=" text-gray-400 mb-2 text-sm flex items-center space-x-2">
                    <Lock size={16} />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Enter password"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-sm flex items-center space-x-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertTriangle size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-yellow-300 text-black py-3 rounded-xl font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Activity size={18} />
                      <span>Access Dashboard</span>
                    </div>
                  )}
                </motion.button>

                <div className="mt-4 text-center">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
                      <CheckCircle2 size={16} className="text-green-400" />
                      <span>Demo: admin / sentinel123</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default LandingPage;