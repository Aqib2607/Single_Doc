<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogApiRequests
{
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);
        
        // Log incoming request
        Log::info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
            'body' => $request->all(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        $response = $next($request);
        
        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2);
        
        // Log response
        Log::info('API Response', [
            'status' => $response->status(),
            'duration_ms' => $duration,
            'response_size' => strlen($response->getContent()),
            'response_body' => $response->getContent()
        ]);

        return $response;
    }
}