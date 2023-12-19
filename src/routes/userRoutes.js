var express = require("express");
var router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setFavoriteCoins,
} = require("../controllers/userController");
const { protect, isAdmin, isOwner } = require("../middleware/authMiddleware");

const userValidation = require("../validations/userValidation");
const validate = require("../utils/Validate");

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:            # arbitrary name for the security scheme
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 */


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of all users in the system.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a list of users.
 *         content:
 *           application/json:
 *             example:
 *               data: [{ name: "user_name", favorite_coins: [] }]
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
// router.get("/", protect, getUsers);
router.get("/", protect, getUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get details of a specific user
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve details of a specific user using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation. Returns details of the specified user.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { _id: "user_id", name: "user_name", email: "user_email@example.com" }
 *       '400':
 *         description: Bad Request. Invalid or missing parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid userId"
 *       '404':
 *         description: Not Found. User with the specified ID not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "User not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.get("/:id", isOwner, validate(userValidation.getUser), getUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update details of a specific user
 *     security:
 *       - bearerAuth: []
 *     description: Update details of a specific user using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       '200':
 *         description: Successful operation. Returns updated details of the specified user.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { _id: "user_id", name: "updated_user_name", email: "updated_user_symbol"}
 *       '400':
 *         description: Bad Request. Invalid or missing parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid userId"
 *       '404':
 *         description: Not Found. User with the specified ID not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.patch("/:id", isOwner, validate(userValidation.updateUser), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a specific user
 *     security:
 *       - bearerAuth: []
 *     description: Delete a specific user using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation. Returns an empty object indicating successful deletion.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {}
 *       '400':
 *         description: Bad Request. Invalid or missing parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid userId"
 *       '404':
 *         description: Not Found. User with the specified ID not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "User not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.delete("/:id", isOwner,validate(userValidation.deleteUser), deleteUser);

/**
 * @swagger
 * /users/{id}/favorite-coins:
 *   patch:
 *     summary: Set favorite coins for a user
 *     security:
 *       - bearerAuth: []
 *     description: Set favorite coins for a user using their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to set favorite coins for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               favorite_coins:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - favorite_coins
 *     responses:
 *       '200':
 *         description: Successful operation. Returns updated user details with favorite coins.
 *         content:
 *           application/json:
 *             example:
 *               _id: "user_id"
 *               name: "user_name"
 *               email: "user_email@example.com"
 *               favorite_coins: ["coin_id_1", "coin_id_2", ...]
 *       '400':
 *         description: Bad Request. Invalid or missing parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid userId"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.patch("/:id/favorite-coins", isOwner,validate(userValidation.setFavoriteCoins), setFavoriteCoins);

module.exports = router;

// /* GET error */
// router.get("/this-is-an-error", function (req, res, next) {
//   throw new Error("some error");
//   res.send("respond with a resource");
// });
