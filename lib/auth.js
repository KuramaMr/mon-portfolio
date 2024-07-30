import bcrypt from 'bcrypt';

const users = [
  {
    id: 1,
    username: 'admin',
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
  },
];

export async function authenticate(username, password) {
  const user = users.find(u => u.username === username);
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;
  
  return { id: user.id, username: user.username };
}
