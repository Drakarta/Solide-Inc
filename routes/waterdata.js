const express = require("express");
const router = express.Router();
const db = require("../database");

// http://localhost:3000/api/waterdata/drink?id=1&water=123

/**
 * @swagger
 * /api/waterdata/drink:
 *   post:
 *     summary: Record water intake
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
router.post("/drink", async (req, res) => {
    try {
        const { id, water } = req.query;

        if (!id || !water) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }
        
        await db.query(
            'INSERT INTO waterdata (user_id, water_intake) VALUES (?, ?)',
            [id, water]
        );

        return res.status(200).json({ message: "Water intake record added successfully." });
    } catch (error) {
        console.error("Error inserting into the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// http://localhost:3000/api/waterdata/getdrink?id=1

/**
 * @swagger
 * /api/waterdata/getdrink:
 *   get:
 *     summary: Get recent water intake records
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
router.get("/getdrink", async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        const [results] = await db.query(
            'SELECT * FROM waterdata WHERE user_id = ? LIMIT 10;',
            [id]
        );
        console.log( results)

        return res.status(200).json({ data: results });
    } catch (error) {
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;