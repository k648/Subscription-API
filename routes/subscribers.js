const express = require('express');
const authRole = require('../middleware/authorize')
const router  = express.Router();

router.use(express.json());


const auth = require ('../middleware/auth')

const  subscribersController = require ('../controllers/subscribers');

/**
 * @swagger
 * /api/v1/subscribers:
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
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: subscription created
 */

/**
 * @swagger
 * /api/v1/singleSubscriber/{subscription_id}:
 *   get:
 *     parameters:
 *       - name: subscription_id
 *         in: path
 *         required: true
 *         description: The ID of the subscriber
 *         schema:
 *           type: string  
 *     responses:
 *       200:
 *         description: A single subscriber object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscription_id:
 *                   type: string
 *                 # Add other subscriber properties here
 */


/**
 * @swagger
 * /api/v1/checkSubscriberStatus/{subscription_id}:
 *   get:
 *     parameters:
 *       - name: subscription_id
 *         in: path
 *         required: true
 *         description: The ID of the subscriber
 *         schema:
 *           type: string  
 *     responses:
 *       200:
 *         description: A single subscriber object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscription_id:
 *                   type: string
 *                 # Add other subscriber properties here
 */


/**
 * @swagger
 * /api/v1/checkunSubscriberStatus/{subscription_id}:
 *   get:
 *     parameters:
 *       - name: subscription_id
 *         in: path
 *         required: true
 *         description: The ID of the subscriber
 *         schema:
 *           type: string  
 *     responses:
 *       200:
 *         description: A single subscriber object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscription_id:
 *                   type: string
 *                 # Add other subscriber properties here
 */



/**
 * @swagger
 * /api/v1/unsubscribe/{subscription_id}:
 *   delete:
 *     security:  # Apply the security scheme for this route
 *       - BearerAuth: []  # Referencing the global security scheme
 *     parameters:
 *       - name: subscription_id
 *         in: path
 *         required: true
 *         description: The ID of the subscriber to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Subscriber successfully deleted
 */

/**
 * @swagger
 * /api/v1/updateSubscriber/{subscription_id}:
 *   patch:
 *     parameters:
 *       - name: subscription_id
 *         in: path
 *         required: true
 *         description: The ID of the subscriber to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscriber successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service_id:
 *                   type: string
 *                 phone_number:
 *                   type: string
 */


router.post('/subscribers',auth, subscribersController.subscribeUser )
router.delete('/unsubscribe/:subscription_id',auth,authRole('admin'),subscribersController.unsubscribeUser)
router.get('/singleSubscriber/:subscription_id',subscribersController.getSubscriber )
router.get('/checkSubscriberStatus/:subscription_id',subscribersController.checkSubscriberStatus )
router.get('/checkunSubscriberStatus/:subscription_id',subscribersController.checkunSubscriberStatus )
router.patch('/updateSubscriber/:subscription_id',auth,authRole('admin'),subscribersController.updateSubscriber)
module.exports = router