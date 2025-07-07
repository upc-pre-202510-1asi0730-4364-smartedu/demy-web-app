export const Sex = Object.freeze({
    MALE: 'MALE',
    FEMALE: 'FEMALE'
})

export class Student {
    constructor({
                    id = '',
                    name = '',
                    dni = '',
                    sex = 'MALE',
                    birthDate = null,
                    address = '',
                    phoneNumber = ''
                } = {}) {
        this.id = id
        this.name = name
        this.dni = dni
        this.sex = sex
        this.birthDate = birthDate ? new Date(birthDate) : null
        this.address = address
        this.phoneNumber = phoneNumber
    }

}
