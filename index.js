require('dotenv').config()
const express = require('express')
const app = express();
const path = require('path');
const port = process.env.PORT;
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override")
const colors = require("colors");
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//mongodb+srv://prabhat011kumar:<bazhlzCCQbEnrRoB>@cluster0.jgchaxv.mongodb.net/?retryWrites=true&w=majority

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('DB connected successfully'.blue))
.catch((err)=>console.log(err))

let secret = process.env.SECRET || 'weneedabettersecretkey';

const sessionConfig = {
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire : Date.now() + 7*24*60*60*1000
    }
}
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require('./routes/paymentRoutes');

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride("_method"))

app.use(session(sessionConfig));
app.use(passport.authenticate('session'));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/products",productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);

app.get('/', (req,res)=>{
    res.render('homepage');
})

app.listen(port, () => console.log(`Server listening at http://localhost:3000`.red))   