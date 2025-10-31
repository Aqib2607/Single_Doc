<?php

return [
    'defaults' => [
        'guard' => 'patient',
        'passwords' => 'patients',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'patients',
        ],
        'patient' => [
            'driver' => 'session',
            'provider' => 'patients',
        ],
        'doctor' => [
            'driver' => 'session',
            'provider' => 'doctors',
        ],
    ],

    'providers' => [
        'patients' => [
            'driver' => 'eloquent',
            'model' => App\Models\Patient::class,
        ],
        'doctors' => [
            'driver' => 'eloquent',
            'model' => App\Models\Doctor::class,
        ],
    ],

    'passwords' => [
        'patients' => [
            'provider' => 'patients',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
        'doctors' => [
            'provider' => 'doctors',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];