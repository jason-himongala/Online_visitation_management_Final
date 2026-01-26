<?php

namespace App\Listeners;

use App\Events\SendEmailEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendEmailListener implements ShouldQueue
{
    public function handle(SendEmailEvent $event)
    {
        $data = $event->mail_data;

        Mail::send(
            $data['template'],
            $data['body_data'],
            function ($message) use ($data) {
                $message->to($data['to_email'], $data['to_name'] ?? null)
                    ->subject($data['subject'])
                    ->from($data['from_email'], $data['from_name']);

                if (isset($data['attachment'])) {
                    foreach ($data['attachment'] as $file) {
                        $message->attach($file);
                    }
                }
            }
        );
    }
}
