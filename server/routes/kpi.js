const express = require('express');
const router = express.Router();
const { createKPI, getAllKPIs, getMyKPIs, getKPIById, updateKPI, deleteKPI } = require('../controllers/kpiController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.get('/my-kpis', getMyKPIs);

router.route('/')
  .get(getAllKPIs)
  .post(authorize('admin', 'supervisor'), createKPI);

router.route('/:id')
  .get(getKPIById)
  .put(authorize('admin', 'supervisor'), updateKPI)
  .delete(authorize('admin'), deleteKPI);

module.exports = router;