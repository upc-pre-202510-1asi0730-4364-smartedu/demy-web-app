/**
 * Represents a student's attendance record for a specific date.
 */
export class AttendanceReport {
    /**
     * Creates an instance of AttendanceReport.
     * @param {Object} params - The attendance data.
     * @param {string} params.dni - The student's DNI (national ID).
     * @param {string} params.studentName - The full name of the student.
     * @param {string} params.status - The attendance status (e.g., "Present", "Absent").
     * @param {string|Date} params.date - The date of the attendance record.
     */
    constructor({ dni, studentName, status, date }) {
        this.dni = dni
        this.studentName = studentName
        this.status = status
        this.date = date
    }
}
