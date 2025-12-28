<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Fiche d'Inscription</title>
    <style>
        @page {
            margin: 20mm;
        }
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header h1 {
            margin: 0;
            color: #2563eb;
            font-size: 24pt;
        }
        .header p {
            margin: 5px 0;
            color: #666;
            font-size: 10pt;
        }
        .section {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9fafb;
            border-left: 4px solid #2563eb;
        }
        .section h3 {
            margin-top: 0;
            color: #2563eb;
            font-size: 14pt;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
        }
        .info-grid {
            display: table;
            width: 100%;
            margin: 10px 0;
        }
        .info-row {
            display: table-row;
        }
        .info-label {
            display: table-cell;
            font-weight: bold;
            width: 35%;
            padding: 8px 0;
            color: #555;
        }
        .info-value {
            display: table-cell;
            padding: 8px 0;
            color: #333;
        }
        .photo-container {
            float: right;
            margin: 0 0 15px 15px;
            text-align: center;
        }
        .photo-container img {
            width: 120px;
            height: 150px;
            object-fit: cover;
            border: 2px solid #e5e7eb;
            border-radius: 4px;
        }
        .tuteurs-list {
            list-style: none;
            padding: 0;
        }
        .tuteurs-list li {
            padding: 10px;
            margin: 8px 0;
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 9pt;
            color: #666;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 9pt;
            font-weight: bold;
        }
        .badge-success {
            background-color: #d1fae5;
            color: #065f46;
        }
        .badge-warning {
            background-color: #fef3c7;
            color: #92400e;
        }
        .badge-danger {
            background-color: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FICHE D'INSCRIPTION</h1>
        <p>Année Scolaire: {{ $inscription->anneeScolaire->annee ?? 'N/A' }}</p>
        <p>Date d'inscription: {{ \Carbon\Carbon::parse($inscription->date_inscription)->format('d/m/Y') }}</p>
    </div>

    <div class="section">
        <h3>📋 Informations de l'Élève</h3>
        
        @if($inscription->eleve->photo)
        <div class="photo-container">
            <img src="{{ public_path('storage/' . $inscription->eleve->photo) }}" alt="Photo">
        </div>
        @endif

        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Matricule:</div>
                <div class="info-value"><strong>{{ $inscription->eleve->matricule ?? 'N/A' }}</strong></div>
            </div>
            <div class="info-row">
                <div class="info-label">Nom complet:</div>
                <div class="info-value">{{ $inscription->eleve->user->prenom }} {{ $inscription->eleve->user->nom }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Date de naissance:</div>
                <div class="info-value">{{ $inscription->eleve->date_naissance ? \Carbon\Carbon::parse($inscription->eleve->date_naissance)->format('d/m/Y') : 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Lieu de naissance:</div>
                <div class="info-value">{{ $inscription->eleve->lieu_naissance ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Sexe:</div>
                <div class="info-value">{{ $inscription->eleve->sexe === 'M' ? 'Masculin' : 'Féminin' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Âge:</div>
                <div class="info-value">{{ $inscription->eleve->age ?? 'N/A' }} ans</div>
            </div>
            <div class="info-row">
                <div class="info-label">Adresse:</div>
                <div class="info-value">{{ $inscription->eleve->adresse ?? 'N/A' }}</div>
            </div>
            @if($inscription->eleve->classe)
            <div class="info-row">
                <div class="info-label">Classe:</div>
                <div class="info-value">{{ $inscription->eleve->classe->nom }} ({{ $inscription->eleve->classe->niveauScolaire->nom ?? 'N/A' }})</div>
            </div>
            @endif
            <div class="info-row">
                <div class="info-label">Statut:</div>
                <div class="info-value">
                    @if($inscription->statut === 'inscrit')
                        <span class="badge badge-success">Inscrit</span>
                    @elseif($inscription->statut === 'en attente')
                        <span class="badge badge-warning">En attente</span>
                    @else
                        <span class="badge badge-danger">Rejeté</span>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>👨‍👩‍👧 Parents / Tuteurs</h3>
        <ul class="tuteurs-list">
            @forelse($inscription->eleve->tuteurs as $tuteur)
            <li>
                <strong>{{ $tuteur->prenom }} {{ $tuteur->nom }}</strong><br>
                <small>
                    Relation: {{ $tuteur->pivot->relation_type ?? 'PARENT' }} | 
                    Téléphone: {{ $tuteur->telephone ?? 'N/A' }} | 
                    Email: {{ $tuteur->email ?? 'N/A' }}<br>
                    @if($tuteur->adresse)
                    Adresse: {{ $tuteur->adresse }}<br>
                    @endif
                    @if($tuteur->profession)
                    Profession: {{ $tuteur->profession }}
                    @endif
                </small>
            </li>
            @empty
            <li>Aucun tuteur enregistré</li>
            @endforelse
        </ul>
    </div>

    @if($inscription->eleve->documents && $inscription->eleve->documents->count() > 0)
    <div class="section">
        <h3>📎 Documents joints</h3>
        <ul>
            @foreach($inscription->eleve->documents as $document)
            <li>{{ $document->type }} - {{ $document->nom_original ?? 'Document' }} ({{ \Carbon\Carbon::parse($document->date_upload)->format('d/m/Y') }})</li>
            @endforeach
        </ul>
    </div>
    @endif

    @if($inscription->commentaire)
    <div class="section">
        <h3>📝 Commentaires</h3>
        <p>{{ $inscription->commentaire }}</p>
    </div>
    @endif

    <div class="footer">
        <p>Document généré automatiquement le {{ now()->format('d/m/Y à H:i') }}</p>
        <p>Ce document est confidentiel et réservé à un usage administratif.</p>
    </div>
</body>
</html>
