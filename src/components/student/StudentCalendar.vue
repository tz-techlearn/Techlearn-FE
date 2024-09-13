<template>
    <div class="row d-md-flex justify-content-between nav-student">
        <div class="col col-md-3 d-md-flex justify-content-start align-items-center">
            <div class="img-avatar">
                <img class="rounded-circle"
                    src="https://media.discordapp.net/attachments/1276452438135799840/1282903831318888560/455284467_1042581230583933_1145821705937534774_n.jpg?ex=66e3afcc&is=66e25e4c&hm=8c4af59644a8c0c11d4088105720e9e0e0bebcb184214336d0e528c279fc519b&=&format=webp&width=643&height=643"
                    alt="my-avatar">
            </div>
            <div class="ms-2 d-flex flex-column align-items-center m-0">
                <div class="font-weight-bold name-color">Huang Phan</div>
                <div class="info-student">Học viên</div>
                <div class="info-student">hoang@gmail.com</div>
            </div>
        </div>
        <div v-if="stateButtonFormStudent === true" class="col col-md-9 d-flex align-items-center p-0">
            <form @submit.prevent="searchCalendar" class="row w-100">
                <div class="col col-md-11 d-flex justify-content-evenly">
                    <div>
                        <div>
                            <label class="font-weight-bold" for="course">Khóa học</label>
                            <span class="error-message">{{ courseError }}</span>
                        </div>
                        <div>
                            <select class="modify-select" name="course" v-model="course" @change="onCourseChange">
                                <option value="" disabled selected hidden>Chọn Khóa học</option>
                                <option class="modify-option" value="Course 1">Lập trình
                                    Python cơ bản và nâng cao</option>
                                <option class="modify-option" value="Lập trình C++ cơ bản và nâng cao">Lập trình C++ cơ
                                    bản và nâng cao</option>
                                <option class="modify-option" value="Lập trình Java cơ bản và nâng cao">Lập trình Java
                                    cơ bản và nâng cao</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label class="font-weight-bold" for="chapter">Chương</label>
                            <span class="error-message">{{ chapterError }}</span>
                        </div>
                        <div>
                            <select class="modify-select" name="chapter" v-model="chapter" :disabled="!course"
                                @change="onChuongChange">
                                <option value="" disabled selected hidden>Chọn chương</option>
                                <option class="modify-option" value="Chapter 1">Chương 1</option>
                                <option class="modify-option" value="chuong2">Chương 2</option>
                                <option class="modify-option" value="chuong3">Chương 3</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label class="font-weight-bold" for="teacher">Giảng viên</label>
                            <span class="error-message">{{ teacherError }}</span>
                        </div>
                        <div>
                            <select class="modify-select" name="teacher" v-model="teacher" :disabled="!chapter">
                                <option :value="null" disabled selected hidden>Chọn giảng viên</option>
                                <option class="modify-option" v-for="teacher in allTeachers" :key="teacher.id"
                                    :value="teacher">
                                    {{ teacher.OwnerText }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col col-md-1 d-flex justify-content-center align-items-center mt-4">
                    <button type="submit" class="btn btn-primary border-0 modify-button"
                        style="background-color: rgb(49, 210, 242) ">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                class="bi bi-funnel" viewBox="0 0 16 16">
                                <path
                                    d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
                            </svg> Lọc</span>
                    </button>
                </div>
            </form>
        </div>
        <div v-if="stateButtonFormStudent === false"
            class="col col-md-1 d-flex align-items-center justify-content-center">
            <button @click="changeOfStateButtonStudent" class="btn btn-primary border-0 modify-button"
                style="background-color: rgb(49, 210, 242) ">
                <span><i class="fas fa-plus"></i> Tạo lịch</span>
            </button>
        </div>
    </div>
    <div v-if="stateButtonFormStudent === true" class="row">
        <div class="col" style="margin-top: 60px;">
            <Calendar :url="url" :id="idGV" />
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useField, useForm } from 'vee-validate';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import * as yup from 'yup';
import Calendar from '../Calendar/Calendar.vue';
const rootApi = process.env.VUE_APP_ROOT_API;


const stateButtonFormStudent = ref(false);

const { handleSubmit, resetForm } = useForm({
    initialValues: {
        course: "",
        chapter: "",
        teacher: null,
    },
    validationSchema: yup.object({
        course: yup
            .string()
            .required('*bắt buộc'),
        chapter: yup
            .string()
            .required('*bắt buộc'),
        teacher: yup
            .object().nullable()
            .required('*bắt buộc')
    }),
});

const { value: course, errorMessage: courseError } = useField('course');
const { value: chapter, errorMessage: chapterError } = useField('chapter');
const { value: teacher, errorMessage: teacherError } = useField('teacher');
const allTeachers = ref([]);
const url = ref("");
const idGV = ref()


const getAllCalendars = () => {
    url.value = `${rootApi}`
}
const getAllTeacher = async () => {
    try {
        const res = await axios.get(`${rootApi}/teachers/`);
        allTeachers.value = res.data;
    } catch (error) {
        console.log(error);
    }
}

const changeOfStateButtonStudent = () => {
    stateButtonFormStudent.value = !stateButtonFormStudent.value;
}

const searchCalendar = handleSubmit(async (formData) => {
    try {
        const { course, chapter, teacher } = formData;
        
        const teacherName = teacher ? teacher.OwnerText : null;
        const technicalTeacherName = course;
        const chapterName = chapter;

        let res = await axios.get(`${rootApi}/teacher-calendar/find-calendars`, {
            params: {
                teacherName, technicalTeacherName, chapterName
            }
        });

        if (res.status === 200) {
            resetForm();
            idGV.value = res.data.result;
            getAllTeacher();
        }
    } catch (error) {
        toast.error("Không có khung giờ giảng viên trong ngày hôm nay!");
    }
});

const onCourseChange = () => {
    chapter.value = "";
    teacher.value = null;
}

const onChuongChange = () => {
    teacher.value = null;
}


onMounted(() => {
    getAllTeacher();
    getAllCalendars();
})
</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.img-avatar img {
    width: 75px;
    height: 75px;
}

.modify-button {
    padding: 6px 12px;
}

.name-color {
    color: #6B7A99;
}

.info-student {
    color: var(--text-color);
    font-size: 13px;
}

.modify-select {
    border-radius: 8px;
    padding: 8px;
    color: var(--text-color);
}

.modify-option {
    color: rgb(45, 34, 34);
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
}

.input-time {
    max-width: 75px;
    height: auto;
}
</style>