const express = require("express");
const router = express.Router();
const db = require("../database");

// Swagger doc for /api/user/register
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user http://localhost:3000/api/user/register?email=user@example.com&username=john_doe&password=secretpassword
 *     parameters:
 *       - name: email
 *         in: query
 *         type: string
 *         required: true
 *         description: The email address of the user.
 *       - name: username
 *         in: query
 *         type: string
 *         required: true
 *         description: The username of the user.
 *       - name: password
 *         in: query
 *         type: string
 *         required: true
 *         description: The password for the user.
 *     responses:
 *       '200':
 *         description: User created successfully
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *               description: Success message
 *       '400':
 *         description: Bad Request. Check request payload.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
*/
// Create a new user on /api/user/register
router.post("/register", async (req, res) => {
    try {
        // Get user email, username and password from request body
        const { email, username, password } = req.query;
        // Check if user email, username and password are valid
        if (!email || !username || !password) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Check if user email already exists
        const results = await db.query(
            'SELECT email FROM user WHERE email=?', [email]
        )
        // If user email already exists, return error message
        if (results === !undefined || results.length !== 0) {
            return res.status(400).json({ error: "Email already exists" });
        }
        // Hash password
        const hashPassword = await Bun.password.hash(password)
        // Insert user into the database
        await db.query(
            'INSERT INTO user (email, password, username) VALUES (?, ?, ?)',
            [email, hashPassword, username]
        );
        // Return success message
        return res.status(200).json({ data: "user created" });
    } catch (error) {
        // Catch and log error
        console.error("Error inserting into the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Swagger doc for /api/user/login
/**
 * @swagger
 * /api/user/login:
 *   get:
 *     summary: User login http://localhost:3000/api/user/register?email=user@example.com&password=secretpassword

 *     parameters:
 *       - name: email
 *         in: query
 *         type: string
 *         required: true
 *         description: The email address of the user.
 *       - name: password
 *         in: query
 *         type: string
 *         required: true
 *         description: The password for the user.
 *     responses:
 *       '200':
 *         description: Login successful
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *               description: Success message
 *             user:
 *               type: integer
 *               description: User ID
 *       '400':
 *         description: Bad Request. Check request payload.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
 *       '401':
 *         description: Unauthorized. Invalid credentials.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
*/
// User login on /api/user/login
router.get("/login", async (req, res) => {
    try {
        // Get user email and password from request body
        const { email, password } = req.query;
        // Check if user email and password are valid
        if (!email || !password) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Check if user email exists
        const results = await db.query(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );
        // compare password with hash
        const isMatch = await Bun.password.verify(password, results[0].password)
        // If user email does not exist or password does not match, return error message
        if (results === undefined || results.length === 0 || isMatch === false) {
            return res.status(401).json({ error: "Unauthorized. Invalid credentials." });
        }
        // Return success message
        return res.status(200).json({ data: {result: "login successful", user: results[0].id}});
    } catch (error) {
        //  Catch and log error
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Swagger doc for /api/user/change
/**
 * @swagger
 * /api/user/change:
 *   put:
 *     summary: Rename user information http://localhost:3000/api/user/rename?id=1&[newname, newemail, newpassword]=123
 *     parameters:
 *       - name: id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The ID of the user to be renamed.
 *       - name: newname
 *         in: query
 *         type: string
 *         required: false
 *         description: The new name for the user.
 *       - name: newemail
 *         in: query
 *         type: string
 *         required: false
 *         description: The new email for the user.
 *       - name: newpassword
 *         in: query
 *         type: string
 *         required: false
 *         description: The new password for the user.
 *     responses:
 *       '200':
 *         description: User information updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message
 *       '400':
 *         description: Bad Request. Check request payload.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
 *       '404':
 *         description: User not found.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
*/
//  Update user information on /api/user/change
router.put("/change", async (req, res) => {
    try {
        // Get user ID, new name, new email and new password from request body
        const { id, newname, newemail, newpassword } = req.query;
        // Check if user ID, new name, new email and new password are valid
        if (!id || (!newname && !newemail && !newpassword)) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Check if user ID exists
        const results = await db.query(
            "SELECT * FROM user WHERE id = ?",
            [id]
        );
        // If user ID does not exist, return error message
        if ( results !== undefined && results.length > 0) {
            let updateFields = [];
            let updateValues = [];
            // Update username`
            if (newname) {
                updateFields.push("username = ?");
                updateValues.push(newname);
            }
            // Update email
            if (newemail) {
                updateFields.push("email = ?");
                updateValues.push(newemail);
            }
            // Update password
            if (newpassword) {
                updateFields.push("password = ?");
                // Hash password
                const hashPassword = await Bun.password.hash(newpassword)
                updateValues.push(hashPassword);
            }
            // Update user information in the database
            const updateQuery = `UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`;
            const updateParams = [...updateValues, id];
            
            await db.query(updateQuery, updateParams);
            // Return success message
            return res.status(200).json({ message: "User information updated successfully." });
        } else {
            // If user ID does not exist, return error message
            return res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        // Catch and log error
        console.error("Error querying/updating the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Swagger doc for /api/user/delete
/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Delete a user http://localhost:3000/api/user/delete?id=1
 *     parameters:
 *       - name: id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The ID of the user to be deleted.
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message
 *       '400':
 *         description: Bad Request. Check request payload.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
 *       '404':
 *         description: User not found.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
*/
// Delete a user on /api/user/delete
router.delete("/delete", async (req, res) => {
    try {
        //  Get user ID from request body
        const { id } = req.query;

        if (!id) {
            // Check if user ID is valid
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Check if user ID exists
        const results = await db.query(
            "SELECT * FROM user WHERE id = ?",
            [id]
        );
        // If user ID does not exist, return error message
        if (results.length > 0) {
            await db.query(
                "DELETE FROM user WHERE id = ?",
                [id]
            );
            // Return success message
            return res.status(200).json({ message: "User deleted successfully." });
        } else {
            // If user ID does not exist, return error message
            console.log("User not found.");
            return res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        // Catch and log error
        console.error("Error querying/deleting from the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Swagger doc for /api/user/get
/**
 * @swagger
 * /api/user/get:
 *   get:
 *     summary: Retrieve a user by ID. http://localhost:3000/api/waterdata/get?id=1
 *     description: Fetches a user from the database based on the provided ID.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID of the user to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: User record retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad Request. The ID parameter is missing or invalid.
 *       '500':
 *         description: Internal Server Error.
 */
// Get a user on /api/user/get
router.get("/get", async (req, res) => {
    try {
        // Get user ID from request body
        const { id } = req.query;

        if (!id) {
            //  Check if user ID is valid
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Get user from the database
        const results = await db.query(
            "SELECT * FROM user WHERE id = ?",
            [id]
        );

        // success message
        return res.status(200).json({ data: results });
    } catch (error) {
        // Catch and log error
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Swagger doc for /api/user/getall
/**
 * @swagger
 * /api/user/getall:
 *   get:
 *     summary: Retrieve all users from the database. http://localhost:3000/api/user/getall
 *     description: Fetches all user records from the database.
 *     responses:
 *       '200':
 *         description: A list of all users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal Server Error.
 */
// Get all users on /api/user/getall
router.get("/getall", async (req, res) => {
    try {
        // Get all users from the database
        const results = await db.query(
            "SELECT * FROM user"
        );
        // Return success message
        return res.status(200).json({ data: results });
    } catch (error) {
        // Catch and log error
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;