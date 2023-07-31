const express = require("express");
const router = express.Router();

const {
  transactionController,
  getTransactionsByUser,
} = require("../controllers/transaction.controller");

router.post("/", transactionController).get("/", getTransactionsByUser);

module.exports = router;
