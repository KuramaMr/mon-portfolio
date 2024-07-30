import { authenticate } from '../../../lib/auth';

export async function POST(request) {
  const { username, password } = await request.json();
  const user = await authenticate(username, password);
  
  if (user) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
