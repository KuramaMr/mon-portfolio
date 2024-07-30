import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'formations.json');

export async function GET() {
  const fileContents = await fs.readFile(filePath, 'utf8');
  return new Response(fileContents, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const formations = await request.json();
  await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request) {
  const newFormation = await request.json();
  const fileContents = await fs.readFile(filePath, 'utf8');
  const formations = JSON.parse(fileContents);
  formations.push(newFormation);
  await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
  return new Response(JSON.stringify({ success: true, id: newFormation.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const fileContents = await fs.readFile(filePath, 'utf8');
  let formations = JSON.parse(fileContents);
  formations = formations.filter(formation => formation.id !== id);
  await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}