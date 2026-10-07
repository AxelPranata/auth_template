# Authentication Template

This repository provides a basic template for authenticating a user.
It includes features like signing up, signing in, and signing out.
It utilizes multiple modules listed below. 

## Dependencies

| Module          | Purpose                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `bcrypt`        | Hashes user passwords before storing them in the database and compares passwords during sign-in.  |
| `cookie-parser` | Parses cookies from incoming requests so authentication tokens stored in cookies can be accessed. |
| `dotenv`        | Loads environment variables from the `.env` file, such as database credentials and JWT secrets.   |
| `express`       | Provides the backend server, API routes, and request/response handling.                           |
| `jsonwebtoken`  | Creates and verifies JSON Web Tokens (JWTs) for access and refresh token authentication.          |
| `ms`            | Converts time values such as `15m` and `7d` into milliseconds for token expiration settings.  |
| `mssql`         | Connects to the Microsoft SQL Server database and executes SQL queries.                           |

## Database Format (Users)

| UserID | Username       | Email            | PasswordHash                        |
| ------ | ---------------| ---------------- | ----------------------------------- |
| 1      | WHYAHK         | test@email.com   | $2b$1KaBDhILvnDUsEEe.yIV./xUvzqzfs6 |

<br><br>

# Running Project

## 1. Install dependencies

Run the following command in the root of the project directory:

```
npm ci
```

## 2. Setup database on local Microsoft SQL Server

Open your local Microsoft SQL Server app, use or create a new database, and run this code once to create the user table.

```sql
DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    UserID INT IDENTITY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CONSTRAINT PK_UserID PRIMARY KEY (UserID),
);
```

## 3. Start the backend Express server

Run the following command:

```
npm run dev
```

If it doesn't work, try running:

```
nodemon app.js
```

## 4. Access the website

Open the following link in your browser:

```
http://localhost:3000/
```

<br><br>

# Note
> Credentials such as `.env` files, database credentials are **NOT** included in this repository. Downloading the project from the repository would require additional setup for such files.

Here is what is needed in the `.env` file:
```
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_DATABASE=
DB_PORT=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
```