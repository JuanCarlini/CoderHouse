import express from "express"
import session from "express-session"
import 'dotenv/config'
import mongoose from "mongoose"

const app = express()

import passport from "passport";
import { strategyLogin, strategySignup } from "./src/middlewares/passportLocal.js"

passport.use('login', strategyLogin);
passport.use('signup', strategySignup)

import routes from './src/routes/routes.js'

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(session({
    secret: 'keyboard cat',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: Number(process.env.TIEMPO_EXPIRACION)
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)

mongoose.connect(process.env.MONGO)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))