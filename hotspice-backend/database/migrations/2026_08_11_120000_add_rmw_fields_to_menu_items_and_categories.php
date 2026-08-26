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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('icon')->nullable()->after('image');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->boolean('is_special')->default(false)->after('is_featured');
            $table->integer('prep_time')->nullable()->after('calories');
            $table->json('tags')->nullable()->after('prep_time');
            $table->decimal('rating', 2, 1)->default(0)->after('tags');
            $table->integer('rating_count')->default(0)->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('icon');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn(['is_special', 'prep_time', 'tags', 'rating', 'rating_count']);
        });
    }
};
