import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists');
  }

  // Create user
  user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  // Generate referral code
  user.referralCode = user.generateReferralCode();
  await user.save();

  const token = generateToken(user._id);
  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);
  return { user, token };
};
