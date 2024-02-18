var express = require('express');
var router = express.Router();
// ==================================================
// Route to list all records. Display view to list all records
// ==================================================
router.get('/', function(req, res, next) {
    let query = "SELECT subscription_id, customer_id, category_id, subscribedate, unsubscribedate FROM subscription";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
        console.log(err);
        res.render('error');
    }
    res.render('subscription/allrecords', {allrecs: result});
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// ==================================================

router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT subscription_id, customer_id, category_id, subscribedate, unsubscribedate FROM subscription WHERE subscription_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.render('subscription/onerec', {onerec: result[0] });
    }
    });
});    


// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', function(req, res, next) {
    res.render('subscription/addrec');
});    

// ==================================================
// Route to obtain user input and save in database.
// ==================================================

router.post('/', function(req, res, next) {
    let insertquery = "INSERT INTO subscription (subscription_id, customer_id, category_id, subscribedate, unsubscribedate) VALUES (?, ?, ?, ?, ?)";
    db.query(insertquery,[req.body.subscription_id, req.body.customer_id, req.body.category_id, req.body.subscribedate, req.body.unsubscribedate],(err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/subscription');
    }
    });
});

// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {
    let query = "SELECT subscription_id, customer_id, category_id, subscribedate, unsubscribedate FROM subscription WHERE subscription_id = "
    + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
    console.log(err);
    res.render('error');
    } else {
    res.render('subscription/editrec', {onerec: result[0] });
    }
    });
    });
    

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE subscription SET subscription SET subscription_id = ?, customer_id = ?, category_id = ?, subscribedate = ?, unsubscribedate = ? WHERE category_id = " + req.body.subscription_id;
    db.query(updatequery,[req.body.subscription_id, req.body.customer_id, req.body.category_id, req.body.subscribedate, req.body.unsubscribedate],(err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/subscription');
    }
    });
});    

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM subscription WHERE subscription_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/subscription');
    }
    });
});

module.exports = router;
