<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendPaymentReminderRequest;
use App\Http\Requests\SendUrgentNotificationRequest;
use App\Http\Requests\SendGeneralNotificationRequest;
use App\Models\Notification;
use App\Models\NotificationTemplate;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controller API pour la gestion des notifications
 * 
 * Endpoints REST pour le frontend React
 */
class NotificationController extends Controller
{
    /**
     * Service de notifications
     *
     * @var NotificationService
     */
    protected NotificationService $notificationService;

    /**
     * Créer une nouvelle instance du controller.
     *
     * @param NotificationService $notificationService
     */
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Envoyer un rappel de paiement
     *
     * @param SendPaymentReminderRequest $request
     * @return JsonResponse
     */
    public function sendPaymentReminder(SendPaymentReminderRequest $request): JsonResponse
    {
        try {
            $recipient = \App\Models\User::findOrFail($request->recipient_id);
            
            $data = [
                'amount' => $request->amount,
                'due_date' => $request->due_date,
                'tranche' => $request->tranche,
                'student_name' => $request->student_name,
            ];

            $scheduledAt = $request->scheduled_at 
                ? \Carbon\Carbon::parse($request->scheduled_at) 
                : null;

            $notification = $this->notificationService->sendPaymentReminder(
                $recipient,
                $data,
                $request->user(),
                $scheduledAt
            );

            return response()->json([
                'success' => true,
                'message' => 'Rappel de paiement créé avec succès',
                'data' => [
                    'notification' => $notification->load(['recipient', 'template']),
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi du rappel de paiement', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du rappel de paiement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Envoyer une notification urgente
     *
     * @param SendUrgentNotificationRequest $request
     * @return JsonResponse
     */
    public function sendUrgentNotification(SendUrgentNotificationRequest $request): JsonResponse
    {
        try {
            $recipient = \App\Models\User::findOrFail($request->recipient_id);

            $notification = $this->notificationService->sendUrgentNotification(
                $recipient,
                $request->subject,
                $request->body,
                $request->metadata ?? [],
                $request->user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Notification urgente envoyée avec succès',
                'data' => [
                    'notification' => $notification->load(['recipient']),
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi de la notification urgente', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de la notification urgente',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Envoyer une notification générale
     *
     * @param SendGeneralNotificationRequest $request
     * @return JsonResponse
     */
    public function sendGeneralNotification(SendGeneralNotificationRequest $request): JsonResponse
    {
        try {
            $recipient = \App\Models\User::findOrFail($request->recipient_id);

            $scheduledAt = $request->scheduled_at 
                ? \Carbon\Carbon::parse($request->scheduled_at) 
                : null;

            $notification = $this->notificationService->sendGeneralNotification(
                $recipient,
                $request->subject,
                $request->body,
                $request->metadata ?? [],
                $request->user(),
                $scheduledAt
            );

            return response()->json([
                'success' => true,
                'message' => 'Notification générale créée avec succès',
                'data' => [
                    'notification' => $notification->load(['recipient']),
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi de la notification générale', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de la notification générale',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Lister les notifications (admin)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Notification::with(['recipient', 'sender', 'template']);

            // Filtres
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('recipient_id')) {
                $query->where('recipient_id', $request->recipient_id);
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $notifications = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $notifications,
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des notifications', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des notifications',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtenir une notification spécifique
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $notification = Notification::with(['recipient', 'sender', 'template', 'logs'])
                ->findOrFail($id);

            $stats = $this->notificationService->getNotificationStats($notification);

            return response()->json([
                'success' => true,
                'data' => [
                    'notification' => $notification,
                    'stats' => $stats,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Notification introuvable',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Obtenir les notifications de l'utilisateur connecté (parent)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function myNotifications(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $query = Notification::where('recipient_id', $user->id)
                ->with(['sender', 'template']);

            // Filtres
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $notifications = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $notifications,
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des notifications de l\'utilisateur', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des notifications',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Relancer une notification échouée
     *
     * @param int $id
     * @return JsonResponse
     */
    public function retry(int $id): JsonResponse
    {
        try {
            $notification = Notification::findOrFail($id);

            $result = $this->notificationService->retryFailedNotification($notification);

            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Notification relancée avec succès',
                    'data' => [
                        'notification' => $notification->fresh(),
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'La notification ne peut pas être relancée (statut invalide)',
            ], 400);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la relance de la notification', [
                'error' => $e->getMessage(),
                'notification_id' => $id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la relance de la notification',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Lister les templates disponibles
     *
     * @return JsonResponse
     */
    public function templates(): JsonResponse
    {
        try {
            $templates = NotificationTemplate::active()->get();

            return response()->json([
                'success' => true,
                'data' => $templates,
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des templates', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des templates',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tracker l'ouverture d'un email
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function trackOpen(Request $request, int $id): JsonResponse
    {
        try {
            $notification = Notification::findOrFail($id);

            // Créer un log d'ouverture
            \App\Models\NotificationLog::createOpenedLog(
                $notification->id,
                $notification->recipient->email,
                $request->ip(),
                $request->userAgent()
            );

            // Retourner une image 1x1 transparente
            $image = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
            
            return response($image, 200)->header('Content-Type', 'image/gif');

        } catch (\Exception $e) {
            Log::error('Erreur lors du tracking de l\'ouverture', [
                'error' => $e->getMessage(),
                'notification_id' => $id,
            ]);

            // Retourner quand même une image pour ne pas casser le tracking
            $image = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
            return response($image, 200)->header('Content-Type', 'image/gif');
        }
    }
}

