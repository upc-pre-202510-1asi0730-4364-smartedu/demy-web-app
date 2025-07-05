import httpInstance from '../../shared/services/http.instance.js';
import { UserAccount } from '../model/user-account.js';
let isCreating = false;

export class TeacherService {
    baseEndpoint = import.meta.env.VITE_API_BASE_URL;
    resourceEndpoint = this.baseEndpoint + '/users/teachers';

    async getTeachers() {
        const res = await httpInstance.get(`${this.baseEndpoint}/users/teachers`);
        return res.data.teachers.map(teacherData => new UserAccount(teacherData));
    }

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

    async updateTeacher(id, teacherData) {
        const updateData = {
            fullName: teacherData.fullName,
            email: teacherData.email,
            ...(teacherData.passwordHash && { newPassword: teacherData.passwordHash }) // ✅ CAMBIADO
        };
        const res = await httpInstance.put(`${this.baseEndpoint}/users/teachers/${id}`, updateData);
        return new UserAccount(res.data.user);
    }

    async deleteTeacher(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`);
        return true;
    }
}

export function useTeacherService() {
    return new TeacherService();
}