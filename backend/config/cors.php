<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
<<<<<<< HEAD
    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:5500'],
=======
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5500'],
>>>>>>> group-1
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];