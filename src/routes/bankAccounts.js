const express = require('express');
const router = express.Router();
const {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} = require('../controllers/bankAccountController');

router.route('/')
  .get(getBankAccounts)
  .post(createBankAccount);

router.route('/:id')
  .put(updateBankAccount)
  .delete(deleteBankAccount);

module.exports = router;
