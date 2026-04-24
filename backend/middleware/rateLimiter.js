import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const voteLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute
  max: 50, // limit each IP to 50 votes per minute
  message: 'Too many votes, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user && req.user.role === 'admin',
});

export const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again later',
});
