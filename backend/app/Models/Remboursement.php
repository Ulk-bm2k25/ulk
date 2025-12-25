<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Remboursement extends Model
{
    use HasFactory;

    protected $table = 'remboursements';

    protected $fillable = [
        'numero_dossier',
        'etudiant_id',
        'montant',
        'motif',
        'description',
        'statut',
        'date_demande'
    ];

    protected $casts = [
        'date_demande' => 'datetime',
        'montant' => 'float'  // ✅ Correction ici
    ];

    // ✅ Relation avec spécification de la clé étrangère
    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'etudiant_id');
    }

    // ✅ Accesseur statut
    public function getStatutLibelleAttribute()
    {
        $statuts = [
            'en_attente' => 'En attente',
            'approuve'   => 'Approuvé',
            'refuse'     => 'Refusé',
            'paye'       => 'Payé'
        ];

        return $statuts[$this->statut] ?? $this->statut;
    }

    // ✅ Accesseur motif
    public function getMotifLibelleAttribute()
    {
        $motifs = [
            'double_paiement' => 'Double paiement',
            'erreur_montant'  => 'Erreur de montant',
            'desistement'     => 'Désistement',
            'autre'           => 'Autre'
        ];

        return $motifs[$this->motif] ?? $this->motif;
    }

    // ✅ Scopes
    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeApprouves($query)
    {
        return $query->where('statut', 'approuve');
    }

    // ✅ Ajoutez les attributs d'accesseur à $appends si nécessaire
    protected $appends = ['statut_libelle', 'motif_libelle'];
}