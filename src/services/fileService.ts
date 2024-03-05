import { QueryResult } from 'pg';
import { db } from './databaseService';

export const getDirectory = async (user: any, dirId: number | null) => {
    try {
        if (dirId == null) {
            dirId = user.rootDir;
            if (dirId == null)
                return { status: 400, message: 'Parameter dirId is missing' }
        }

        const userPermissions = (await db.getPermissionForDirectory(user.id, dirId)).rows[0];
        if (!userPermissions.can_read_out)
            return { status: 403, message: 'Insufficient permissions' }

        const parentDirectories: QueryResult = await db.getParentDirectories(dirId);
        const itemsInDir: QueryResult = await db.getItemsInDir(dirId);

        return {
            status: 200, message: 'Directory retrieved successfully', data: {
                parentDirectories: parentDirectories.rows,
                itemsInDir: itemsInDir.rows
            }
        };
    }
    catch (error) {
        return { status: 500, message: 'Internal server error' }
    }
}

export const getFile = async (user: any, fileId: number): Promise<any> => {
    try {
        const userPermissions = (await db.getPermissionForFile(user.id, fileId)).rows[0];
        if (!userPermissions.can_read_out)
            return { status: 403, message: 'Insufficient permissions' }

        const file = (await db.getFileContent(fileId)).rows[0];

        return { status: 200, message: 'Directory retrieved successfully', data: { file } };
    }
    catch (error) {
        return { status: 500, message: 'Internal server error' }
    }
}
