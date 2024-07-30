'use client';

import { useState, useEffect } from 'react';

export default function FormationEditor() {
  const [formations, setFormations] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        setFormations(data);
        const tags = new Set(data.flatMap(formation => formation.tags));
        setAllTags(Array.from(tags));
      });
  }, []);

  const handleSave = () => {
    fetch('/api/formations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formations)
    }).then(() => alert('Formations sauvegardées'));
  };

  const addFormation = () => {
    const newFormation = {
      id: Date.now(),
      titre: 'Nouvelle formation',
      description: 'Description de la nouvelle formation',
      duree: '1 jour',
      tags: []
    };
    fetch('/api/formations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFormation)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormations([...formations, { ...newFormation, id: data.id }]);
        }
      });
  };

  const removeFormation = (id) => {
    fetch('/api/formations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormations(formations.filter(formation => formation.id !== id));
        }
      });
  };

  const addTag = (formationIndex, tag) => {
    const newFormations = [...formations];
    if (!newFormations[formationIndex].tags.includes(tag)) {
      newFormations[formationIndex].tags.push(tag);
      setFormations(newFormations);
      if (!allTags.includes(tag)) {
        setAllTags([...allTags, tag]);
      }
    }
  };

  const removeTag = (formationIndex, tag) => {
    const newFormations = [...formations];
    newFormations[formationIndex].tags = newFormations[formationIndex].tags.filter(t => t !== tag);
    setFormations(newFormations);
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
            className="w-full mb-2 p-2 border rounded"
            value={formation.duree}
            onChange={(e) => {
              const newFormations = [...formations];
              newFormations[index].duree = e.target.value;
              setFormations(newFormations);
            }}
          />
          <div className="mb-2">
            <h4 className="font-bold">Tags:</h4>
            {formation.tags.map(tag => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {tag}
                <button onClick={() => removeTag(index, tag)} className="ml-1 text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <div className="mb-2">
            <input
              className="p-2 border rounded mr-2"
              placeholder="Ajouter un tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTag(index, e.target.value);
                  e.target.value = '';
                }
              }}
            />
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => addTag(index, tag)}
                className="bg-blue-500 text-white rounded px-2 py-1 text-sm mr-1 mb-1"
              >
                {tag}
              </button>
            ))}
          </div>
          <button
            onClick={() => removeFormation(formation.id)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      ))}
      <button
        onClick={addFormation}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
      >
        Ajouter une formation
      </button>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sauvegarder
      </button>
    </div>
  );
}