<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('states', function (Blueprint $table) {
            if (!Schema::hasColumn('states', 'name')) {
                $table->string('name')->after('id');
            }
            
            if (!Schema::hasColumn('states', 'country_id')) {
                $table->foreignId('country_id')->after('name')->constrained('countries')->onDelete('cascade');
            }
        });
    }

    public function down()
    {
        Schema::table('states', function (Blueprint $table) {
            $table->dropColumn(['name', 'country_id']);
        });
    }
};