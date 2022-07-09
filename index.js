import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import 'dotenv/config'
import mongoose from "mongoose"
// import {PORT} from './src/utils/minimistPort.js'
import minimist from 'minimist'

import rutas from './src/routes/routes.js'

import passport from "passport";
import { objStrategy, objStrategySignup } from "./src/middlewares/passportLocal.js"
//app
import os from 'os'
import cluster from 'cluster'
const numCPUs = os.cpus().length;


const app = express()

passport.use('login', objStrategy);
passport.use('signup', objStrategySignup)

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(cookieParser())
app.use(session({
    secret: 'clave_secreta',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: Number(process.env.TIME_SESSION_SECONDS) * 1000 // Tiempo de inactividad
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', rutas)

mongoose.connect(process.env.MONGO);

//console.log(PORT)
const args = minimist(process.argv.slice(2))
const PORT = args.puerto || 8080 
const modoServer = args.modo || 'Fork'

// node index --modo CLUSTER => PARA EJECUTAR 
// forever start index.js para hacer andar el forever
//  forever list => para ver las lista de procesos activos
// ejecutar en powershell  tasklist /fi "imagename eq node.exe"
// pm2 start index.js --name="ServerX" --watch -- PORT  => Ejecutar en Modo Fork pm2
// pm2 start app.js --name="Server1X" --watch -i -- PORT => Ejecutar en Modo Cluster pm2
// pm2 list => para listar en powershell
// pm2 monit => para escuchar todos los procesos 
// hacer pruebas de finalización =>  pm2 start index.js --watch

// pm2 start index.js –name servidor-8082 – –puerto 8082 –modo CLUSTER

// pm2 start index.js –name servidor-8081 – –puerto 8081

// pm2 start index.js –name servidor-8080 – –puerto 8080

// pm2 start index.js –name servidor-8083 – –puerto 8083 –modo CLUSTER


if (modoServer == 'CLUSTER') {
    if(cluster.isPrimary){
        console.log(`Master ${process.pid} is running`)
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
    
        cluster.on('exit', (worker,code,signal)=>{
            console.log(`Worker ${worker.proccess.pid} died`)
        })
        
    } else {
        app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
       console.log(`Worker ${process.pid} started`)
    }
} else {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
}
