
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
    <div>
      <h2>Éditeur de Galerie</h2>
      {gallery.map((image, index) => (
        <div key={image.id}>
          <input
            value={image.titre}
            onChange={(e) => {
              const newGallery = [...gallery];
              newGallery[index].titre = e.target.value;
              setGallery(newGallery);
            }}
          />
          <input
            value={image.publicId}
            onChange={(e) => {
              const newGallery = [...gallery];
              newGallery[index].publicId = e.target.value;
              setGallery(newGallery);
            }}
          />
        </div>
      ))}
      <button onClick={handleSave}>Sauvegarder</button>
    </div>
  );
}