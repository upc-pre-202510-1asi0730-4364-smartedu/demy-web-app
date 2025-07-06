import { AttendanceRecord } from './attendance-record.entity.js'

export class ClassSession {
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

    toJSON() {
        return {
            courseId: this.courseId,
            date: this.date,
            attendance: this.attendance.map(a => a.toJSON())
        }
    }
}

