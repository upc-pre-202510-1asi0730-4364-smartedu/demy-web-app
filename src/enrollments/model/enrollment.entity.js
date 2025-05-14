// Enums como objetos inmutables
export const EnrollmentStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED',
    DELETED: 'DELETED'
});

export const PaymentStatus = Object.freeze({
    PENDING: 'PENDING',
    PAID: 'PAID',
    REFUNDED: 'REFUNDED',
    PARTIAL: 'PARTIAL'
});

// Clase limpia con destructuring
export class Enrollment {
    constructor({
                    id = '',
                    studentId = '',
                    periodId = '',
                    amount = 0,
                    enrollmentStatus = EnrollmentStatus.ACTIVE,
                    paymentStatus = PaymentStatus.PENDING,
                    createdAt = new Date()
                } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.periodId = periodId;
        this.amount = amount;
        this.enrollmentStatus = enrollmentStatus;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    }
}
