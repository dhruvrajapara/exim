<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectText;
    public $htmlContent;
    public $attachmentPath;
    public $attachmentName;

    public function __construct($subjectText, $htmlContent, $attachmentPath = null, $attachmentName = null)
    {
        $this->subjectText = $subjectText;
        $this->htmlContent = $htmlContent;
        $this->attachmentPath = $attachmentPath;
        $this->attachmentName = $attachmentName;
    }

    public function build()
    {
        $mail = $this->subject($this->subjectText)
                     ->html($this->htmlContent);

        if ($this->attachmentPath && file_exists($this->attachmentPath)) {
            $options = [];
            if ($this->attachmentName) {
                $options['as'] = $this->attachmentName;
            }
            $options['mime'] = 'application/pdf';

            $mail->attach($this->attachmentPath, $options);
        }

        return $mail;
    }
}
