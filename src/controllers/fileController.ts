import { Request, Response } from 'express';
import { disableDirectory, disableFile, getDirectory, getFile, updateDirectory, updateFile } from '../services/fileService';

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

export const updateFileController = async (req: Request, res: Response): Promise<any> => {
    const { fileId, filename, directoryId, fileContent } = req.body;
    try {
        const result = await updateFile(fileId, filename, directoryId, fileContent);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error updating file:', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while updating file' });
    }
};

export const updateDirectoryController = async (req: Request, res: Response): Promise<any> => {
    const { directoryId, directoryName, parentDirectoryId } = req.body;
    try {
        const result = await updateDirectory(directoryId, directoryName, parentDirectoryId);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error updating directory:', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while updating directory' });
    }
};

export const disableFileController = async (req: Request, res: Response): Promise<any> => {
    const { fileId } = req.params;
    try {
        const result = await disableFile(parseInt(fileId));
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error disabling file:', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while disabling file' });
    }
};

export const disableDirectoryController = async (req: Request, res: Response): Promise<any> => {
    const { directoryId } = req.params;
    try {
        const result = await disableDirectory(parseInt(directoryId));
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error disabling directory:', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while disabling directory' });
    }
};