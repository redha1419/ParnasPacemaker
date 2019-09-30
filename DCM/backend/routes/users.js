const express = require('express');
const router = new express.Router();

router.get('/test', function(req, res) {
    console.log('another one');
    res.send('hello')
});

module.exports = router;