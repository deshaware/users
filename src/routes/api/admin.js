const router = require('express').Router();
const Admin = require('../../models/Admin');
const _ = require('lodash');
const auth = require('../../middleware/auth');

router.post('/signup', async ( req, res ) => {
    try {
        const admin = new Admin(req.body)
        await admin.save()
        const token = await admin.generateAuthToken();
        res.status(201).send({admin,token});
    } catch (error) {
        res.status(400).send({error:error.message})
    }
});

// get me
router.get('/me', auth , async ( req, res ) => {
    const {admin,token} = req;
    res.status(200).send({admin,token})    
});


// log in and get the token
router.post('/login', async (req, res) => {
    try {
        console.log(req.body.email)
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await Admin.generateAuthToken()
        res.send({ admin, token })
    } catch (e) {
        res.status(400).send()
    }
});

//add users, required token,
router.post('/add', auth , async ( req , res) => {
    try {
        //validate user details
        
    } catch (error) {
        
    }
});

module.exports = router;