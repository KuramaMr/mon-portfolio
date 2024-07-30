import FormationCard from '../components/FormationCard';
import formations from '../../data/formations.json';

export default function Formations() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Mes Formations</h1>
      {formations.map((formation) => (
        <FormationCard key={formation.id} {...formation} />
      ))}
    </div>
  );
}