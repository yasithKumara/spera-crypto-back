var express = require("express");
var router = express.Router();
const {
    createCoin,
  getCoins,
  getCoin,
  updateCoin,
  deleteCoin,
} = require("../controllers/coinController");
const { isAdmin, protect } = require("../middleware/authMiddleware");
const coinValidation = require("../validations/coinValidation");
const validate = require("../utils/Validate");

/**
 * @swagger
 * /coins:
 *   post:
 *     summary: Create a new coin
 *     security:
 *       - bearerAuth: [] 
 *     description: Create a new coin with the provided name, symbol, and optional price.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               price:
 *                 type: string
 *             required:
 *               - name
 *               - symbol
 *     responses:
 *       '201':
 *         description: Coin created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "coin_id"
 *               name: "coin_name"
 *               symbol: "coin_symbol"
 *               price: 0.00
 *       '400':
 *         description: Bad Request. Invalid coin data or coin already exists.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid coin data"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.post("/", isAdmin, validate(coinValidation.createCoin),  createCoin);

/**
 * @swagger
 * /coins:
 *   get:
 *     summary: Get a list of all coins
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of all coins in the system.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns a list of coins.
 *         content:
 *           application/json:
 *             example:
 *               data: [{ _id: "coin_id", name: "coin_name", symbol: "coin_symbol", price: 0.00 }, ...]
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.get("/", protect, getCoins);

/**
 * @swagger
 * /coins/{id}:
 *   get:
 *     summary: Get details of a specific coin
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve details of a specific coin using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the coin to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation. Returns details of the specified coin.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { _id: "coin_id", name: "coin_name", symbol: "coin_symbol", price: 0.00 }
 *       '400':
 *         description: Bad Request. Invalid or missing parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid coinId"
 *       '404':
 *         description: Not Found. Coin with the specified ID not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Coin not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.get("/:id", protect, validate(coinValidation.getCoin), getCoin);

/**
 * @swagger
 * /coins/{id}:
 *   put:
 *     summary: Update details of a specific coin
 *     security:
 *       - bearerAuth: []
 *     description: Update details of a specific coin using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the coin to update
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
 *               symbol:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - name
 *               - symbol
 *     responses:
 *       '200':
 *         description: Successful operation. Returns updated details of the specified coin.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { _id: "coin_id", name: "updated_coin_name", symbol: "updated_coin_symbol", price: 0.00 }
 *       '400':
 *         description: Bad Request. Invalid or missing parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid coinId"
 *       '404':
 *         description: Not Found. Coin with the specified ID not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Coin not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.put("/:id", isAdmin, validate(coinValidation.updateCoin), updateCoin);

/**
 * @swagger
 * /coins/{id}:
 *   delete:
 *     summary: Delete a specific coin
 *     security:
 *       - bearerAuth: []
 *     description: Delete a specific coin using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the coin to delete
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
 *               error: "Invalid coinId"
 *       '404':
 *         description: Not Found. Coin with the specified ID not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Coin not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.delete("/:id", isAdmin, validate(coinValidation.deleteCoin), deleteCoin);

module.exports = router;