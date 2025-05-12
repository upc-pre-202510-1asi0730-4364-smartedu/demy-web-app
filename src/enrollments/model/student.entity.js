export const Sex = Object.freeze({
    MALE: 'MALE',
    FEMALE: 'FEMALE'
})

export class Student {
    constructor({
                    id = '',
                    firstName = '',
                    lastName = '',
                    dni = '',
                    sex = Sex.MALE,
                    birthDate = null,
                    address = '',
                    phoneNumber = ''
                } = {}) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.dni = dni
        this.sex = sex
        this.birthDate = birthDate ? new Date(birthDate) : null
        this.address = address
        this.phoneNumber = phoneNumber
    }
}
