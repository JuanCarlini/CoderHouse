import express from "express"
import session from "express-session"
import 'dotenv/config'
import mongoose from "mongoose"
import minimist from "minimist"
import cluster from "cluster"
import os from 'os'

const numCPUs = os.cpus().length;

const app = express()

import passport from "passport";
import { strategyLogin, strategySignup } from "./src/middlewares/passportLocal.js"

const numCPU = os.cpus().length

import { logger, loggerWarn, loggerError } from "./src/utils/logger.js"
import compression from "compression"
app.use(compression())

passport.use('login', strategyLogin);
passport.use('signup', strategySignup)

import routes from './src/routes/routes.js'

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use((req, res) => {
    logger.warn('La ruta no existe')
    loggerWarn.warn('La ruta que quiere accede no existe')
    res.send('La ruta no existe')
})


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: Number(process.env.TIEMPO_EXPIRACION) * 1000
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)


mongoose.connect(process.env.MONGO)

const args = minimist(process.argv.slice(2))
const PORT = args.puerto || 8080 
const modoServer = args.modo || 'FORK'

if(modoServer == "CLUSTER"){
    if (cluster.isPrimary) {
        logger.info('Se ejecutó en modo CLUSTER. Creando Workers')
        for (let i = 0; i < numCPU; i++) {
            cluster.fork();
        }
        cluster.on("listening", (worker, address) => {
            logger.info(`Worker: ${worker.process.pid} || Port: ${address.port}`);
        });
    } else {
        app
            .listen(PORT, () => logger.info(`http://localhost:${PORT}/`))
            .on('error', err => logger.error(err))
    }
}else{

    logger.info('Se ejecutó en modo FORK.')
    app
        .listen(PORT, () => logger.info(`http://localhost:${PORT}/`))
        .on('error', err => () => {
            logger.error(err)
            loggerError.error(err)
        })
}
