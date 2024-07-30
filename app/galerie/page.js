'use client';

import CloudinaryImage from '../components/CloudinaryImage';
import galleryData from '../../data/gallery.json';

export default function Galerie() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Ma Galerie</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryData.map((image) => (
          <div key={image.id} className="relative">
            <CloudinaryImage publicId={image.publicId} alt={image.titre} />
            <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              {image.titre}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}