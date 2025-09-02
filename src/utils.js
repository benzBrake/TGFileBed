// Utility functions

// Generate a random hash
export const generateHash = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get file extension
export const getFileExtension = (filename) => {
  if (typeof filename !== 'string') return '';
  const match = filename.match(/\.([a-zA-Z0-9]{1,5})$/);
  return match ? match[1].toLowerCase() : '';
};