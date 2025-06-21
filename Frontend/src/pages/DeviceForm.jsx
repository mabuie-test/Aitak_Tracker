import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeviceForm() {
  const { id } = useParams();
  const [form, setForm] = useState({
    imei: '',
    label: '',
    tenantId: '',
    owner: '',
    status: 'active'
  });
  const [tenants, setTenants] = useState([]);
  const [users, setUsers]     = useState([]);
  const [role, setRole]       = useState(null);
  const nav = useNavigate();

  // decodifica token e carrega tenants/users conforme role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    setRole(payload.role);

    // super-admin: busca todos tenants e depois todos users de cada tenant selecionado
    if (payload.role === 'super-admin') {
      axios.get(`${import.meta.env.VITE_API_URL}/api/tenants`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setTenants(res.data))
        .catch(console.error);
    } else {
      // admin: seta tenantId e busca users do seu tenant
      setForm(f => ({ ...f, tenantId: payload.tenantId }));
    }
  }, []);

  // ao escolher um tenant (super-admin), recarrega lista de users
  useEffect(() => {
    if (role === 'super-admin' && form.tenantId) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => setUsers(res.data.filter(u => u.tenantId === form.tenantId)))
      .catch(console.error);
    }
    if (role === 'admin') {
      axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => setUsers(res.data))
      .catch(console.error);
    }
  }, [form.tenantId, role]);

  // carrega dados existentes se for edição
  useEffect(() => {
    if (!id) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/devices/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setForm({
      imei: res.data.imei || '',
      label: res.data.label || '',
      tenantId: res.data.tenantId || '',
      owner: res.data.owner?._id || '',
      status: res.data.status || 'active'
    }))
    .catch(console.error);
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = id ? 'put' : 'post';
    const url = `${import.meta.env.VITE_API_URL}/api/devices${id ? `/${id}` : ''}`;
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => nav('/devices'))
    .catch(err => {
      console.error('Erro ao salvar dispositivo:', err);
      const msg = err.response?.data?.error || err.message;
      alert(`Falha ao guardar dispositivo: ${msg}`);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id ? 'Editar' : 'Novo'} Dispositivo</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* super-admin escolhe tenant */}
        {role === 'super-admin' && (
          <label className="block">
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
                  {t.name} ({t._id.slice(0,8)}…)
                </option>
              ))}
            </select>
          </label>
        )}

        {/* IMEI */}
        <label className="block">
          IMEI
          <input
            name="imei"
            value={form.imei}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>

        {/* Label */}
        <label className="block">
          Label
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>

        {/* Status (edição) */}
        {id && (
          <label className="block">
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>
        )}

        {/* Dono do veículo */}
        <label className="block">
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
