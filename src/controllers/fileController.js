const { Storage } = require('@google-cloud/storage');
const path = require('path');
const config = require('../../config/config'); // Ensure you have your Google Cloud credentials configured
const { File } = require('../models'); // Import the File model

const storage = new Storage({
  projectId: config.googleCloudStorage.projectId,
  keyFilename: path.join(__dirname, '../../service-account.json') // Path to your service account key file
});

const bucketName = config.googleCloudStorage.bucketName;
const bucket = storage.bucket(bucketName);

class FileController {
  // Handle file upload
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false
      });

      blobStream.on('error', err => {
        console.error('Upload error:', err);
        res.status(500).send({ message: 'Upload error', error: err.message });
      });

      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        await File.create({
          userId: req.userId, // Assuming userId is set by auth middleware
          fileName: req.file.originalname
        });
        res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
      });

      blobStream.end(req.file.buffer);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  }

  // Handle file download
  async downloadFile(req, res) {
    try {
      const fileName = req.params.fileName;
      const fileRecord = await File.findOne({ where: { fileName, userId: req.userId } });

      if (!fileRecord) {
        return res.status(404).send('File not found or you do not have access.');
      }

      const file = bucket.file(fileName);

      const exists = await file.exists();
      if (!exists[0]) {
        return res.status(404).send('File not found.');
      }

      file.createReadStream()
        .on('error', err => {
          console.error('Download error:', err);
          res.status(500).send({ message: 'Download error', error: err.message });
        })
        .pipe(res);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  }

  // Handle file deletion
  async deleteFile(req, res) {
    try {
      const fileName = req.params.fileName;
      const fileRecord = await File.findOne({ where: { fileName, userId: req.userId } });

      if (!fileRecord) {
        return res.status(404).send('File not found or you do not have access.');
      }

      const file = bucket.file(fileName);

      const exists = await file.exists();
      if (!exists[0]) {
        return res.status(404).send('File not found.');
      }

      await file.delete();
      await fileRecord.destroy();
      res.status(200).send({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  }
}

module.exports = FileController;