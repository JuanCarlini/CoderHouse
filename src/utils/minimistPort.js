import parseArgs from 'minimist'
//node index --puerto numero
const options = { default: {puerto: 8080}}
export const PORT = parseArgs(process.argv, options).puerto

