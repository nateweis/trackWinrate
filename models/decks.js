const db = require('../db/db_connection');

const addDeck = (req, res) => {
    db.none('INSERT INTO decks(name, wins, losses color) VALUES(${name}, 0, 0, ${color})', req.body)
    .then(() => res.json({message: "The Deck Has Been Saved", status: 200}))
    .catch(err => res.json({message: "ERR On Deck Save", err, status: 402}))
}

module.exports = {
    addDeck
}