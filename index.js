const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { resolve } = require('path');

const app = express();
const port = 3010;


app.use(express.json());


app.use(express.static('static'));


mongoose.connect('mongodb://localhost:27017/marketplace', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
