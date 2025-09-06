<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('cities', function (Blueprint $table) {
            // Add country_id if missing
            if (!Schema::hasColumn('cities', 'country_id')) {
                $table->foreignId('country_id')->after('name')->constrained('countries')->onDelete('cascade');
            }
            
            // Add state_id if missing
            if (!Schema::hasColumn('cities', 'state_id')) {
                $table->foreignId('state_id')->after('country_id')->constrained('states')->onDelete('cascade');
            }
        });
    }

    public function down()
    {
        Schema::table('cities', function (Blueprint $table) {
            // Remove foreign key constraints first
            $table->dropForeign(['country_id']);
            $table->dropForeign(['state_id']);
            
            // Then drop the columns
            $table->dropColumn(['country_id', 'state_id']);
        });
    }
};