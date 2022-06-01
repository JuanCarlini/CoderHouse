import passport from "passport";
import { Router } from 'express'
import { isAuth } from '../middlewares/authenticated.js'
import fkr from '../class/fkr.js'

const router = Router()

router.get('/', isAuth, (req, res) => {
    const list = fkr()
    res.render('products', { list, user: req.user })
})

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('login')
})
router.post('/login', passport.authenticate('login', {failureRedirect: 'login-error'}), (req, res) => res.redirect('/'))

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('register')
})
router.post('/register', passport.authenticate('signup', {failureRedirect: '/registro-error'}), (req, res) => res.redirect('/login'))

router.get('/logout', isAuth, (req, res) => {
    req.logout(err => {
        if (err) return err
        res.redirect('/login')
    })
})

router.get('/login-error', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('login-error')
})
router.get('/registro-error', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('registro-error')
})


export default router