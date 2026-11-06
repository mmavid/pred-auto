const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

const PORT = 3000;
const SECRET_KEY = 'super_secret_key';

app.use(express.json());
app.use(cors());


function generateETag(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: { isEmail: true } 
    },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'users', timestamps: false });

const car_dealership = [
    { id: 1, marka: 'BMW', model: 'M5', god: 2026, price: 16700000 },
    { id: 2, marka: 'Ford', model: 'Explorer', god: 2013, price: 1260000 },
    { id: 3, marka: 'Mazda', model: 'RX7', god: 2002, price: 2800000 },
    { id: 4, marka: 'Mercedes', model: 'CLS', god: 2016, price: 4600000 },
    { id: 5, marka: 'LADA', model: 'Niva', god: 2026, price: 1700000 },
    { id: 6, marka: 'Mercedes', model: 'E-Class', god: 2015, price: 2600000 },
    { id: 7, marka: 'BMW', model: 'M4', god: 2025, price: 13500000 },
    { id: 8, marka: 'Ford', model: 'Focus', god: 2016, price: 980000 }
];
let nextId = 9;

app.get('/', (req, res) => {
    return res.send(car_dealership);
});


app.get('/cached', (req, res) => {

  const etag = generateETag(JSON.stringify(car_dealership));
  const lastModified = new Date().toUTCString();

  // res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('ETag', etag);
  res.setHeader('Last-Modified', lastModified);

  if (req.headers['if-none-match'] === etag ||
    req.headers['if-modified-since'] === lastModified) {
    return res.status(304).end();
  }
  return res.send(car_dealership);
})


app.post('/car', (req, res) => {
    const { marka, model, god, price } = req.body;
    if (!marka || !model || !god || !price) {
        return res.status(400).json({ error: 'данные не указаны' });
    }
    const newCar_dealership = {
        id: nextId++,
        marka,
        model,
        god,
        price
    };
    car_dealership.push(newCar_dealership);
    console.log('авто добавлено');
    return res.status(200).json({ message: 'Created' });
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Невалидный токен' });
    }
};

app.post('/author/register', async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        if (!email || !phone || !password) return res.status(400).json({ error: 'Все поля обязательны' });

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, phone, password: hash });
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user.id, email: user.email, phone: user.phone } });
    } catch (err) {
        if (err.name === 'SequelizeValidationError') return res.status(400).json({ error: err.errors[0].message });
        if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Email или телефон заняты' });
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/author/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Неверный email или пароль' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
});

app.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'phone'] 
        });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
});