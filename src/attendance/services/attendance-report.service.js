import httpInstance from "../../shared/services/http.instance.js";
import { AttendanceReport } from '../model/attendance-report.entity.js'

const REPORT_URL = import.meta.env.VITE_REPORT_ATTENDANCE_ENDPOINT_PATH
/**
 * Service for fetching attendance reports from the backend.
 */
export const attendanceReportService = {
    /**
     * Fetches an attendance report by course ID, DNI, and date range.
     * @param {Object} params - Parameters for the report.
     * @param {number} params.courseId - ID of the course.
     * @param {string} params.dni - DNI of the student.
     * @param {string} params.startDate - Start date in YYYY-MM-DD format.
     * @param {string} params.endDate - End date in YYYY-MM-DD format.
     * @returns {Promise<AttendanceReport[]>} - A list of attendance records.
     * @throws {Error} If the request fails or data is malformed.
     */
    async fetchReport({ courseId, dni, startDate, endDate }) {
        try {
            const { data } = await httpInstance.get(REPORT_URL, {
                params: { courseId, dni, startDate, endDate }
            })

            console.log('[Backend response]', data)

            if (!data || !Array.isArray(data.attendance)) return []

            return data.attendance.map(record => new AttendanceReport(record))
        } catch (error) {
            console.error('[AttendanceReportService] Error fetching report:', error)
            throw error
        }
    }
}