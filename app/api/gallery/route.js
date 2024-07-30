import { NextResponse } from 'next/server';

const galleryData = [
  { id: 1, titre: "Image 1", publicId: "sample1" },
  { id: 2, titre: "Image 2", publicId: "sample2" },
  // Ajoutez d'autres images ici
];

export async function GET() {
  return NextResponse.json(galleryData);
}