<template>
    <!-- Tabs -->
    <div class="w-100 d-flex justify-content-center mb-4">
        <div class="content-schedule-tabs shadow">
            <div class="tab-button mr-1" :class="{ active: activeTab === 'content' }" @click="activeTab = 'content'">
                Nội dung
            </div>
            <div class="tab-button" :class="{ active: activeTab === 'schedule' }" @click="activeTab = 'schedule'">
                Đặt lịch hỗ trợ
            </div>
        </div>
    </div>

    <!-- Nội dung khóa học -->
    <div v-if="activeTab === 'content'">
        <CourseDetails></CourseDetails>
    </div>

    <!-- Đặt lịch  -->
    <div v-if="activeTab === 'schedule'">
        <h3 class="content-title">
            <StudentCalendar></StudentCalendar>
        </h3>
    </div>
</template>

<script setup>
import CourseDetails from '@/components/Course/CourseDetails.vue';
import StudentCalendar from '@/components/student/StudentCalendar.vue';
import { ref} from 'vue';
const activeTab = ref("content");
</script>

<style scoped>
.content-schedule-tabs {
    display: flex;
    width: 50% !important;
    background: #fff;
    border-radius: 30px;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    padding: 5px;
}

.tab-button {
    width: 50%;
    padding-left: 15px;
    text-align: center;
    border-radius: 20px;
    background-color: #f3f3f3;
    padding: 5px;
    cursor: pointer;
}

.content-schedule-tabs .active {
    background-color: #0d6efd;
    color: #fff;
}
</style>