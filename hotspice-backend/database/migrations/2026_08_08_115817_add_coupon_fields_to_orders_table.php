<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Snapshot the code + amount rather than a coupon_id FK, so a coupon
            // can be edited/deleted later without touching historical orders —
            // same reasoning as order_items snapshotting item_name/item_price.
            $table->string('coupon_code')->nullable()->after('delivery_fee');
            $table->decimal('discount_amount', 8, 2)->default(0)->after('coupon_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['coupon_code', 'discount_amount']);
        });
    }
};
