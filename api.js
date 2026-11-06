const PORT = 3000;
const API = `http://localhost:${PORT}`;
const IPHONE_RU_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

function extractDigits(value) {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (digits.length > 0 && digits[0] !== '7') digits = '7' + digits;
    return digits.slice(0, 11);
}

function formatPhoneRU(digits) {
    const d = digits.slice(1);
    let out = '+7';
    if (d.length > 0) out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ')';
    if (d.length > 3) out += ' ' + d.slice(3, 6);
    if (d.length > 6) out += '-' + d.slice(6, 8);
    if (d.length > 8) out += '-' + d.slice(8, 10);
    return out;
}

const form_1 = document.getElementById('form_1');
const marka = document.getElementById('marka');
const model = document.getElementById('model');
const god = document.getElementById('god');
const price = document.getElementById('price');

if (form_1) {
    form_1.addEventListener('submit', async (e) => {
        e.preventDefault();

        const body = {
            marka: marka.value.trim(),
            model: model.value.trim(),
            god: god.value.trim(),
            price: price.value.trim(),
        };

        const response = await fetch(`${API}/car`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(data);
    });
}

const phoneInput = document.getElementById('registerPhone');
const phoneError = document.getElementById('phoneError');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
        let normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
        if (normalized.length > 0 && normalized[0] !== '7') normalized = '7' + normalized;
        e.target.value = formatPhoneRU(normalized);
        if (phoneError) phoneError.style.display = 'none';
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (phoneError) phoneError.textContent = '';
        const value = phoneInput.value.trim();

        if (!IPHONE_RU_REGEX.test(value)) {
            if (phoneError) {
                phoneError.textContent = 'Введите номер в формате +7 (999) 123-45-67';
                phoneError.style.display = 'block';
            }
            phoneInput.focus();
            return;
        }

        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const phoneToSend = extractDigits(value);

        try {
            const response = await fetch(`${API}/author/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone: phoneToSend, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Ошибка регистрации');
            alert('Успешная регистрация');
        } catch (error) {
            alert(`Не удалось: ${error.message}`);
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${API}/author/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Ошибка входа');

            localStorage.setItem('token', data.token);
            alert('Вы вошли!');
        } catch (error) {
            alert(`Не удалось: ${error.message}`);
        }
    });
}

const loadUsersBtn = document.getElementById('loadUsersBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loadError = document.getElementById('loadError');
const usersOutput = document.getElementById('usersOutput');

if (loadUsersBtn) {
    loadUsersBtn.addEventListener('click', async () => {
        loadError.textContent = '';
        usersOutput.style.display = 'none';

        const token = localStorage.getItem('token');
        if (!token) {
            loadError.textContent = 'Доступ запрещён. Сначала авторизуйтесь';
            return;
        }

        try {
            const res = await fetch(`${API}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await res.json();

            if (res.status === 200) {
                usersOutput.textContent = JSON.stringify(data, null, 2);
                usersOutput.style.display = 'block';
            } else {
                loadError.textContent = data.error || 'Ошибка загрузки';
            }
        } catch (err) {
            loadError.textContent = 'Ошибка соединения с сервером';
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        usersOutput.style.display = 'none';
        loadError.textContent = '';
        alert('Вы вышли из системы');
    });
}