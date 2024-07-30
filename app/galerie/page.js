import CloudinaryImage from '../components/CloudinaryImage';

export default function Galerie() {
  // Ces IDs seront remplacés par vos vrais IDs d'images Cloudinary
  const imageIds = ['sample', 'sample2'];

  return (
    <div>
      <h1>Ma Galerie</h1>
      {imageIds.map((id) => (
        <CloudinaryImage key={id} publicId={id} alt={`Image ${id}`} />
      ))}
    </div>
  );
}