import httpInstance from '../../shared/services/http.instance.js';
import { UserAccount } from '../model/user-account.js';
let isCreating = false;


/**
 * Service to manage teacher accounts via the users/teachers backend endpoints.
 */
export class TeacherService {
    baseEndpoint = import.meta.env.VITE_API_BASE_URL;
    resourceEndpoint = this.baseEndpoint + '/users/teachers';
    /**
     * Retrieves all teacher accounts from the backend.
     *
     * @returns {Promise<UserAccount[]>} A list of teacher users.
     */
    async getTeachers() {
        const res = await httpInstance.get(`${this.baseEndpoint}/users/teachers`);
        return res.data.teachers.map(teacherData => new UserAccount(teacherData));
    }

    async getTeachersSchedule() {
        const res = await httpInstance.get(`${this.resourceEndpoint}`);

        // Handle different response formats
        let teachersData;
        if (Array.isArray(res.data)) {
            teachersData = res.data;
        } else if (res.data && Array.isArray(res.data.teachers)) {
            teachersData = res.data.teachers;
        } else if (res.data && Array.isArray(res.data.data)) {
            teachersData = res.data.data;
        } else {
            console.warn('Unexpected teachers response structure:', res.data);
            return [];
        }

        return teachersData
            .filter(user => user.role === 'TEACHER' || user.role === 1)
            .map(teacherData => new UserAccount(teacherData));
    }

    /**
     * Creates a new teacher account.
     * Prevents multiple simultaneous creation requests.
     *
     * @param {Object} teacherData - The teacher data.
     * @param {string} teacherData.fullName - Full name of the teacher.
     * @param {string} teacherData.email - Email address of the teacher.
     * @param {string} teacherData.passwordHash - Plain password to create the teacher.
     * @returns {Promise<UserAccount>} The created teacher user.
     * @throws {Error} If a creation is already in process.
     */
    async createTeacher(teacherData) {
        if (isCreating) throw new Error('La creación de profesor ya está en proceso');

        isCreating = true;
        try {
            const payload = {
                fullName: teacherData.fullName,
                email: teacherData.email,
                password: teacherData.passwordHash // usa password real
            };
            const response = await httpInstance.post(this.resourceEndpoint, payload);
            return new UserAccount(response.data);
        } finally {
            isCreating = false;
        }
    }


    /**
     * Updates a teacher's information by ID.
     * If a new password is provided, it is included as 'newPassword'.
     *
     * @param {string|number} id - The ID of the teacher.
     * @param {Object} teacherData - The updated data.
     * @param {string} teacherData.fullName - Updated full name.
     * @param {string} teacherData.email - Updated email.
     * @param {string} [teacherData.passwordHash] - Optional new password.
     * @returns {Promise<UserAccount>} The updated teacher user.
     */
    async updateTeacher(id, teacherData) {
        const updateData = {
            fullName: teacherData.fullName,
            email: teacherData.email,
            ...(teacherData.passwordHash && { newPassword: teacherData.passwordHash }) // ✅ CAMBIADO
        };
        const res = await httpInstance.put(`${this.baseEndpoint}/users/teachers/${id}`, updateData);
        return new UserAccount(res.data.user);
    }

    /**
     * Deletes a teacher by ID.
     *
     * @param {string|number} id - The ID of the teacher to delete.
     * @returns {Promise<boolean>} True if deletion succeeded.
     */
    async deleteTeacher(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`);
        return true;
    }
}

/**
 * Factory hook to get a TeacherService instance.
 *
 * @returns {TeacherService} A new TeacherService instance.
 */
export function useTeacherService() {
    return new TeacherService();
}