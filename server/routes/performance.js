const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitWork, getMySubmissions, getPendingApprovals, reviewSubmission, getTeamPerformance, getPerformanceHistory } = require('../controllers/performanceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 5242880 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const validExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (validExt) cb(null, true);
    else cb(new Error('Only images, PDF, and Word documents are allowed'));
  },
});

router.use(protect);

router.post('/submit', upload.array('evidenceDocuments', 5), submitWork);
router.get('/my-submissions', getMySubmissions);
router.get('/pending-approvals', authorize('supervisor', 'admin'), getPendingApprovals);
router.put('/:id/review', authorize('supervisor', 'admin'), reviewSubmission);
router.get('/team', authorize('supervisor', 'admin'), getTeamPerformance);
router.get('/history/:employeeId?', getPerformanceHistory);

module.exports = router;
