require('dotenv').config()
var cors = require('cors')

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const readSitesFromJson = require('./routes/sites.js')

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connected to MongoDB'))

app.use(cors())

app.use(express.json())

const sitesRouter = require('./routes/sites')
app.use('/sites', sitesRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
    sitesRouter.readSitesFromJson()
})