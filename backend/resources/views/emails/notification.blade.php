<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 24px;
        }
        .content {
            margin-bottom: 30px;
        }
        .content p {
            margin-bottom: 15px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .urgent {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .urgent h3 {
            color: #dc2626;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>École - Plateforme de Gestion Scolaire</h1>
        </div>

        <div class="content">
            @if($notification->type === 'urgent_info')
                <div class="urgent">
                    <h3>⚠️ Information Urgente</h3>
                </div>
            @endif

            <h2>{{ $subject }}</h2>

            <div>
                {!! nl2br(e($body)) !!}
            </div>

            @if($notification->type === 'payment_reminder' && isset($notification->metadata['amount']))
                <p style="font-size: 18px; font-weight: bold; color: #2563eb;">
                    Montant : {{ number_format($notification->metadata['amount'], 2, ',', ' ') }} FCFA
                </p>
            @endif
        </div>

        <div class="footer">
            <p>Cet email a été envoyé par la plateforme de gestion scolaire.</p>
            <p>© {{ date('Y') }} - Tous droits réservés</p>
            <p style="margin-top: 15px;">
                <small>
                    <a href="{{ config('app.url') }}/notifications/{{ $notification->id }}/track/open?token={{ $notification->id }}">
                        Suivre cette notification
                    </a>
                </small>
            </p>
        </div>
    </div>
</body>
</html>

