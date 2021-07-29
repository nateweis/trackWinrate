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

const removeDeck = (req, res) => {
    db.none('DELETE FROM decks WHERE id = $1', req.params.id)
    .then(() => res.json({message: "Successfull Delete Deck from DB", status: 200}))
    .catch(err => res.json({message: "ERR Deleting the deck from the db", err, status: 402}))
}

const changeRecord = (req, res) => {
    db.none('UPDATE decks SET wins = ${wins}, losses = ${losses}, last_update = NOW() WHERE id = ${id}', req.body)
    .then(() => res.json({message: "Updated Win/Loss Record", status: 200}))
    .catch(err => res.json({message: "ERR Updating the Win/Loss Record", err, status: 402}))
}

module.exports = {
    addDeck,
    getAllDecks,
    changeRecord,
    removeDeck
}