import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeviceForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ imei: '', label: '' });
  const nav = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/devices/${id}`)
        .then(res => setForm(res.data))
        .catch(console.error);
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const method = id ? 'put' : 'post';
    const url    = `${import.meta.env.VITE_API_URL}/api/devices${id ? `/${id}` : ''}`;
    axios[method](url, form)
      .then(() => nav('/devices'))
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id ? 'Editar' : 'Novo'} Dispositivo</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
