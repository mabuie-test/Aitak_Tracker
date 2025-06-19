import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const nav = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}`)
        .then(res => setForm(res.data))
        .catch(console.error);
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const method = id ? 'put' : 'post';
    const url    = id
      ? `${import.meta.env.VITE_API_URL}/api/users/${id}`
      : `${import.meta.env.VITE_API_URL}/api/auth/register`;
    axios[method](url, form)
      .then(() => nav('/users'))
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id ? 'Editar' : 'Novo'} Utilizador</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block mb-2">
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        {!id && (
          <label className="block mb-2">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </label>
        )}
        <label className="block mb-4">
          Função
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
