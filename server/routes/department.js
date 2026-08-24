const express = require('express');
const router = express.Router();
const { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/', getAllDepartments);
router.post('/', protect, authorize('admin'), createDepartment);
router.get('/:id', protect, getDepartmentById);
router.put('/:id', protect, authorize('admin'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

module.exports = router;
