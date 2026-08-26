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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            // A review belongs to (and dies with) its order — nothing currently
            // deletes orders, but if that ever changes, the review going with it
            // is correct (unlike order_items, a review isn't purchase history).
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            // restrictOnDelete as a DB-level backstop: the app already blocks
            // deleting a menu item that's ever been ordered (Phase 3), and a
            // review can only exist for an item that was ordered, so this
            // should never actually fire in practice.
            $table->foreignId('menu_item_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->boolean('is_hidden')->default(false);
            $table->timestamps();

            $table->unique(['order_id', 'menu_item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
