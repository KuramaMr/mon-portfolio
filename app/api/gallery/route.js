import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'gallery.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return new Response(fileContents, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const gallery = await request.json();
  const filePath = path.join(process.cwd(), 'data', 'gallery.json');
  await fs.writeFile(filePath, JSON.stringify(gallery, null, 2));
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}