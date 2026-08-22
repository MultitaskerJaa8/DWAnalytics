const express = require('express');
const router = express.Router();
const {
  createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.route('/')
  .get(getAllDepartments)
  .post(authorize('admin'), createDepartment);

router.route('/:id')
  .get(getDepartmentById)
  .put(authorize('admin'), updateDepartment)
  .delete(authorize('admin'), deleteDepartment);

module.exports = router;