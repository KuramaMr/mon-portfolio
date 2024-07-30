import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'formations.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier formations.json:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formations = await request.json();
    await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier formations.json:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request) {
  const newFormation = await request.json();
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const formations = JSON.parse(fileContents);
    formations.push(newFormation);
    await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
    return NextResponse.json({ success: true, id: newFormation.id });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une formation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    let formations = JSON.parse(fileContents);
    formations = formations.filter(formation => formation.id !== id);
    await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression d\'une formation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}