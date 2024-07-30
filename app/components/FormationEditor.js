'use client';

import { useState, useEffect } from 'react';

export default function FormationEditor() {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => setFormations(data));
  }, []);

  const handleSave = () => {
    fetch('/api/formations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formations)
    }).then(() => alert('Formations sauvegardées'));
  };

  return (
    <div>
      <h2>Éditeur de Formations</h2>
      {formations.map((formation, index) => (
        <div key={formation.id}>
          <input
            value={formation.titre}
            onChange={(e) => {
              const newFormations = [...formations];
              newFormations[index].titre = e.target.value;
              setFormations(newFormations);
            }}
          />
          <input
            value={formation.description}
            onChange={(e) => {
              const newFormations = [...formations];
              newFormations[index].description = e.target.value;
              setFormations(newFormations);
            }}
          />
          <input
            value={formation.duree}
            onChange={(e) => {
              const newFormations = [...formations];
              newFormations[index].duree = e.target.value;
              setFormations(newFormations);
            }}
          />
        </div>
      ))}
      <button onClick={handleSave}>Sauvegarder</button>
    </div>
  );
}
