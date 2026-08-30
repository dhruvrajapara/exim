<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\CampaignMail;
use App\Models\CampaignLog;

class SendCampaignEmailJob implements ShouldQueue
{
    use Queueable;

    public $recipient;
    public $subject;
    public $htmlContent;
    public $attachmentPath;
    public $attachmentName;
    public $recipientType;
    public $smtpSettings;

    public function __construct($recipient, $subject, $htmlContent, $attachmentPath, $attachmentName, $recipientType, $smtpSettings)
    {
        $this->recipient = $recipient;
        $this->subject = $subject;
        $this->htmlContent = $htmlContent;
        $this->attachmentPath = $attachmentPath;
        $this->attachmentName = $attachmentName;
        $this->recipientType = $recipientType;
        $this->smtpSettings = $smtpSettings;
    }

    public function handle(): void
    {
        // Dynamic SMTP configuration
        if (!empty($this->smtpSettings['smtp_host']) && !empty($this->smtpSettings['smtp_username'])) {
            $encryption = strtolower($this->smtpSettings['smtp_encryption'] ?? 'ssl');
            $scheme = ($encryption === 'ssl' || $encryption === 'smtps') ? 'smtps' : null;

            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.host' => $this->smtpSettings['smtp_host'],
                'mail.mailers.smtp.port' => (int)($this->smtpSettings['smtp_port'] ?? 465),
                'mail.mailers.smtp.username' => $this->smtpSettings['smtp_username'],
                'mail.mailers.smtp.password' => $this->smtpSettings['smtp_password'] ?? '',
                'mail.mailers.smtp.scheme' => $scheme,
                'mail.mailers.smtp.timeout' => 30,
                'mail.from.address' => $this->smtpSettings['smtp_from_address'] ?: $this->smtpSettings['smtp_username'],
                'mail.from.name' => $this->smtpSettings['smtp_from_name'] ?: 'BiteExport'
            ]);
        }

        $userEmail = $this->recipient['email'];
        $userName = ucwords(str_replace(['.', '_', '-'], ' ', $this->recipient['name']));

        // Dynamic Personalization Tag Replacements
        $personalizedSubject = str_replace(
            ['{name}', '{email}'],
            [$userName, $userEmail],
            $this->subject
        );

        $personalizedHtml = str_replace(
            ['{name}', '{email}'],
            [$userName, $userEmail],
            $this->htmlContent
        );

        try {
            Mail::to($userEmail)->send(
                new CampaignMail($personalizedSubject, $personalizedHtml, $this->attachmentPath, $this->attachmentName)
            );

            CampaignLog::create([
                'subject' => $personalizedSubject,
                'recipient_email' => $userEmail,
                'recipient_name' => $userName,
                'recipient_type' => $this->recipientType,
                'status' => 'sent',
                'error_message' => null,
                'pdf_attachment_name' => $this->attachmentName
            ]);
        } catch (\Exception $e) {
            $err = $e->getMessage();
            Log::error("Failed to send campaign mail to {$userEmail}: " . $err);

            CampaignLog::create([
                'subject' => $personalizedSubject,
                'recipient_email' => $userEmail,
                'recipient_name' => $userName,
                'recipient_type' => $this->recipientType,
                'status' => 'failed',
                'error_message' => $err,
                'pdf_attachment_name' => $this->attachmentName
            ]);
        }
    }
}
