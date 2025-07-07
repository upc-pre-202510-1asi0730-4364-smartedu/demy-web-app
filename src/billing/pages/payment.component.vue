<script>
import { ref } from 'vue'

import StudentSearch from "../components/student-search.component.vue";
import StudentStatus from "../components/student-status.component.vue";
import PaymentRegistration from "../components/payment-registration.component.vue";

import { StudentService } from '../../enrollments/services/student.service.js'
import { InvoiceService } from '../services/invoice.service.js'
import { PaymentService } from '../services/payment.service.js'
import { FinancialTransactionService } from '../services/financial-transaction.service.js'
import { FinancialTransaction } from '../model/financial-transaction.entity.js'
import { PaymentStatus } from '../model/invoice.entity.js'
import { useToast } from 'primevue/usetoast'

const studentService = new StudentService()
const invoiceService = new InvoiceService()
const paymentService = new PaymentService()
const transactionService = new FinancialTransactionService()

export default {
  name: 'payments-page',
  components: {
    StudentSearch,
    StudentStatus,
    PaymentRegistration
  },
  setup() {
    const toast = useToast()
    const studentPaymentStatus = ref(null)
    const selectedInvoice = ref(null)
    const showPaymentForm = ref(false)

    const onSearch = async (dni) => {
      try {
        console.log('Buscando por DNI:', dni)
        const students = await studentService.getByDni(dni)
        console.log('Respuesta del servicio:', students)
        const student = students.find(s => s.dni === dni)
        if (!student) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Estudiante no encontrado',
            life: 3000
          })
          return
        }

        const invoices = await invoiceService.getByDni(student.dni)
        studentPaymentStatus.value = { student, invoices }
      } catch (err) {
        console.error('Error al buscar estudiante:', err.response?.data || err.message)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error durante la búsqueda',
          life: 3000
        })
      }
    }

    const onRegisterPaymentRequest = (invoice) => {
      selectedInvoice.value = invoice
      showPaymentForm.value = true
    }

    const onPaymentRegistered = async (method) => {
      const invoice = selectedInvoice.value
      const status = studentPaymentStatus.value
      if (!status || !invoice) return

      try {
        await paymentService.registerPayment(invoice.id, method)

        toast.add({
          severity: 'success',
          summary: 'Pago registrado',
          detail: 'El pago se registró correctamente',
          life: 3000
        })

        const updatedStudent = await studentService.getByDni(status.student.dni)
        const updatedInvoices = await invoiceService.getByDni(status.student.dni)

        studentPaymentStatus.value = {
          student: updatedStudent,
          invoices: updatedInvoices
        }
        showPaymentForm.value = false

      } catch (err) {
        console.error('Error al registrar el pago', err)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el pago',
          life: 3000
        })
      }
    }

    return {
      studentPaymentStatus,
      selectedInvoice,
      showPaymentForm,
      onSearch,
      onRegisterPaymentRequest,
      onPaymentRegistered
    }
  }
}
</script>

<template>
  <div>
    <h3>{{ $t('payments.title') }}</h3>
    <p class="subtitle-2">{{ $t('payments.subtitle') }}</p>

    <student-search @search="onSearch" />

    <student-status
        v-if="studentPaymentStatus"
        :student="studentPaymentStatus.student"
        :invoices="studentPaymentStatus.invoices"
        @registerPaymentRequested="onRegisterPaymentRequest"
    />

    <payment-registration
        v-if="showPaymentForm && selectedInvoice"
        :student="studentPaymentStatus.student"
        :invoice="selectedInvoice"
        @paymentRegistered="onPaymentRegistered"
    />
  </div>
</template>

<style scoped>
h3 {
  color: var(--color-secondary-dark-1);
}

.subtitle-2 {
  font-size: 1rem;
  color: var(--color-secondary-dark-1);
  margin-bottom: 1.25rem;
}
</style>