<template>
    <Toast />
    <div class="main">
        <div class="card">
            <div class="description">
                <h1>Seller Management</h1>
                <p>
                    In this menu, you can view the paginated list of sellers registered in the system. 
                    You can also sort, add new sellers, edit existing information, delete records, and manually send the report email.
                </p>
            </div>

            <DataTable 
                v-model:filters="filters" 
                :value="sellers" 
                dataKey="id"
                paginator 
                :rows="8" 
                :rowsPerPageOptions="[8, 20, 30, 50]" 
                removableSort
                filterDisplay="row"
                :globalFilterFields="['name', 'email']"
                tableStyle="min-width: 50rem;"
            >
                <template #header>
                    <div class="flex justify-content-end">
                        <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search by Name or Email" />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="ID" sortable style="width: 10%" />
                <Column field="name" header="Name" sortable style="width: 20%" />
                <Column field="email" header="Email" sortable style="width: 25%" />
                <Column field="created_at" header="Created At" sortable style="width: 15%">
                    <template #body="slotProps">
                        {{ formatDateTime(slotProps.data.created_at) }}
                    </template>
                </Column>
                <Column field="updated_at" header="Updated At" sortable style="width: 15%">
                    <template #body="slotProps">
                        {{ formatDateTime(slotProps.data.updated_at) }}
                    </template>
                </Column>

                <Column :exportable="false" header="Actions" style="width: 15%;">
                    <template #body="slotProps">
                        <Button icon="pi pi-eye" outlined rounded class="mr-2" severity="info" @click="viewSeller(slotProps.data)" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editSeller(slotProps.data)" />
                        <Button icon="pi pi-envelope" outlined rounded severity="secondary" class="mr-2" @click="sendSellerReport(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteSeller(slotProps.data)" />
                    </template>
                </Column>

                <template #empty>No sellers found.</template>
                <template #loading>Loading sellers data. Please wait.</template>
            </DataTable>
        </div>

        <Dialog v-model:visible="sellerDialog" :style="{ width: '450px' }" header="Seller Details" :modal="true">
            <div class="flex flex-column gap-4">
                <div>
                    <label class="block font-bold mb-2">Name <span class="text-red-500">*</span></label>
                    <InputText v-model.trim="seller.name" class="w-full" :class="{ 'p-invalid': submitted && !seller.name }" />
                </div>
                <div>
                    <label class="block font-bold mb-2">Email <span class="text-red-500">*</span></label>
                    <InputText v-model.trim="seller.email" class="w-full" :class="{ 'p-invalid': submitted && !seller.email }" />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveSeller" />
            </template>
        </Dialog>

        <Dialog v-model:visible="viewSellerDialog" :style="{ width: '450px' }" header="View Seller Details" :modal="true">
            <div class="flex flex-column gap-3">
                <div class="flex gap-2">
                    <div class="w-2">
                        <label class="block font-bold mb-2">ID</label>
                        <p>{{ seller.id }}</p>
                    </div>
                    <div class="w-10">
                        <label class="block font-bold mb-2">Name</label>
                        <p>{{ seller.name }}</p>
                    </div>
                </div>
                <hr>

                <div>
                    <label class="block font-bold mb-2">Email</label>
                    <p>{{ seller.email }}</p>
                </div>
                <hr>

                <div class="flex gap-2">
                    <div class="w-6">
                        <label class="block font-bold mb-2">Created At</label>
                        <p>{{ formatDateTime(seller.created_at) }}</p>
                    </div>

                    <div class="w-6">
                        <label class="block font-bold mb-2">Updated At</label>
                        <p>{{ formatDateTime(seller.updated_at) }}</p>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Close" icon="pi pi-times" text @click="viewSellerDialog = false" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteSellerDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl text-red-500" />
                <span>Are you sure you want to delete <b>{{ seller.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteSellerDialog = false" />
                <Button label="Yes" icon="pi pi-check" severity="danger" @click="deleteSeller" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { sellerService } from '@/services/sellerService';
import { reportService } from '@/services/reportService';

const sellers = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const sellerDialog = ref(false);
const deleteSellerDialog = ref(false);
const seller = ref({});
const submitted = ref(false);
const toast = useToast();
const viewSellerDialog = ref(false);

onMounted(() => {
    loadSellers();
});

const loadSellers = async () => {
    try {
        const response = await sellerService.list();
        if (response.success) {
            sellers.value = response.data;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to load sellers.', life: 3000 });
    }
};

const openNew = () => {
    seller.value = {};
    submitted.value = false;
    sellerDialog.value = true;
};

const hideDialog = () => {
    sellerDialog.value = false;
    submitted.value = false;
};

const saveSeller = async () => {
    submitted.value = true;

    if (!seller.value.name?.trim() || !seller.value.email?.trim()) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields.', life: 3000 });
        return;
    }

    if (!isValidEmail(seller.value.email)) {
        toast.add({ severity: 'error', summary: 'Invalid Email', detail: 'Please enter a valid email address.', life: 3000 });
        return;
    }

    try {
        let response;
        if (seller.value.id) {
            response = await sellerService.update(seller.value.id, {
                name: seller.value.name,
                email: seller.value.email
            });
        } else {
            response = await sellerService.store({
                name: seller.value.name,
                email: seller.value.email
            });
        }

        if (response.success) {
            toast.add({ severity: 'success', summary: 'Successful', detail: seller.value.id ? 'Seller Updated Successfully' : 'Seller Created Successfully', life: 3000 });
            sellerDialog.value = false;
            loadSellers();
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save seller.', life: 3000 });
    }
};

const editSeller = (sel) => {
    seller.value = { ...sel };
    sellerDialog.value = true;
};

const confirmDeleteSeller = (sel) => {
    seller.value = sel;
    deleteSellerDialog.value = true;
};

const deleteSeller = async () => {
    try {
        const response = await sellerService.destroy(seller.value.id);
        if (response.success) {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Seller Deleted Successfully', life: 3000 });
            deleteSellerDialog.value = false;
            loadSellers();
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to delete seller.', life: 3000 });
    }
};

const sendSellerReport = async (sellerData) => {
    try {
        const response = await reportService.sendSellerReport(sellerData.id);
        if (response.success) {
            toast.add({ 
                severity: 'success', 
                summary: 'Report Sent', 
                detail: `The report email was sent to ${sellerData.name}.`, 
                life: 3000 
            });
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to send report.', life: 3000 });
    }
};

const viewSeller = async (sel) => {
    try {
        const response = await sellerService.show(sel.id);
        if (response.success) {
            seller.value = response.data;
            viewSellerDialog.value = true;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to load seller.', life: 3000 });
    }
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
    });
};
</script>

<style scoped>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4rem;
}
.card {
    padding-top: 2rem;
    width: 100vw;
}
.description {
    text-align: center;
    margin: 0rem 0rem 1rem;

    p {
        font-weight: 300;
    }
}
</style>
