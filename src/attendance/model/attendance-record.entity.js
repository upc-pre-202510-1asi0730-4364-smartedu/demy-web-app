import { AttendanceStatus } from './attendance-status.js'

export class AttendanceRecord {
    constructor(dni, status = AttendanceStatus.PRESENT) {
        this.dni = dni
        this.status = status
    }

    toJSON() {
        return {
            dni: this.dni ,
            status: this.status
        }
    }
}
