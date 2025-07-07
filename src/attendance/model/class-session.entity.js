import { AttendanceRecord } from './attendance-record.entity.js'
/**
 * Represents a class session with a specific course and date, including student attendance.
 */
export class ClassSession {
    /**
     * Creates a new ClassSession.
     * @param {number} courseId - The ID of the course.
     * @param {string} date - The date of the session in YYYY-MM-DD format.
     * @param {AttendanceRecord[]} [attendance=[]] - List of attendance records.
     */
    constructor(courseId, date, attendance = []) {
        this.courseId = courseId
        this.date = date  // YYYY-MM-DD
        this.attendance = attendance
    }

    setAttendance(records) {
        this.attendance = records
    }

    getAttendance() {
        return this.attendance
    }
    /**
     * Serializes the session into a plain JSON object.
     * @returns {{ courseId: number, date: string, attendance: Object[] }}
     */
    toJSON() {
        return {
            courseId: this.courseId,
            date: this.date,
            attendance: this.attendance.map(a => a.toJSON())
        }
    }
}

