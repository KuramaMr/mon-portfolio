
export default function FormationCard({ titre, description, duree }) {
    return (
      <div className="border p-4 mb-4 rounded shadow">
        <h2 className="text-xl font-bold">{titre}</h2>
        <p className="mt-2">{description}</p>
        <p className="mt-2 font-semibold">Durée : {duree}</p>
      </div>
    );
  }