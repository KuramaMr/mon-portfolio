import { NextResponse } from 'next/server';

const formationsData = [
  { id: 1, titre: "Formation 1", description: "Description de la formation 1", tags: ["tag1", "tag2"] },
  { id: 2, titre: "Formation 2", description: "Description de la formation 2", tags: ["tag2", "tag3"] },
  // Ajoutez d'autres formations ici
];

export async function GET() {
  return NextResponse.json(formationsData);
}