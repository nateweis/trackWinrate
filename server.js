const express = require('express');
// const cors = require('cors');
const app = express();

const port = process.env.PORT || 3004

// app.use(cors);
app.use(express.json());
app.use(express.static('public'));


const deckController = require('./controllers/deckRoutes');
app.use('/deck', deckController)


app.listen(port, () => console.log(`Hidee Hoe im on port ${port}`))