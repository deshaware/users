const router = require('express').Router();
const User = require('../../models/User');
const _ = require('lodash');
const auth = require('../../middleware/auth');

router.get('/all', auth, async ( req, res ) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({"error":error.message})
    }
});

router.post('/add', auth, async ( req, res) => {
    try {
        if(!req.body.firstName) throw new Error("Please provide firstName");
        if(!req.body.lastName) throw new Error("Please provide lastName");
        if(!req.body.email) throw new Error("Please provide email");
        let user = {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            age:req.body.age?req.body.age:null,
            hobby:req.body.hobby?req.body.hobby.split(','):[],
            createdBy:req.admin._id
        }
        const newUser = new User(user);
        await newUser.save();
        res.status(201).send({data:newUser});
    } catch (error) {
        res.status(400).send({"error":error.message})
    }
});

// get user with specific email
router.get('/get:email', auth, async (req, res) => {
    try {
        const user = User.find({email:req.params.email});
        if(!user) res.status(200).send({data:`No such user with email ${req.params.email}`});
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error:error.data})
    }
    
});


module.exports = router;