'use client';

import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';

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

  const addImage = () => {
    const newImage = {
      id: Date.now(),
      titre: 'Nouvelle image',
      publicId: 'default_public_id'
    };
    fetch('/api/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newImage)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGallery([...gallery, { ...newImage, id: data.id }]);
        }
      });
  };

  const removeImage = (id) => {
    fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGallery(gallery.filter(image => image.id !== id));
        }
      });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Éditeur de Galerie</h2>
      {gallery.map((image, index) => (
        <div key={image.id} className="mb-4 p-4 border rounded flex items-center">
          <div className="flex-shrink-0 mr-4">
            <CldImage
              width="100"
              height="100"
              src={image.publicId}
              alt={image.titre}
            />
          </div>
          <div className="flex-grow">
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
          <button
            onClick={() => removeImage(image.id)}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      ))}
      <button
        onClick={addImage}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
      >
        Ajouter une image
      </button>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sauvegarder
      </button>
    </div>
  );
}