// Generate profile data based on user inputs using @faker-js/faker v8+
function generateProfileData(password, email, locale = 'en_US') {
    let fakerInstance;
    let actualLocale = locale;

    // Select the correct locale object from the global 'faker' object (provided by CDN)
    // The global 'faker' object contains properties for each locale, e.g., faker.en_US, faker.vi
    // Note: @faker-js/faker often uses locales like 'en', 'de', 'vi', 'ja', etc.
    // It might have specific variants like 'en_US', but check the available locales if needed.
    // We'll try the provided locale first, then a simplified version (e.g., 'en' from 'en_US'), then fallback to 'en'.

    const baseLocale = locale.split('_')[0]; // e.g., 'en' from 'en_US'

    if (faker[locale]) { // Try exact locale (e.g., 'en_US')
        fakerInstance = faker[locale];
        console.log(`Using Faker locale: ${locale}`);
    } else if (faker[baseLocale]) { // Try base locale (e.g., 'en')
        fakerInstance = faker[baseLocale];
        actualLocale = baseLocale;
        console.log(`Locale '${locale}' not found, using base locale: ${actualLocale}`);
    } else {
        console.warn(`Locale '${locale}' or base locale '${baseLocale}' not found in @faker-js/faker CDN build. Falling back to 'en'.`);
        fakerInstance = faker.en; // Default fallback to English
        actualLocale = 'en';
        // Safety check if even 'en' is missing (highly unlikely for standard build)
        if (!fakerInstance) {
             console.error("Critical: Default locale 'faker.en' not found. Using the base 'faker' object.");
             fakerInstance = faker; // Last resort
             actualLocale = 'en'; // Assume base is 'en'
        }
    }


    // --- The rest of the generation logic remains the same ---
    // --- as it already uses the v6+ syntax ---

    const lastName = fakerInstance.person.lastName();
    const firstName = fakerInstance.person.firstName();

    // Format birthdate to YYYY-MM-DD which is more standard for inputs
    const birthdateObj = fakerInstance.date.birthdate({ min: 18, max: 75, mode: 'age' });
    // Ensure date object before formatting
    const birthdate = birthdateObj instanceof Date ? birthdateObj.toISOString().split('T')[0] : 'N/A';

    // SSN generation is often US-specific ('en')
    // Check if finance.ssn exists for the current locale instance
    const ssn = (typeof fakerInstance.finance?.ssn === 'function' && actualLocale.startsWith('en'))
                ? fakerInstance.finance.ssn()
                : "N/A";

    // Phone number formatting might vary. Pass undefined format for non-en locales
    // to let faker use the locale's default format.
    const phoneFormat = actualLocale.startsWith('en') ? '(###) ###-####' : undefined;

    return {
        // Basic information
        "SF ID": "",
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        gender: fakerInstance.person.sex(), // Already correct syntax
        birthdate: birthdate, // Use formatted birthdate
        ssn: ssn, // Use generated SSN (with check)

        // Address (Already correct syntax)
        street: fakerInstance.location.streetAddress(),
        city: fakerInstance.location.city(),
        state: fakerInstance.location.state({ abbreviated: true }),
        zip: fakerInstance.location.zipCode(),
        country: fakerInstance.location.country(),

        // Contact information (Already correct syntax)
        phone: fakerInstance.phone.number(phoneFormat),
        cell_phone: fakerInstance.phone.number(phoneFormat),

        // Parent information (Already correct syntax)
        parent1_first_name: fakerInstance.person.firstName(),
        parent1_last_name: lastName, // Keep same last name as profile
        parent2_first_name: fakerInstance.person.firstName(),
        parent2_last_name: fakerInstance.person.lastName(), // Different last name for parent 2
        secondary_email: fakerInstance.internet.email(),
    };
}

// Display the profile data as an HTML table (No changes needed here)
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
                        <td>${value ?? ""}</td> {/* Use nullish coalescing for robustness */}
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

    // Default to 'en_US' or just 'en' if locale input is empty
    if (!locale) {
        locale = 'en'; // Default to 'en' as it's more common in @faker-js/faker
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
