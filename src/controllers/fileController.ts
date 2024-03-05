import { Request, Response } from 'express';
import { getDirectory, getFile } from '../services/fileService';

export const getDirectoryController = async (req: Request, res: Response): Promise<any> => {
  const dirId: number | null = parseInt(req.params.dirId);
  try {
    let result = await getDirectory(req.body.user, dirId)

    return res.status(result.status).json({
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error fetching directory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch directory',
      error: error
    });
  }
};

export const getFileController = async (req: Request, res: Response): Promise<any> => {
  const fileId: number = parseInt(req.params.fileId);
  try {
    let result = await getFile(req.body.user, fileId)

    if (result.status === 200) {
      res.setHeader('Content-Disposition', `attachment; filename=${result.data!.file.filename}`);
      return res.send(result.data!.file.content);
    }

    return res.status(result.status).json({
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file',
      error: error
    });
  }
};