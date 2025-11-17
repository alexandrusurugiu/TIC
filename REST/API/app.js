const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = 5000;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/items', itemRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});