import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = '06b017b1f10adec14d177b5f5c50689f09916303f1aef769a6eceff77c337cf6';

export const extractTokenFromRequest = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    return token || null;
};

export const verifyToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

export const authorizeUserByToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractTokenFromRequest(req);
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        req.body.user = await verifyToken(token);

        if (req.body.user != null) next();
        else return res.status(401).json({ message: 'Invalid token' });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const encryptToken = (data: any) => {
    return jwt.sign(data, secretKey, { expiresIn: '1h' });
}