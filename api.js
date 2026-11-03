const PORT = 3000
const API = `http://localhost:${PORT}`

const form_1 = document.getElementById('form_1')
const marka = document.getElementById('marka')
const model = document.getElementById('model')
const god = document.getElementById('god')
const price = document.getElementById('price')

form_1.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = {
        marka: marka.value.trim(),
        model: model.value.trim(),
        god: god.value.trim(),
        price: price.value.trim(),
    }

    const response = await fetch(`${API}/car`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    const data = await response.json()
    console.log(data);
})

const phoneInput = document.getElementById('registerPhone');
const phoneError = document.getElementById('phoneError');
const phoneRegex = /^\+?[\d\s\-()]{10,20}$/;

phoneInput.addEventListener('input', () => {
    const value = phoneInput.value;
    if (value === '') {
        phoneError.style.display = 'none';
        return;
    }
    if (!phoneRegex.test(value)) {
        phoneError.textContent = 'Неверный формат или длина (10-20 символов)';
        phoneError.style.display = 'block';
    } else {
        phoneError.style.display = 'none';
    }
});

function normalizePhone(phone) {
    let clean = phone.replace(/[^\d+]/g, '');
    if (clean.indexOf('+') > 0) clean = clean.replace(/\+/g, '');
    return clean;
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    let phone = phoneInput.value.trim();

    if (!phoneRegex.test(phone)) {
        alert('Исправьте номер телефона перед отправкой');
        return;
    }

    phone = normalizePhone(phone);

    try {
        const response = await fetch(`${API}/author/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Ошибка регистрации');
        alert('Успех! Теперь войдите.');
    } catch (err) {
        alert(`Не удалось: ${err.message}`);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
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
    } catch (err) {
        alert(`Не удалось: ${err.message}`);
    }
});