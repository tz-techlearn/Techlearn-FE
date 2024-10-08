<template>
  <div class="container ">
    <div class="row">
      <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-4" v-for="(course, index) in courses" :key="index">
        <div class="card shadow mx-2 d-flex flex-column" style="width: 100%;">
          <img :src="course.thumbnailUrl" class="card-img-top" alt="Course thumbnail" />
          <div class="card-body d-flex flex-column flex-grow-1" @click="navigateToAssignment(course.id)">
            <p class="card-name">{{ course.name }}</p>
            <p class="card-total-exercises">{{ course.totalExercises }}</p>
            <p class="card-text flex-grow-1">{{ truncatedDescriptions(course.description) }}</p>
          </div>
          <div class="c-footer pb-2" v-if="course.teacher.length > 1">
            <img class="avatar" :src="avatar" alt="Teacher avatar" />
            <p class="my-auto">{{ course?.teacher[0]?.name }}</p>
          </div>
          <div class="d-flex gap-2 justify-content-center pb-3 container">
            <button v-if="isTrial(course.id)" type="button" class="btn btn-primary btn-buy-only px-2">Mua</button>
            <button v-else-if="isPaid(course.id)" type="button" class="btn btn-primary btn-learn-only">Học</button>
            <div v-else class="d-flex gap-2 justify-content-center w-100">
              <button type="button" class="btn btn-primary btn-buy w-40">Mua</button>
              <button type="button" class="btn btn-primary btn-try w-40">Học Thử</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import avatar from "../../public/avatar.jpg";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();

const rootApi = process.env.VUE_APP_ROOT_API;
const courses = ref([]);
const studentCourses = ref([]);
const userID = computed(() => store.getters.user);

const fetchCourses = async () => {
  const response = await axios.get(`${rootApi}/courses?id=${userID.value.id}`);
  courses.value = response.data.result.data.items;
};

const fetchStudentCourses = async () => {
  const response = await axios.get(`${rootApi}/student-courses?id=${userID.value.id}`);
  studentCourses.value = response.data.result;
};

const isTrial = (courseId) => {
  const studentCourse = studentCourses.value?.find(sc => sc.idCourse === courseId);
  return studentCourse && studentCourse.status === "TRIAL";
};

const isPaid = (courseId) => {
  const studentCourse = studentCourses.value?.find(sc => sc.idCourse === courseId);
  return studentCourse && studentCourse.status === "PAID";
};

const navigateToAssignment = (courseId) => {
  router.push({
    name: 'lesson',
    params: { id: courseId }
  });
};

const truncatedDescriptions = (description) => {
  return description.length > 120 ?
    description.substring(0, 120) + '...' :
    description
};


onMounted(async () => {
  await fetchCourses();
  await fetchStudentCourses();
});
</script>

<style scoped>
.container {
  /* display: flex;
  justify-content: center; */
}

.card-container {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.w-40 {
  width: 50%;
}

.card-img-top {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.title {
  margin-top: 8px;
  font-weight: 650;
  font-size: 24px;
}

.card-title {
  font-weight: 580;
}

.card {
  cursor: pointer;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  height: 370px;
}

.quantity-exercise {
  font-size: 14px;
  color: rgb(175, 154, 154);
}

.card-text {
  font-size: 10px;
  font-weight: 300;
  color: rgb(120, 88, 88);
}

.c-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin-left: 15px;
  align-items: center;
}

.c-footer img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(0, 122, 255, 0.42);
  padding: 2px;
  background-color: white;
}

.avatar {
  object-fit: cover;
}

.card-name {
  font-size: 12px;
  font-weight: 500;
}

.card-total-exercises {
  font-weight: 300;
  font-size: 12px;
  opacity: 50%;
}

.btn {
  width: 100%;
  height: 29px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  transition: background-color 0.1s ease;
}

.btn-try {
  background-color: rgba(99, 151, 206, 0.42);
  color: rgba(0, 0, 0, 1);
}

.btn-try:hover {
  background-color: rgba(3, 125, 255, 0.568);
  color: rgba(0, 0, 0, 1);
}

.btn-buy {
  background-color: rgba(212, 28, 37, 0.541);
  color: rgba(0, 0, 0, 1);
}

.btn-buy-only {
  background-color: rgba(212, 28, 37, 0.541);
  color: rgba(0, 0, 0, 1);
  width: 100%;
}

.btn-learn-only {
  width: 100%;
  background-color: #00e3cc;
  color: rgba(0, 0, 0, 1);
}

.btn-learn-only:hover {
  background-color: #03b3a1;
  color: rgba(0, 0, 0, 1);
}


.btn-buy:hover,
.btn-buy-only:hover {
  background-color: rgba(190, 47, 47, 0.651);
  color: rgba(0, 0, 0, 1);
}
</style>