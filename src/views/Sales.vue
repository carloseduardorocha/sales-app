<template>
    <Toast />
    <div class="main">
        <div class="card">
            <div class="description">
                <h1>Sales Management</h1>
                <p>
                    In this menu, you can view the paginated list of sales registered in the system.
                    You can also sort, add new sales, edit existing information and delete records.
                </p>
            </div>

            <DataTable 
                v-model:filters="filters" 
                :value="sales" 
                dataKey="id"
                paginator 
                :rows="8" 
                :rowsPerPageOptions="[8, 20, 30, 50]" 
                removableSort
                filterDisplay="row"
                :globalFilterFields="['seller.name']"
                tableStyle="min-width: 50rem;"
                :loading="loading"
            >
                <template #header>
                    <div class="flex justify-content-end">
                        <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                        <Select 
                            v-model="filters['seller.id'].value"
                            :options="sellerOptions" 
                            placeholder="Filter by seller"
                            optionLabel="label"
                            optionValue="value"
                            showClear
                            class="mr-2"
                            size="small"
                        />
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search by Seller" />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="ID" sortable style="width: 5%" />
                <Column field="seller.name" header="Seller" sortable style="width: 20%" />
                <Column field="amount" header="Value" sortable style="width: 10%">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.amount) }}
                    </template>
                </Column>
                <Column field="commission" header="Commission" sortable style="width: 10%">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.commission) }}
                    </template>
                </Column>
                <Column field="sale_date" header="Date" sortable style="width: 13%">
                    <template #body="slotProps">
                        {{ formatDateOnly(slotProps.data.sale_date) }}
                    </template>
                </Column>
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

                <Column :exportable="false" header="Actions" style="width: 12%;">
                    <template #body="slotProps">
                        <Button icon="pi pi-eye" outlined rounded severity="info" class="mr-2" @click="viewSale(slotProps.data.id)" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editSale(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" class="mr-2" @click="confirmDeleteSale(slotProps.data)" />
                    </template>
                </Column>

                <template #empty>No sales found.</template>
                <template #loading>Loading sales data. Please wait.</template>
            </DataTable>
        </div>

        <Dialog v-model:visible="saleDialog" :style="{ width: '450px' }" header="Sale Details" :modal="true">
            <div class="flex flex-column gap-4">
                <div>
                    <label class="block font-bold mb-2">Seller <span class="text-red-500">*</span></label>
                    <Select 
                        v-model="sale.seller_id" 
                        :options="sellerOptions" 
                        placeholder="Select a Seller"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !sale.seller_id }"
                        optionLabel="label"
                        optionValue="value"
                        showClear
                    />
                </div>
                <div>
                    <label class="block font-bold mb-2">Value <span class="text-red-500">*</span></label>
                    <InputNumber 
                        v-model="sale.amount" 
                        class="w-full" 
                        inputClass="w-full" 
                        mode="currency" 
                        currency="BRL" 
                        locale="pt-BR"
                        :class="{ 'p-invalid': submitted && !sale.amount }"
                    />
                </div>
                <div>
                    <label class="block font-bold mb-2">Date <span class="text-red-500">*</span></label>
                    <InputText
                        type="date"
                        v-model="formattedSaleDate"
                        class="w-full"
                        :max="maxDate"
                        :class="{ 'p-invalid': submitted && !sale.sale_date }"
                    />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveSale" />
            </template>
        </Dialog>

        <Dialog v-model:visible="viewSaleDialog" :style="{ width: '450px' }" header="View Sale Details" :modal="true">
            <div class="flex flex-column gap-3">
                <div class="flex gap-2">
                    <div class="w-2">
                        <label class="block font-bold mb-2">Sale ID</label>
                        <p>{{ sale.id }}</p>
                    </div>
                    <div class="w-10">
                        <label class="block font-bold mb-2">Seller</label>
                        <p>{{ sale.seller?.name }}</p>
                    </div>
                </div><hr>
                <div class="flex gap-2">
                    <div class="w-4">
                        <label class="block font-bold mb-2">Value</label>
                        <p>{{ formatCurrency(sale.amount) }}</p>
                    </div>
                    <div class="w-4">
                        <label class="block font-bold mb-2">Commission</label>
                        <p>{{ formatCurrency(sale.commission) }}</p>
                    </div>
                    <div class="w-4">
                        <label class="block font-bold mb-2">Date</label>
                        <p>{{ formatDateOnly(sale.sale_date) }}</p>
                    </div>
                </div><hr>
                <div class="flex gap-2">
                    <div class="w-6">
                        <label class="block font-bold mb-2">Updated At</label>
                        <p>{{ formatDateTime(sale.updated_at) }}</p>
                    </div>

                    <div class="w-6">
                        <label class="block font-bold mb-2">Created At</label>
                        <p>{{ formatDateTime(sale.created_at) }}</p>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Close" icon="pi pi-times" text @click="viewSaleDialog = false" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteSaleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle text-3xl text-red-500" />
                <span>Are you sure you want to delete the sale from <b>{{ sale.seller?.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteSaleDialog = false" />
                <Button label="Yes" icon="pi pi-check" severity="danger" @click="deleteSale" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { useRouter } from 'vue-router';
import { saleService } from '@/services/saleService';
import { sellerService } from '@/services/sellerService';

const sales = ref([]);
const sale = ref({});
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'seller.id': { value: null, matchMode: FilterMatchMode.EQUALS }
});
const saleDialog = ref(false);
const deleteSaleDialog = ref(false);
const viewSaleDialog = ref(false);
const submitted = ref(false);
const toast = useToast();
const router = useRouter();
const loading = ref(false);
const sellerOptions = ref([]);

const today = new Date();
const maxDate = today.toISOString().split('T')[0];

const loadSales = async () => {
    loading.value = true;
    try {
        const response = await saleService.list();
        sales.value = response.data;
    } finally {
        loading.value = false;
    }
};

const loadSellers = async () => {
    const response = await sellerService.list();
    sellerOptions.value = response.data.map(seller => ({
        label: seller.name,
        value: seller.id
    }));
};

const formattedSaleDate = computed({
    get() {
        if (!sale.value.sale_date) return '';
        return new Date(sale.value.sale_date).toISOString().split('T')[0];
    },
    set(value) {
        if (!value) {
            sale.value.sale_date = null;
        } else {
            sale.value.sale_date = `${value}T00:00:00.000Z`;
        }
    }
});

onMounted(async () => {
    await loadSales();
    await loadSellers();
});

const openNew = () => {
    sale.value = {};
    submitted.value = false;
    saleDialog.value = true;
};

const hideDialog = () => {
    saleDialog.value = false;
    submitted.value = false;
};

const saveSale = async () => {
    submitted.value = true;

    if (!sale.value.seller_id || !sale.value.amount || !sale.value.sale_date) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields.', life: 3000 });
        return;
    }

    if (sale.value.id) {
        await saleService.update(sale.value.id, sale.value);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Sale Updated Successfully', life: 3000 });
    } else {
        await saleService.store(sale.value);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Sale Created Successfully', life: 3000 });
    }

    await loadSales();
    saleDialog.value = false;
    sale.value = {};
};

const editSale = (s) => {
    sale.value = { ...s, seller_id: s.seller.id };
    saleDialog.value = true;
};

const viewSale = async (id) => {
    const response = await saleService.show(id);
    sale.value = response.data;
    viewSaleDialog.value = true;
};

const confirmDeleteSale = (s) => {
    sale.value = s;
    deleteSaleDialog.value = true;
};

const deleteSale = async () => {
    await saleService.destroy(sale.value.id);
    await loadSales();
    deleteSaleDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Sale Deleted Successfully', life: 3000 });
    sale.value = {};
};

const formatCurrency = (value) => {
    if (value == null) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

const formatDateOnly = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
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
}
.description p {
    font-weight: 300;
}
</style>