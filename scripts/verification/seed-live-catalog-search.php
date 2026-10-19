<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Hash;
use Modules\Course\Models\Offering;
use Modules\Identity\Models\User;

$backend = getenv('LARAVEL_BACKEND_PATH');
if (! $backend || ! is_file($backend.'/artisan')) {
    throw new RuntimeException('Set LARAVEL_BACKEND_PATH to the isolated backend checkout.');
}
require $backend.'/vendor/autoload.php';
$app = require $backend.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
$connection = config('database.default');
if ($connection !== 'pgsql' || config('database.connections.'.$connection.'.database') !== 'shouman_integration') {
    throw new RuntimeException('Refusing to seed outside disposable PostgreSQL shouman_integration.');
}
$path = getenv('SEARCH_INTEGRATION_FIXTURE') ?: '/tmp/shouman-search-credentials.json';
if (file_exists($path)) {
    throw new RuntimeException('Use a fresh SEARCH_INTEGRATION_FIXTURE path.');
}
$prefix = 'بحث'.bin2hex(random_bytes(6));
$password = bin2hex(random_bytes(20)).'Aa1!';
$user = User::factory()->create([
    'name' => 'اختبار البحث المعزول',
    'email' => bin2hex(random_bytes(8)).'@integration.example.invalid',
    'password' => Hash::make($password),
]);
$user->assignRole('system-administrator');
$rows = [];
$create = function (string $key, array $attributes = []) use (&$rows, $prefix): void {
    $offering = Offering::factory()->create(array_replace([
        'title' => $prefix.' '.$key,
        'slug' => 'search-'.bin2hex(random_bytes(10)),
        'summary' => 'بيانات اختبار معزولة', 'description' => 'محتوى اختبار معزول',
        'kind' => 'course', 'pricing' => 'free', 'is_featured' => true,
        'status' => 'published', 'published_at' => now()->subDay(),
        'visible_from' => null, 'visible_until' => null,
    ], $attributes));
    $rows[$key] = ['id' => $offering->id, 'slug' => $offering->slug];
};
foreach (range(1, 7) as $index) {
    $create('page'.$index);
}
$create('latin', ['title' => $prefix.' MiXeD']);
$create('literal', ['title' => $prefix.' %_\\ & +']);
$create('summary', ['title' => 'ملخص معزول', 'summary' => $prefix.' ملخص']);
$create('description', ['title' => 'وصف معزول', 'description' => $prefix.' وصف']);
$create('draft', ['status' => 'draft', 'published_at' => null]);
$create('hidden', ['status' => 'hidden']);
$create('future', ['visible_from' => now()->addDay()]);
$create('expired', ['visible_until' => now()->subDay()]);
$create('paid', ['pricing' => 'paid', 'price_amount' => 15000, 'currency' => 'EGP']);
$create('track', ['kind' => 'track']);
$create('ordinary', ['is_featured' => false]);
$manifest = ['prefix' => $prefix, 'rows' => $rows, 'users' => ['admin' => ['id' => $user->id, 'email' => $user->email]], 'password' => $password];
// Exclusive creation prevents accidentally overwriting another active run's credentials.
$handle = fopen($path, 'x');
if ($handle === false) {
    throw new RuntimeException('Use a fresh SEARCH_INTEGRATION_FIXTURE path.');
}
chmod($path, 0600);
fwrite($handle, json_encode($manifest, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
fclose($handle);
echo 'Disposable search fixtures created; credentials saved privately.'.PHP_EOL;
