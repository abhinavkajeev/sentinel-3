import React, { useState, useEffect } from 'react';

function Dashboard({ onBack, onCamera }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3070';

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allEvents = await response.json();
      setEvents(allEvents);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch events from backend. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  const simulateEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const entryData = {
        location: "Main Entrance",
        eventType: "Entry",
        dataHash: "0x" + Math.random().toString(36).substring(2, 12).padEnd(10, '0')
      };
      await fetch(`${API_BASE_URL}/record-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      const exitData = {
        location: "Main Entrance",
        eventType: "Exit",
        dataHash: entryData.dataHash
      };
      await fetch(`${API_BASE_URL}/record-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exitData)
      });
      await fetchEvents();
    } catch (err) {
      console.error(err);
      setError("Failed to simulate event. Check if the backend is running and the blockchain is connected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-2">Sentinel-3</h1>
          <p className="text-xl text-gray-400">Decentralized Security Event Log</p>
        </header>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <button
            onClick={simulateEvent}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Processing..." : "Simulate New Entry/Exit"}
          </button>
          <button
            onClick={fetchEvents}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-700 text-gray-300 font-semibold shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            Refresh Log
          </button>
          <button
            onClick={onCamera}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Open Camera
          </button>
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-500 text-white font-semibold shadow-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
          >
            Back to Landing Page
          </button>
        </div>
        {error && (
          <div className="bg-red-800 text-red-100 p-4 rounded-xl shadow-lg mb-6 text-center transition-all duration-300">
            {error}
          </div>
        )}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Event Log (Immutable)</h2>
          {events.length === 0 && !loading && !error && (
            <p className="text-center text-gray-400 italic">No events recorded yet. Click \"Simulate New Entry/Exit\" to begin.</p>
          )}
          {events.map((event, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl shadow-inner mb-4 transition-all duration-300 ${event.eventType === 'Unusual Activity' ? 'bg-red-900 border-2 border-red-700' : 'bg-gray-700 border border-gray-600'}`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm sm:text-base mb-2">
                <span className="font-medium text-gray-300">Timestamp: <span className="text-white">{event.timestamp}</span></span>
                <span className="font-medium text-gray-300">Location: <span className="text-white">{event.location}</span></span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm sm:text-base mb-2">
                <span className="font-medium text-gray-300">Event: <span className={`font-bold ${event.eventType === 'Unusual Activity' ? 'text-red-400' : event.eventType === 'Entry' ? 'text-green-400' : 'text-yellow-400'}`}>{event.eventType}</span></span>
                <span className="font-medium text-gray-300 break-all">Hash: <span className="text-white">{event.dataHash}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
