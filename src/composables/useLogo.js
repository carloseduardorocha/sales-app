import { ref, computed, onMounted } from 'vue';

export function useLogo() {
    const isDarkMode = ref(false);

    const checkDarkMode = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode.value = prefersDark;
    };

    onMounted(() => {
        checkDarkMode();
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode);
    });

    const logo = computed(() =>
        isDarkMode.value
            ? '/src/assets/logo/logo_tray_white.svg'
            : '/src/assets/logo/logo_tray.svg'
    );

    return { logo };
}