<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>
<template>
    <div class="flex-1 p-8">
        <h1 class="text-3xl font-semibold">Dashboard</h1>
            <!-- Your page content goes here -->
    </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'

export default {

}
</script>
