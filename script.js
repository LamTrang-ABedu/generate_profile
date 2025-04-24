// Sử dụng thư viện faker đã được nhúng từ CDN
const { faker } = window;

// Hàm tạo dữ liệu profile, giờ nhận tham số từ input
function generateProfileData(password, email, locale = 'en_US') {
    let currentFaker;
    let actualLocale = locale; // Lưu lại locale thực tế được dùng

    // Cố gắng khởi tạo Faker với locale người dùng, nếu lỗi thì dùng en_US
    // Sử dụng mảng locale để Faker tự động fallback nếu locale chính không có đủ data
    try {
        // Ví dụ: nếu locale là 'vi_VN', nó sẽ thử 'vi_VN' trước, rồi đến 'en_US'
        currentFaker = new faker.Faker({ locale: [locale, 'en_US'] });
        console.log(`Using locale array: [${locale}, 'en_US']`);
        // Kiểm tra xem locale mong muốn có thực sự được dùng không (có thể Faker chỉ dùng fallback)
        // Cách kiểm tra này không hoàn hảo 100% nhưng là một gợi ý
        if (currentFaker.metadata.code !== locale && currentFaker.metadata.code !== locale.split('_')[0]) {
             console.warn(`Locale '${locale}' might not be fully supported or available, Faker might be using fallback '${currentFaker.metadata.code}'.`);
             actualLocale = currentFaker.metadata.code; // Cập nhật locale thực tế
        } else {
            actualLocale = locale; // Locale mong muốn đã được dùng
        }

    } catch (e) {
        console.error(`Error initializing Faker with locale '${locale}': ${e}. Falling back to 'en_US'.`);
        currentFaker = new faker.Faker({ locale: ['en_US'] }); // Chỉ dùng en_US nếu lỗi hoàn toàn
        actualLocale = 'en_US';
    }

    // Tạo dữ liệu
    const userLastName = currentFaker.person.lastName();
    const firstName = currentFaker.person.firstName();

    const profile = {
        // Thông tin cơ bản
        "SF ID": "",
        "password": password, // Sử dụng password từ input
        "email": email,       // Sử dụng email từ input
        "first_name": firstName,
        "last_name": userLastName,
        "full_name": `${firstName} ${userLastName}`,
        "gender": currentFaker.person.sex(), // 'male' hoặc 'female'
        "birthdate": currentFaker.date.birthdate({ min: 18, max: 75, mode: 'age' }).toLocaleDateString('en-CA'), // YYYY-MM-DD
        "ssn": actualLocale.startsWith('en') ? currentFaker.finance.ssn() : "N/A", // SSN chủ yếu cho US

        // Địa chỉ
        "street": currentFaker.location.streetAddress(),
        "city": currentFaker.location.city(),
        "state": currentFaker.location.state({ abbreviated: true }), // Luôn thử lấy viết tắt
        "zip": currentFaker.location.zipCode(),
        "country": currentFaker.location.country(), // <--- Lấy country dựa trên locale của Faker

        // Thông tin liên lạc
        "phone": actualLocale.startsWith('en') ? currentFaker.phone.number('(###) ###-####') : currentFaker.phone.number(), // Định dạng US hoặc chung
        "cell_phone": actualLocale.startsWith('en') ? currentFaker.phone.number('(###) ###-####') : currentFaker.phone.number(),

        // Thông tin cha mẹ
        "parent1_first_name": currentFaker.person.firstName(),
        "parent1_last_name": userLastName,
        "parent2_first_name": currentFaker.person.firstName(),
        "parent2_last_name": currentFaker.person.lastName(),
        "secondary_email": currentFaker.internet.email(),
    };
    return profile;
}

// Hàm hiển thị bảng (giữ nguyên)
function displayProfileAsTable(profileData) {
    const container = document.getElementById('profile-table-container');
    if (!container) return;

    let tableHTML = '<table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>';
    for (const key in profileData) {
        if (profileData.hasOwnProperty(key)) {
            // Xử lý giá trị null hoặc undefined để hiển thị chuỗi rỗng
            const value = profileData[key] === null || profileData[key] === undefined ? "" : profileData[key];
            tableHTML += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }
    }
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

// Hàm được gọi khi nhấn nút "Generate Profile"
function handleGenerateClick() {
    // Lấy giá trị từ các trường input
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value; // Không trim password
    let locale = document.getElementById('localeInput').value.trim();

    // Sử dụng locale mặc định nếu người dùng không nhập gì
    if (!locale) {
        locale = 'en_US';
        document.getElementById('localeInput').value = locale; // Cập nhật lại ô input cho rõ
    }

    // Kiểm tra email cơ bản (không bắt buộc nhưng nên có)
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    // Gọi hàm tạo profile với dữ liệu input
    const profile = generateProfileData(password, email, locale);

    // Hiển thị profile
    displayProfileAsTable(profile);
}

// Không tự động chạy khi tải trang nữa, chỉ chạy khi nhấn nút
// document.addEventListener('DOMContentLoaded', handleGenerateClick);
