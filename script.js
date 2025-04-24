// NO import statement needed here when using the CDN script in HTML

// Generate profile data based on user inputs using @faker-js/faker v8+ (from CDN)
function generateProfileData(password, email, locale = 'en') { // Default to 'en'
    let fakerInstance;
    let actualLocale = locale;

    // Select the correct locale object from the global 'faker' object (provided by CDN)
    // The global 'faker' object contains properties for each locale, e.g., faker.en_US, faker.vi
    const baseLocale = locale.split('_')[0]; // e.g., 'en' from 'en_US'

    // Check for specific locale (e.g., en_US), then base (e.g., en), then fallback
    if (typeof faker !== 'undefined' && faker[locale]) { // Check if global faker and specific locale exist
        fakerInstance = faker[locale];
        console.log(`Using Faker locale: ${locale}`);
    } else if (typeof faker !== 'undefined' && faker[baseLocale]) { // Check for base locale
        fakerInstance = faker[baseLocale];
        actualLocale = baseLocale;
        console.log(`Locale '${locale}' not found, using base locale: ${actualLocale}`);
    } else if (typeof faker !== 'undefined' && faker.en) { // Fallback to 'en'
         console.warn(`Locale '${locale}' or base locale '${baseLocale}' not found in @faker-js/faker CDN build. Falling back to 'en'.`);
         fakerInstance = faker.en;
         actualLocale = 'en';
    } else {
        // If faker itself is not defined globally (CDN failed or script order wrong)
        console.error("Faker library not found. Make sure it's loaded correctly via CDN before this script.");
        // Return empty/default data or throw an error to prevent further issues
        return { /* Return some default structure or null */ };
    }


    // --- Generate profile data using the selected fakerInstance ---

    const lastName = fakerInstance.person.lastName();
    const firstName = fakerInstance.person.firstName();

    // Format birthdate to YYYY-MM-DD
    const birthdateObj = fakerInstance.date.birthdate({ min: 18, max: 75, mode: 'age' });
    const birthdate = birthdateObj instanceof Date ? birthdateObj.toISOString().split('T')[0] : 'N/A';

    // SSN generation is often US-specific ('en')
    const ssn = (typeof fakerInstance.finance?.ssn === 'function' && actualLocale.startsWith('en'))
                ? fakerInstance.finance.ssn()
                : "N/A";

    // Phone number formatting
    const phoneFormat = actualLocale.startsWith('en') ? '(###) ###-####' : undefined;

    return {
        // Basic information
        "SF ID": "",
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        gender: fakerInstance.person.sex(),
        birthdate: birthdate,
        ssn: ssn,

        // Address
        street: fakerInstance.location.streetAddress(),
        city: fakerInstance.location.city(),
        state: fakerInstance.location.state({ abbreviated: true }),
        zip: fakerInstance.location.zipCode(),
        country: fakerInstance.location.country(),

        // Contact information
        phone: fakerInstance.phone.number(phoneFormat),
        cell_phone: fakerInstance.phone.number(phoneFormat),

        // Parent information
        parent1_first_name: fakerInstance.person.firstName(),
        parent1_last_name: lastName,
        parent2_first_name: fakerInstance.person.firstName(),
        parent2_last_name: fakerInstance.person.lastName(),
        secondary_email: fakerInstance.internet.email(),
    };
}

// Display the profile data as an HTML table (No changes needed here)
function displayProfileAsTable(profileData) {
    const container = document.getElementById('profile-table-container');
    if (!container || !profileData) return; // Added check for profileData

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

// Handle the "Generate Profile" button click event (No changes needed here)
function handleGenerateClick() {
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    let locale = document.getElementById('localeInput').value.trim();

    // Default to 'en' if locale input is empty
    if (!locale) {
        locale = 'en'; // Default to 'en'
        document.getElementById('localeInput').value = locale;
    }

    // Validate email input
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    // Generate and display profile
    const profile = generateProfileData(password, email, locale);
    if (profile) { // Check if profile generation was successful
       displayProfileAsTable(profile);
    }
}

// Attach event listeners (No changes needed here)
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateProfileButton');
    if (generateButton) {
        generateButton.addEventListener('click', handleGenerateClick);
    }
    // Optional: Set default locale in input field
    const localeInput = document.getElementById('localeInput');
     if (localeInput && !localeInput.value) {
         localeInput.value = 'en'; // Default to 'en'
     }
});
