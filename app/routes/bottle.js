const express = require("express");
const router = express.Router();
const db = require("../database");

// Swagger doc for /api/bottle/create
/**
 * @swagger
 * /api/bottle/create:
 *   post:
 *     summary: Create a new bottle http://localhost:3000/api/bottle/create?weight=123&name=bottle&user_id=1
 *     parameters:
 *       - name: weight
 *         in: query
 *         type: integer
 *         required: true
 *         description: The weight of the bottle.
 *       - name: name
 *         in: query
 *         type: string
 *         required: true
 *         description: The name of the bottle.
 *       - name: user_id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The user ID associated with the bottle.
 *     responses:
 *       '200':
 *         description: Bottle created successfully
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
// Create a new bottle on /api/bottle/create
router.post("/create", async (req, res) => {
    try {
        // Get bottle weight, name, and user ID from request body
        const { weight, name, user_id } = req.query;
        // Check if bottle weight, name, and user ID are valid
        if ( !weight || !name || !user_id ) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Insert bottle into the database
        await db.query(
            "INSERT INTO bottle (weight, name, user_id) VALUES (?, ?, ?)",
            [weight, name, user_id]
        );
        // Return success message
        return res.status(200).json({ data: "bottle created" });
    } catch (error) {
        // Catch and log error   
        console.error("Error inserting into the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Swagger doc for /api/bottle/rename
/**
 * @swagger
 * /api/bottle/rename:
 *   put:
 *     summary: Rename a bottle http://localhost:3000/api/bottle/rename?id=1&newname=newname
 *     parameters:
 *       - name: id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The ID of the bottle to be renamed.
 *       - name: newname
 *         in: query
 *         type: string
 *         required: true
 *         description: The new name for the bottle.
 *     responses:
 *       '200':
 *         description: Bottle updated successfully
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
// Rename a bottle on /api/bottle/rename
router.put("/rename", async (req, res) => {
    try {
        // Get bottle ID and new name from request body
        const { id, newname } = req.query;
        // Check if bottle ID and new name are valid
        if (!id || !newname) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Update bottle in the database
        await db.query(
            "UPDATE bottle SET name = ? WHERE id = ?",
            [newname, id]
        );
        // Return success message
        return res.status(200).json({ data: "bottle updated" });
    } catch (error) {
        // Catch and log error
        console.error("Error updating the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

// Swagger doc for /api/bottle/updateweight
/**
 * @swagger
 * /api/bottle/delete:
 *   delete:
 *     summary: Delete a bottle http://localhost:3000/api/bottle/delete?id=1
 *     parameters:
 *       - name: id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The ID of the bottle to be deleted.
 *     responses:
 *       '200':
 *         description: Bottle deleted successfully
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
// Delete a bottle on /api/bottle/delete
router.delete("/delete", async (req, res) => {
    try {
        // Get bottle ID from request body
        const { id } = req.query;
        // Check if bottle ID is valid
        if (!id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Delete bottle from the database
        await db.query(
            "DELETE FROM bottle WHERE id = ?",
            [id]
        );
        // Return success message
        return res.status(200).json({ data: "bottle deleted" });
    } catch (error) {
        //  Catch and log error
        console.error("Error deleting from the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

// Swagger doc for /api/bottle/updateweight
/**
 * @swagger
 * /api/bottle/get:
 *   get:
 *     summary: Get information about a bottle http://localhost:3000/api/bottle/get?id=1
 *     parameters:
 *       - name: id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The ID of the bottle to retrieve information.
 *     responses:
 *       '200':
 *         description: Successfully retrieved bottle information
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               description: Bottle information
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
// Get information about a bottle on /api/bottle/get
router.get("/get", async (req, res) => {
    try {
        // Get bottle ID from request body
        const { id } = req.query;
        // Check if bottle ID is valid
        if (!id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        // Query the database for the bottle
        const results = await db.query(
            "SELECT * FROM bottle WHERE id = ?",
            [id]
        );
        // Return success message
        return res.status(200).json({ data: results });
    } catch (error) {
        // Catch and log error
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

// Swagger doc for /api/bottle/updateweight
/**
 * @swagger
 * /api/bottle/getalluser:
 *   get:
 *     summary: Get information about a bottle http://localhost:3000/api/bottle/get?user_id=1
 *     parameters:
 *       - name: user_id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The ID of the bottle to retrieve information.
 *     responses:
 *       '200':
 *         description: Successfully retrieved bottle information
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               description: Bottle information
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
//  Get information about a bottle on /api/bottle/get
router.get("/getalluser", async (req, res) => {
    try {
        // Get bottle ID from request body
        const { user_id } = req.query;
        // Check if bottle ID is valid
        if (!user_id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        //  Query the database for the bottle
        const results = await db.query(
            "SELECT * FROM bottle WHERE user_id = ?",
            [user_id]
        );
        // Return success message
        return res.status(200).json({ data: results });
    } catch (error) {
        // Catch and log error
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

// Swagger doc for /api/bottle/updateweight
/**
 * @swagger
 * /api/bottle/getall:
 *   get:
 *     summary: Retrieve all bottles from the database. http://localhost:3000/api/bottle/getall
 *     description: Fetches all bottle records from the database.
 *     responses:
 *       '200':
 *         description: A list of all bottles retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bottle'
 *       '500':
 *         description: Internal Server Error.
 */
// Get all bottles on /api/bottle/getall
router.get("/getall", async (req, res) => {
    try {
        // Query the database for all bottles
        const results = await db.query(
            "SELECT * FROM bottle"
        );
        // Return success message
        return res.status(200).json({ data: results });
    } catch (error) {
        //  Catch and log error
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;