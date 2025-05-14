import httpInstance from '../../shared/services/http.instance.js';
import { UserAccount } from '../model/user-account.js';
let isCreating = false;

export class TeacherService {
    resourceEndpoint = import.meta.env.VITE_USER_ACCOUNT_ENDPOINT_PATH;

    async getTeachers() {
        const res = await httpInstance.get(this.resourceEndpoint);
        return res.data
            .filter(user => user.role === 'TEACHER' || user.role === 1)
            .map(teacherData => new UserAccount(teacherData));
    }

    async createTeacher(teacherData) {
        if (isCreating) {
            throw new Error('La creación de profesor ya está en proceso');
        }

        isCreating = true;
        try {
            const payload = {
                fullName: teacherData.fullName,
                email: teacherData.email,
                password: teacherData.passwordHash,
                role: 'TEACHER',
                status: 'ACTIVE'
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
            ...(teacherData.passwordHash && { password: teacherData.passwordHash })
        };
        const res = await httpInstance.patch(`${this.resourceEndpoint}/${id}`, updateData);
        return new UserAccount(res.data);
    }

    async deleteTeacher(id) {
        await httpInstance.delete(`${this.resourceEndpoint}/${id}`);
        return true;
    }
}

export function useTeacherService() {
    return new TeacherService();
}