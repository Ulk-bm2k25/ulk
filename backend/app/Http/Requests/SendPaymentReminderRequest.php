<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request pour l'envoi d'un rappel de paiement
 */
class SendPaymentReminderRequest extends FormRequest
{
    /**
     * Déterminer si l'utilisateur est autorisé à faire cette requête.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Seuls les admins peuvent envoyer des rappels de paiement
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
            'amount' => 'required|numeric|min:0',
            'due_date' => 'nullable|date',
            'tranche' => 'nullable|string|max:255',
            'student_name' => 'nullable|string|max:255',
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
            'amount.required' => 'Le montant est requis.',
            'amount.numeric' => 'Le montant doit être un nombre.',
            'amount.min' => 'Le montant doit être supérieur ou égal à 0.',
            'due_date.date' => 'La date d\'échéance doit être une date valide.',
            'scheduled_at.date' => 'La date d\'envoi programmée doit être une date valide.',
            'scheduled_at.after' => 'La date d\'envoi programmée doit être dans le futur.',
        ];
    }
}

