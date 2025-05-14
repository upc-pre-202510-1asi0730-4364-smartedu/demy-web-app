import { AttendanceRecord } from './attendance-record.entity.js'

export class ClassSession {
    constructor(id, attendance = [], createdAt = new Date()) {
        this.id = id
        this.attendance = attendance
        this.createdAt = createdAt
    }

    setAttendance(records) {
        this.attendance = records
    }

    getAttendance() {
        return this.attendance
    }

    toJSON() {
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            attendance: this.attendance.map(a => a.toJSON())
        }
    }
}
