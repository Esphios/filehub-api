import express from 'express';
import { getDirectoryController, getFileController } from '../controllers/fileController';
import { authorizeUserByToken } from '../services/jwsServices';

const router = express.Router();

/**
 * @swagger
 * /auth/directory/{dirId}:
 *   get:
 *     summary: Get directory details
 *     description: Retrieve details of a directory by its ID
 *     parameters:
 *       - in: path
 *         name: dirId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the directory to retrieve
 *     security:
 *       - BearerAuth: []
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
 * /auth/file/{fileId}:
 *   get:
 *     summary: Get file details
 *     description: Retrieve details of a file by its ID
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the file to retrieve
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: File details retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: File not found
 */

router.get('/file/:fileId', authorizeUserByToken, getFileController);

export default router;
