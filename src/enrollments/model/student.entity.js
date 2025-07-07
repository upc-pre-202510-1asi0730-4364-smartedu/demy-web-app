export const Sex = Object.freeze({
    MALE: 'Male',
    FEMALE: 'Female'
})

export class Student {
    constructor({
                    id = 0,
                    firstName = '',
                    lastName = '',
                    dni = '',
                    sex = Sex.MALE,
                    birthDate = '',
                    address = '',
                    phoneNumber = ''
                } = {}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.sex = sex ?? Sex.MALE
        this.birthDate = birthDate ? new Date(birthDate) : new Date();
        this.address = address;
        this.phoneNumber = phoneNumber;
    }
}
