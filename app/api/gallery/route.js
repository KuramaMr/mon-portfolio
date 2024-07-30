import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'gallery.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier gallery.json:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const gallery = await request.json();
    await fs.writeFile(filePath, JSON.stringify(gallery, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier gallery.json:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request) {
  const newImage = await request.json();
  const fileContents = await fs.readFile(filePath, 'utf8');
  const gallery = JSON.parse(fileContents);
  gallery.push(newImage);
  await fs.writeFile(filePath, JSON.stringify(gallery, null, 2));
  return NextResponse.json({ success: true, id: newImage.id });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const fileContents = await fs.readFile(filePath, 'utf8');
  let gallery = JSON.parse(fileContents);
  gallery = gallery.filter(image => image.id !== id);
  await fs.writeFile(filePath, JSON.stringify(gallery, null, 2));
  return NextResponse.json({ success: true });
}