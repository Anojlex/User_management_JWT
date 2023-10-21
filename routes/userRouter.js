var express = require('express')

var router = express.Router();

const userController=require("../controllers/userController")



router.post('/register', userController.userRegistration)

router.post('/login', userController.verifyLogin)

router.get('/getUsers', userController.fetchUserData)

router.get('/getSingleUser', userController.fetchSingleUserData)

router.post('/updateUser', userController.updateUser)

router.post('/deleteUser', userController.deleteUser)

router.post('/adminlogin', userController.verifyAdminLogin)

router.get('/getNewAccessToken', userController.generateNewAccessToken)

module.exports = router;
