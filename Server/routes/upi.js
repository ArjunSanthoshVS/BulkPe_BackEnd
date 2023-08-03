require('dotenv').config()
const express = require('express');
const middleware = require('../middleware/middleware');
const router = express.Router();
const axios = require('axios');
const UPI = require('../model/upiSchema');

router.post('/upi-link', middleware, async (req, res) => {
  try {
    const { amount, transcation_note } = req.body;
    if (!amount) amount = 1
    const date = new Date();
    const reference_id = "BulkPe" + date.valueOf()
    const currentUserId = req.userId;
    const response = await axios.post(
      process.env.LINK,
      {
        amount,
        reference_id,
        transcation_note,
      },
      {
        headers: {
          Authorization: process.env.TOKEN,
        },
      }
    );
    res.status(200).json({ upiLink: response?.data });
    const upiCollection = new UPI({
      user: currentUserId,
      amount,
      reference_id,
      transcation_note,
      upiLink: response?.data?.data?.upi
    })
    await upiCollection.save()
  } catch (error) {
    console.error('Error while generating UPI link:', error);
    res.status(500).json({ message: 'Error while generating UPI link' });
  }
})

router.post('/callback', async (req, res) => {
  try {
    const { status, reference_id, transaction_id } = req.body;
    const upiCollection = await UPI.findOne({ reference_id })
    if (upiCollection) {
      if (status === "success") {
        upiCollection.status = 'success'
        await upiCollection.save()
      }
    }
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: 'Error while processing callback' });
  }
});

module.exports = router;
