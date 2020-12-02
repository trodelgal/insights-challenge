const { Router } = require('express');

const router = Router();

router.use('/posts', require('./posts'));
router.use('/labels', require('./labels'));
router.use('/analitics', require('./analitics'));


module.exports = router;