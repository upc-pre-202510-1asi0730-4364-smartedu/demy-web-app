import { AttendanceStatus } from './attendance-status.js'

export class AttendanceRecord {
    constructor(studentId, status = AttendanceStatus.PRESENT) {
        this.studentId = studentId
        this.status = status
    }

    toJSON() {
        return {
            studentId: this.studentId,
            status: this.status
        }
    }
}
