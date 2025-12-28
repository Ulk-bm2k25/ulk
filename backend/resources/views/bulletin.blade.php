<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Bulletin de Notes - {{ $eleve->user->nom }} {{ $eleve->user->prenom }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; font-size: 12px; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ea580c; padding-bottom: 15px; }
        .school-name { font-size: 24px; font-weight: bold; color: #ea580c; text-transform: uppercase; margin: 0; }
        .school-info { font-size: 10px; color: #666; margin-top: 5px; }
        
        .bulletin-title { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; }
        
        .info-grid { width: 100%; margin-bottom: 30px; }
        .info-box { width: 48%; display: inline-block; vertical-align: top; }
        .info-label { font-weight: bold; color: #64748b; margin-bottom: 2px; }
        .info-value { font-size: 14px; color: #1e293b; font-weight: bold; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #ea580c; color: white; padding: 10px; text-align: left; font-size: 10px; text-transform: uppercase; }
        td { border: 1px solid #e2e8f0; padding: 10px; }
        tr:nth-child(even) { background: #f8fafc; }
        
        .summary { float: right; width: 250px; background: #ea580c; color: white; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .summary-label { font-size: 10px; opacity: 0.9; }
        .summary-value { font-size: 18px; font-weight: bold; }
        
        .footer { position: fixed; bottom: 30px; left: 0; width: 100%; text-align: center; font-size: 8px; color: #94a3b8; }
        .signatures { margin-top: 60px; width: 100%; }
        .sig-box { width: 30%; display: inline-block; text-align: center; font-weight: bold; border-top: 1px solid #333; padding-top: 10px; }
        
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="school-name">SchoolHUB - Academy</h1>
        <div class="school-info">Excellence - Discipline - Succès | Contact: +229 00 00 00 00 | Email: contact@schoolhub.bj</div>
    </div>

    <div class="bulletin-title">BULLETIN DE NOTES - {{ $semestre->nom }}</div>

    <table class="info-grid">
        <tr>
            <td style="border:none; padding:0; width: 50%;">
                <div class="info-label">Élève :</div>
                <div class="info-value">{{ strtoupper($eleve->user->nom) }} {{ $eleve->user->prenom }}</div>
                <div style="margin-top: 10px;">
                    <div class="info-label">Matricule :</div>
                    <div class="info-value" style="font-family: monospace;">{{ $eleve->id }}</div>
                </div>
            </td>
            <td style="border:none; padding:0; width: 50%; text-align: right;">
                <div class="info-label">Classe :</div>
                <div class="info-value">{{ $eleve->classe->nom }}</div>
                <div style="margin-top: 10px;">
                    <div class="info-label">Année Scolaire :</div>
                    <div class="info-value">{{ $annee_scolaire }}</div>
                </div>
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th style="width: 40%;">Matière</th>
                <th style="text-align: center;">Coef.</th>
                <th style="text-align: center;">Note / 20</th>
                <th style="text-align: center;">Note Pondérée</th>
                <th>Appréciation</th>
            </tr>
        </thead>
        <tbody>
            @foreach($notes as $note)
            <tr>
                <td style="font-weight: bold;">{{ $note->matiere->nom }}</td>
                <td style="text-align: center;">{{ $note->coefficient }}</td>
                <td style="text-align: center;">{{ number_format($note->note, 2) }}</td>
                <td style="text-align: center; font-weight: bold;">{{ number_format($note->note * $note->coefficient, 2) }}</td>
                <td style="font-style: italic; font-size: 10px;">
                    @if($note->note >= 16) Très Bien
                    @elseif($note->note >= 14) Bien
                    @elseif($note->note >= 12) Assez Bien
                    @elseif($note->note >= 10) Passable
                    @else Insuffisant
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="clear: both;">
        <div class="summary">
            <div style="font-size: 10px; margin-bottom: 5px;">RÉSULTATS GLOBAUX</div>
            <div style="font-size: 24px; font-weight: 900;">MOYENNE : {{ number_format($average, 2) }} / 20</div>
            <div style="font-size: 10px; margin-top: 5px; opacity: 0.8;">Total des points : {{ $total_points }} / {{ $total_coefficients * 20 }}</div>
        </div>
    </div>

    <div class="signatures">
        <div class="sig-box" style="float: left; margin-left: 5%;">Le Parent</div>
        <div class="sig-box" style="float: right; margin-right: 5%;">Le Directeur</div>
        <div style="clear: both;"></div>
    </div>

    <div class="footer">
        Document généré automatiquement par SchoolHUB le {{ date('d/m/Y à H:i') }} - Page 1/1
    </div>
</body>
</html>
