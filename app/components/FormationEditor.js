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
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Éditeur de Formations</h2>
      {formations.map((formation, index) => (
        <div key={formation.id} className="mb-4 p-4 border rounded">
          <input
            className="w-full mb-2 p-2 border rounded"
            value={formation.titre}
            onChange={(e) => {
              const newFormations = [...formations];
              newFormations[index].titre = e.target.value;
              setFormations(newFormations);
            }}
          />
          <textarea
            className="w-full mb-2 p-2 border rounded"
            value={formation.description}
            onChange={(e) => {
              const newFormations = [...formations];
              newFormations[index].description = e.target.value;
              setFormations(newFormations);
            }}
          />
          <input
            className="w-full p-2 border rounded"
            value={formation.duree}
            onChange={(e) => {
              const newFormations = [...formations];
              newFormations[index].duree = e.target.value;
              setFormations(newFormations);
            }}
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sauvegarder
      </button>
    </div>
  );
}