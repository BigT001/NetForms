"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import L from 'leaflet';

// Custom marker icon
const icon = L.divIcon({
  className: 'custom-marker',
  html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>`,
});

const MapVisitors = ({ locations }) => {
  const center = [20, 0]; // Default center of the map

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Visitor Locations</h3>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.latitude, location.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-semibold">{location.city}</p>
                  <p className="text-sm text-gray-600">{location.country}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default MapVisitors;
