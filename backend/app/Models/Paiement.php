<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $table = 'paiement';
    protected $fillable = [
        'eleve_id', 'tranche_id', 'montant_paye', 
        'mode_paiement', 'reference_paiement', 
        'statut', 'date_paiement'
    ];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function tranche()
    {
        return $this->belongsTo(TranchePaiement::class, 'tranche_id');
    }
}
