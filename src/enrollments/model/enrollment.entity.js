export const EnrollmentStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED',
});

export const PaymentStatus = Object.freeze({
    PENDING: 'PENDING',
    PAID: 'PAID',
    REFUNDED: 'REFUNDED',
});

export class Enrollment {
    constructor({
                    id = 0,
                    studentId = '',
                    academicPeriodId = '',
                    weeklyScheduleName = '',
                    amount = 0,
                    currency = 'USD',
                    enrollmentStatus = '',
                    paymentStatus = '',
                    createdAt = new Date()
                } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.academicPeriodId = academicPeriodId;
        this.weeklyScheduleName = weeklyScheduleName;
        this.amount = amount;
        this.currency = currency ? currency.toUpperCase() : 'USD';
        this.enrollmentStatus = enrollmentStatus;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    }
}
