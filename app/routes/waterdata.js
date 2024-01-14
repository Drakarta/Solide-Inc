const express = require("express");
const router = express.Router();
const db = require("../database");

// Swagger doc for /api/waterdata/drink
/**
 * @swagger
 * /api/waterdata/drink:
 *   post:
 *     summary: Record water intake http://localhost:3000/api/waterdata/drink?id=1&water=123
 *     parameters:
 *       - name: id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The ID of the user recording water intake.
 *       - name: water
 *         in: query
 *         type: integer
 *         required: true
 *         description: The amount of water intake.
 *     responses:
 *       '200':
 *         description: Water intake record added successfully
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
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
*/
// Create water intake record on /api/waterdata/drink
router.post("/drink", async (req, res) => {
    try {
        // Get user ID and water intake from request body
        const { id, water } = req.query;
        
        // Check if user ID and water intake are valid
        if (!id || !water) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        
        // Insert water intake record into the database
        await db.query(
            'INSERT INTO waterdata (user_id, water_intake) VALUES (?, ?)',
            [id, water]
        );
        
        // Return success message
        return res.status(200).json({ message: "Water intake record added successfully." });
    } catch (error) {
        // Catch and log error
        console.error("Error inserting into the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Swagger doc for /api/waterdata/getdrink
/**
 * @swagger
 * /api/waterdata/getdrink:
 *   get:
 *     summary: Get recent water intake records http://localhost:3000/api/waterdata/getdrink?id=1
 *     parameters:
 *       - name: id
 *         in: query
 *         type: integer
 *         required: true
 *         description: The ID of the user to retrieve water intake records.
 *     responses:
 *       '200':
 *         description: Successfully retrieved water intake records
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               description: Array of water intake records
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
// Get recent water intake records on /api/waterdata/getdrink
router.get("/getdrink", async (req, res) => {
    try {
        // Get user ID from request body
        const { id } = req.query;

        // Check if user ID is valid
        if (!id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        // Get recent water intake records from the database
        const results = await db.query(
            'SELECT * FROM waterdata WHERE user_id = ?;',
            [id]
        );
        // Return success message
        return res.status(200).json({ data: results });
    } catch (error) {
        // Catch and log error
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Swagger doc for /api/waterdata/getall
/**
 * @swagger
 * /api/waterdata/getall:
 *   get:
 *     summary: Retrieve all records from the waterdata table. http://localhost:3000/api/waterdata/getall
 *     description: Fetches all records from the waterdata table in the database.
 *     responses:
 *       '200':
 *         description: A list of all records retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WaterData'
 *       '500':
 *         description: Internal Server Error.
 */
// Get all records from the waterdata table on /api/waterdata/getall
router.get("/getall", async (req, res) => {
    try {
        // Get all records from the waterdata table
        const results = await db.query(
            'SELECT * FROM waterdata;'
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