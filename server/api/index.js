const { Router } = require('express');

const router = Router();

router.use('/posts', require('./posts'));
router.use('/labels', require('./labels'));
router.use('/analitics', require('./analitics'));
router.use('/notifications', require('./notifications'));


module.exports = router;