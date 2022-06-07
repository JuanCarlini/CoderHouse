export const objInfo = {
    argumentosEntrada : process.argv,
    carpetaProyecto : process.cwd(),
    sistemaOperativo: process.platform,
    versionNode: process.version,
    memoriaTotalReservada: process.memoryUsage().rss,
    processId : process.pid,
    pathDeEjecucion: process.title
}