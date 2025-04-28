<template>
    <div class="main">
        <div class="logo-content">
            <h1>Sales Control App</h1>
            <Image :src="logo" alt="Image" width="250" />
            <h1>Everything you need to sell online</h1>
        </div>
        <Card class="card-content">
            <template #title>
                <p>Login</p>
            </template>
            <template #content>
                <div class="card flex flex-column justify-center">
                    <Toast />

                    <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="w-full p-5">
                        <div class="flex flex-column gap-3">
                            <div class="flex flex-column gap-2">
                                <InputText name="email" type="text" placeholder="Email" fluid />
                                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error.message }}</Message>
                            </div>
                            <div class="flex flex-column gap-2">
                                <Password name="password" placeholder="Password" :feedback="false" toggleMask fluid />
                                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                                    <ul class="my-0 px-4 flex flex-column gap-1">
                                        <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                                    </ul>
                                </Message>
                            </div>
                            <Button type="submit" severity="secondary" label="Submit" :loading="isSubmitting" />
                        </div>
                    </Form>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';
import Image from 'primevue/image';
import { useLogo } from '@/composables/useLogo';
import { authService } from '@/services/authService';

const router = useRouter();
const toast = useToast();
const { logo } = useLogo();

const initialValues = ref({
    email: '',
    password: ''
});

const isSubmitting = ref(false);

const resolver = zodResolver(
    z.object({
        email: z
            .string()
            .min(1, { message: 'Email is required.' })
            .email({ message: 'Invalid email format.' }),
        password: z
            .string()
            .min(6, { message: 'Minimum 6 characters.' })
            .max(20, { message: 'Maximum 20 characters.' })
            .refine((value) => /[a-z]/.test(value), { message: 'Must have a lowercase letter.' })
            .refine((value) => /[A-Z]/.test(value), { message: 'Must have an uppercase letter.' })
            .refine((value) => /\d/.test(value), { message: 'Must have a number.' })
            .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), { message: 'Must have a special character.' })
    })
);

const onFormSubmit = async (e) => {
    if (e.valid) {
        isSubmitting.value = true;
        try {
            const { email, password } = e.values;

            const response = await authService.login(email, password);

            if (response.success) {
                toast.add({ severity: 'success', summary: 'Login successful!', life: 2000 });
                router.push('/sellers');
            } else {
                console.log(response);
                toast.add({ severity: 'error', summary: 'Login failed', detail: response.message, life: 3000 });
            }
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Unexpected error during login.', life: 3000 });
        } finally {
            isSubmitting.value = false;
        }
    }
};
</script>

<style scoped>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 88vh;
    gap: 4rem;
}

.p-card-title {
    text-align: center;
    font-weight: 900 !important;
    font-size: 30px !important;
}

.card-content {
    width: 700px;
}

.logo-content {
    -webkit-text-stroke: 0.3px #002c6a;
}
</style>
