<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TranchePaiement extends Model
{
    protected $table = 'tranche_paiement';
    protected $fillable = ['frais_type_id', 'nom_tranche', 'pourcentage_du_total', 'date_limite'];

    public function fraisType()
    {
        return $this->belongsTo(FraisType::class, 'frais_type_id');
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'tranche_id');
    }
}
