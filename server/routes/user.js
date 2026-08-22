const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUserById, getSupervisorsAndEmployees, updateUser, updateUserRole, deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.get('/', authorize('admin', 'supervisor'), getAllUsers);
router.get('/list/supervisors-employees', authorize('admin'), getSupervisorsAndEmployees);
router.get('/:id', getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.put('/:id/role', authorize('admin'), updateUserRole);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;