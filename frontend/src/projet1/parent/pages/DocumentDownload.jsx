import { useEffect, useState } from "react";
import "../styles/DocumentDownload.css";
import education from "../assets/education.svg";

export default function DocumentDownload() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/documents-list")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
        if (data.length > 0) setSelectedDoc(data[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      {/* Barre latérale (Liste des documents) */}
      <aside className="sidebar">
        <div className="logo-section">
          <img src={education} alt="logo" className="logo-img" />
          <span className="schoolname">SchoolHub</span>
        </div>

        <div className="sidebar-content">
          <h1>Documents</h1>
          <p className="subtitle">Sélectionnez pour prévisualiser</p>

          {loading ? (
            <p className="info">Chargement...</p>
          ) : (
            <ul className="doc-list">
              {documents.map((doc) => (
              <li 
  key={doc.id} 
  className={`doc-item ${selectedDoc?.id === doc.id ? "active" : ""}`}
  onClick={() => setSelectedDoc(doc)}
>
  <span className="doc-name">{doc.name}</span>
  
  {/* Bouton pour télécharger (Route download) */}
  <a 
    href={`http://localhost:8000/download/${doc.file_name}`} 
    className="download-btn-small"
    onClick={(e) => e.stopPropagation()}
  >
    ⬇
  </a>
</li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Zone d'aperçu (Remplit tout le reste à droite) */}
<main className="preview-area">
  {selectedDoc ? (
    <embed
      key={selectedDoc.id}
      /* On utilise la route /preview pour l'afficher à droite */
      src={`http://localhost:8000/preview/${selectedDoc.file_name}#toolbar=0`}
      type="application/pdf"
      width="100%"
      height="100%"
    />
  ) : (
    <div className="empty-state">Sélectionnez un document</div>
  )}
</main>
    </div>
  );
}