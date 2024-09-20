<template>
    <div class="teacher-tab">
        <b-tabs content-class="mt-3">
            <b-tab title="Lịch rảnh" active>
                <Calendar url="http://localhost:8181/api/v1/teacher-calendar" />
            </b-tab>
            <b-tab title="Lịch bận">
                <Calendar url="http://localhost:8181/api/v1/teacher-calendar" />
            </b-tab>
        </b-tabs>
    </div>

</template>

<script setup>

import Calendar from '../Calendar/Calendar.vue';

</script>

<style>
.teacher-tab .nav-link {
    color: black !important;
}

.teacher-tab .active{
    color: #E3165B !important;
}
</style>