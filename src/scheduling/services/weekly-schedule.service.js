import httpInstance from '../../shared/services/http.instance.js';
import { ScheduleWeekly } from '../model/weekly-schedule.entity.js';

/**
 * Service for managing weekly schedules through API requests
 */
export class WeeklyScheduleService {
    /** @type {string} The API endpoint for weekly schedules */
    resourceEndpoint = import.meta.env.VITE_WEEKLYSCHEDULES_ENDPOINT_PATH;

    /**
     * Retrieves all weekly schedules
     * @returns {Promise<Array<ScheduleWeekly>>} Promise resolving to array of weekly schedules
     */
    async getAll() {
        try {
            const response = await httpInstance.get(this.resourceEndpoint);
            console.log('Response:', response);

            // Verifica si response.data es un array antes de usar .map()
            if (Array.isArray(response.data)) {
                return response.data.map(data => new ScheduleWeekly(data));
            } else {
                console.error('La respuesta no es un array:', response.data);
                throw new Error('La respuesta no es un array');
            }
        } catch (error) {
            console.error('Error fetching weekly schedules:', error);
            throw error;
        }
    }

    /**
     * Retrieves a specific weekly schedule by ID
     * @param {number} id - The weekly schedule ID
     * @returns {Promise<ScheduleWeekly>} Promise resolving to the weekly schedule
     */
    async getById(id) {
        try {
            const response = await httpInstance.get(`${this.resourceEndpoint}/${id}`);
            return new ScheduleWeekly(response.data);
        } catch (error) {
            console.error(`Error fetching weekly schedule with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Creates a new weekly schedule
     * @param {ScheduleWeekly} weeklySchedule - The weekly schedule to create
     * @returns {Promise<ScheduleWeekly>} Promise resolving to the created weekly schedule
     */
    async create(weeklySchedule) {
        try {
            const response = await httpInstance.post(this.resourceEndpoint, weeklySchedule);
            return new ScheduleWeekly(response.data);
        } catch (error) {
            console.error('Error creating weekly schedule:', error);
            throw error;
        }
    }

    /**
     * Updates an existing weekly schedule
     * @param {number} id - The ID of the weekly schedule to update
     * @param {ScheduleWeekly} weeklySchedule - The updated weekly schedule data
     * @returns {Promise<ScheduleWeekly>} Promise resolving to the updated weekly schedule
     */
    async update(id, weeklySchedule) {
        try {
            const response = await httpInstance.put(`${this.resourceEndpoint}/${id}`, weeklySchedule);
            return new ScheduleWeekly(response.data);
        } catch (error) {
            console.error(`Error updating weekly schedule with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Deletes a weekly schedule
     * @param {number} id - The ID of the weekly schedule to delete
     * @returns {Promise<void>} Promise resolving when deletion is complete
     */
    async delete(id) {
        try {
            await httpInstance.delete(`${this.resourceEndpoint}/${id}`);
        } catch (error) {
            console.error(`Error deleting weekly schedule with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Adds a schedule to a weekly schedule
     * @param {number} weeklyScheduleId - The ID of the weekly schedule
     * @param {Object} scheduleData - The schedule data to add
     * @returns {Promise<any>} Promise resolving to the response
     */
    async addScheduleToWeekly(weeklyScheduleId, scheduleData) {
        try {
            const response = await httpInstance.post(`${this.resourceEndpoint}/${weeklyScheduleId}/schedules`, scheduleData);
            return response.data;
        } catch (error) {
            console.error(`Error adding schedule to weekly schedule with ID ${weeklyScheduleId}:`, error);
            throw error;
        }
    }

    /**
     * Removes a schedule from a weekly schedule
     * @param {number} weeklyScheduleId - The ID of the weekly schedule
     * @param {number} scheduleId - The ID of the schedule to remove
     * @returns {Promise<void>} Promise resolving when deletion is complete
     */
    async removeScheduleFromWeekly(weeklyScheduleId, scheduleId) {
        try {
            await httpInstance.delete(`${this.resourceEndpoint}/${weeklyScheduleId}/schedules/${scheduleId}`);
        } catch (error) {
            console.error(`Error removing schedule with ID ${scheduleId} from weekly schedule with ID ${weeklyScheduleId}:`, error);
            throw error;
        }
    }

    /**
     * Updates the name of a weekly schedule
     * @param {number} weeklyScheduleId - The ID of the weekly schedule
     * @param {string} newName - The new name for the weekly schedule
     * @returns {Promise<ScheduleWeekly>} Promise resolving to the updated weekly schedule
     */
    async updateWeeklyScheduleName(weeklyScheduleId, newName) {
        try {
            const response = await httpInstance.put(`${this.resourceEndpoint}/${weeklyScheduleId}/name`, { name: newName });
            return new ScheduleWeekly(response.data);
        } catch (error) {
            console.error(`Error updating name for weekly schedule with ID ${weeklyScheduleId}:`, error);
            throw error;
        }
    }

    /**
     * Gets schedules by teacher ID
     * @param {number} teacherId - The teacher's ID
     * @returns {Promise<Array>} Promise resolving to array of schedules
     */
    async getSchedulesByTeacherId(teacherId) {
        try {
            const response = await httpInstance.get(`${this.resourceEndpoint}/by-teacher/${teacherId}`);
            if (Array.isArray(response.data)) {
                return response.data;
            } else {
                throw new Error('The response is not a array');
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Updates a schedule
     * @param {number} scheduleId - The ID of the schedule to update
     * @param {Object} scheduleData - The updated schedule data
     * @returns {Promise<any>} Promise resolving to the updated schedule
     */
    async updateScheduleById(scheduleId, scheduleData) {
        try {
            const response = await httpInstance.put(`${this.resourceEndpoint}/schedules/${scheduleId}`, scheduleData);
            return response.data;
        } catch (error) {
            console.error(`Error updating schedule with ID ${scheduleId}:`, error);
            throw error;
        }
    }
}

const weeklyScheduleService = new WeeklyScheduleService();
export default weeklyScheduleService;
