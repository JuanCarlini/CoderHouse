import { Router } from 'express'
import passport from "passport";
import { isAuth } from '../middlewares/authenticated.js'
import {objInfo} from '../utils/info.js'
import { fork } from "child_process";
import 'dotenv/config'
const router = Router()


/**
 * rutas get para renderizar las vistas
 */
router.get('/', isAuth, (req, res) => res.render('productos', {
    user: req.user
}))

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('login')
})

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('register')
})

router.get('/error', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.render('error-login')
})

router.get('/logout', isAuth, (req, res) => {
    req.logout(err => {
        if (err) return err
        res.redirect('/login')
    })
})



router.get('/info', (req,res)=> {
    // res.render('info', {data : objInfo})
    res.json(objInfo)
})

router.get('/api/random', (req, res) => {
    let cant = req.query.cant || 1000000;
    let passCant = ['' + cant + '']
    const child = fork('./random.js');
    child.send(passCant);
    child.on('message', (operation) => {
    // res.send(JSON.stringify(operation));
    res.render('random', {operation: operation})
    });
})


/**
 * router para autenticar
 */

router.post('/login', passport.authenticate('login', {failureRedirect: '/error'}), (req, res) => res.redirect('/'))

router.post('/register', passport.authenticate('signup', {failureRedirect: '/error'}), (req, res) => res.redirect('/login'))


export default router