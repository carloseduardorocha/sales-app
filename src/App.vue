<script setup>
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
    import Menubar from 'primevue/menubar';
    import { useLogo } from '@/composables/useLogo';

    const { logo } = useLogo();

    const items = ref([
        {
            label: 'Sellers',
            icon: 'pi pi-users',
            to: '/sellers'
        },
        {
            label: 'Sales',
            icon: 'pi pi-shopping-cart',
            to: '/sales'
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            to: '/logout'
        }
    ]);
</script>

<template>
    <div class="menubar-container">
        <img class="logo" :src="logo" alt="Logo" width="80"/>
        <Menubar :model="items" class="menubar">
            <template #start>
                <!-- Logo já está no início -->
            </template>
        </Menubar>
    </div>
    <router-view></router-view>
</template>

<style scoped>
    .menubar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        margin-right: 20px;
    }

    .menubar {
        width: 100%;
    }

    .p-menubar {
        justify-content: flex-end;
    }
</style>
