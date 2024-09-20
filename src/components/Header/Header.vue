<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <button @click="toggleSidebar" type="button" id="sidebarCollapse" class="btn btn-info">
                    <i class="fas fa-align-left text-white"></i>
                </button>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ml-auto align-items-center">
                        <li v-if="!isLoggedIn" class="nav-item">
                            <a class="nav-link" href="/login">
                                <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 512 512">
                                    <path
                                        d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                                </svg>
                                Đăng Nhập
                            </a>
                        </li>
                        <li v-else class="nav-item dropdown">
                            <link class="name-color">{{ user.fullName }}</link>
                            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img :src="user.avatar"
                                    class="rounded-circle avatar" alt="User Avatar">
                            </a>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                <a class="dropdown-item" href="#">Thông tin cá nhân</a>
                                <div class="dropdown-divider"></div>
                                <p class="dropdown-item" @click="handleLogout">Đăng xuất</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import axios from 'axios';
import { inject, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const toggleSidebar = inject('toggleSidebar');
const isLoggedIn = ref(false);
const user = ref({ fullName: '' ,avatar: ''});

onMounted(() => {
    checkLoginStatus();
});

const checkLoginStatus = async () => {
    const accessToken = localStorage.getItem("accessToken");
    isLoggedIn.value = !!accessToken;

    if (isLoggedIn.value) {
        try {
            const response = await axios.get("http://localhost:8181/api/v1/users/me", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            user.value = response.data.result;
        } catch (error) {
            console.error( error);
        }
    }
};

const handleLogout = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        localStorage.clear();
        router.push("/login").then(() => {
            toast.success("Đăng xuất thành công!", {
                autoClose: 1200
            });
        });
        await axios.get("http://localhost:8181/api/v1/auth/logout", {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        isLoggedIn.value = false;
    } catch (err) {
        console.log(err);
    }
};
</script>

<style scoped>
.navbar {
    padding: 15px 10px;
    background: #fff;
    border: none;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
    box-shadow: none;
    outline: none !important;
    border: none;
}

.avatar {
    width: 40px;
    height: 40px;
}

.nav-item .dropdown-menu {
    min-width: 150px;
}

.dropdown-item {
    cursor: pointer;
}
</style>