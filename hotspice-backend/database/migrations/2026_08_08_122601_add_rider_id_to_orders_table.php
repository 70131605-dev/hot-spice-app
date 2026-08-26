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
            // nullOnDelete (not cascade) so removing a rider never touches order
            // history — same lesson learned from the menu_items/categories
            // cascade-delete bug found in Phase 3. The app also blocks deleting
            // a rider who still has orders assigned, as a first line of defense.
            $table->foreignId('rider_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('rider_id');
        });
    }
};
