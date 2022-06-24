import passport from "passport";
import { Router } from 'express'
import { isAuth } from '../middlewares/authenticated.js'
import fkr from '../class/fkr.js'
import { fork } from "child_process";
import { logger, loggerError } from '../utils/logger.js'

const router = Router()

router.get('/', isAuth, (req, res) => {
    const list = fkr()
    res.render('products', { list, user: req.user })
})

router.get('/login', (req, res) => {
    try {
        logger.info('Se ejecutó el render de login')
        if (req.isAuthenticated()) return res.redirect('/')
        res.render('login')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

router.get('/register', (req, res) => {
    try {
        logger.info('Se ejecutó el render de register')
        if (req.isAuthenticated()) return res.redirect('/')
    res.render('register')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

router.get('/error', (req, res) => {
    try {
        logger.info('No estas logueado amigo')
        if (req.isAuthenticated()) return res.redirect('/')
        res.render('error-login')
    res.render('register')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

router.get('/logout', isAuth, (req, res) => {
    try {
        logger.info('Usuario deslogueado')
        req.logout(err => {
            if (err) return err
            res.redirect('/login')
        })
    res.render('register')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

router.get('/info', (req, res) => {

    try {
        logger.info('esto es un logger de info')
        const dataProcess = {
            arguments : process.argv,
            directory : process.cwd(),
            so: process.platform,
            nodeVersion: process.version,
            totalMemory: process.memoryUsage().rss,
            processId : process.pid,
            cantidadDeCPUs: os.cpus().length,
        }
        res.json(dataProcess)
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        loggerError.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})


router.get('/randoms', (req, res) => {
    try {
        logger.info('Se ejecutó el api random')
        const cantidad = req.query.cantidad || 100000000 

        const forked = fork('procesoSecundario.js', [cantidad], {
            cwd: process.cwd()
        })
        forked.on("message", respuesta => res.json({
            respuesta,
            pid: process.pid
        }))
        res.render('register')
    } catch (error) {
        logger.error('Se produjo un error:' + error.message)
        res.send("Error")
    }
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/error'}), (req, res) => res.redirect('//'))

router.post('/register', passport.authenticate('signup', {failureRedirect: '/error'}), (req, res) => res.redirect('//login'))


export default router