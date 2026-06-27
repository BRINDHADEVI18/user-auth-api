const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


dotenv.config();
// configuring env variables 

const app = express();


app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 3000;
// process is a global obj

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;