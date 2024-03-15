var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

function adminonly(req,res,next){
    if (!req.session.isadmin){
        return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
        next();
    }

// ==================================================
// Route to list all records. Display view to list all records
// ==================================================
router.get('/', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, firstname, lastname, username, isadmin FROM customer";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
        console.log(err);
        res.render('error');
    }
    res.render('customer/allrecords', {allrecs: result});
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
//URL: http://localhost:3006/customer/1/show
// ==================================================

router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, firstname, lastname, email, phone, username, password, isadmin FROM customer WHERE customer_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.render('customer/onerec', {onerec: result[0] });
    }
    });
});    

// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', adminonly, function(req, res, next) {
    res.render('customer/addrec');
});    

// ==================================================
// Route Enable Registration
// ==================================================
router.get('/register', function(req, res, next) {
    res.render('customer/addrec');
    });    

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function(req, res, next) {
    let insertquery = "INSERT INTO customer (firstname, lastname, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?)";
    bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
    if(err) { res.render('error');}
    db.query(insertquery,[req.body.firstname, req.body.lastname, req.body.email, req.body.phone, req.body.username, hash],(err, result) => {
    if (err) {
    console.log(err);
    res.render('error');
    } else {
    res.redirect('/customer');
    }
    });
    });
    });
    });

// ==================================================
// Route Provide Login Window
// ==================================================
router.get('/login', function(req, res, next) {
    res.render('customer/login', {message: "Please Login"});
});

// ==================================================
// Route Check Login Credentials
// ==================================================
router.post('/login', function(req, res, next) {
    let query = "SELECT customer_id, firstname, lastname, password, isadmin from customer WHERE username = '" + req.body.username + "'";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            res.render('error');
        } else {
            if (result[0]) { // Check if result array is not empty
                // Username was correct. Check if password is correct
                bcrypt.compare(req.body.password, result[0].password, function(err, result1) {
                    if (result1) {
                        // Password is correct. Set session variables for user.
                        var custid = result[0].customer_id;
                        req.session.customer_id = custid;
                        var custname = result[0].firstname + " " + result[0].lastname;
                        req.session.custname = custname;
                        var isadmin = result[0].isadmin;
                        req.session.isadmin = isadmin;
                        res.redirect('/');
                    } else {
                        // password do not match
                        res.render('customer/login', { message: "Wrong Password" });
                    }
                });
            } else {
                // Username not found
                res.render('customer/login', { message: "Wrong Username" });
            }
        }
    });
});
// ==================================================
// Route Check Login Credentials
// ==================================================
router.get('/logout', function(req, res, next) {
    req.session.customer_id = 0;
    req.session.custname = "";
    req.session.cart=[];
    req.session.qty=[];
    req.session.isadmin = 0;
    res.redirect('/');
    });    

// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, firstname, lastname, email, phone, username, password, isadmin FROM customer WHERE customer_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.render('customer/editrec', {onerec: result[0] });
    }
    });
});
    

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function(req, res, next) {
    var isadmin_value = 0;
    if (req.body.isadmin){
        isadmin_value = 1;
    }
    
    let updatequery = "UPDATE customer SET firstname = ?, lastname = ?, email = ?, phone = ?, username = ?, password = ?, isadmin = ? WHERE customer_id = " + req.body.customer_id;
    db.query(updatequery,[req.body.firstname, req.body.lastname, req.body.email,
    req.body.phone, req.body.username, req.body.password, isadmin_value],(err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/customer');
    }
    });
});    

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM customer WHERE customer_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
    if (err) {
        console.log(err);
        res.render('error');
    } else {
        res.redirect('/customer');
    }
    });
});


module.exports = router;
