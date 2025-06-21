// src/pages/TenantForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function TenantForm() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    contactEmail: '',
    plan: 'basic',
    adminUserId: ''
  });
  const [users, setUsers] = useState([]);
  const nav = useNavigate();

  // busca lista de users (somente para super-admin)
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setUsers(res.data))
    .catch(console.error);
  }, []);

  // se for edição, carrega dados existentes
  useEffect(() => {
    if (!id) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/tenants/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      const t = res.data;
      setForm({
        name: t.name || '',
        contactEmail: t.contactEmail || '',
        plan: t.plan || 'basic',
        adminUserId: t.adminUser?._id || ''
      });
    })
    .catch(console.error);
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const url = id
      ? `${import.meta.env.VITE_API_URL}/api/tenants/${id}`
      : `${import.meta.env.VITE_API_URL}/api/tenants`;
    const method = id ? 'put' : 'post';
    axios[method](url, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => nav('/tenants'))
    .catch(err => {
      const msg = err.response?.data?.error || err.message;
      alert(`Falha ao guardar tenant: ${msg}`);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id ? 'Editar' : 'Novo'} Tenant</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* Nome */}
        <label className="block">
          Nome
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>

        {/* Email de Contacto */}
        <label className="block">
          Email de Contacto
          <input
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>

        {/* Plano */}
        <label className="block">
          Plano
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </label>

        {/* Administrador */}
        <label className="block">
          Administrador
          <select
            name="adminUserId"
            value={form.adminUserId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required={!id}
          >
            <option value="">Selecione um usuário</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.username} ({u.role})
              </option>
            ))}
          </select>
        </label>

        {/* Botão */}
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
