<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard_card_list(Request $request)
    {
        $approved_today = \App\Models\VisitaionInformation::where('status', 'approved')
            ->whereDate('created_at', now()->toDateString())
            ->count();
        $pending = \App\Models\VisitaionInformation::where('status', 'Pending')->count();
        $declined = \App\Models\VisitaionInformation::where('status', 'declined')->count();
        $statusCounts = \App\Models\VisitaionInformation::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');
        $ret = [
            "success" => true,
            "data" => [
                "approved_today" => $approved_today,
                "pending" => $pending,
                "declined" => $declined,
                "request" => $statusCounts->toArray(),
            ]
        ];

        return response()->json($ret, 200);
    }
}