<?php
declare(strict_types=1);

/* KALTRUCK Premium — server-side cPanel quote submission.
 * Requires the hosting mail() transport to be configured for plockhds.pl.
 * PHP mail() returning true means accepted by the local mail transport,
 * not guaranteed delivery to Gmail.
 */
$isAjax = strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'xmlhttprequest';

function respond(int $status, string $message, bool $isAjax): void {
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if ($isAjax) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => $status === 200, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: /wycena/?status=' . ($status === 200 ? 'sent' : 'error'), true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Formularz przyjmuje tylko żądania POST.', $isAjax);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16000) {
    respond(413, 'Zbyt długa wiadomość.', $isAjax);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '') {
    $host = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if (!in_array($host, ['plockhds.pl', 'www.plockhds.pl'], true)) {
        respond(403, 'Niedozwolone źródło formularza.', $isAjax);
    }
}
if (!empty($_POST['website'])) {
    // Quietly discard requests that fill the honeypot field.
    respond(200, 'Zapytanie przyjęte.', $isAjax);
}

$requiredFields = ['name', 'phone', 'email', 'cargo', 'origin', 'destination', 'dimensions_weight', 'preferred_date', 'message'];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || !is_string($_POST[$field])) {
        respond(422, 'Sprawdź pola formularza.', $isAjax);
    }
}

$name = trim(strip_tags($_POST['name']));
$phone = trim(strip_tags($_POST['phone']));
$email = trim($_POST['email']);
$cargo = trim(strip_tags($_POST['cargo']));
$from = trim(strip_tags($_POST['origin']));
$to = trim(strip_tags($_POST['destination']));
$dimensions = trim(strip_tags($_POST['dimensions_weight']));
$date = trim($_POST['preferred_date']);
$message = trim(strip_tags(str_replace(["\r\n", "\r"], "\n", $_POST['message'])));

if ($phone === '' || $cargo === '' || $from === '' || $to === ''
    || strlen($name) > 240 || strlen($phone) > 100 || strlen($email) > 254
    || strlen($cargo) > 500 || strlen($from) > 400 || strlen($to) > 400
    || strlen($dimensions) > 500 || strlen($date) > 10 || strlen($message) > 8000
    || ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL))
    || ($date !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date))
    || preg_match('/[\r\n]/', $name . $phone . $email . $cargo . $from . $to . $dimensions . $date)) {
    respond(422, 'Sprawdź wymagane dane i poprawność adresu e-mail.', $isAjax);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ratePath = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR
    . 'kaltruck_premium_form_' . hash('sha256', __DIR__ . ':' . $ip) . '.txt';
$rateHandle = @fopen($ratePath, 'c+');
if ($rateHandle === false || !flock($rateHandle, LOCK_EX)) {
    if (is_resource($rateHandle)) fclose($rateHandle);
    error_log('[KALTRUCK Premium form] rate-limit store unavailable');
    respond(503, 'Wysyłka chwilowo niedostępna. Spróbuj ponownie później.', $isAjax);
}
$now = time();
$previous = array_values(array_filter(
    array_map('intval', explode(',', (string) stream_get_contents($rateHandle))),
    static fn (int $stamp): bool => $stamp <= $now && $stamp > $now - 900
));
if (count($previous) >= 3 || ($previous !== [] && max($previous) > $now - 45)) {
    flock($rateHandle, LOCK_UN);
    fclose($rateHandle);
    respond(429, 'Zbyt wiele prób. Spróbuj ponownie za minutę.', $isAjax);
}

$body = implode("\n", [
    'Zapytanie z plockhds.pl / KALTRUCK Premium',
    '',
    'Imię / firma: ' . ($name ?: 'nie podano'),
    'Telefon: ' . $phone,
    'Adres e-mail: ' . ($email ?: 'nie podano'),
    'Co przewozimy: ' . $cargo,
    'Skąd: ' . $from,
    'Dokąd: ' . $to,
    'Wymiary / waga: ' . ($dimensions ?: 'nie podano'),
    'Preferowany termin: ' . ($date ?: 'nie podano'),
    '',
    'Wiadomość:',
    $message ?: 'brak',
    '',
    '--',
    'Zapytanie z formularza wyceny KALTRUCK Premium',
]);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: KALTRUCK Premium <formularz@plockhds.pl>',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}
$subject = '=?UTF-8?B?' . base64_encode('Zapytanie o wycenę HDS — KALTRUCK') . '?=';
$queued = @mail('hds.plock@gmail.com', $subject, $body, implode("\r\n", $headers));

if ($queued) {
    $previous[] = $now;
    rewind($rateHandle);
    ftruncate($rateHandle, 0);
    fwrite($rateHandle, implode(',', $previous));
    fflush($rateHandle);
}
flock($rateHandle, LOCK_UN);
fclose($rateHandle);

if (!$queued) {
    error_log('[KALTRUCK Premium form] PHP mail() rejected outgoing message');
    respond(503, 'Serwer nie przyjął wiadomości. Spróbuj ponownie lub skontaktuj się telefonicznie.', $isAjax);
}
respond(200, 'Zapytanie zostało przyjęte do wysyłki. Dziękujemy!', $isAjax);
