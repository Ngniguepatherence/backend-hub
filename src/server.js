const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', //process.env.FRONTEND_URL || 'http://localhost:8080', //'https://app.westdigitalhub.westtechs.org', // Adjust as needed for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/spaces', require('./routes/spaces'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/students', require('./routes/students'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/booking-history', require('./routes/bookingHistory'));
app.use('/api/cash-register', require('./routes/cashRegister'));
app.use('/api/services', require('./routes/hubServices'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/bank-accounts', require('./routes/bankAccounts'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: `Server is running here and backend is ${process.env.FRONTEND_URL}` });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Auto-update booking statuses every 5 minutes
const { updateBookingStatuses } = require('./utils/bookingStatusUpdater');
setInterval(async () => {
  try {
    await updateBookingStatuses();
  } catch (error) {
    console.error('Error in scheduled booking status update:', error);
  }
}, 5 * 60 * 1000); // Every 5 minutes

// Run immediately on startup
updateBookingStatuses().catch(err => {
  console.error('Error in initial booking status update:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Auto-update booking statuses every 5 minutes`);
});

