import { baseUrl } from './info.js';

document.querySelector('#frmGenerate').addEventListener('submit', (e) => {
    e.preventDefault();

    // The endpoint is inferred from the selected option
    let endpoint = '/';
    if (e.target.chkPerson.checked) {
        const numPersons = parseInt(e.target.txtNumberPersons.value);
        if (numPersons > 1) {
            endpoint += `bulk/${numPersons}`;
        } else {
            endpoint += 'person-full';
        }
    }  else {
        // Map the selected value to the correct endpoint
        const option = e.target.cmbPartialOptions.value;
        switch (option) {
            case 'cpr':
                endpoint += 'cpr';
                break;
            case 'name-gender':
                endpoint += 'person'; // Since your /person endpoint returns name and gender
                break;
            case 'name-gender-dob':
                endpoint += 'person-dob';
                break;
            case 'cpr-name-gender':
                endpoint += 'person-cpr';
                break;
            case 'cpr-name-gender-dob':
                endpoint += 'person-cpr-dob';
                break;
            case 'address':
                endpoint += 'address';
                break;
            case 'phone':
                endpoint += 'phone';
                break;
            default:
                console.error('Invalid option selected');
                return;
        }
    }

    // API call
    fetch(baseUrl + endpoint)
    .then(response => {
        if (!response.ok) {
            handleError();
        } else {
            return response.json();
        }
    })
    .then(handlePersonData)
    .catch(handleError);
});

const handlePersonData = (data) => {
    const output = document.querySelector('#output');
    output.innerHTML = '';

    if (data.length === undefined) {
        data = [data];
    }

    data.forEach(item => {
        const personCard = document.importNode(document.getElementById('personTemplate').content, true);
        console.log('Person Data:', item); // Log the item to inspect its properties

        if (item.cpr !== undefined) {
            const cprValue = personCard.querySelector('.cprValue');
            cprValue.innerText = item.cpr;
            cprValue.classList.remove('hidden');
            personCard.querySelector('.cpr').classList.remove('hidden');
        }
        if (item.firstName !== undefined) {
            const firstNameValue = personCard.querySelector('.firstNameValue');
            firstNameValue.innerText = item.firstName;
            firstNameValue.classList.remove('hidden');
            const lastNameValue = personCard.querySelector('.lastNameValue');
            lastNameValue.innerText = item.lastName;
            lastNameValue.classList.remove('hidden');
            personCard.querySelector('.firstName').classList.remove('hidden');
            personCard.querySelector('.lastName').classList.remove('hidden');
        }    
        if (item.gender !== undefined) {
            const genderValue = personCard.querySelector('.genderValue');
            genderValue.innerText = item.gender;
            genderValue.classList.remove('hidden');
            personCard.querySelector('.gender').classList.remove('hidden');
        }        
        if (item.birthDate !== undefined) {
            const dobValue = personCard.querySelector('.dobValue');
            dobValue.innerText = item.birthDate;
            dobValue.classList.remove('hidden');
            personCard.querySelector('.dob').classList.remove('hidden');
        }
        if (item.address !== undefined) {
            // Address is in the expected "address" object
            const streetValue = personCard.querySelector('.streetValue');
            streetValue.innerText = `${item.address.street} ${item.address.number}, ${item.address.floor}.${item.address.door}`;
            streetValue.classList.remove('hidden');
            const townValue = personCard.querySelector('.townValue');
            townValue.innerText = `${item.address.postal_code} ${item.address.town_name}`;
            townValue.classList.remove('hidden');
            personCard.querySelector('.address').classList.remove('hidden');
        } else if (item.street !== undefined && item.number !== undefined) {
            // Address properties are directly on the root object
            const streetValue = personCard.querySelector('.streetValue');
            streetValue.innerText = `${item.street} ${item.number}, ${item.floor}.${item.door}`;
            streetValue.classList.remove('hidden');
            const townValue = personCard.querySelector('.townValue');
            townValue.innerText = `${item.postal_code} ${item.town_name}`;
            townValue.classList.remove('hidden');
            personCard.querySelector('.address').classList.remove('hidden');
        }
        if (item.phoneNumber !== undefined) {
            const phoneNumberValue = personCard.querySelector('.phoneNumberValue');
            phoneNumberValue.innerText = item.phoneNumber;
            phoneNumberValue.classList.remove('hidden');
            personCard.querySelector('.phoneNumber').classList.remove('hidden');
        }

        output.appendChild(personCard);
    });
    output.classList.remove('hidden');
};

const handleError = () => {
    const output = document.querySelector('#output');
    
    output.innerHTML = 
    '<p>There was a problem communicating with the API</p>';
    output.classList.add('error');

    setTimeout(() => {
        output.innerHTML = '';
        output.classList.remove('error');
    }, 2000);
};