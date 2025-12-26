<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; margin: 0; padding: 0; }
        .card {
            width: 320px;
            height: 200px;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 10px;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
        }
        .header {
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 5px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
        }
        .school-name { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #f97316; }
        .year { font-size: 8px; opacity: 0.7; }
        .content { display: flex; gap: 10px; }
        .photo-box {
            width: 70px;
            height: 85px;
            background: #475569;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .details { flex: 1; }
        .label { font-size: 6px; text-transform: uppercase; color: #f97316; margin-bottom: 1px; }
        .value { font-size: 10px; font-weight: bold; margin-bottom: 5px; }
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #f97316;
            color: white;
            padding: 5px 10px;
            font-size: 9px;
            font-weight: bold;
            text-align: center;
        }
        .matricule { font-size: 8px; margin-top: 5px; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <span class="school-name">{{ $school_name }}</span>
            <span class="year">{{ $academic_year }}</span>
        </div>
        <div class="content">
            <div class="photo-box">
                @if($eleve->photo)
                    <img src="{{ public_path($eleve->photo) }}" style="width: 100%; height: 100%; object-fit: cover;">
                @else
                    <span style="font-size: 20px; opacity: 0.2;">PHOTO</span>
                @endif
            </div>
            <div class="details">
                <div class="label">Nom & Prénoms</div>
                <div class="value">{{ strtoupper($eleve->user->nom) }} {{ $eleve->user->prenom }}</div>
                
                <div style="display: flex; gap: 15px;">
                    <div>
                        <div class="label">Classe</div>
                        <div class="value">{{ $eleve->classe->nom }}</div>
                    </div>
                    <div>
                        <div class="label">Sexe</div>
                        <div class="value">{{ $eleve->sexe }}</div>
                    </div>
                </div>

                <div class="matricule">MATRICULE: {{ $eleve->matricule }}</div>
            </div>
        </div>
        <div class="footer">CARTE D'IDENTITÉ SCOLAIRE</div>
    </div>
</body>
</html>
