import { Pool, QueryResult } from 'pg';
require('dotenv').config();

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432
});

const query = async (text: string, params?: any[]): Promise<QueryResult> => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query:', { text, duration, rows: res.rowCount });
        return res;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
};

export const db = {

    create_admin: async (
        username: string,
        email: string,
        hashedPassword: string
    ): Promise<QueryResult> => {

        return await query('CALL filehub.create_admin($1, $2, $3);', [username, hashedPassword, email]);
    },
    create_user: async (
        username: string,
        email: string,
        hashedPassword: string
    ): Promise<QueryResult> => {

        return await query('CALL filehub.create_user($1, $2, $3);', [username, hashedPassword, email]);
    },
    create_guest: async (
        username: string,
        email: string,
        hashedPassword: string
    ): Promise<QueryResult> => {

        return await query('CALL filehub.create_guest($1, $2, $3);', [username, hashedPassword, email]);
    },

    loginUser: async (
        email: string,
        hashedPassword: string
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.users WHERE email = $1 AND password = $2', [email, hashedPassword]);
    },

    forgotPassword: async (
        email: string
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.users WHERE email = $1', [email]);
    },

    resetPassword: async (
        email: string,
        hashedPassword: string
    ): Promise<QueryResult> => {

        return await query('UPDATE filehub.users SET password = $1 WHERE email = $2', [hashedPassword, email]);
    },

    getFullPath: async (
        dirId: number
    ): Promise<QueryResult> => {

        return await query('SELECT filehub.get_full_path($1);', [dirId]);
    },
    getItemsInDir: async (
        dirId: number
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.get_items_in_dir($1);', [dirId]);
    },
    getPermissionForDirectory: async (
        userId: number,
        dirId: number
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.get_recursive_permission($1, $2);', [userId, dirId]);
    },
    getPermissionForFile: async (
        userId: number,
        fileId: number
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.get_permission_for_file($1, $2);', [userId, fileId]);
    },
    getFileContent: async (
        fileId: number
    ): Promise<QueryResult> => {

        return await query('SELECT filename, file_content as content FROM filehub.files WHERE file_id = $1;', [fileId]);
    },
    getParentDirectories: async (
        dirId: number
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.get_parent_directories($1);', [dirId]);
    },
    getRootDirectory: async (
        userId: number
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.directories WHERE directory_id = (select root_dir FROM filehub.users WHERE user_id = $1) AND disabled_at IS null;', [userId]);
    },
    getDirectory: async (
        dirId: number
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.directories WHERE directory_id = $1 AND disabled_at IS null;', [dirId]);
    },
    getFile: async (
        fileId: number
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.files WHERE file_id = $1 AND disabled_at IS null;', [fileId]);
    },
    getUser: async (
        userId: number
    ): Promise<QueryResult> => {

        return await query('SELECT * FROM filehub.users WHERE user_id = $1 AND disabled_at IS null;', [userId]);
    },

    createDirectory: async (
        userId: number,
        parent_id: number | null,
        directory_name: string
    ): Promise<QueryResult> => {

        return await query('CALL filehub.create_directory($1, 2$, 3$);', [userId, directory_name, parent_id]);
    },
    createFile: async (
        userId: number,
        directoryId: number | null,
        fileName: string,
        fileContent: Buffer
    ): Promise<QueryResult> => {

        return await query('CALL filehub.create_file($1, 2$, 3$, 4$);', [userId, fileName, [fileContent], directoryId]);
    },
    createPermissionForFile: async (
        userId: number,
        fileId: number,
        canRead: boolean,
        canWrite: boolean,
        canShare: boolean,
        canDelete: boolean,
        isRecursive: boolean,
    ): Promise<QueryResult> => {

        return await query(
            'INSERT INTO filehub.permissions (user_id, file_id, can_read, can_write, can_delete, can_share, is_recursive) VALUES ($1, $2, $3, $4, $5, $6, $7);',
            [userId, fileId, canRead, canWrite, canShare, canDelete, isRecursive]
        );
    },
    createPermissionForDirectory: async (
        userId: number,
        directoryId: number,
        canRead: boolean,
        canWrite: boolean,
        canShare: boolean,
        canDelete: boolean,
        isRecursive: boolean,
    ): Promise<QueryResult> => {

        return await query(
            'INSERT INTO filehub.permissions (user_id, directory_id, can_read, can_write, can_delete, can_share, is_recursive) VALUES ($1, $2, $3, $4, $5, $6, $7);',
            [userId, directoryId, canRead, canWrite, canShare, canDelete, isRecursive]
        );
    },
    updateUser: async (
        userId: number,
        name: string,
        email: string,
        password: string,
        roleId: number,
        rootDir: number | null
    ): Promise<QueryResult> => {
        return await query(
            `UPDATE filehub.users
           SET name = $1, email = $2, password = $3, role_id = $4, root_dir = $5, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $6`,
            [name, email, password, roleId, rootDir, userId]
        );
    },
    updateFile: async (
        fileId: number,
        filename: string,
        directoryId: number | null,
        fileContent: Buffer
    ): Promise<QueryResult> => {
        return await query(
            `UPDATE filehub.files
           SET filename = $1, directory_id = $2, file_content = $3, updated_at = CURRENT_TIMESTAMP
           WHERE file_id = $4`,
            [filename, directoryId, fileContent, fileId]
        );
    },
    updateDirectory: async (
        directoryId: number,
        directoryName: string,
        parentDirectoryId: number | null
    ): Promise<QueryResult> => {
        return await query(
            `UPDATE filehub.directories
           SET directory_name = $1, parent_directory_id = $2, updated_at = CURRENT_TIMESTAMP
           WHERE directory_id = $3`,
            [directoryName, parentDirectoryId, directoryId]
        );
    },
    disableFile: async (fileId: number): Promise<QueryResult> => {
        return await query(
            `UPDATE filehub.files
           SET disabled_at = CURRENT_TIMESTAMP
           WHERE file_id = $1`,
            [fileId]
        );
    },
    disableDirectory: async (directoryId: number): Promise<QueryResult> => {
        return await query('SELECT filehub.disable_directory_recursive($1);', [directoryId]);
    },
    disableUser: async (userId: number): Promise<QueryResult> => {
        return await query('SELECT filehub.disable_user($1);', [userId]);
    }
};