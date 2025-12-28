<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Carte de Scolarité</title>
    <style>
        @page {
            margin: 0;
            size: 85.6mm 53.98mm;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 9pt;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card {
            width: 85.6mm;
            height: 53.98mm;
            background: white;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            padding: 4mm;
        }
        .card-header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 3mm;
            margin: -4mm -4mm 3mm -4mm;
            text-align: center;
            font-size: 8pt;
            font-weight: bold;
        }
        .card-body {
            display: flex;
            height: calc(100% - 20mm);
        }
        .card-left {
            flex: 1;
            padding-right: 2mm;
        }
        .card-right {
            width: 25mm;
            text-align: center;
        }
        .photo {
            width: 20mm;
            height: 25mm;
            object-fit: cover;
            border: 1px solid #e5e7eb;
            border-radius: 2px;
            margin-bottom: 2mm;
        }
        .qr-code {
            width: 20mm;
            height: 20mm;
            border: 1px solid #e5e7eb;
            border-radius: 2px;
        }
        .student-name {
            font-size: 11pt;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 1mm;
            line-height: 1.2;
        }
        .student-info {
            font-size: 7pt;
            color: #6b7280;
            margin: 1mm 0;
            line-height: 1.3;
        }
        .matricule {
            font-size: 10pt;
            font-weight: bold;
            color: #2563eb;
            margin-top: 2mm;
            padding-top: 2mm;
            border-top: 1px solid #e5e7eb;
        }
        .classe-info {
            font-size: 8pt;
            color: #374151;
            margin-top: 1mm;
        }
        .year {
            font-size: 7pt;
            color: #9ca3af;
            margin-top: 1mm;
        }
        .card-footer {
            position: absolute;
            bottom: 2mm;
            left: 4mm;
            right: 4mm;
            text-align: center;
            font-size: 6pt;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
            padding-top: 1mm;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="card-header">
            CARTE DE SCOLARITÉ
        </div>
        
        <div class="card-body">
            <div class="card-left">
                <div class="student-name">
                    {{ strtoupper($eleve->user->nom) }}<br>
                    {{ $eleve->user->prenom }}
                </div>
                
                <div class="student-info">
                    @if($eleve->classe)
                    Classe: <strong>{{ $eleve->classe->nom }}</strong><br>
                    @endif
                    @if($eleve->date_naissance)
                    Né(e) le: {{ \Carbon\Carbon::parse($eleve->date_naissance)->format('d/m/Y') }}<br>
                    @endif
                </div>
                
                <div class="matricule">
                    Matricule: {{ $eleve->matricule ?? 'N/A' }}
                </div>
                
                <div class="year">
                    Année: {{ $anneeScolaire->annee ?? date('Y') . '-' . (date('Y') + 1) }}
                </div>
            </div>
            
            <div class="card-right">
                @if($eleve->photo)
                <img src="{{ public_path('storage/' . $eleve->photo) }}" alt="Photo" class="photo">
                @else
                <div class="photo" style="background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 6pt;">
                    Photo
                </div>
                @endif
                
                @if($qrCodeUrl)
                <img src="{{ $qrCodeUrl }}" alt="QR Code" class="qr-code">
                @endif
            </div>
        </div>
        
        <div class="card-footer">
            Document officiel - Ne pas dupliquer
        </div>
    </div>
</body>
</html>

