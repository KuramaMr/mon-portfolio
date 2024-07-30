'use client';

import { useState, useEffect } from 'react';
import FormationCard from '../components/FormationCard';

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        setFormations(data);
        setFilteredFormations(data);
        const tags = new Set(data.flatMap(formation => formation.tags));
        setAllTags(Array.from(tags));
      });
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredFormations(formations);
    } else {
      setFilteredFormations(formations.filter(formation =>
        selectedTags.every(tag => formation.tags.includes(tag))
      ));
    }
  }, [selectedTags, formations]);

  const toggleTag = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Mes Formations</h1>
      <div className="mb-4">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`mr-2 mb-2 px-3 py-1 rounded ${
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {filteredFormations.map((formation) => (
        <FormationCard key={formation.id} {...formation} />
      ))}
    </div>
  );
}