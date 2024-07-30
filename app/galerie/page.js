'use client';

import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';

const ITEMS_PER_PAGE = 9; // Nombre d'images par page

export default function Galerie() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors du chargement de la galerie');
        }
        return res.json();
      })
      .then(data => setImages(data))
      .catch(err => {
        console.error('Erreur:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  const pageCount = Math.ceil(images.length / ITEMS_PER_PAGE);
  const paginatedImages = images.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Ma Galerie</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedImages.map((image) => (
          <div key={image.id} className="relative">
            <CldImage
              width="400"
              height="300"
              src={image.publicId}
              alt={image.titre}
            />
            <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              {image.titre}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}