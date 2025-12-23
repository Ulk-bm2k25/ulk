use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('eleve_id')->nullable()->constrained('eleves')->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained('matieres')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};
