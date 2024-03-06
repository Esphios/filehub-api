import express from 'express';
import { disableDirectoryController, disableFileController, getDirectoryController, getFileController, updateDirectoryController, updateFileController } from '../controllers/fileController';
import { authorizeUserByToken } from '../services/jwsServices';

const router = express.Router();
// Swagger Annotations
/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File management
 */

/**
 * @swagger
 * /files/directory/{dirId}:
 *   get:
 *     summary: Get directory details
 *     tags: [Files]
 *     description: Retrieve details of a directory by its ID
 *     parameters:
 *       - in: path
 *         name: dirId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the directory to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Directory details retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Directory not found
 */

router.get('/directory/:dirId', authorizeUserByToken, getDirectoryController);

/**
 * @swagger
 * /files/file/{fileId}:
 *   get:
 *     summary: Get file details
 *     tags: [Files]
 *     description: Retrieve details of a file by its ID
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the file to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File details retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: File not found
 */

router.get('/file/:fileId', authorizeUserByToken, getFileController);

/**
 * @swagger
 * /files/directories/{directoryId}:
 *   delete:
 *     summary: Disable directory
 *     tags: [Files]
 *     description: Disable directory by directory ID
 *     parameters:
 *       - in: path
 *         name: directoryId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Directory disabled successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.delete('/directories/:directoryId', authorizeUserByToken, disableDirectoryController);

/**
 * @swagger
 * /files/file/{fileId}:
 *   delete:
 *     summary: Disable file
 *     tags: [Files]
 *     description: Disable file by file ID
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: File disabled successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.delete('/file/:fileId', authorizeUserByToken, disableFileController);

/**
 * @swagger
 * /files/directories/{directoryId}:
 *   put:
 *     summary: Update directory
 *     tags: [Files]
 *     description: Update directory by directory ID
 *     parameters:
 *       - in: path
 *         name: directoryId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Directory updated successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.put('/directories/:directoryId', authorizeUserByToken, updateDirectoryController);

/**
 * @swagger
 * /files/file/{fileId}:
 *   put:
 *     summary: Update file
 *     tags: [Files]
 *     description: Update file by file ID
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: File updated successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.put('/file/:fileId', authorizeUserByToken, updateFileController);


export default router;
