const PORT = 3000
const API = `http://localhost:${PORT}`


const form_1 = document.getElementById('form_1')
const login = document.getElementById('login')
const password = document.getElementById('password')

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
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    const data = await response.json()
    console.log(data);

})