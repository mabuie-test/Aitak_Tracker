import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeviceForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ imei: '', label: '', tenantId: '' });
  const [tenants, setTenants] = useState([]);
  const [role, setRole]       = useState(null);
  const nav = useNavigate();

  // decodifica o token para obter o role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
      // se super-admin, busca tenants
      if (payload.role === 'super-admin') {
        axios.get(`${import.meta.env.VITE_API_URL}/api/tenants`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setTenants(res.data))
        .catch(console.error);
      } else {
        // para admin normal, define tenantId do token
        setForm(f => ({ ...f, tenantId: payload.tenantId }));
      }
    }
  }, []);

  // se for edição, carrega dados existentes
  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/devices/${id}`)
        .then(res => setForm({
          imei: res.data.imei,
          label: res.data.label,
          tenantId: res.data.tenantId
        }))
        .catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? 'put' : 'post';
    const url = `${import.meta.env.VITE_API_URL}/api/devices${id ? `/${id}` : ''}`;
    axios[method](url, form)
      .then(() => nav('/devices'))
      .catch(err => {
        console.error(err);
        const msg = err.response?.data?.error || err.message;
        alert(`Falha ao guardar dispositivo: ${msg}`);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id ? 'Editar' : 'Novo'} Dispositivo</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        {role === 'super-admin' && (
          <label className="block mb-4">
            Tenant
            <select
              name="tenantId"
              value={form.tenantId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Selecione um Tenant</option>
              {tenants.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t._id.slice(0, 8)}…)
                </option>
              ))}
            </select>
          </label>
        )}

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

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
