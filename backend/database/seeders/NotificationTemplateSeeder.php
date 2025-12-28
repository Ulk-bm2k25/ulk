<?php

namespace Database\Seeders;

use App\Models\NotificationTemplate;
use Illuminate\Database\Seeder;

/**
 * Seeder pour créer les templates de notifications par défaut
 */
class NotificationTemplateSeeder extends Seeder
{
    /**
     * Exécuter le seeder.
     *
     * @return void
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'payment_reminder_tranche_1',
                'subject' => 'Rappel de paiement - Tranche 1 - {{tranche}}',
                'body' => "Bonjour {{parent_name}},\n\nNous vous rappelons que le paiement de la tranche {{tranche}} pour {{student_name}} est dû.\n\nDétails :\n- Montant : {{amount}} FCFA\n- Date d'échéance : {{due_date}}\n\nVeuillez effectuer le paiement dans les plus brefs délais.\n\nCordialement,\nL'équipe administrative",
                'type' => 'payment_reminder',
                'is_active' => true,
                'variables' => [
                    'parent_name' => 'Nom du parent/tuteur',
                    'student_name' => 'Nom de l\'élève',
                    'amount' => 'Montant à payer',
                    'due_date' => 'Date d\'échéance',
                    'tranche' => 'Numéro de la tranche',
                ],
                'description' => 'Template pour les rappels de paiement de la première tranche',
            ],
            [
                'name' => 'payment_reminder_tranche_2',
                'subject' => 'Rappel de paiement - Tranche 2 - {{tranche}}',
                'body' => "Bonjour {{parent_name}},\n\nNous vous rappelons que le paiement de la tranche {{tranche}} pour {{student_name}} est dû.\n\nDétails :\n- Montant : {{amount}} FCFA\n- Date d'échéance : {{due_date}}\n\nVeuillez effectuer le paiement dans les plus brefs délais.\n\nCordialement,\nL'équipe administrative",
                'type' => 'payment_reminder',
                'is_active' => true,
                'variables' => [
                    'parent_name' => 'Nom du parent/tuteur',
                    'student_name' => 'Nom de l\'élève',
                    'amount' => 'Montant à payer',
                    'due_date' => 'Date d\'échéance',
                    'tranche' => 'Numéro de la tranche',
                ],
                'description' => 'Template pour les rappels de paiement de la deuxième tranche',
            ],
            [
                'name' => 'payment_reminder_tranche_3',
                'subject' => 'Rappel de paiement - Tranche 3 - {{tranche}}',
                'body' => "Bonjour {{parent_name}},\n\nNous vous rappelons que le paiement de la tranche {{tranche}} pour {{student_name}} est dû.\n\nDétails :\n- Montant : {{amount}} FCFA\n- Date d'échéance : {{due_date}}\n\nVeuillez effectuer le paiement dans les plus brefs délais.\n\nCordialement,\nL'équipe administrative",
                'type' => 'payment_reminder',
                'is_active' => true,
                'variables' => [
                    'parent_name' => 'Nom du parent/tuteur',
                    'student_name' => 'Nom de l\'élève',
                    'amount' => 'Montant à payer',
                    'due_date' => 'Date d\'échéance',
                    'tranche' => 'Numéro de la tranche',
                ],
                'description' => 'Template pour les rappels de paiement de la troisième tranche',
            ],
            [
                'name' => 'general_notification',
                'subject' => '{{subject}}',
                'body' => "Bonjour {{parent_name}},\n\n{{message}}\n\nCordialement,\nL'équipe administrative",
                'type' => 'general',
                'is_active' => true,
                'variables' => [
                    'parent_name' => 'Nom du parent/tuteur',
                    'subject' => 'Sujet de la notification',
                    'message' => 'Message principal',
                ],
                'description' => 'Template générique pour les notifications générales',
            ],
        ];

        foreach ($templates as $template) {
            NotificationTemplate::updateOrCreate(
                ['name' => $template['name']],
                $template
            );
        }

        $this->command->info('Templates de notifications créés avec succès !');
    }
}

