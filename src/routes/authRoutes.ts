import express from 'express';
import { authorizeUserByToken } from '../services/jwsServices';
import { 
  registerUserController, 
  loginUserController, 
  forgotPasswordController, 
  resetPasswordController, 
  grantFilePermissionController, 
  grantDirPermissionController,
  disableUserController,
  updateUserController
 } from '../controllers/authController';

const router = express.Router();
// Swagger Annotations
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Register a new user with provided credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               password:
 *                 type: string
 *             example:
 *               name: username
 *               email: user@mail.com
 *               role_id: 2
 *               password: password
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Invalid request body
 */

router.post('/register', registerUserController);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in user
 *     tags: [Auth]
 *     description: Log in user with provided credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: user@mail.com
 *               password: password
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       401:
 *         description: Unauthorized access
 */
router.post('/login', loginUserController);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send forgot password email
 *     tags: [Auth]
 *     description: Send an email to the user with instructions to reset the password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: user@mail.com
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       404:
 *         description: User not found
 */

router.post('/forgot-password', forgotPasswordController);

/**
 * @swagger
 * /auth/reset-password:
 *   get:
 *     summary: Reset password
 *     tags: [Auth]
 *     description: Reset user's password using reset token
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset token received via email
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: New password to be set
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid reset token
 */

router.get('/reset-password', resetPasswordController);


/**
 * @swagger
 * /auth/grant-file-permission:
 *   post:
 *     summary: Grant file permission
 *     tags: [Auth]
 *     description: Grant permission to access a file to a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: integer
 *               receiverId:
 *                 type: integer
 *               canRead:
 *                 type: boolean
 *             example:
 *               fileId: 1
 *               receiverId: 5
 *               canRead: true
 *     responses:
 *       200:
 *         description: Permission granted successfully
 *       401:
 *         description: Unauthorized access
 */

router.post('/grant-file-permission', authorizeUserByToken, grantFilePermissionController);

/**
 * @swagger
 * /auth/grant-directory-permission:
 *   post:
 *     summary: Grant directory permission
 *     tags: [Auth]
 *     description: Grant permission to access a directory to a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               directoryId:
 *                 type: integer
 *               receiverId:
 *                 type: integer
 *               canRead:
 *                 type: boolean
 *             example:
 *               directoryId: 3
 *               receiverId: 5
 *               canRead: true
 *     responses:
 *       200:
 *         description: Permission granted successfully
 *       401:
 *         description: Unauthorized access
 */
router.post('/grant-directory-permission', authorizeUserByToken, grantDirPermissionController);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Disable user
 *     tags: [Auth]
 *     description: Disable user by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User disabled successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */ 
router.delete('/users/:userId', authorizeUserByToken, disableUserController);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user
 *     tags: [Auth]
 *     description: Update user by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.put('/users/:userId', authorizeUserByToken, updateUserController);

export default router;
