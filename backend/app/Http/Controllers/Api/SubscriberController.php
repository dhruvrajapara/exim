<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    /**
     * Store a new subscriber (Public)
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        // Use firstOrCreate to prevent duplicates while returning success
        $subscriber = Subscriber::firstOrCreate(
            ['email' => $request->email],
            ['status' => 'active']
        );

        return response()->json([
            'success' => true,
            'message' => 'Successfully subscribed to the newsletter!',
            'data' => $subscriber
        ]);
    }

    /**
     * Get all subscribers (Admin)
     */
    public function index()
    {
        $subscribers = Subscriber::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $subscribers
        ]);
    }

    /**
     * Delete a subscriber (Admin)
     */
    public function destroy($id)
    {
        $subscriber = Subscriber::find($id);
        
        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Subscriber not found'
            ], 404);
        }

        $subscriber->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subscriber deleted successfully'
        ]);
    }

    /**
     * Send bulk campaign emails
     */
    public function sendCampaign(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'html_content' => 'required|string',
            'recipient_type' => 'required|in:subscribers,inquiries,all,custom',
            'custom_emails' => 'nullable|string',
            'pdf_attachment' => 'nullable|file|mimes:pdf|max:15360'
        ]);

        $recipientList = []; // Stores array of ['email' => ..., 'name' => ...]

        if ($request->recipient_type === 'subscribers' || $request->recipient_type === 'all') {
            $subscribers = Subscriber::all();
            foreach ($subscribers as $s) {
                $recipientList[] = [
                    'email' => $s->email,
                    'name' => explode('@', $s->email)[0] // Default name from email prefix
                ];
            }
        }

        if ($request->recipient_type === 'inquiries' || $request->recipient_type === 'all') {
            $inquiries = \App\Models\Inquiry::all();
            foreach ($inquiries as $inq) {
                if ($inq->email) {
                    $recipientList[] = [
                        'email' => $inq->email,
                        'name' => $inq->name ?: explode('@', $inq->email)[0]
                    ];
                }
            }
        }

        if ($request->recipient_type === 'custom' && $request->filled('custom_emails')) {
            // Supports: "Dhruv Rajapara <dhruvrajapara2805@gmail.com>" OR "Dhruv Rajapara: dhruvrajapara2805@gmail.com" OR "dhruvrajapara2805@gmail.com"
            $rawLines = preg_split('/[\n,]+/', $request->custom_emails);
            foreach ($rawLines as $line) {
                $line = trim($line);
                if (empty($line)) continue;

                $email = '';
                $name = '';

                if (preg_match('/^(.*?)\s*<([^>]+)>$/', $line, $matches)) {
                    $name = trim($matches[1]);
                    $email = trim($matches[2]);
                } elseif (strpos($line, ':') !== false) {
                    $parts = explode(':', $line, 2);
                    $name = trim($parts[0]);
                    $email = trim($parts[1]);
                } else {
                    $email = $line;
                    $name = explode('@', $line)[0];
                }

                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $recipientList[] = [
                        'email' => $email,
                        'name' => $name ?: explode('@', $email)[0]
                    ];
                }
            }
        }

        // Deduplicate by email
        $uniqueRecipients = [];
        foreach ($recipientList as $item) {
            $uniqueRecipients[$item['email']] = $item;
        }

        if (empty($uniqueRecipients)) {
            return response()->json([
                'success' => false,
                'message' => 'No valid email recipients found.'
            ], 400);
        }

        // Handle PDF Attachment if uploaded
        $attachmentPath = null;
        $attachmentName = null;
        if ($request->hasFile('pdf_attachment')) {
            $file = $request->file('pdf_attachment');
            $attachmentName = $file->getClientOriginalName();
            
            $tempDir = storage_path('app/temp');
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0777, true);
            }
            
            $attachmentPath = $tempDir . '/' . \Illuminate\Support\Str::uuid() . '_' . $attachmentName;
            move_uploaded_file($file->getPathname(), $attachmentPath);
        }

        // Prevent PHP & Nginx 504 Gateway Timeout during email broadcast
        set_time_limit(300);

        // Dynamic SMTP configuration
        $smtpSettings = \App\Models\WebsiteSetting::whereIn('key', [
            'smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_encryption', 'smtp_from_address', 'smtp_from_name'
        ])->pluck('value', 'key')->toArray();

        if (!empty($smtpSettings['smtp_host']) && !empty($smtpSettings['smtp_username'])) {
            $encryption = strtolower($smtpSettings['smtp_encryption'] ?? 'ssl');
            $scheme = ($encryption === 'ssl' || $encryption === 'smtps') ? 'smtps' : null;

            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.host' => $smtpSettings['smtp_host'],
                'mail.mailers.smtp.port' => (int)($smtpSettings['smtp_port'] ?? 465),
                'mail.mailers.smtp.username' => $smtpSettings['smtp_username'],
                'mail.mailers.smtp.password' => $smtpSettings['smtp_password'] ?? '',
                'mail.mailers.smtp.scheme' => $scheme,
                'mail.mailers.smtp.timeout' => 15,
                'mail.from.address' => $smtpSettings['smtp_from_address'] ?: $smtpSettings['smtp_username'],
                'mail.from.name' => $smtpSettings['smtp_from_name'] ?: 'BiteExport'
            ]);
        }

        $dispatchedCount = 0;

        foreach ($uniqueRecipients as $recipient) {
            \App\Jobs\SendCampaignEmailJob::dispatch(
                $recipient,
                $request->subject,
                $request->html_content,
                $attachmentPath,
                $attachmentName,
                $request->recipient_type,
                $smtpSettings
            );
            $dispatchedCount++;
        }

        return response()->json([
            'success' => true,
            'message' => "Campaign broadcast started in background for {$dispatchedCount} recipients! Check Broadcast Logs for progress.",
            'sent_count' => $dispatchedCount,
            'failed_count' => 0
        ]);
    }

    public function getCampaignLogs()
    {
        $logs = \App\Models\CampaignLog::orderBy('created_at', 'desc')->limit(100)->get();
        return response()->json($logs);
    }
}
