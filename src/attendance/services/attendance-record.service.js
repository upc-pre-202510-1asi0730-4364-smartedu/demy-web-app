import httpInstance from '../../shared/services/http.instance.js'

export class AttendanceRecordService {
    constructor() {
        this.resourceEndpoint = `${import.meta.env.VITE_API_BASE_URL}/attendance-record`
    }

    async save(record) {
        return await httpInstance.post(this.resourceEndpoint, record)
    }

    async saveMany(records) {
        for (const record of records) {
            await this.save(record) // 👈 espera uno por uno
        }
    }
}
