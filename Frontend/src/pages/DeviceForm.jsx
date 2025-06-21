// src/pages/DeviceForm.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeviceForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ imei: '', label: '', tenantId: '', owner: '' });
  const [users, setUsers] = useState([]);
  const [role, setRole]   = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    setRole(payload.role);
    if (payload.role === 'super-admin') {
      // buscar tenants se necessário...
    }
    // buscar users do tenant (admin e super-admin)
    axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data))
    .catch(console.error);

    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/devices/${id}`)
        .then(r => setForm({
          imei: r.data.imei,
          label: r.data.label,
          tenantId: r.data.tenantId,
          owner: r.data.owner || ''
        }));
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const url = id
      ? `${import.meta.env.VITE_API_URL}/api/devices/${id}`
      : `${import.meta.env.VITE_API_URL}/api/devices`;
    axios.post(url, form)  // método ajustado no backend
      .then(() => nav('/devices'))
      .catch(err => alert(err.response?.data?.error || 'Falha ao guardar dispositivo'));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id ? 'Editar' : 'Novo'} Dispositivo</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        {/* se super-admin, exiba tenant select como antes */}
        {role === 'super-admin' && (
          <label className="block mb-4">
            Tenant
            <input
              name="tenantId"
              value={form.tenantId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </label>
        )}
        {/* campos imei e label */}
        <label className="block mb-2">
          IMEI
          <input
            name="imei"
            value={form.imei}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <label className="block mb-4">
          Label
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        {/* novo: seleção de owner */}
        <label className="block mb-4">
          Dono do Veículo
          <select
            name="owner"
            value={form.owner}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecione um utilizador</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
