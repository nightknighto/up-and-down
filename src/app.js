const express = require('express');
const app = express();
const { sequelize } = require('./models'); // Import Sequelize instance

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/users', userRoutes);
app.use(express.static('public'));

// Error handling middleware
const errorMiddleware = require('./middlewares/errorMiddleware');
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 3000;

// Synchronize the database and then start the server
sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Unable to synchronize the database:', error);
});