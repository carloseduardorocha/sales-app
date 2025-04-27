<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';
import { useLogo } from '@/composables/useLogo';

const router = useRouter();
const { logo } = useLogo();

const items = ref([
    {
        label: 'Sellers',
        icon: 'pi pi-users',
        route: '/sellers'
    },
    {
        label: 'Sales',
        icon: 'pi pi-shopping-cart',
        route: '/sales'
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        route: '/logout'
    }
]);
</script>

<template>
    <div class="menubar-container">
        <img class="logo" :src="logo" alt="Logo" width="80" />
        <Menubar :model="items" class="menubar">
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
                </a>
            </template>
        </Menubar>
    </div>
    <router-view />
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
