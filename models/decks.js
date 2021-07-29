const db = require('../db/db_connection');

const addDeck = (req, res) => {
    db.none('INSERT INTO decks(id, name, wins, losses, color, last_update)VALUES(${id}, ${name}, 0, 0, ${color}, NOW())', req.body)
    .then(() => res.json({message: "The Deck Has Been Saved", status: 200}))
    .catch(err => res.json({message: "ERR On Deck Save", err, status: 402}))
}

const getAllDecks = (req, res) => {
    db.any('SELECT * FROM decks ORDER BY last_update DESC')
    .then((data) => res.json({message: "Retrived all Decks", status: 200, decks: data}))
    .catch(err => res.json({message: "ERR getting the decks", err, status: 402}))
}

module.exports = {
    addDeck,
    getAllDecks
}