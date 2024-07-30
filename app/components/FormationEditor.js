'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

export default function FormationEditor() {
  const [formations, setFormations] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "formations"
  });

  useEffect(() => {
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => {
        setFormations(data);
        reset({ formations: data });
        const tags = new Set(data.flatMap(formation => formation.tags));
        setAllTags(Array.from(tags));
      });
  }, [reset]);

  const onSubmit = (data) => {
    fetch('/api/formations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.formations)
    }).then(() => alert('Formations sauvegardées'));
  };

  const addFormation = () => {
    append({
      id: Date.now(),
      titre: '',
      description: '',
      duree: '',
      tags: []
    });
  };

  const addTag = (formationIndex, tag) => {
    const updatedFormations = [...formations];
    if (!updatedFormations[formationIndex].tags.includes(tag)) {
      updatedFormations[formationIndex].tags.push(tag);
      setFormations(updatedFormations);
      if (!allTags.includes(tag)) {
        setAllTags([...allTags, tag]);
      }
    }
  };

  const removeTag = (formationIndex, tagToRemove) => {
    const updatedFormations = [...formations];
    updatedFormations[formationIndex].tags = updatedFormations[formationIndex].tags.filter(tag => tag !== tagToRemove);
    setFormations(updatedFormations);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Éditeur de Formations</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 p-4 border rounded">
            <input
              {...register(`formations.${index}.titre`, { required: "Le titre est requis" })}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Titre de la formation"
            />
            {errors.formations?.[index]?.titre && <span className="text-red-500">{errors.formations[index].titre.message}</span>}
            
            <textarea
              {...register(`formations.${index}.description`, { required: "La description est requise" })}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Description de la formation"
            />
            {errors.formations?.[index]?.description && <span className="text-red-500">{errors.formations[index].description.message}</span>}
            
            <input
              {...register(`formations.${index}.duree`, { required: "La durée est requise" })}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Durée de la formation"
            />
            {errors.formations?.[index]?.duree && <span className="text-red-500">{errors.formations[index].duree.message}</span>}
            
            <div className="mb-2">
              <h4 className="font-bold">Tags:</h4>
              {formations[index]?.tags.map(tag => (
                <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(index, tag)} className="ml-1 text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="mb-2">
              <input
                className="p-2 border rounded mr-2"
                placeholder="Ajouter un tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(index, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              {allTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(index, tag)}
                  className="bg-blue-500 text-white rounded px-2 py-1 text-sm mr-1 mb-1"
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFormation}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        >
          Ajouter une formation
        </button>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sauvegarder
        </button>
      </form>
    </div>
  );
}