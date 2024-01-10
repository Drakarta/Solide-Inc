const express = require("express");
const router = express.Router();
const db = require("../database");

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
router.post("/create", async (req, res) => {
    try {
        const { weight, name, user_id } = req.query;

        if ( !weight || !name || !user_id ) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        await db.query(
            "INSERT INTO bottle (weight, name, user_id) VALUES (?, ?, ?)",
            [weight, name, user_id]
        );

        console.log("Bottle successfully inserted into the database");
        return res.status(200).json({ data: "bottle created" });
    } catch (error) {
        console.error("Error inserting into the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

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
router.put("/rename", async (req, res) => {
    try {
        const { id, newname } = req.query;

        if (!id || !newname) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        await db.query(
            "UPDATE bottle SET name = ? WHERE id = ?",
            [newname, id]
        );

        console.log("Bottle successfully updated in the database");
        return res.status(200).json({ data: "bottle updated" });
    } catch (error) {
        console.error("Error updating the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

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
router.delete("/delete", async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        await db.query(
            "DELETE FROM bottle WHERE id = ?",
            [id]
        );

        console.log("Bottle successfully deleted from the database");
        return res.status(200).json({ data: "bottle deleted" });
    } catch (error) {
        console.error("Error deleting from the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

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
router.get("/get", async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        const results = await db.query(
            "SELECT * FROM bottle WHERE id = ?",
            [id]
        );

        return res.status(200).json({ data: results });
    } catch (error) {
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

/**
 * @swagger
 * /api/bottle/getall:
 *   get:
 *     summary: Retrieve all bottle records from the database.
 *     description: Returns a list of all bottle records stored in the database.
 *     responses:
 *       '200':
 *         description: A list of all bottle records retrieved successfully.
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the bottle record.
 *                   attribute1:
 *                     type: string
 *                     description: Description or name of attribute 1.
 *                   attribute2:
 *                     type: string
 *                     description: Description or name of attribute 2.
 *                   ...
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the bottle record was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the bottle record was last updated.
 *       '500':
 *         description: Internal Server Error. An error occurred while processing the request.
 */
router.get("/getall", async (req, res) => {
    try {
        const results = await db.query(
            "SELECT * FROM bottle"
        );

        return res.status(200).json({ data: results });
    } catch (error) {
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;