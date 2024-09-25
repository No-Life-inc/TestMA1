import { promises as fs } from 'fs';  // Brug promises-baseret filhåndtering
import path from 'path';

class FakeInfo {
    static GENDER_FEMININE = 'female';
    static GENDER_MASCULINE = 'male';
    static FILE_PERSON_NAMES = path.join(process.cwd(), 'data/person-names.json');
    static PHONE_PREFIXES = [
        '2', '30', '31', '40', '41', '42', '50', '51', '52', '53', '60', '61', '71', '81', '91', '92', '93', '342',
        '344', '345', '346', '347', '348', '349', '356', '357', '359', '362', '365', '366', '389', '398', '431',
        '441', '462', '466', '468', '472', '474', '476', '478', '485', '486', '488', '489', '493', '494', '495',
        '496', '498', '499', '542', '543', '545', '551', '552', '556', '571', '572', '573', '574', '577', '579',
        '584', '586', '587', '589', '597', '598', '627', '629', '641', '649', '658', '662', '663', '664', '665',
        '667', '692', '693', '694', '697', '771', '772', '782', '783', '785', '786', '788', '789', '826', '827', '829'
    ];
    static MIN_BULK_PERSONS = 2;
    static MAX_BULK_PERSONS = 100;

    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.gender = '';
        this.birthDate = '';
        this.cpr = '';
        this.address = {};
        this.phone = '';
        this.setFullNameAndGender();
        this.setBirthDate();
        this.setCpr();
        this.setAddress();
        this.setPhone();
    }

    async setCpr() {
        if (!this.birthDate) {
            this.setBirthDate();
        }
        if (!this.firstName || !this.lastName || !this.gender) {
            await this.setFullNameAndGender();
        }

        let finalDigit = Math.floor(Math.random() * 10);
        if (this.gender === FakeInfo.GENDER_FEMININE && finalDigit % 2 === 1) {
            finalDigit++;
        }

        this.cpr = `${this.birthDate.substring(8, 10)}${this.birthDate.substring(5, 7)}${this.birthDate.substring(2, 4)}${FakeInfo.getRandomDigit()}${FakeInfo.getRandomDigit()}${FakeInfo.getRandomDigit()}${finalDigit}`;
    }

    setBirthDate() {
        const year = Math.floor(Math.random() * (new Date().getFullYear() - 1900 + 1)) + 1900;
        const month = Math.floor(Math.random() * 12) + 1;
        let day;
        if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
            day = Math.floor(Math.random() * 31) + 1;
        } else if ([4, 6, 9, 11].includes(month)) {
            day = Math.floor(Math.random() * 30) + 1;
        } else {
            day = Math.floor(Math.random() * 28) + 1;
        }
        this.birthDate = new Date(year, month - 1, day).toISOString().split('T')[0];
    }

    async setFullNameAndGender() {
        const data = await fs.readFile(FakeInfo.FILE_PERSON_NAMES, 'utf8');
        const names = JSON.parse(data);
        const person = names.persons[Math.floor(Math.random() * names.persons.length)];

        this.firstName = person.firstName;
        this.lastName = person.lastName;
        this.gender = person.gender;
    }

    setAddress() {
        this.address.street = FakeInfo.getRandomText(40);
        this.address.number = Math.floor(Math.random() * 999) + 1;

        if (Math.random() < 0.2) {
            this.address.number += FakeInfo.getRandomText(1, false).toUpperCase();
        }

        this.address.floor = Math.random() < 0.3 ? 'st' : Math.floor(Math.random() * 99) + 1;
        const doorType = Math.floor(Math.random() * 20) + 1;
        if (doorType < 8) {
            this.address.door = 'th';
        } else if (doorType < 15) {
            this.address.door = 'tv';
        } else if (doorType < 17) {
            this.address.door = 'mf';
        } else if (doorType < 19) {
            this.address.door = Math.floor(Math.random() * 50) + 1;
        } else {
            const lowerCaseLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ø', 'æ', 'å'];
            this.address.door = lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
            if (doorType === 20) {
                this.address.door += '-';
            }
            this.address.door += Math.floor(Math.random() * 999) + 1;
        }

        // Replace this with your actual logic for Danish towns
        this.address.postal_code = '1000';
        this.address.town_name = 'Copenhagen';
    }

    setPhone() {
        let phone = FakeInfo.PHONE_PREFIXES[Math.floor(Math.random() * FakeInfo.PHONE_PREFIXES.length)];
        while (phone.length < 8) {
            phone += FakeInfo.getRandomDigit();
        }
        this.phone = phone;
    }

    static getRandomText(length = 1, includeDanishCharacters = true) {
        const validCharacters = [
            ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
            'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z'
        ];
        if (includeDanishCharacters) {
            validCharacters.push('æ', 'ø', 'å', 'Æ', 'Ø', 'Å');
        }

        let text = validCharacters[Math.floor(Math.random() * (validCharacters.length - 1)) + 1];
        for (let index = 1; index < length; index++) {
            text += validCharacters[Math.floor(Math.random() * validCharacters.length)];
        }
        return text;
    }

    static getRandomDigit() {
        return Math.floor(Math.random() * 10).toString();
    }

    getFakePerson() {
        return {
            CPR: this.cpr,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            birthDate: this.birthDate,
            address: this.address,
            phoneNumber: this.phone
        };
    }

    static async getFakePersons(amount = FakeInfo.MIN_BULK_PERSONS) {
        if (amount < FakeInfo.MIN_BULK_PERSONS) amount = FakeInfo.MIN_BULK_PERSONS;
        if (amount > FakeInfo.MAX_BULK_PERSONS) amount = FakeInfo.MAX_BULK_PERSONS;

        const bulkInfo = [];
        for (let i = 0; i < amount; i++) {
            const fakeInfo = new FakeInfo();
            bulkInfo.push(fakeInfo.getFakePerson());
        }
        return bulkInfo;
    }
}

export default FakeInfo;
