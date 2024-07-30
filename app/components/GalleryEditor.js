'use client';

import { useState, useEffect } from 'react';

export default function GalleryEditor() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setGallery(data));
  }, []);

  const handleSave = () => {
    fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gallery)
    }).then(() => alert('Galerie sauvegardée'));
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Éditeur de Galerie</h2>
      {gallery.map((image, index) => (
        <div key={image.id} className="mb-4 p-4 border rounded">
          <input
            className="w-full mb-2 p-2 border rounded"
            value={image.titre}
            onChange={(e) => {
              const newGallery = [...gallery];
              newGallery[index].titre = e.target.value;
              setGallery(newGallery);
            }}
          />
          <input
            className="w-full p-2 border rounded"
            value={image.publicId}
            onChange={(e) => {
              const newGallery = [...gallery];
              newGallery[index].publicId = e.target.value;
              setGallery(newGallery);
            }}
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sauvegarder
      </button>
    </div>
  );
}