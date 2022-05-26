import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import 'dotenv/config'
import fkr from './class/fkr.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views','./public/views');


app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO
    }),
    secret: String(process.env.SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}))

app.get('/productos', (req,res)=> {
    if(req.session.user){
        const list = fkr()
        res.render('products', {list})
    } else {
        res.redirect('/login')
    }
})
app.get('/login' , (req,res)=> {
    const {userName} = req.body
    req.session.user = userName
    res.render('login')
})
app.get('/logout', (req,res)=> {
    const userName = req.session.user
    req.session.destroy()
    res.render('logout', {
        userName
    })
})
app.post('/login', (req,res)=> {
    const {userName} = req.body
    req.session.user = userName
    res.redirect('/productos')
})


app.listen(8080, ()=> {
    console.log(`Server on http://localhost:8080`)
});