const express = require('express');
const router = express.Router();
const FileController = require('../controllers/fileController');
const upload = require('../middlewares/uploadMiddleware'); // Assuming you have this middleware
const authMiddleware = require('../middlewares/authMiddleware');

const fileController = new FileController();

router.post('/upload', authMiddleware, upload.single('file'), (req, res) => fileController.uploadFile(req, res));
router.get('/download/:filePath', authMiddleware, (req, res) => fileController.downloadFile(req, res));
router.delete('/delete/:filePath', authMiddleware, (req, res) => fileController.deleteFile(req, res));

module.exports = router;