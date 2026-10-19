<?php

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Hash;
use Modules\Course\Models\Lesson;
use Modules\Course\Models\Offering;
use Modules\Course\Models\Subject;
use Modules\Identity\Models\User;

$backend = getenv('LARAVEL_BACKEND_PATH');
if (! $backend || ! is_file($backend.'/artisan')) {
    throw new RuntimeException('Set LARAVEL_BACKEND_PATH to the isolated backend checkout.');
}
require $backend.'/vendor/autoload.php';
$app = require $backend.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
if (config('database.connections.pgsql.database') !== 'shouman_integration') {
    throw new RuntimeException('Refusing to seed a non-disposable database.');
}
$password = bin2hex(random_bytes(20)).'Aa1!';
$users = [];
foreach (['admin' => 'system-administrator', 'manager' => 'academy-manager', 'instructor' => 'instructor', 'student' => 'student'] as $label => $role) {
    $user = User::factory()->create([
        'name' => 'اختبار تكامل '.$label,
        'email' => $label.'@integration.example.invalid',
        'password' => Hash::make($password),
    ]);
    $user->assignRole($role);
    $users[$label] = ['id' => $user->id, 'email' => $user->email];
}
$offering = Offering::factory()->create(['title' => 'دورة اختبار التكامل', 'slug' => 'integration-course', 'summary' => 'بيانات اختبار معزولة', 'starts_at' => '2026-10-19T10:00:00+03:00']);
$subjects = [];
foreach ([1, 2] as $position) {
    $subject = Subject::factory()->create(['offering_id' => $offering->id, 'title' => 'مادة اختبار '.$position, 'position' => $position]);
    $lessons = [];
    foreach ([1, 2] as $lessonPosition) {
        $lesson = Lesson::factory()->create(['subject_id' => $subject->id, 'title' => 'درس اختبار '.$position.'-'.$lessonPosition, 'position' => $lessonPosition]);
        $lessons[] = $lesson->id;
    }
    $subjects[] = ['id' => $subject->id, 'lessons' => $lessons];
}
$fixture = ['users' => $users, 'password' => $password, 'offering_id' => $offering->id, 'subjects' => $subjects];
file_put_contents('/tmp/shouman-live-credentials.json', json_encode($fixture, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
chmod('/tmp/shouman-live-credentials.json', 0600);
echo 'Disposable integration records created; credentials saved privately.'.PHP_EOL;
