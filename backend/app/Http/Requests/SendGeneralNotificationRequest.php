<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request pour l'envoi d'une notification générale
 */
class SendGeneralNotificationRequest extends FormRequest
{
    /**
     * Déterminer si l'utilisateur est autorisé à faire cette requête.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Seuls les admins peuvent envoyer des notifications générales
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Obtenir les règles de validation qui s'appliquent à la requête.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'recipient_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'metadata' => 'nullable|array',
            'scheduled_at' => 'nullable|date|after:now',
        ];
    }

    /**
     * Obtenir les messages d'erreur personnalisés.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'recipient_id.required' => 'Le destinataire est requis.',
            'recipient_id.exists' => 'Le destinataire sélectionné n\'existe pas.',
            'subject.required' => 'Le sujet est requis.',
            'subject.string' => 'Le sujet doit être une chaîne de caractères.',
            'subject.max' => 'Le sujet ne doit pas dépasser 255 caractères.',
            'body.required' => 'Le corps du message est requis.',
            'body.string' => 'Le corps du message doit être une chaîne de caractères.',
            'scheduled_at.date' => 'La date d\'envoi programmée doit être une date valide.',
            'scheduled_at.after' => 'La date d\'envoi programmée doit être dans le futur.',
        ];
    }
}

