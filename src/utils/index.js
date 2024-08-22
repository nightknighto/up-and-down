// Utility functions for the Google Drive clone project

// Function to generate a unique file name
function generateFileName(file) {
  const timestamp = Date.now();
  const extension = file.originalname.split('.').pop();
  return `${timestamp}.${extension}`;
}

// Function to format file size in human-readable format
function formatFileSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  return `${size.toFixed(2)} ${units[index]}`;
}

module.exports = {
  generateFileName,
  formatFileSize
};