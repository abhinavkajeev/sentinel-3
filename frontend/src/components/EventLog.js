import React from 'react';

function EventLog({ events }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Event Log (Immutable)</h2>
      {events.length === 0 && (
        <p className="text-center text-gray-400 italic">No events recorded yet. Click "Simulate New Event" to begin.</p>
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
  );
}

export default EventLog;
