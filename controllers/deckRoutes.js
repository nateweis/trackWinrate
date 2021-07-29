const express = require('express')
const router = express.Router();
const Deck = require('../models/decks')

router.post('/', Deck.addDeck)
router.get('/', Deck.getAllDecks)
router.put('/', Deck.changeRecord)


module.exports = router