import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DeviceList() {
  const [devices, setDevices] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/devices`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setDevices(res.data))
    .catch(err => {
      console.error('Erro ao listar dispositivos:', err);
      alert('Falha ao carregar lista de dispositivos');
    });
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Dispositivos</h1>
        <button
          onClick={() => nav('/devices/new')}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Novo
        </button>
      </div>
      <table className="w-full table-auto border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">IMEI</th>
            <th className="p-2">Label</th>
            <th className="p-2">Status</th>
            <th className="p-2">Dono</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d._id} className="border-t">
              <td className="p-2 font-mono">{d.imei}</td>
              <td className="p-2">{d.label || '-'}</td>
              <td className="p-2">{d.status}</td>
              <td className="p-2">{d.owner?.username || '-'}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => nav(`/devices/${d._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
