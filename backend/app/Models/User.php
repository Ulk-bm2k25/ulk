<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyEmailNotification;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Relation: Un utilisateur peut être un parent/tuteur
     */
    public function parentTuteur(): HasOne
    {
        return $this->hasOne(ParentTuteur::class, 'user_id');
    }

    /**
     * Relation: Un utilisateur peut être un responsable (admin)
     */
    public function responsable(): HasOne
    {
        return $this->hasOne(Responsable::class, 'user_id');
    }

    /**
     * Relation: Un utilisateur peut être un enseignant
     */
    public function enseignant(): HasOne
    {
        return $this->hasOne(Enseignant::class, 'user_id');
    }

    /**
     * Vérifier si l'utilisateur est un parent
     */
    public function isParent(): bool
    {
        return $this->parentTuteur()->exists();
    }

    /**
     * Vérifier si l'utilisateur est un administrateur
     */
    public function isAdmin(): bool
    {
        return $this->responsable()->exists();
    }

    /**
     * Vérifier si l'utilisateur est un enseignant
     */
    public function isEnseignant(): bool
    {
        return $this->enseignant()->exists();
    }

    /**
     * Obtenir le rôle de l'utilisateur
     */
    public function getRole(): string
    {
        if ($this->isAdmin()) {
            return 'admin';
        } elseif ($this->isEnseignant()) {
            return 'enseignant';
        } elseif ($this->isParent()) {
            return 'parent';
        }
        
        return 'guest';
    }

    /**
     * Obtenir les données du profil en fonction du rôle
     */
    public function getProfile()
    {
        if ($this->isAdmin()) {
            return $this->responsable;
        } elseif ($this->isEnseignant()) {
            return $this->enseignant;
        } elseif ($this->isParent()) {
            return $this->parentTuteur;
        }
        
        return null;
    }

    /**
     * Envoyer la notification de réinitialisation de mot de passe personnalisée
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Envoyer la notification de vérification d'email personnalisée
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailNotification());
    }
}