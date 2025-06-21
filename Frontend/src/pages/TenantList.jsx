import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TenantList() {
  const [tenants, setTenants] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/tenants`)
      .then(res => setTenants(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Tenants</h1>
        <button
          onClick={() => nav('/tenants/new')}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Novo
        </button>
      </div>
      <table className="w-full table-auto border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>                {/* ← NOVO */}
+            <th className="p-2">Nome</th>
            <th className="p-2">Email</th>
            <th className="p-2">Plano</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map(t => (
            <tr key={t._id} className="border-t">
              <td className="p-2">{t.name}</td>
              <td className="p-2">{t.contactEmail}</td>
              <td className="p-2">{t.plan}</td>
              <td className="p-2">
                <button
                  onClick={() => nav(`/tenants/${t._id}`)}
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
