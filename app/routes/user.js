const express = require("express");
const router = express.Router();
const db = require("../database");

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
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.query;

        if (!email || !username || !password) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        const results = await db.query(
            'SELECT email FROM user WHERE email=?', [email]
        )
        
        if (results === !undefined || results.length !== 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashPassword = await Bun.password.hash(password)

        await db.query(
            'INSERT INTO user (email, password, username) VALUES (?, ?, ?)',
            [email, hashPassword, username]
        );

        console.log("User successfully inserted into the database");
        return res.status(200).json({ data: "user created" });
    } catch (error) {
        console.error("Error inserting into the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

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
router.get("/login", async (req, res) => {
    try {
        const { email, password } = req.query;

        if (!email || !password) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        const results = await db.query(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );
        
        const isMatch = await Bun.password.verify(password, results[0].password)

        if (results === undefined || results.length === 0 || isMatch === false) {
            return res.status(401).json({ error: "Unauthorized. Invalid credentials." });
        }

        return res.status(200).json({ data: {result: "login successful", user: results[0].id}});
    } catch (error) {
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

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
router.put("/change", async (req, res) => {
    try {
        const { id, newname, newemail, newpassword } = req.query;

        if (!id || (!newname && !newemail && !newpassword)) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        const results = await db.query(
            "SELECT * FROM user WHERE id = ?",
            [id]
        );

        if ( results !== undefined && results.length > 0) {
            let updateFields = [];
            let updateValues = [];

            if (newname) {
                updateFields.push("username = ?");
                updateValues.push(newname);
            }

            if (newemail) {
                updateFields.push("email = ?");
                updateValues.push(newemail);
            }

            if (newpassword) {
                updateFields.push("password = ?");
                const hashPassword = await Bun.password.hash(newpassword)
                updateValues.push(hashPassword);
            }

            const updateQuery = `UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`;
            const updateParams = [...updateValues, id];

            await db.query(updateQuery, updateParams);

            return res.status(200).json({ message: "User information updated successfully." });
        } else {
            return res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        console.error("Error querying/updating the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

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
router.delete("/delete", async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        const results = await db.query(
            "SELECT * FROM user WHERE id = ?",
            [id]
        );

        if (results.length > 0) {
            await db.query(
                "DELETE FROM user WHERE id = ?",
                [id]
            );

            return res.status(200).json({ message: "User deleted successfully." });
        } else {
            console.log("User not found.");
            return res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        console.error("Error querying/deleting from the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

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
router.get("/get", async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        const results = await db.query(
            "SELECT * FROM user WHERE id = ?",
            [id]
        );

        return res.status(200).json({ data: results });
    } catch (error) {
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

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
router.get("/getall", async (req, res) => {
    try {
        const results = await db.query(
            "SELECT * FROM user"
        );

        return res.status(200).json({ data: results });
    } catch (error) {
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;