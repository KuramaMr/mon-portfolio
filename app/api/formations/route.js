import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'formations.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return new Response(fileContents, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const formations = await request.json();
  const filePath = path.join(process.cwd(), 'data', 'formations.json');
  await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
