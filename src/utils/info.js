import os from 'os'
const numCPUs = os.cpus().length;
 
  export const objInfo = {
        argumentosEntrada : process.argv,
        carpetaProyecto : process.cwd(),
        sistemaOperativo: process.platform,
        versionNode: process.version,
        memoriaTotalReservada: process.memoryUsage().rss,
        processId : process.pid,
        pathDeEjecucion: process.title,
        cantidadCpu: numCPUs
    }


  

    





// *Directorio actual de trabajo:"+ process.cwd();
// *Id
// del proceso:
// *‡ process. pid;
// *Versión de Node: *+ process.version;
// *Título del proceso:
// ** process. title;
// *Sistema operativo;
// + process.platform;
// Uso de la memoria:+ process.memoryUsage();