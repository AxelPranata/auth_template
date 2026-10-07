const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Create new user
async function createUser(username, email, passwordHash) {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const query = `
            INSERT INTO Users (Username, Email, PasswordHash)
            VALUES (@username, @email, @passwordHash);
        `

        const request = await connection.request();
        request.input("username", sql.VarChar(50), username.trim());
        request.input("email", sql.VarChar(50), email.trim().toLowerCase());
        request.input("passwordHash", sql.VarChar(255), passwordHash.trim());

        const response = await request.query(query);
        return response;
    }
    catch (error) {
        console.error(`Database error: ${error}`);
        throw error;
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (error) {
                console.log(`Error closing database connection: ${error}`);
            }
        }
    }
}

// Get user from provided email
async function getUserByEmail(email) {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const query = `
            SELECT UserID, Username, Email, PasswordHash FROM Users WHERE Email = @email;
        `

        const request = await connection.request();
        request.input("email", sql.VarChar(50), email.trim().toLowerCase());
        
        const response = await request.query(query);
        return response.recordset[0];
    }
    catch (error) {
        console.error(`Database error: ${error}`);
        throw error;
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (error) {
                console.log(`Error closing database connection: ${error}`);
            }
        }
    }
}

module.exports = {
    createUser,
    getUserByEmail,
}