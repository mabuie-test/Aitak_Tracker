import React from 'react';

export default function DeviceWidget({ device, onVoice }) {
  if (!device) return null;
  return (
    <div className="flex items-center space-x-4 p-2">
      <div><strong>{device.label}</strong></div>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={onVoice}
      >
        Gravar Voz
      </button>
    </div>
  );
}
