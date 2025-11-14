import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Layout from '../components/layout/Layout';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Settings = () => {
  const bins = [
    { id: 'bin-1', type: 'Metal', location: { lat: 28.6139, lng: 77.2090 }, fillLevel: 75, status: 'active' },
    { id: 'bin-2', type: 'Biodegradable', location: { lat: 28.6149, lng: 77.2100 }, fillLevel: 50, status: 'active' },
    { id: 'bin-3', type: 'Non-Biodegradable', location: { lat: 28.6159, lng: 77.2080 }, fillLevel: 30, status: 'active' },
    { id: 'bin-4', type: 'Others', location: { lat: 28.6169, lng: 77.2110 }, fillLevel: 20, status: 'active' }
  ];

  const workers = [
    { id: 1, name: 'Worker A', assignment: 'Assigned to Dry Bin 1' },
    { id: 2, name: 'Worker John', assignment: 'Maintenance on Metal Bin 2' },
    { id: 3, name: 'Worker B', assignment: 'Route 4 Collection' }
  ];

  const alerts = [
    { id: 1, message: 'Alert: Dry Bin 3 is full' },
    { id: 2, message: 'Alert: Metal Bin 2 requires maintenance' }
  ];

  const binStatusData = [
    { type: 'Metal', fillLevel: 70 },
    { type: 'Biodegradable', fillLevel: 40 }
  ];

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Bin Status</h4>
          <div className="grid grid-cols-2 gap-4">
            {binStatusData.map((bin, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="bg-[#A8D5A2] rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 cursor-pointer">
                  <span className="text-sm font-medium text-gray-800">{bin.type}</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-12 bg-white rounded" style={{ opacity: bin.fillLevel > 30 ? 1 : 0.3 }}></div>
                    <div className="w-2 h-12 bg-white rounded" style={{ opacity: bin.fillLevel > 60 ? 1 : 0.3 }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">{bin.fillLevel}% Full</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Map</h4>
          <div className="h-64 rounded-xl overflow-hidden bg-gray-100">
            <MapContainer center={[28.6139, 77.2090]} zoom={14} style={{ height: '100%', width: '100%' }} className="rounded-xl">
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {bins.map((bin) => (
                <Marker key={bin.id} position={[bin.location.lat, bin.location.lng]}>
                  <Popup>
                    <strong>{bin.type}</strong><br />
                    Fill Level: {bin.fillLevel}%<br />
                    Status: {bin.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Live Camera Feed</h4>
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0NDQ0NDQyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjODg4ODg4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TGl2ZSBGZWVKPC90ZXh0Pjwvc3ZnPg==" alt="Live camera feed" className="w-full h-48 object-cover rounded-xl mb-4 bg-gray-200" />
          <div className="text-center">
            <Button variant="ghost" className="text-[#A8D5A2] hover:text-[#98C592] hover:bg-gray-50 transition-colors">Reset</Button>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Anomaly Alerts</h4>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group">
                    <span className="text-sm text-gray-700">{alert.message}</span>
                    <Button size="sm" className="bg-[#A8D5A2] hover:bg-[#98C592] text-gray-800 text-xs rounded-full transition-colors">Acknowledge</Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Worker Assignment Queue</h4>
              <div className="space-y-3">
                {workers.map((worker) => (
                  <div key={worker.id} className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-all cursor-pointer">
                    {worker.name}: {worker.assignment}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
