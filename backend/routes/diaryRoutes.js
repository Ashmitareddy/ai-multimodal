const express = require('express');
const router = express.Router();
const { logEntry, getEntries } = require('../controllers/diaryController');

router.post('/log', logEntry);
router.get('/', getEntries);

module.exports = router;
