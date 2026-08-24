const express = require('express');
const router = express.Router();
const { createKPI, getAllKPIs, getMyKPIs, getKPIById, updateKPI, deleteKPI } = require('../controllers/kpiController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.get('/my-kpis', getMyKPIs);
router.get('/', getAllKPIs);
router.post('/', authorize('admin', 'supervisor'), createKPI);
router.get('/:id', getKPIById);
router.put('/:id', authorize('admin', 'supervisor'), updateKPI);
router.delete('/:id', authorize('admin'), deleteKPI);

module.exports = router;
