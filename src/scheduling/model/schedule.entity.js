/**
 * Represents a single schedule within a weekly schedule
 */
export class Schedule {
    /**
     * Creates a new Schedule instance
     * @param {Object} data - The schedule data
     * @param {number} [data.id] - The schedule ID
     * @param {string} [data.dayOfWeek] - The day of the week
     * @param {Object} [data.timeRange] - The time range object
     * @param {string} [data.timeRange.start] - The start time
     * @param {string} [data.timeRange.end] - The end time
     * @param {Object} [data.course] - The course object
     * @param {Object} [data.classroom] - The classroom object
     * @param {Object} [data.teacher] - The teacher object
     */
    constructor(data = {}) {
        this.id = data.id || 0;
        this.dayOfWeek = data.dayOfWeek || '';
        this.timeRange = {
            start: data.timeRange?.start || '',
            end: data.timeRange?.end || ''
        };
        this.course = {
            id: data.course?.id || null,
            name: data.course?.name || '',
            code: data.course?.code || ''
        };
        this.classroom = {
            id: data.classroom?.id || null,
            code: data.classroom?.code || '',
            capacity: data.classroom?.capacity || 0,
            campus: data.classroom?.campus || ''
        };
        this.teacher = {
            id: data.teacher?.id || null,
            fullName: data.teacher?.fullName || ''
        };
    }
}
