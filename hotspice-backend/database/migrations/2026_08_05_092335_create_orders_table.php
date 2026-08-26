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
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('order_number')->unique();
        $table->enum('order_type', ['delivery', 'pickup'])->default('delivery');
        $table->enum('status', ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'])->default('pending');
        $table->decimal('subtotal', 8, 2);
        $table->decimal('delivery_fee', 8, 2)->default(0);
        $table->decimal('total', 8, 2);
        $table->text('delivery_address')->nullable();
        $table->text('notes')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
