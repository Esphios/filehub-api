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

            
        const dir = (await db.getDirectory(dirId))?.rows[0];
        if (dir == null)
            return { status: 404, message: 'Directory not found', data: null };

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

        const file = (await db.getFile(fileId))?.rows[0];
        if (file == null)
            return { status: 404, message: 'Directory not found', data: null };

        return { status: 200, message: 'Directory retrieved successfully', data: { file } };
    }
    catch (error) {
        return { status: 500, message: 'Internal server error' }
    }
}

export const updateFile = async (fileId: number, filename: string, directoryId: number, fileContent: Buffer): Promise<any> => {
    if (fileId == null || filename == null || directoryId == null || fileContent == null) {
        return { status: 400, message: 'All parameters must be provided' };
    }
    try {
        await db.updateFile(fileId, filename, directoryId, fileContent);
        return { status: 200, message: 'File updated successfully' };
    } catch (error) {
        console.error('Error updating file:', error);
        return { status: 500, message: 'An error occurred while updating file' };
    }
}

export const updateDirectory = async (directoryId: number, directoryName: string, parentDirectoryId: number): Promise<any> => {
    if (directoryId == null || directoryName == null || parentDirectoryId == null) {
        return { status: 400, message: 'All parameters must be provided' };
    }
    try {
        await db.updateDirectory(directoryId, directoryName, parentDirectoryId);
        return { status: 200, message: 'Directory updated successfully' };
    } catch (error) {
        console.error('Error updating directory:', error);
        return { status: 500, message: 'An error occurred while updating directory' };
    }
}

export const disableFile = async (fileId: number): Promise<any> => {
    if (fileId == null) {
        return { status: 400, message: 'File ID must be provided' };
    }
    try {
        await db.disableFile(fileId);
        return { status: 200, message: 'File disabled successfully' };
    } catch (error) {
        console.error('Error disabling file:', error);
        return { status: 500, message: 'An error occurred while disabling file' };
    }
}

export const disableDirectory = async (directoryId: number): Promise<any> => {
    if (directoryId == null) {
        return { status: 400, message: 'Directory ID must be provided' };
    }
    try {
        await db.disableDirectory(directoryId);
        return { status: 200, message: 'Directory disabled successfully' };
    } catch (error) {
        console.error('Error disabling directory:', error);
        return { status: 500, message: 'An error occurred while disabling directory' };
    }
}
