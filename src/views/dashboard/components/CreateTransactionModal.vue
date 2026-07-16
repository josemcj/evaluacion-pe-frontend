<script setup>
import { inject, computed, reactive, ref, watch } from 'vue';
import { createTransaction } from '@/api/transactions';
import useSwal from '@/composables/useSwal';
import { encryptAES } from '@/utils/crypto';

const $loading = inject('$loading');
const swal = useSwal();

const showModal = defineModel({
  type: Boolean,
  default: false,
});

const emit = defineEmits(['saved', 'hidden']);

const form = reactive({
  amount: '',
  cardNumber: '',
  cardHolder: '',
  expirationDate: '',
  cvv: '',
});

const errors = reactive({
  amount: '',
  cardholder: '',
  cardNumber: '',
  expirationDate: '',
  cvv: '',
});

const loading = ref(false);
const errorMessage = ref('');

const resetErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = '';
  });
  errorMessage.value = '';
};

const resetModal = () => {
  form.amount = '';
  form.cardNumber = '';
  form.cardHolder = '';
  form.expirationDate = '';
  form.cvv = '';

  resetErrors();
  loading.value = false;
  emit('hidden');
};

const cleanCardNumber = computed(() => form.cardNumber.replace(/\D/g, ''));

const formatCardNumber = () => {
  const digits = cleanCardNumber.value.slice(0, 16);
  form.cardNumber = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const formatExpirationDate = () => {
  const digits = form.expirationDate.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    form.expirationDate = digits;
    return;
  }

  form.expirationDate = `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const validateExpirationDate = () => {
  const match = form.expirationDate.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);

  if (month < 1 || month > 12) return false;

  const expiration = new Date(year, month, 0, 23, 59, 59);
  return expiration >= new Date();
};

const validateForm = () => {
  resetErrors();

  let valid = true;
  const amount = Number(form.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Ingresa un importe mayor a cero.';
    valid = false;
  }

  if (!form.cardholder) {
    errors.cardholder = 'Ingresa el nombre del titular.';
    valid = false;
  }

  if (!/^\d{16}$/.test(cleanCardNumber.value)) {
    errors.cardNumber = 'El número de tarjeta debe contener 16 dígitos.';
    valid = false;
  }

  if (!validateExpirationDate()) {
    errors.expirationDate = 'Ingresa una fecha vigente con formato MM/AA.';
    valid = false;
  }

  if (!/^\d{3,4}$/.test(form.cvv)) {
    errors.cvv = 'El CVV debe contener 3 o 4 dígitos.';
    valid = false;
  }

  return valid;
};

const onSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    const [encryptedCardNumber, encryptedExpirationDate, encryptedCvv] = await Promise.all([
      encryptAES(cleanCardNumber.value),
      encryptAES(form.expirationDate),
      encryptAES(form.cvv),
    ]);

    const transactionData = {
      amount: Number(form.amount),
      cardholder: form.cardholder.trim(),
      cardNumber: encryptedCardNumber,
      expirationDate: encryptedExpirationDate,
      cvv: encryptedCvv,
    };

    const response = await createTransaction(transactionData);
    console.log(response);

    if (response.sucess) {
      swal.toast(response.message ?? 'Venta creada correctamente');
      showModal.value = false;
      emit('saved');
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Ocurrió un error al crear la venta.';
  } finally {
    loading.value = false;
  }
};

watch(showModal, (newValue) => {
  if (!newValue) {
    resetModal();
  }
});
</script>

<template>
  <BModal
    v-model="showModal"
    title="Crear venta"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    ok-title="Crear venta"
    cancel-title="Cancelar"
    @ok.prevent="onSubmit"
    @hidden="resetModal">
    <BAlert v-if="errorMessage" variant="danger" :model-value="true" class="mb-3">
      {{ errorMessage }}
    </BAlert>

    <BForm @submit.prevent="onSubmit">
      <BFormGroup label="Importe" label-for="transaction-amount" class="mb-3">
        <BInputGroup prepend="$">
          <BFormInput
            id="transaction-amount"
            v-model="form.amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            :disabled="loading"
            :state="errors.amount ? false : null" />
        </BInputGroup>

        <BFormInvalidFeedback :state="!errors.amount">
          {{ errors.amount }}
        </BFormInvalidFeedback>
      </BFormGroup>

      <BFormGroup label="Nombre del titular" label-for="transaction-cardholder" class="mb-3">
        <BFormInput
          id="transaction-cardholder"
          v-model.trim="form.cardholder"
          type="text"
          maxlength="100"
          autocomplete="cc-name"
          placeholder="Nombre como aparece en la tarjeta"
          :disabled="loading"
          :state="errors.cardholder ? false : null" />

        <BFormInvalidFeedback :state="!errors.cardholder">
          {{ errors.cardholder }}
        </BFormInvalidFeedback>
      </BFormGroup>

      <BFormGroup label="Número de tarjeta" label-for="transaction-card-number" class="mb-3">
        <BFormInput
          id="transaction-card-number"
          v-model="form.cardNumber"
          type="text"
          inputmode="numeric"
          autocomplete="cc-number"
          maxlength="19"
          placeholder="0000 0000 0000 0000"
          :disabled="loading"
          :state="errors.cardNumber ? false : null"
          @input="formatCardNumber" />

        <BFormInvalidFeedback :state="!errors.cardNumber">
          {{ errors.cardNumber }}
        </BFormInvalidFeedback>
      </BFormGroup>

      <div class="row">
        <div class="col-sm-6">
          <BFormGroup label="Fecha de expiración" label-for="transaction-expiration" class="mb-3">
            <BFormInput
              id="transaction-expiration"
              v-model="form.expirationDate"
              type="text"
              inputmode="numeric"
              autocomplete="cc-exp"
              maxlength="5"
              placeholder="MM/AA"
              :disabled="loading"
              :state="errors.expirationDate ? false : null"
              @input="formatExpirationDate" />

            <BFormInvalidFeedback :state="!errors.expirationDate">
              {{ errors.expirationDate }}
            </BFormInvalidFeedback>
          </BFormGroup>
        </div>

        <div class="col-sm-6">
          <BFormGroup label="CVV" label-for="transaction-cvv" class="mb-3">
            <BFormInput
              id="transaction-cvv"
              v-model="form.cvv"
              type="password"
              inputmode="numeric"
              autocomplete="cc-csc"
              minlength="3"
              maxlength="4"
              placeholder="123"
              :disabled="loading"
              :state="errors.cvv ? false : null"
              @input="form.cvv = form.cvv.replace(/\D/g, '').slice(0, 4)" />

            <BFormInvalidFeedback :state="!errors.cvv">
              {{ errors.cvv }}
            </BFormInvalidFeedback>
          </BFormGroup>
        </div>
      </div>
    </BForm>
  </BModal>
</template>
