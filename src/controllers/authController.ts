import { Request, Response } from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, giveFilePermission as grantFilePermission, giveDirPermission as grantDirPermission, updateUser, disableUser } from '../services/authService';
import { extractTokenFromRequest } from '../services/jwsServices'

export const registerUserController = async (req: Request, res: Response) => {
  const { name, email, password, role_id } = req.body;
  if (!name || !email || !password || !role_id) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  try {
    let response = await registerUser(name, email, password, role_id, extractTokenFromRequest(req));
    return res.status(response.status).json({ message: response.message });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const token = await loginUser(email, password);
    if (token) {
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    if (await forgotPassword(email))
      return res.status(200).json({ message: 'Password reset email sent' });
    return res.status(500).json({ message: 'Internal server error' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, password } = req.query;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required in the query parameters' });
  }

  try {
    await resetPassword(token as string, password as string);
    return res.status(200).json({ message: `Password reset successful. Your new password is: "${password}"` });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const grantFilePermissionController = async (req: Request, res: Response) => {
  try {
    const providerId: number = req.body.user.id;
    const receiverId: number = req.body.receiverId;
    const fileId: number = req.body.fileId;

    if (receiverId == null || fileId == null)
      return res.status(400).json({ message: 'Missing Parameter (receiverId and fileId required)' });

    const canRead: boolean = req.body.canRead || false;
    const canWrite: boolean = req.body.canWrite || false;
    const canShare: boolean = req.body.canShare || false;
    const canDelete: boolean = req.body.canDelete || false;
    const isRecursive: boolean = req.body.isRecursive || false;

    const result = await grantFilePermission(providerId, receiverId, fileId, canRead, canWrite, canShare, canDelete, isRecursive);
    return res.status(result.status).json({ message: result.message });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const grantDirPermissionController = async (req: Request, res: Response) => {
  try {
    const providerId: number = req.body.user.id;
    const receiverId: number = req.body.receiverId;
    const directoryId: number = req.body.directoryId;

    if (receiverId == null || directoryId == null)
      return res.status(400).json({ message: 'Missing Parameter (receiverId and directoryId required)' });

    const canRead: boolean = req.body.canRead || false;
    const canWrite: boolean = req.body.canWrite || false;
    const canShare: boolean = req.body.canShare || false;
    const canDelete: boolean = req.body.canDelete || false;
    const isRecursive: boolean = req.body.isRecursive || false;

    const result = await grantDirPermission(providerId, receiverId, directoryId, canRead, canWrite, canShare, canDelete, isRecursive);
    return res.status(result.status).json({ message: result.message });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const updateUserController = async (req: Request, res: Response): Promise<any> => {
    const { userId, name, email, password, roleId, rootDir } = req.body;
    try {
        const result = await updateUser(userId, name, email, password, roleId, rootDir);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while updating user' });
    }
};

export const disableUserController = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    try {
        const result = await disableUser(parseInt(userId));
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error disabling user:', error);
        return res.status(500).json({ status: 'error', message: 'An error occurred while disabling user' });
    }
};