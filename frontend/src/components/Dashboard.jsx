import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Fingerprint
} from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('All Events');
  
  const [isAnimating, setIsAnimating] = useState(false);

  const securityEvents = [
    // I've added more items to make the content long enough to scroll
    { id: 'EVT-7B3D9', timestamp: '3:01:12 PM', eventType: 'Entry', status: 'Verified' },
    { id: 'DEV-A4C8E', timestamp: '2:59:45 PM', eventType: 'Attempt', status: 'Flagged' },
    { id: 'EVT-F6A21', timestamp: '2:58:03 PM', eventType: 'Exit', status: 'Verified' },
    { id: 'EVT-9C55B', timestamp: '2:55:19 PM', eventType: 'Entry', status: 'Verified' },
    { id: 'EVT-E2D44', timestamp: '2:54:30 PM', eventType: 'Exit', status: 'Verified' },
    { id: 'EVT-1F88G', timestamp: '2:52:01 PM', eventType: 'Entry', status: 'Verified' },
    { id: 'EVT-3H22A', timestamp: '2:51:43 PM', eventType: 'Exit', status: 'Verified' },
    { id: 'EVT-B7G19', timestamp: '2:49:11 PM', eventType: 'Entry', status: 'Verified' },
    { id: 'DEV-K9L3P', timestamp: '2:48:50 PM', eventType: 'Attempt', status: 'Flagged' },
    { id: 'EVT-M4N0B', timestamp: '2:47:22 PM', eventType: 'Exit', status: 'Verified' },
  ];
  
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

  const navigate = useNavigate();
  return (
    // CHANGED: Set a fixed screen height and removed overflow-hidden
    <div className="flex h-screen bg-[#0A0A0A] text-gray-300 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] bg-green-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-3xl animation-delay-4000 animate-pulse"></div>
      </div>

      <aside className={`bg-black/30 backdrop-blur-md p-4 flex flex-col justify-between border-r border-white/10 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div>
          <div className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} mb-10`}>
            <div className="w-10 h-10 bg-yellow-400/90 rounded-lg flex items-center justify-center">
              <Shield className="text-black" />
            </div>
            {isSidebarOpen && <h1 className="text-2xl font-bold text-white">Sentinel-3</h1>}
          </div>
          <nav className="space-y-2">
            {[
              { icon: LayoutGrid, label: 'Dashboard', active: true, onClick: () => navigate('/dashboard') },
              { icon: Video, label: 'Live Feed', onClick: () => navigate('/camera') },
              { icon: FileText, label: 'Event Logs', onClick: () => navigate('/eventlog') },
              { icon: Users, label: 'Personnel' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${!isSidebarOpen && 'justify-center'} ${item.active ? 'bg-yellow-400/10 text-yellow-400' : 'hover:bg-white/10 text-gray-400'}`}
                style={{ background: 'none', border: 'none', outline: 'none', cursor: item.onClick ? 'pointer' : 'default' }}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div>
           <a href="#" className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-400 ${!isSidebarOpen && 'justify-center'}`}>
             <Settings size={20} />
             {isSidebarOpen && <span className="font-medium">Settings</span>}
           </a>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`flex items-center w-full space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-400 ${!isSidebarOpen && 'justify-center'}`}>
             {isSidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
             {isSidebarOpen && <span className="font-medium">Collapse</span>}
           </button>
        </div>
      </aside>

      {/* CHANGED: Added overflow-y-auto to enable scrolling only for this element */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Security Event Dashboard</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input type="text" placeholder="Search events..." className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50"/>
          </div>
        </header>
        
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[{icon: Video, title: "Active Cameras", value:"48 / 50", color:"green"}, {icon: AlertTriangle, title: "Security Alerts (24h)", value:"3", color:"yellow"}, {icon: Shield, title: "System Uptime", value:"99.98%", color:"blue"}].map(card => (
              <div key={card.title} className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-green-500/10">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 bg-${card.color}-500/10 rounded-lg`}><card.icon className={`text-${card.color}-400`} size={24}/></div>
                  <div>
                    <p className="text-gray-400 text-sm">{card.title}</p>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Live Event Feed</h3>
              <div className="flex space-x-2">
                {['All Events', 'Entries', 'Exits'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2">
              <div className="grid grid-cols-10 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                <div className="col-span-4">Event ID</div>
                <div className="col-span-3">Timestamp</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {filteredEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className={`grid grid-cols-10 gap-4 px-4 py-4 border-t border-white/10 transition-all duration-500 ease-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <div className="col-span-4 flex items-center space-x-3">
                    <Fingerprint className="text-gray-500" size={18}/>
                    <span className="font-mono text-sm text-gray-300">{event.id}</span>
                  </div>
                  <div className="col-span-3 text-sm text-gray-400 flex items-center">{event.timestamp}</div>
                  <div className="col-span-1 flex items-center">
                    {event.eventType === 'Entry' ? <LogIn className="text-green-400" size={18} /> : event.eventType === 'Exit' ? <LogOut className="text-red-400" size={18} /> : <AlertTriangle className="text-yellow-400" size={18}/>}
                  </div>
                  <div className="col-span-2 flex justify-end text-sm">{getStatusBadge(event.status)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;