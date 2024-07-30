import { NextResponse } from 'next/server';

const galleryData = [
  { id: 1, titre: "cld-sample-4", publicId: "cld-sample-4" },
  { id: 2, titre: "cld-sample-5", publicId: "cld-sample-5" },
  // Ajoutez d'autres images ici
];

export async function GET() {
  return NextResponse.json(galleryData);
}