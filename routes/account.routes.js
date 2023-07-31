const express = require("express");
const router = express.Router();
const {
  getUsersAccounts,
  getAccountByNumber,
  createNewAccount,
  desactivateAccount,
} = require("../controllers/account.controller");

router.get("/", getUsersAccounts);
router.get("/validate/:number", getAccountByNumber);
router.post("/new", createNewAccount);
router.patch("/desactivate", desactivateAccount);
module.exports = router;
