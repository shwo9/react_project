const express = require('express')
const app = express()
const port = 5000
const { User } = require('./models/User');
const config = require('./config/key');

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// application/json
app.use(express.json());




const mongoose = require('mongoose');
mongoose.connect(config.mongoURI).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) =>{
    // 회원가입을 위한 route
    // 회원가입 정보를 client에서 가져와 DB에 넣는 작업.

    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })


})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})