var express = require('express');
var router = express.Router();
// ==================================================
// Route to list all records. Display view to list all records
// ==================================================
router.get('/', function(req, res, next) {
    let query = "SELECT product_id, productname, category_id, saleprice, status FROM product";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
        console.log(err);
        res.render('error');
    }
    res.render('product/allrecords', {allrecs: result});
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
//URL: http://localhost:3006/product/1/show
// ==================================================

router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT product_id, productname, prodimage, description, ingredients, category_id, saleprice, status FROM product WHERE product_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.render('product/onerec', {onerec: result[0] });
    }
    });
});    


// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', function(req, res, next) {
    res.render('product/addrec');
});    

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', function(req, res, next) {
    let insertquery = "INSERT INTO product (productname, prodimage, description, ingredients, category_id, saleprice, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(insertquery,[req.body.productname, req.body.prodimage, req.body.description,
    req.body.ingredients, req.body.category_id, req.body.saleprice, req.body.status],(err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/product');
    }
    });
});

// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT product_id, productname,prodimage, description, ingredients, category_id, saleprice, status FROM product WHERE product_id = "
    + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log(err);
    res.render('error');
    } else {
    res.render('product/editrec', {onerec: result[0] });
    }
    });
    });
    

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE product SET productname = ?, prodimage = ?, description = ?, ingredients = ?, category_id = ?, saleprice = ?, status = ? WHERE product_id = " + req.body.product_id;
    db.query(updatequery,[req.body.productname, req.body.prodimage, req.body.description,
    req.body.ingredients, req.body.weightdetail, req.body.healthwarn, req.body.prodcolor,
    req.body.package_id, req.body.category_id, req.body.saleprice, req.body.status],(err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/product');
    }
    });
});    

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM product WHERE product_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/product');
    }
    });
});

module.exports = router;
