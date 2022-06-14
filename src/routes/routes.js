import passport from "passport";
import { Router } from 'express'
import { isAuth } from '../middlewares/authenticated.js'
import fkr from '../class/fkr.js'
import { fork } from "child_process";
import { objInfo } from '../utils/info.js'

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

router.get('/info', (req,res)=> {
    res.render('info', {data : objInfo})
})

    router.get('/random', (req, res) => {
        let cant = req.query.cant || 100;
        let passCant = ['' + cant + '']
        const child = fork('./random.js');
        child.send(passCant);
        child.on('message', (operation) => {
        // res.send(JSON.stringify(operation));
        res.render('random', {operation: operation})
      });
    })


export default router