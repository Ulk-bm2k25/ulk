<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Présence</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            color: #333;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-section table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-section td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .info-section td:first-child {
            font-weight: bold;
            background-color: #f5f5f5;
            width: 30%;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .stat-item {
            text-align: center;
        }
        .stat-item .value {
            font-size: 24px;
            font-weight: bold;
            color: #eb8e3a;
        }
        .stat-item .label {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .table th {
            background-color: #eb8e3a;
            color: white;
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
        }
        .table td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .badge {
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-present {
            background-color: #d4edda;
            color: #155724;
        }
        .badge-absent {
            background-color: #f8d7da;
            color: #721c24;
        }
        .badge-late {
            background-color: #fff3cd;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>RAPPORT DE PRÉSENCE</h1>
        <p>École - Période du {{ \Carbon\Carbon::parse($date_debut)->format('d/m/Y') }} au {{ \Carbon\Carbon::parse($date_fin)->format('d/m/Y') }}</p>
    </div>

    <div class="stats">
        <div class="stat-item">
            <div class="value">{{ $totalPresences }}</div>
            <div class="label">Présences</div>
        </div>
        <div class="stat-item">
            <div class="value">{{ $totalAbsences }}</div>
            <div class="label">Absences</div>
        </div>
        <div class="stat-item">
            <div class="value">{{ $totalRetards }}</div>
            <div class="label">Retards</div>
        </div>
        <div class="stat-item">
            <div class="value">{{ $totalDays }}</div>
            <div class="label">Jours</div>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Élève</th>
                <th>Statut</th>
                <th>Motif</th>
            </tr>
        </thead>
        <tbody>
            @forelse($presences as $presence)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($presence->date)->format('d/m/Y') }}</td>
                    <td>{{ $presence->eleve->prenom ?? '' }} {{ $presence->eleve->nom ?? '' }}</td>
                    <td>
                        @if($presence->statut === 'present')
                            <span class="badge badge-present">Présent</span>
                        @elseif($presence->statut === 'absent')
                            <span class="badge badge-absent">Absent</span>
                        @else
                            <span class="badge badge-late">Retard</span>
                        @endif
                    </td>
                    <td>{{ $presence->motif ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align: center; padding: 20px;">Aucune donnée disponible</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Rapport généré le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>
</body>
</html>

