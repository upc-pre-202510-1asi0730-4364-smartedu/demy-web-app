import { useToast } from 'primevue/usetoast'

export class NotificationService {
    constructor() {
        this.toast = useToast()
    }

    showSuccess(message, duration = 3000) {
        this.toast.add({
            severity: 'success',
            summary: '✔ Éxito',
            detail: message,
            life: duration
        })
    }

    showError(message, duration = 3000) {
        this.toast.add({
            severity: 'error',
            summary: '✖ Error',
            detail: message,
            life: duration
        })
    }

    showInfo(message, duration = 3000) {
        this.toast.add({
            severity: 'info',
            summary: 'ℹ️ Info',
            detail: message,
            life: duration
        })
    }
}