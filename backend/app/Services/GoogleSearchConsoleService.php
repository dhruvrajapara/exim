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
            $endDate = date('Y-m-d', strtotime('-2 days')); // GSC has ~2-day latency
            $startDate = date('Y-m-d', strtotime("-{$days} days"));

            // 1. Fetch Date Chart & Overall Totals
            $dateReq = new SearchAnalyticsQueryRequest();
            $dateReq->setStartDate($startDate);
            $dateReq->setEndDate($endDate);
            $dateReq->setDimensions(['date']);
            $dateReq->setRowLimit(100);

            $dateRes = $service->sites_searchAnalytics->query($this->siteUrl, $dateReq);
            $dateRows = $dateRes->getRows() ?? [];

            $totalClicks = 0;
            $totalImpressions = 0;
            $chartData = [];

            foreach ($dateRows as $row) {
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

            // 2. Fetch Top Keywords / Queries
            $queryReq = new SearchAnalyticsQueryRequest();
            $queryReq->setStartDate($startDate);
            $queryReq->setEndDate($endDate);
            $queryReq->setDimensions(['query']);
            $queryReq->setRowLimit(10);

            $queryRes = $service->sites_searchAnalytics->query($this->siteUrl, $queryReq);
            $queryRows = $queryRes->getRows() ?? [];

            $topQueries = [];
            foreach ($queryRows as $row) {
                $topQueries[] = [
                    'keyword' => $row->getKeys()[0] ?? '',
                    'clicks' => $row->getClicks(),
                    'impressions' => $row->getImpressions(),
                    'ctr' => round($row->getCtr() * 100, 2),
                    'position' => round($row->getPosition(), 1)
                ];
            }

            // 3. Fetch Top Pages
            $pageReq = new SearchAnalyticsQueryRequest();
            $pageReq->setStartDate($startDate);
            $pageReq->setEndDate($endDate);
            $pageReq->setDimensions(['page']);
            $pageReq->setRowLimit(10);

            $pageRes = $service->sites_searchAnalytics->query($this->siteUrl, $pageReq);
            $pageRows = $pageRes->getRows() ?? [];

            $topPages = [];
            foreach ($pageRows as $row) {
                $fullUrl = $row->getKeys()[0] ?? '';
                $parsedPath = parse_url($fullUrl, PHP_URL_PATH) ?: '/';
                $topPages[] = [
                    'url' => $parsedPath,
                    'clicks' => $row->getClicks(),
                    'impressions' => $row->getImpressions(),
                    'ctr' => round($row->getCtr() * 100, 2),
                    'position' => round($row->getPosition(), 1)
                ];
            }

            // 4. Fetch Top Countries
            $countryReq = new SearchAnalyticsQueryRequest();
            $countryReq->setStartDate($startDate);
            $countryReq->setEndDate($endDate);
            $countryReq->setDimensions(['country']);
            $countryReq->setRowLimit(5);

            $countryRes = $service->sites_searchAnalytics->query($this->siteUrl, $countryReq);
            $countryRows = $countryRes->getRows() ?? [];

            $topCountries = [];
            foreach ($countryRows as $row) {
                $topCountries[] = [
                    'country' => strtoupper($row->getKeys()[0] ?? ''),
                    'clicks' => $row->getClicks(),
                    'impressions' => $row->getImpressions(),
                ];
            }

            return [
                'total_clicks' => $totalClicks,
                'total_impressions' => $totalImpressions,
                'ctr' => $ctr,
                'chart' => $chartData,
                'top_queries' => $topQueries,
                'top_pages' => $topPages,
                'top_countries' => $topCountries
            ];

        } catch (\Exception $e) {
            Log::error('Google Search Console Query Error: ' . $e->getMessage());
            return [
                'error' => $e->getMessage()
            ];
        }
    }
}
