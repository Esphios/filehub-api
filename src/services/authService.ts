import crypto from 'crypto';
import { db } from './databaseService';
import { MailOptions, sendMail } from './smtpService'
import { readFileSync } from 'fs';
import { encryptToken, verifyToken } from './jwsServices';

export const registerUser = async (
    name: string,
    email: string,
    password: string,
    roleId: number,
    token: string | null
): Promise<any> => {
    if (roleId == 1) {
        if (token == null)
            return { status: 400, message: 'Token is Required for this operation' };

        let user = await verifyToken(token);
        if (user.role != 1)
            return { status: 403, message: 'Insufficient permissions' };
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    try {
        switch (roleId) {
            case 1:
                await db.create_admin(name, email, hashedPassword);
                break;
            case 2:
                await db.create_user(name, email, hashedPassword);
                break;
            case 3:
                await db.create_guest(name, email, hashedPassword);
                break;
            default:
                return { status: 400, message: 'Token is Required for this operation' };
        }
        return { status: 201, message: 'User registered successfully' };
    } catch (e) {
        throw e;
    }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<string | null> => {

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const result = await db.loginUser(email, hashedPassword);

    if (result.rows.length === 1) {
        return encryptToken({
            email: email,
            name: result.rows[0].name,
            role: result.rows[0].role_id,
            id: result.rows[0].user_id,
            rootDir: result.rows[0].root_dir
        });
    } else {
        return null;
    }
};

export const forgotPassword = async (email: string): Promise<boolean> => {
    let ret = false;
    try {
        const result = await db.forgotPassword(email);
        if (result.rows.length === 1) {
            ret = await sendPasswordResetEmail(email, encryptToken({ email }));
            console.log('Password reset email sent');
        } else {
            ret = false;
            console.log('Email not found');
        }
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
    return ret;
};

const sendPasswordResetEmail = async (email: string, token: string) => {
    const htmlTemplate = readFileSync('./src/assets/forgotPasswordTemplate.html', 'utf-8');

    const resetLink = `http://localhost:3000/reset-password?token=${token}&password=${generateRandomPassword()}`;
    const htmlContent = htmlTemplate.replace('{resetLink}', resetLink);

    const mailOptions: MailOptions = {
        to: email,
        subject: 'Password Reset Request',
        html: htmlContent,
    }

    return await sendMail(mailOptions);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
        const decodedToken = await verifyToken(token) as { email: string };
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

        await db.resetPassword(decodedToken.email, hashedPassword);
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

const comparePermissions = (providerPermissions: any, receiverPermissions: any): boolean => {
    if (
        (providerPermissions.can_share_out === false) ||
        (providerPermissions.can_read_out === false && receiverPermissions.canRead) ||
        (providerPermissions.can_write_out === false && receiverPermissions.canWrite) ||
        (providerPermissions.can_delete_out === false && receiverPermissions.canDelete) ||
        (providerPermissions.is_recursive_out === false && receiverPermissions.isRecursive)
    ) return false;
    return true;
}

export const giveFilePermission = async (
    providerId: number,
    receiverId: number,
    fileId: number,
    canRead: boolean,
    canWrite: boolean,
    canShare: boolean,
    canDelete: boolean,
    isRecursive: boolean,
): Promise<any> => {
    try {
        const giverPermissions = (await db.getPermissionForFile(providerId, fileId)).rows[0];
        const receiverPermissions = { canRead, canWrite, canShare, canDelete, isRecursive };

        if (!comparePermissions(giverPermissions, receiverPermissions))
            return { status: 403, message: 'Insufficient permissions' };

        await db.createPermissionForFile(receiverId, fileId, canRead, canWrite, canShare, canDelete, isRecursive);

        return { status: 201, message: 'Created permissions successfully' };
    }
    catch (error) {
        console.error('Error in giveFilePermission:', error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

export const giveDirPermission = async (
    providerId: number,
    receiverId: number,
    dirId: number,
    canRead: boolean,
    canWrite: boolean,
    canShare: boolean,
    canDelete: boolean,
    isRecursive: boolean,
): Promise<any> => {
    try {
        const giverPermissions = await db.getPermissionForDirectory(providerId, dirId);
        const receiverPermissions = { canRead, canWrite, canShare, canDelete, isRecursive };

        if (!comparePermissions(giverPermissions, receiverPermissions))
            return { status: 403, message: 'Insufficient permissions' };

        await db.createPermissionForFile(receiverId, dirId, canRead, canWrite, canShare, canDelete, isRecursive);

        return { status: 201, message: 'Created permissions successfully' };
    }
    catch (error) {
        console.error('Error in giveDirPermission:', error);
        return { status: 500, message: 'Internal Server Error' };
    }
};

const generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!$*-_+';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
};