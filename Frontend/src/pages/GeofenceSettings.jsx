import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function GeofenceSettings() {
  const { deviceId } = useParams();
  const [geo, setGeo] = useState({ center: { lat: '', lng: '' }, radius: '' });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/devices/${deviceId}`)
      .then(res => setGeo(res.data.geofence || { center: { lat: '', lng: '' }, radius: '' }))
      .catch(console.error);
  }, [deviceId]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'radius') {
      setGeo({ ...geo, radius: value });
    } else {
      setGeo({ center: { ...geo.center, [name]: value }, radius: geo.radius });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/alert?imei=${deviceId}&code=GEOFENCE_OUT`, // or /devices/:id/geofence if endpoint
      { center: geo.center, radius: Number(geo.radius) }
    )
    .then(() => alert('Geofence atualizada'))
    .catch(console.error);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Definir Geofence</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block mb-2">
          Latitude
          <input
            name="lat"
            value={geo.center.lat}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <label className="block mb-2">
          Longitude
          <input
            name="lng"
            value={geo.center.lng}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <label className="block mb-4">
          Raio (m)
          <input
            name="radius"
            value={geo.radius}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar Geofence
        </button>
      </form>
    </div>
  );
}
