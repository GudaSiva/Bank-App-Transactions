const asyncHandler = require("express-async-handler");
const Account = require("../models/account.model");
const User = require("../models/user.model");

const getUsersAccounts = asyncHandler(async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ status: "failed", data: null, error: "Unauthorized" });
  try {
    //find all active accounts from user
    const accounts = await Account.find({ user: req.user.id, active: true });
    res.status(200).json({ status: "succeeded", data: accounts, error: null });
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", data: null, error: error.message });
  }
});

const getAccountByNumber = asyncHandler(async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ status: "failed", data: null, error: "Unauthorized" });
  try {
    const account = await Account.findOne({
      number: reformatIban,
      active: true,
    }).populate("user", "firstName lastName");
    if (!account) {
      return res
        .status(400)
        .json({ status: "failed", data: null, error: "Account not found" });
    }
    res.status(200).json({
      status: "succeeded",
      data: {
        number: account.number,
        id: account._id,
        owner: account.user.firstName + " " + account.user.lastName,
      },
      error: null,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", data: null, error: error.message });
  }
});

const createNewAccount = asyncHandler(async (req, res) => {

  // if (!req.user)
  //   return res
  //     .status(401)
  //     .json({ status: "failed", data: null, error: "Unauthorized" });
  
  //prevent user from creating more than 3 accounts
  // const accounts = await Account.find({ user: req.user.id, active: true });
  // if (accounts.length >= 3) {
  //   return res.status(400).json({
  //     status: "failed",
  //     data: null,
  //     error: "You can't have more than 3 accounts",
  //   });
  // }
  try {
    console.log("Account" , req.user.id);
    const newAccount = await Account.create({
      user: req.user.id,
      number: `ES99 1234 5555 6666 ${Math.floor(Math.random() * 100000000)}`,
      createdAt: new Date(),
    });
    //add account to users accounts array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { accounts: newAccount._id },
    });

    res
      .status(200)
      .json({ status: "succeeded", data: newAccount, error: null });
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", data: null, error: error.message });
  }
});

const desactivateAccount = asyncHandler(async (req, res) => {
  //only for desactivating accounts
  if (!req.user)
    return res
      .status(401)
      .json({ status: "failed", data: null, error: "Unauthorized" });
  try {
    const foundAccount = await Account.findById(req.body.id);
    if (!foundAccount) {
      return res
        .status(400)
        .json({ status: "failed", data: null, error: "Account not found" });
    }
    if (foundAccount.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ status: "failed", data: null, error: "Unauthorized" });
    }
    if (foundAccount.balance !== 0) {
      return res
        .status(400)
        .json({ status: "failed", data: null, error: "Account not empty" });
    }

    const updatedAccount = await Account.findByIdAndUpdate(req.body.id, {
      active: false,
    });

    res
      .status(200)
      .json({ status: "succeeded", data: updatedAccount, error: null });
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", data: null, error: error.message });
  }
});

module.exports = {
  getUsersAccounts,
  getAccountByNumber,
  createNewAccount,
  desactivateAccount,
};
