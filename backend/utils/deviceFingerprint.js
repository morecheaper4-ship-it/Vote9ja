import crypto from 'crypto';

export const generateDeviceFingerprint = (userAgent) => {
  return crypto.createHash('sha256').update(userAgent).digest('hex');
};

export const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip
  );
};
