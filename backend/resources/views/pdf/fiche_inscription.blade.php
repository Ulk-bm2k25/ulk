<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans; }
    </style>
</head>
<body>

<h2 style="text-align: center">FICHE D’INSCRIPTION</h2>

<p><strong>Nom :</strong> {{ $inscription->eleve->user->name }}</p>
<p><strong>Classe :</strong> {{ $inscription->eleve->classe->nom }}</p>
<p><strong>Date :</strong> {{ $inscription->date_inscription }}</p>

<h4>Parents / Tuteurs</h4>
<ul>
@foreach($inscription->eleve->tuteurs as $tuteur)
    <li>
        {{ $tuteur->nom }} {{ $tuteur->prenom }}
        ({{ $tuteur->pivot->relation_type }})
        - {{ $tuteur->telephone }}
    </li>
@endforeach
</ul>

<p>Document généré automatiquement</p>

</body>
</html>