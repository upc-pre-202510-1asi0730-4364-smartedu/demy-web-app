import { AttendanceStatus } from './attendance-status.js'
/**
 * Represents a raw attendance record used for creating or updating class sessions.
 */
export class AttendanceRecord {
    /**
     * Creates an instance of AttendanceRecord.
     * @param {string} dni - The student's DNI (national ID).
     * @param {AttendanceStatus} [status=AttendanceStatus.PRESENT] - The attendance status.
     */
    constructor(dni, status = AttendanceStatus.PRESENT) {
        this.dni = dni
        this.status = status
    }
    /**
     * Converts the attendance record to a plain JSON object.
     * @returns {{ dni: string, status: AttendanceStatus }} A JSON-compatible representation of the record.
     */
    toJSON() {
        return {
            dni: this.dni ,
            status: this.status
        }
    }
}
