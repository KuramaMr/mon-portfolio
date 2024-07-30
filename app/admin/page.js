'use client';

import { useState } from 'react';
import FormationEditor from '../components/FormationEditor';
import GalleryEditor from '../components/GalleryEditor';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.success) {
      setIsAuthenticated(true);
    } else {
      alert('Authentification échouée');
    }
  };

  if (!isAuthenticated) {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <button type="submit">Se connecter</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Administration</h1>
      <FormationEditor />
      <GalleryEditor />
    </div>
  );
}