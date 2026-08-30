<?php

namespace App\Services;

use Google\Client;
use Google\Service\SearchConsole;
use Google\Service\SearchConsole\SearchAnalyticsQueryRequest;
use App\Models\WebsiteSetting;
use Illuminate\Support\Facades\Log;

class GoogleSearchConsoleService
{
    protected $client;
    protected $siteUrl;

    public function __construct()
    {
        $settings = WebsiteSetting::whereIn('key', [
            'gsc_enabled',
            'gsc_site_url',
            'gsc_service_account_json'
        ])->pluck('value', 'key')->toArray();

        $isEnabled = filter_var($settings['gsc_enabled'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $jsonConfig = $settings['gsc_service_account_json'] ?? null;
        $this->siteUrl = $settings['gsc_site_url'] ?? null;

        if ($isEnabled && $jsonConfig && $this->siteUrl) {
            try {
                $credentials = json_decode($jsonConfig, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($credentials)) {
                    $this->client = new Client();
                    $this->client->setAuthConfig($credentials);
                    $this->client->addScope(SearchConsole::WEBMASTERS_READONLY);
                }
            } catch (\Exception $e) {
                Log::error('Google Search Console Client Init Error: ' . $e->getMessage());
                $this->client = null;
            }
        }
    }

    public function isConnected()
    {
        return !is_null($this->client) && !empty($this->siteUrl);
    }

    public function getAnalyticsData($days = 30)
    {
        if (!$this->isConnected()) {
            return null;
        }

        try {
            $service = new SearchConsole($this->client);
            $request = new SearchAnalyticsQueryRequest();

            $endDate = date('Y-m-d', strtotime('-2 days')); // GSC has ~2-day latency
            $startDate = date('Y-m-d', strtotime("-{$days} days"));

            $request->setStartDate($startDate);
            $request->setEndDate($endDate);
            $request->setDimensions(['date']);
            $request->setRowLimit(100);

            $response = $service->sites_searchAnalytics->query($this->siteUrl, $request);
            $rows = $response->getRows();

            if (!$rows) {
                return [
                    'clicks' => 0,
                    'impressions' => 0,
                    'ctr' => 0,
                    'position' => 0,
                    'chart' => []
                ];
            }

            $totalClicks = 0;
            $totalImpressions = 0;
            $chartData = [];

            foreach ($rows as $row) {
                $clicks = $row->getClicks();
                $impressions = $row->getImpressions();
                $dateKey = $row->getKeys()[0] ?? '';

                $totalClicks += $clicks;
                $totalImpressions += $impressions;

                $chartData[] = [
                    'date' => date('M d', strtotime($dateKey)),
                    'clicks' => $clicks,
                    'impressions' => $impressions,
                ];
            }

            $ctr = $totalImpressions > 0 ? round(($totalClicks / $totalImpressions) * 100, 2) : 0;

            return [
                'total_clicks' => $totalClicks,
                'total_impressions' => $totalImpressions,
                'ctr' => $ctr,
                'chart' => $chartData
            ];

        } catch (\Exception $e) {
            Log::error('Google Search Console Query Error: ' . $e->getMessage());
            return [
                'error' => $e->getMessage()
            ];
        }
    }
}
