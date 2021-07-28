const express = require('express')
const router = express.Router();
const Deck = require('../models/decks')

router.post('/', Deck.addDeck)

module.exports = router