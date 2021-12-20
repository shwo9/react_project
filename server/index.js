const express = require("express");
const app = express();
const config = require("./config/key");
const cookieParser = require("cookie-parser");
const port = 5000;
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// application/json
app.use(express.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 회원가입
app.post("/api/users/register", (req, res) => {
  // 회원가입을 위한 route
  // 회원가입 정보를 client에서 가져와 DB에 넣는 작업.
  const user = new User(req.body);
  // console.log(user);
  // {
  //   name: 'test121',
  //   email: 'test121@naver.com',
  //   password: 'test12',
  //   role: 0,
  //   _id: new ObjectId("61ba0cab51d634aba67c0336")
  // }

  user.save((err, userInfo) => {
    // console.log(userInfo);
    // {
    //   name: 'test121',
    //   email: 'test1212@naver.com',
    //   password: '$2b$10$HVx8z1xSxTPhr3yNx1aK.OXVQ4gIwlyW305g1ScbAvT.kmCGKsAL2',
    //   role: 0,
    //   _id: new ObjectId("61ba0cdfd8ac5e12ae47a32e"),
    //   __v: 0
    // }
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

// 로그인
app.post("/api/users/login", (req, res) => {
  // 요청한 아이디/비밀번호가 DB에 있는지 확인.
  // 아이디/비밀번호가 맞다면 토큰을 생성.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일이 잘못되었습니다.",
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          meessage: "비밀번호가 틀렸습니다.",
        });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // Token을 쿠키에 저장
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// 인증
app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user.id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, error: err.message });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
