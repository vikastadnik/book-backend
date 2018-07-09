var express = require('express');
var router = express.Router();
var book = require('../dao/Book');

/* GET users listing. */
router.get('/', function(req, res, next) {
    // res.send('respond with a resource');
    book.getAll(req)
        .then(function (value) {
            res.json(value);
        })
        .catch(function (reason) {
            res.status(500);
            res.json({'error': true, 'data': reason});
        })
});

router.post('/', function(req, res, next) {
    book.create(req)
        .then(function (value) {
            res.json(value);
        })
        .catch(function (err) {
            res.status(500);
            res.json({'error': true, 'data': err});
        })
});

router.delete('/', function(req, res, next) {
    console.log(req.query['id']);
    book.delete(req)
        .then(function (value) {
            res.status(204);
            res.send();
        })
        .catch(function (err) {
            res.status(500);
            res.json({'error': true, 'data': err});
        })
});



module.exports = router;
