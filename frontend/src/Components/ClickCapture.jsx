// src/Components/ClickCapture.jsx
import React from 'react';
import { useMapEvents } from 'react-leaflet';

const ClickCapture = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      if (onLocationSelect) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng });
      }
    },
  });
  return null; // No visible output, just event handling
};

export default ClickCapture; // Ensure default export