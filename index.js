const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://shwo9:tlstm123@cluster0.w3gtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})