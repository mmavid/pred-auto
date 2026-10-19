const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 3000

app.use(express.json())
app.use(cors())

const car_dealership = [
    {id: 1, marka: 'BMW', model: 'M5', god: 2026, price: 16700000,},
    {id: 2, marka: 'Ford', model: 'Explorer', god: 2013, price: 1260000,},
    {id: 3, marka: 'Mazda', model: 'RX7', god: 2002, price: 2800000,},
    {id: 4, marka: 'Mercedes', model: 'CLS', god: 2016, price: 4600000,},
    {id: 5, marka: 'LADA', model: 'Niva', god: 2026, price: 1700000,},
    {id: 6, marka: 'Mercedes', model: 'E-Class', god: 2015, price: 2600000,},
    {id: 7, marka: 'BMW', model: 'M4', god: 2025, price: 13500000,},
    {id: 8, marka: 'Ford', model: 'Focus', god: 2016, price: 980000,}
]

app.get('/', (req, res ) =>{
    return res.send(car_dealership)
})

app.listen(PORT, ()=>{
    console.log(`Сервер запущен на http://localhost:${PORT}`)
})