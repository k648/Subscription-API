var express = require('express');


var router  = express.Router();

router.use(express.json());

var  userController = require('../controllers/auth');
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - service_id
 *         - password
 *       properties:
 *         service_id:
 *           type: string
 *           description: The user's service_id
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - service_id
 *               - password
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       401:
 *         description: Invalid email or password
 */

router.post('/register', userController.registerUser)

router.post('/login', userController.loginUser)


module.exports = router;





