const express = require("express");
const router = express.Router();
const db = require("../database");

/**
 * @swagger
 * /api/goal/get:
 *   get:
 *     summary: Get user's water goal by ID. http://localhost:3000/api/goal/get?id=1
 *     description: Endpoint to fetch the water goal of a user by their ID.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: User ID to fetch the water goal.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful response with the user's water goal.
 *       400:
 *         description: Bad request due to missing parameters.
 *       500:
 *         description: Internal server error.
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

        return res.status(200).json({ data: results[0].water_goal });
    } catch (error) {
        console.error("Error querying the database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /api/goal/change:
 *   put:
 *     summary: Update user's water goal by ID. http://localhost:3000/api/goal/change?id=1&newGoal=3000
 *     description: Endpoint to update the water goal of a user by their ID.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: User ID whose water goal needs to be updated.
 *         required: true
 *         type: integer
 *       - name: newGoal
 *         in: query
 *         description: New water goal value for the user.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful response with updated water goal.
 *       400:
 *         description: Bad request due to missing parameters.
 *       500:
 *         description: Internal server error.
 */
router.put("/change", async (req, res) => {
    try {
        const { id, newGoal } = req.query;

        if (!id || !newGoal) {
            return res.status(400).json({ error: "Bad Request. Check request payload." });
        }

        const results =  await db.query(
            'UPDATE user SET water_goal = ? WHERE id = ?',
            [newGoal, id]
        )

        return res.status(200).json({ data: "successfully changed goal" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;