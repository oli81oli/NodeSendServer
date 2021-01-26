const express = require('express')
const connectDB = require('./mongo.config.js/db')
const cors = require('cors')

const app = express()

connectDB()

const optionsCors = {
    origin: process.env.FRONT_END_URL
}
app.use(cors(optionsCors))

const port = process.env.Port || 4000

app.use(express.json())

app.use(express.static('uploads'))

app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/links', require('./routes/links'))
app.use('/api/archives', require('./routes/archives'))


app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})