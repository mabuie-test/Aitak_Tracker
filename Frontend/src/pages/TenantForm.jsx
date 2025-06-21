// src/pages/TenantForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function TenantForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', contactEmail: '', plan: 'basic', adminUserId: '' });
  const [users, setUsers] = useState([]);
  const nav = useNavigate();

  // busca lista de users (somente super-admin)
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => setUsers(r.data))
    .catch(console.error);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const url = id
      ? `${import.meta.env.VITE_API_URL}/api/tenants/${id}`
      : `${import.meta.env.VITE_API_URL}/api/tenants`;
    const method = id ? 'put' : 'post';
    axios[method](url, form)
      .then(() => nav('/tenants'))
      .catch(err => alert(err.response?.data?.error || 'Falha'));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id ? 'Editar' : 'Novo'} Tenant</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        {/* campos existentes */}
        <label className="block mb-4">
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
        {/* restante form */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
