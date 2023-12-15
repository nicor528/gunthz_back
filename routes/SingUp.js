/**
 * @swagger
 * tags:
 *   name: SingUp
 *   description: SingUp operations
 */

const express = require('express');
const { getID, createID, createUser, generateAlphanumericCode, setNewKey } = require('../apis/apiDynamoDB');
const { SingUpEmail1 } = require('../apis/apiAuth');
const { getRot } = require('../apis/apiSpotify');
const router = express.Router();

/**
 * @swagger
 * /api/singup/test:
 *   get:
 *     summary: Test the SingUp route
 *     tags: [SingUp]
 *     responses:
 *       200:
 *         description: Test successful
 *         content:
 *           application/json:
 *             example:
 *               message: Test successful
 */
router.get("/test", (req,res) => {
    console.log("test")
    res.status(200).send("holaaaa")
})

/**
 * @swagger
 * /api/singup/singUpGoogle:
 *   post:
 *     summary: SingUp using Google
 *     tags: [SingUp]
 *     requestBody:
 *       description: User data for Google SignUp
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               user:
 *                 type: object
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: SignUp successful
 *         content:
 *           application/json:
 *             example:
 *               id: 12345
 *               key: abc123
 *       400:
 *         description: Bad connection with DB
 *         content:
 *           application/json:
 *             example:
 *               error: Bad connection with DB
 */
router.post("/singUpGoogle", async (req, res) => {
    const uid = req.body.uid;
    const name = req.body.name;
    const email = req.body.email;
    const lastName = req.body.lastName;
    const country = req.body.country;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const description = req.body.description;
    if(uid && name && email && lastName && country && city && state && zip && description){
        getID(uid).then(() => {
            res.status(401).send({message: "User already exist", status: false})
        }).catch(error => {
            if(error == 1){
                createID(uid).then(id => {
                    getRot(email).then(rot => {
                        createUser(id, name, email, "", lastName, country, city, state, zip, description, rot).then(async (token) => {
                            const key = await generateAlphanumericCode();
                            setNewKey(id, key).then(async () => {
                                const data = await {
                                    id: id,
                                    key: key,
                                    chatToken: token
                                }
                                res.status(200).send({data: data, status: true, message: "registration succefull"})
                            }).catch(error => {res.status(400).send({error, status: false})})
                        }).catch(error => {
                            console.log(error)
                            res.status(400).send({error, status:false})
                        })
                    }).catch(error => {res.status(400).send({error, status:false})})
                }).catch(error => {res.status(400).send({error, status:false})})
            }else{
                res.status(401).send({error, status:false})
            }
        })
        
    }else{
        res.status(401).send({message: "Missing data in the body", status:false})
    }
})

/**
 * @swagger
 * /api/singup/singUpEmail:
 *   post:
 *     summary: SingUp using email and password
 *     tags: [SingUp]
 *     requestBody:
 *       description: User data for Email SingUp
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: SingUp successful
 *         content:
 *           application/json:
 *             example:
 *               id: 12345
 *               key: abc123
 *       400:
 *         description: Bad connection with DB
 *         content:
 *           application/json:
 *             example:
 *               error: Bad connection with DB
 */
router.post("/singUpEmail", async (req, res) => {
    console.log(req.body)
    const name = req.body.name;
    //const uid = req.body.uid;
    const email = req.body.email;
    const pass = req.body.pass;
    const lastName = req.body.lastName;
    const country = req.body.country;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const description = req.body.description;
    if(name && email && pass && lastName && country && city && state && zip && description){
        SingUpEmail1(email, pass).then(user1 => {
            createID(user1.uid).then(id => {
                //getRot(email).then(rot => {
                    createUser(id, name, email, pass, lastName, country, city, state, zip, description).then(async (token) => {
                        const key = await generateAlphanumericCode();
                        setNewKey(id, key).then(async () => {
                                    const data = await {
                                        id: id,
                                        key: key,
                                        chatToken: token
                                    }
                                    res.status(200).send({data, status: true, message: "Success"})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {
                        console.log(error)
                    })
                //}).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(async (error) => {
            if(error == 1){
                res.status(401).send({message: "email already in use", status: false})
            }if(error == 2){
                res.status(401).send({message: "To short password", status: false})
            }else{
                res.status(400).send(error)
            }
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

module.exports = router;