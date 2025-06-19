import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function TenantForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', contactEmail: '', plan: 'basic' });
  const nav = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/tenants/${id}`)
        .then(res => setForm(res.data))
        .catch(console.error);
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const method = id ? 'put' : 'post';
    const url    = `${import.meta.env.VITE_API_URL}/api/tenants${id ? `/${id}` : ''}`;
    axios[method](url, form)
      .then(() => nav('/tenants'))
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id ? 'Editar' : 'Novo'} Tenant</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block mb-2">
          Nome
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <label className="block mb-2">
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
        <label className="block mb-4">
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
