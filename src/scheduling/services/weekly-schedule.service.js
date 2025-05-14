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
}

// Create a singleton instance of the service
const weeklyScheduleService = new WeeklyScheduleService();
export default weeklyScheduleService;
