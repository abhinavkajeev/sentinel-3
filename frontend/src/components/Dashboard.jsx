import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import { 
  Search, 
  LayoutGrid, 
  Video, 
  FileText, 
  Users,
  Settings, 
  CheckCircle,
  LogIn,
  LogOut,
  Shield,
  AlertTriangle,
  ChevronsLeft,
  ChevronsRight,
  Fingerprint,
  LogOut as LogOutIcon,
  ArrowLeft
} from 'lucide-react';

const Dashboard = () => {
  const { company, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('All Events');
  const [isAnimating, setIsAnimating] = useState(false);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  // Remove local loading, use AuthContext loading only
  const [stats, setStats] = useState({
    activeCameras: 0,
    securityAlerts: 0,
    systemUptime: '99.98%'
  });

  // Check authentication
  useEffect(() => {
    if (!loading && !company) {
      navigate('/login');
      return;
    }
  }, [company, loading, navigate]);

  // Fetch recent sessions from backend
  useEffect(() => {
    const fetchSessions = async () => {
      if (!company) return;
      try {
        const response = await api.getRecentSessions(company.companyPin, 50);
        if (response.ok && response.sessions) {
          const events = response.sessions.map(session => {
            const entryEvent = {
              id: session.sessionId + '-ENTRY',
              timestamp: new Date(session.entry?.at).toLocaleTimeString(),
              eventType: 'Entry',
              status: 'Verified',
              sessionId: session.sessionId,
              photoHash: session.entry?.photoHash,
              ipfsUrl: session.entry?.photoUrl,
              txHash: session.entry?.txHash,
              blockHeight: session.entry?.blockHeight,
              eventId: session.entry?.eventId
            };
            const exitEvent = session.exit ? {
              id: session.sessionId + '-EXIT',
              timestamp: new Date(session.exit.at).toLocaleTimeString(),
              eventType: 'Exit',
              status: 'Verified',
              sessionId: session.sessionId,
              photoHash: session.exit.photoHash,
              ipfsUrl: session.exit.photoUrl,
              txHash: session.exit.txHash,
              blockHeight: session.exit.blockHeight,
              eventId: session.exit.eventId,
              matchConfidence: session.matchConfidence
            } : null;
            return [entryEvent, exitEvent].filter(Boolean);
          }).flat();
          setSecurityEvents(events);
          setStats({
            activeCameras: Math.min(48, events.length),
            securityAlerts: events.filter(e => e.status === 'Flagged').length,
            systemUptime: '99.98%'
          });
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setSecurityEvents([
          { id: 'EVT-7B3D9', timestamp: '3:01:12 PM', eventType: 'Entry', status: 'Verified' },
          { id: 'DEV-A4C8E', timestamp: '2:59:45 PM', eventType: 'Attempt', status: 'Flagged' },
          { id: 'EVT-F6A21', timestamp: '2:58:03 PM', eventType: 'Exit', status: 'Verified' },
          { id: 'EVT-9C55B', timestamp: '2:55:19 PM', eventType: 'Entry', status: 'Verified' },
          { id: 'EVT-E2D44', timestamp: '2:54:30 PM', eventType: 'Exit', status: 'Verified' },
        ]);
      }
    };
    fetchSessions();
  }, [company]);
  
  const filteredEvents = securityEvents.filter(event => {
    if (activeTab === 'All Events') return true;
    if (activeTab === 'Entries') return event.eventType === 'Entry';
    if (activeTab === 'Exits') return event.eventType === 'Exit';
    return false;
  });

  useEffect(() => {
    setIsAnimating(false);
    const timer = setTimeout(() => setIsAnimating(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);


  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle size={16} />
            <span>Verified</span>
          </div>
        );
      case 'Flagged':
        return (
          <div className="flex items-center space-x-2 text-yellow-400">
            <AlertTriangle size={16} />
            <span>Flagged</span>
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };

  async function connectLeatherWallet() {
    // Check if the Leather wallet extension is installed
    if (typeof window.btc === 'undefined') {
      alert("Please install the Leather wallet extension first.");
      // Optionally, direct them to the download page
      // window.open('https://leather.io/install-extension', '_blank');
      return;
    }

    try {
      // Define the options for the connection request
      const userAddresses = await window.btc.request('getAddresses');

      if (userAddresses && userAddresses.result.addresses.length > 0) {
        // The user has connected successfully
        const btcAddress = userAddresses.result.addresses.find(addr => addr.type === 'p2wpkh');

        if (btcAddress) {
          console.log("Wallet Connected!");
          console.log("Your BTC Address (Native SegWit):", btcAddress.address);
          // Update state to reflect connected wallet
          setIsWalletConnected(true);
          setWalletAddress(btcAddress.address);
          const statusElem = document.getElementById("wallet-status");
          if (statusElem) {
            statusElem.innerText = `Connected: ${btcAddress.address}`;
          }
          return btcAddress.address;
        } else {
          alert("Could not find a valid Bitcoin address.");
          return null;
        }
      } else {
        // This case might occur if the wallet is locked or has no accounts
        alert("No addresses found. Please unlock your Leather wallet or create an account.");
        return null;
      }
    } catch (error) {
      // The user rejected the connection request
      console.error("Connection rejected by user:", error);
      alert("You rejected the wallet connection request.");
      return null;
    }
  }

  function disconnectWallet() {
    setIsWalletConnected(false);
    setWalletAddress('');
    const statusElem = document.getElementById("wallet-status");
    if (statusElem) {
      statusElem.innerText = '';
    }
    console.log("Wallet disconnected!");
  }

  return (
    // CHANGED: Set a fixed screen height and removed overflow-hidden
    <motion.div 
      className="flex h-screen bg-[#0A0A0A] text-gray-300 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
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

      <motion.aside 
        className={`bg-black/30 backdrop-blur-md p-4 flex flex-col justify-between border-r border-white/10 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div>
          <motion.div 
            className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} mb-10`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div 
              className="w-10 h-10 bg-yellow-400/90 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="text-black" />
            </motion.div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.h1 
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  Sentinel-3
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>
          <nav className="space-y-2">
            {[
              { icon: LayoutGrid, label: 'Dashboard', active: true, onClick: () => navigate('/dashboard') },
              { icon: Video, label: 'Live Feed', onClick: () => navigate('/camera') },
            ].map((item, index) => (
              <motion.button
                key={item.label}
                onClick={item.onClick}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${!isSidebarOpen && 'justify-center'} ${item.active ? 'bg-yellow-400/10 text-yellow-400' : 'hover:bg-white/10 text-gray-400'}`}
                style={{ background: 'none', border: 'none', outline: 'none', cursor: item.onClick ? 'pointer' : 'default' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon size={20} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      className="font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </nav>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
           <motion.a 
             href="#" 
             className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-400 ${!isSidebarOpen && 'justify-center'}`}
             whileHover={{ scale: 1.05, x: 5 }}
           >
             <Settings size={20} />
             <AnimatePresence>
               {isSidebarOpen && (
                 <motion.span 
                   className="font-medium"
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.3 }}
                 >
                   Settings
                 </motion.span>
               )}
             </AnimatePresence>
           </motion.a>
           <motion.button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
             className={`flex items-center w-full space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-400 ${!isSidebarOpen && 'justify-center'}`}
             whileHover={{ scale: 1.05, x: 5 }}
             whileTap={{ scale: 0.95 }}
           >
             {isSidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
             <AnimatePresence>
               {isSidebarOpen && (
                 <motion.span 
                   className="font-medium"
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.3 }}
                 >
                   Collapse
                 </motion.span>
               )}
             </AnimatePresence>
           </motion.button>
           <motion.button 
             onClick={logout}
             className={`flex items-center w-full space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 ${!isSidebarOpen && 'justify-center'}`}
             whileHover={{ scale: 1.05, x: 5 }}
             whileTap={{ scale: 0.95 }}
           >
             <LogOutIcon size={20} />
             <AnimatePresence>
               {isSidebarOpen && (
                 <motion.span 
                   className="font-medium"
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.3 }}
                 >
                   Logout
                 </motion.span>
               )}
             </AnimatePresence>
           </motion.button>
        </motion.div>
      </motion.aside>

      {/* CHANGED: Added overflow-y-auto to enable scrolling only for this element */}
      <motion.main 
        className="flex-1 p-8 overflow-y-auto"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        <motion.header 
          className="flex items-center justify-between mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex items-center space-x-6">
            <motion.h2 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Security Event Dashboard
            </motion.h2>
            
            {/* Beautiful Back Button */}
            <motion.button
              onClick={() => navigate('/')}
              className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-yellow-400/20 hover:to-yellow-500/20 border border-gray-600/50 hover:border-yellow-400/50 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(250, 204, 21, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={16} className="text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
              <span className="text-gray-300 group-hover:text-yellow-400 font-medium text-sm transition-colors duration-300">Back to Landing</span>
            </motion.button>

            {/* Wallet Connect/Disconnect Button */}
            <motion.button
              onClick={isWalletConnected ? disconnectWallet : connectLeatherWallet}
              className={`group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg border ${
                isWalletConnected 
                  ? 'from-red-800/50 to-red-700/50 hover:from-red-400/20 hover:to-red-500/20 border-red-600/50 hover:border-red-400/50 hover:shadow-red-400/20' 
                  : 'from-gray-800/50 to-gray-700/50 hover:from-green-400/20 hover:to-green-500/20 border-gray-600/50 hover:border-green-400/50 hover:shadow-green-400/20'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: isWalletConnected 
                  ? "0 10px 30px rgba(239, 68, 68, 0.2)" 
                  : "0 10px 30px rgba(34, 197, 94, 0.2)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`font-medium text-sm transition-colors duration-300 ${
                isWalletConnected 
                  ? 'text-gray-300 group-hover:text-red-400' 
                  : 'text-gray-300 group-hover:text-green-400'
              }`}>
                {isWalletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
              </span>
            </motion.button>
            <motion.span 
              id="wallet-status" 
              className="ml-4 text-green-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            />
          </div>
          
          <motion.div 
            className="relative w-full max-w-xs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input type="text" placeholder="Search events..." className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200"/>
          </motion.div>
        </motion.header>
        
        <div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              {icon: Video, title: "Active Cameras", value: `${stats.activeCameras} / 50`, color: "green"}, 
              {icon: AlertTriangle, title: "Security Alerts (24h)", value: stats.securityAlerts.toString(), color: "yellow"}, 
              {icon: Shield, title: "System Uptime", value: stats.systemUptime, color: "blue"}
            ].map((card, index) => (
              <motion.div 
                key={card.title} 
                className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-green-500/10"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className={`p-3 bg-${card.color}-500/10 rounded-lg`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.6, type: "spring" }}
                  >
                    <card.icon className={`text-${card.color}-400`} size={24}/>
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-gray-400 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                    >
                      {card.title}
                    </motion.p>
                    <motion.p 
                      className="text-2xl font-bold text-white"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                    >
                      {card.value}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div 
              className="p-4 border-b border-white/10 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-white">Live Event Feed</h3>
              <div className="flex space-x-2">
                {['All Events', 'Entries', 'Exits'].map((tab, index) => (
                  <motion.button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <motion.div 
                className="grid grid-cols-10 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.4 }}
              >
                <div className="col-span-4">Event ID</div>
                <div className="col-span-3">Timestamp</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2 text-right">Status</div>
              </motion.div>

              <AnimatePresence mode="wait">
                {filteredEvents.map((event, index) => (
                  <motion.div 
                    key={event.id}
                    className={`grid grid-cols-10 gap-4 px-4 py-4 border-t border-white/10 transition-all duration-500 ease-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${index * 75}ms` }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 1.8 + index * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                  >
                    <div className="col-span-4 flex items-center space-x-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2 + index * 0.05, duration: 0.3 }}
                      >
                        <Fingerprint className="text-gray-500" size={18}/>
                      </motion.div>
                      <span className="font-mono text-sm text-gray-300">{event.id}</span>
                      {/* Show event image if available */}
                      {event.ipfsUrl && (
                        <motion.img 
                          src={event.ipfsUrl} 
                          alt="Event" 
                          className="ml-2 w-12 h-12 rounded shadow border border-gray-700 object-cover"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 2.2 + index * 0.05, duration: 0.4 }}
                          whileHover={{ scale: 1.1 }}
                        />
                      )}
                    </div>
                    <div className="col-span-3 text-sm text-gray-400 flex flex-col justify-center">
                      <span>{event.timestamp}</span>
                      {/* Show blockchain info if available */}
                      {event.txHash && (
                        <motion.span 
                          className="text-green-400 text-xs font-mono"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.3 + index * 0.05, duration: 0.3 }}
                        >
                          TX: {event.txHash}
                        </motion.span>
                      )}
                      {event.eventId && (
                        <motion.span 
                          className="text-purple-400 text-xs font-mono"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.4 + index * 0.05, duration: 0.3 }}
                        >
                          EventID: {event.eventId}
                        </motion.span>
                      )}
                    </div>
                    <motion.div 
                      className="col-span-1 flex items-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.1 + index * 0.05, duration: 0.3 }}
                    >
                      {event.eventType === 'Entry' ? <LogIn className="text-green-400" size={18} /> : event.eventType === 'Exit' ? <LogOut className="text-red-400" size={18} /> : <AlertTriangle className="text-yellow-400" size={18}/>}
                    </motion.div>
                    <motion.div 
                      className="col-span-2 flex justify-end text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2 + index * 0.05, duration: 0.3 }}
                    >
                      {getStatusBadge(event.status)}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </motion.main>
    </motion.div>
  );
};

export default Dashboard;