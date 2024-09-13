<template>
  <div class="p-2">
    <div class="button-container">
      <!-- <button class="btn btn-primary">
        <router-link :to="{ name: 'StudentCreate' }" class="link-text">
          Add +
        </router-link>
      </button> -->
    </div>

    <div>
      <FormStudent />
    </div>

    <table v-if="list.length" class="styled-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in list" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.fullName }}</td>
          <td>{{ student.age }}</td>
          <td>
            <router-link :to="{ name: 'StudentDetail', params: { id: student.id } }" class="btn btn-info">
              Update
            </router-link>
            <button class="btn btn-danger" @click="openModal(student)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="totalPage > 1" class="pagination">
      <button @click="changePage(1)" :disabled="currentPage === 1">
        First
      </button>
      <span v-if="currentPage > 3">...</span>
      <button v-for="page in pagesToShow" :key="page" @click="changePage(page)" :disabled="currentPage === page">
        {{ page }}
      </button>

      <span v-if="currentPage < totalPage - 2">...</span>
      <button @click="changePage(totalPage)" :disabled="currentPage === totalPage">
        Last
      </button>
    </div>

    <Modal @confirm="handleDelete(seletedObject)" @close="closeModal" class="custom-modal"></Modal>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

// import Modal from '../Modal/Modal.vue';
import { useStore } from 'vuex';
import FormStudent from './StudentCalendar.vue';

const list = ref([]);
const seletedObject = ref(null);
const myModal = ref(null);
const rootApi = process.env.VUE_APP_ROOT_API;
const currentPage = ref(1);
const totalPage = ref(0);
const pageSize = ref(2);
const pagesToShow = ref([]);

// create store
const store = useStore();

onMounted(() => {
  myModal.value = new bootstrap.Modal(document.getElementById("exampleModal"));
  // fetchStudents();
  takeUser();
});

const fetchStudents = async (page = 1) => {
  try {
    const response = await axios.get(`${rootApi}/api/v1/users`, {
      params: {
        page,
        limit: pageSize.value,
      },
    });
    list.value = response.data.result.items || [];
    totalPage.value = response.data.result.totalPage || 1;
    currentPage.value = page;
    updatePagesToShow();
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

//temp data user and push role to store
const takeUser = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/users`);
    const resRole = response.data[0].role;
    store.dispatch('setUserRole', resRole);
  } catch (error) {
    console.error('Error: ', error);
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPage.value) {
    fetchStudents(page);
  }
};

const updatePagesToShow = () => {
  pagesToShow.value = [];

  if (totalPage.value <= 3) {
    for (let i = 1; i <= totalPage.value; i++) {
      pagesToShow.value.push(i);
    }
  } else {
    if (currentPage.value <= 2) {
      pagesToShow.value = [1, 2, 3];
    } else if (currentPage.value >= totalPage.value - 1) {
      pagesToShow.value = [totalPage.value - 2, totalPage.value - 1, totalPage.value];
    } else {
      pagesToShow.value = [
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
      ];
    }
  }
};

const handleDelete = async (data) => {
  try {
    await axios.delete(`${rootApi}/api/v1/users/${data.id}`);
    list.value = list.value.filter((item) => item.id !== data.id);
    if (list.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
    fetchStudents(currentPage.value);
    closeModal();
  } catch (error) {
    console.error('Error deleting student:', error);
  }
};

const openModal = (student) => {
  seletedObject.value = student;
  myModal.value.show();
};

const closeModal = () => {
  myModal.value.hide();
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button-container {
  margin-bottom: 20px;
  text-align: left;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
}

.link-text {
  color: #ffffff;
  text-decoration: none;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.styled-table th,
.styled-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.styled-table th {
  background-color: #f4f4f4;
  font-weight: 600;
}

.styled-table tbody tr:hover {
  background-color: #f9f9f9;
}

.btn-info {
  background-color: #17a2b8;
  border: none;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  margin-right: 5px;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-danger {
  background-color: #d63848;
  border: none;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.btn-danger:hover {
  background-color: #d62839;
}

.custom-modal .modal-dialog {
  max-width: 500px;
  margin: 30px auto;
}

.custom-modal .modal-content {
  border-radius: 8px;
  overflow: hidden;
}

.custom-modal .modal-header {
  background-color: #007bff;
  color: #ffffff;
  border-bottom: 1px solid #ddd;
}

.custom-modal .modal-footer {
  border-top: 1px solid #ddd;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #6b6b6b;
  color: #ffffff;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  opacity: 0.6;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.pagination button:disabled {
  background-color: #c0c0c0;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style>
