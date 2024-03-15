var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
    if (!req.session.isadmin){
        return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
        next();
    }

// Display reports menu
// URL: http://localhost:3006/reports
router.get('/', adminonly, function(req, res, next) {
    res.render('reports/reportmenu');
});

// Customer Listing
// URL: https://localhost:3006/reports/custlist
router.get('/custlist', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, firstname, lastname, username FROM customer";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
        console.log(err);
        res.render('error');
    }
    res.render('reports/custlist', {allrecs: result});
    });
});

// Product Listing
// URL: https://localhost:3006/reports/prodlist
router.get('/prodlist', adminonly, function(req, res, next) {
    let query = "SELECT product_id, productname, category_id, saleprice, status, homepage FROM product";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
        console.log(err);
        res.render('error');
    }
    res.render('reports/prodlist', {allrecs: result});
    });
});

// Sale Listing
// URL: https://localhost:3006/reports/salelist
router.get('/salelist', adminonly, function(req, res, next) {
    let query = "SELECT order_id, customer_id, saledate, paymentstatus FROM saleorder";
    //execute query 
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
    res.render('reports/salelist', {allrecs: result});
    });
});

module.exports = router;