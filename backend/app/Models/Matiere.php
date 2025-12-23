namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'coefficient'];

    public function classes()
    {
        return $this->belongsToMany(Class::class, 'affectations');
    }
}
