'use client';

import { useState, useEffect } from 'react';
import CloudinaryImage from '../components/CloudinaryImage';

export default function Galerie() {
  const [imageIds, setImageIds] = useState([]);

  useEffect(() => {
    // Ici, vous pourriez charger les IDs d'image depuis une API ou un fichier
    setImageIds(['sample', 'sample2']);
  }, []);

  return (
    <div>
      <h1>Ma Galerie</h1>
      {imageIds.map((id) => (
        <CloudinaryImage key={id} publicId={id} alt={`Image ${id}`} />
      ))}
    </div>
  );
}