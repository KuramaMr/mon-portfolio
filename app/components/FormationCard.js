export default function FormationCard({ titre, description, duree, tags }) {
    return (
      <div className="border p-4 mb-4 rounded shadow">
        <h2 className="text-xl font-bold">{titre}</h2>
        <p className="mt-2">{description}</p>
        <p className="mt-2 font-semibold">Durée : {duree}</p>
        <div className="mt-2">
          {tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }