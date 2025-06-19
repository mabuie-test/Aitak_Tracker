import React, { useState } from 'react';
import axios from 'axios';

export default function VoiceModal({ onClose, device }) {
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/devices/${device._id}/voice-trigger`,
      { durationSec: 15 }
    );
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-lg mb-4">Iniciar Gravação</h3>
        <button
          onClick={start}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {loading ? 'Gravando...' : 'Iniciar'}
        </button>
        <button
          onClick={onClose}
          className="ml-2 px-4 py-2 bg-gray-300 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
