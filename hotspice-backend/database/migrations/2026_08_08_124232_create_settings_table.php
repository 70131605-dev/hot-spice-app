<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('store_name')->default('Hot & Spice');
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->decimal('delivery_fee', 8, 2)->default(2.99);
            $table->decimal('min_order_value', 8, 2)->default(0);
            $table->boolean('is_accepting_orders')->default(true);
            $table->timestamps();
        });

        // Singleton row — the app always reads/writes id 1.
        DB::table('settings')->insert([
            'store_name' => 'Hot & Spice',
            'opening_time' => '09:00:00',
            'closing_time' => '23:00:00',
            'delivery_fee' => 2.99,
            'min_order_value' => 0,
            'is_accepting_orders' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
