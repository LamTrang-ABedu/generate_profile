// Import the Faker library from a CDN or fallback
const { faker } = window;

// Generate profile data based on user inputs
function generateProfileData(password, email, locale = 'en_US') {
    let fakerInstance;
    let actualLocale = locale;

    // Initialize Faker with the specified locale, fallback if needed
    try {
        fakerInstance = new faker.Faker({ locale: [locale, 'en_US'] });
        if (fakerInstance.metadata.code !== locale && fakerInstance.metadata.code !== locale.split('_')[0]) {
            console.warn(`Locale '${locale}' might not be fully supported. Fallback to '${fakerInstance.metadata.code}'.`);
            actualLocale = fakerInstance.metadata.code;
        }
    } catch (error) {
        console.error(`Error initializing Faker with locale '${locale}': ${error}. Falling back to 'en_US'.`);
        fakerInstance = new faker.Faker({ locale: ['en_US'] });
        actualLocale = 'en_US';
    }

    // Generate profile data
    const lastName = fakerInstance.person.lastName();
    const firstName = fakerInstance.person.firstName();
    return {
        // Basic information
        "SF ID": "",
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        gender: fakerInstance.person.sex(),
        birthdate: fakerInstance.date.birthdate({ min: 18, max: 75, mode: 'age' }).toLocaleDateString('en-CA'),
        ssn: actualLocale.startsWith('en') ? fakerInstance.finance.ssn() : "N/A",

        // Address
        street: fakerInstance.location.streetAddress(),
        city: fakerInstance.location.city(),
        state: fakerInstance.location.state({ abbreviated: true }),
        zip: fakerInstance.location.zipCode(),
        country: fakerInstance.location.country(),

        // Contact information
        phone: actualLocale.startsWith('en') ? fakerInstance.phone.number('(###) ###-####') : fakerInstance.phone.number(),
        cell_phone: actualLocale.startsWith('en') ? fakerInstance.phone.number('(###) ###-####') : fakerInstance.phone.number(),

        // Parent information
        parent1_first_name: fakerInstance.person.firstName(),
        parent1_last_name: lastName,
        parent2_first_name: fakerInstance.person.firstName(),
        parent2_last_name: fakerInstance.person.lastName(),
        secondary_email: fakerInstance.internet.email(),
    };
}

// Display the profile data as an HTML table
function displayProfileAsTable(profileData) {
    const container = document.getElementById('profile-table-container');
    if (!container) return;

    const tableHTML = `
        <table>
            <thead>
                <tr><th>Field</th><th>Value</th></tr>
            </thead>
            <tbody>
                ${Object.entries(profileData).map(([key, value]) => `
                    <tr>
                        <td>${key}</td>
                        <td>${value ?? ""}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = tableHTML;
}

// Handle the "Generate Profile" button click event
function handleGenerateClick() {
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    let locale = document.getElementById('localeInput').value.trim();

    // Default to 'en_US' if locale input is empty
    if (!locale) {
        locale = 'en_US';
        document.getElementById('localeInput').value = locale;
    }

    // Validate email input
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    // Generate and display profile
    const profile = generateProfileData(password, email, locale);
    displayProfileAsTable(profile);
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateProfileButton');
    if (generateButton) {
        generateButton.addEventListener('click', handleGenerateClick);
    }
});
