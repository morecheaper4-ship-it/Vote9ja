import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.js';
import contestRoutes from './routes/contests.js';
import voteRoutes from './routes/votes.js';
import walletRoutes from './routes/wallet.js';
import userRoutes from './routes/users.js';
import entryRoutes from './routes/entries.js';
import feedRoutes from './routes/feed.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;