const winston = require('winston');
const dotenv = require('dotenv');
const { Command } = require('commander');

// Commander
const program = new Command();
program
  .option('--mode <mode>', 'Modo de trabajo' , 'dev')
  program.parse()
// Cargar la configuración de .env.dev o .env.prod dependiendo del modo
try {
  dotenv.config({
    path: program.opts().mode == 'DEV' ? '.env.dev' : '.env.prod'
  });
} catch (error) {
  console.error('Error cargando archivos .env:', error);
}
//seteo opciones
const customLevelOptions = {
    levels:{
        falta: 0,
        error: 1,
        warning: 2,
        http: 3,
        info: 4,
        debug: 5
    },
    colors:{
        falta: 'red',
        error: 'red' ,
        warning: 'yellow',
        http: 'magenta',
        info: 'cyan',
        debug: 'blue'
    }
}

winston.addColors(customLevelOptions.colors)

if (process.env.MODE === 'PROD') {
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.File({ level: "info", filename: './errors.log' }),
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelOptions.colors }),
                    winston.format.simple()
                )
            })
        ]
    });
} else {
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelOptions.colors }),
                    winston.format.simple()
                )
            })
        ]
    });
}

//middleware
  const addLogger = (req, res, next) =>{
    req.logger = logger
    req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}`)
    req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}`)
    next()
  }

  module.exports = {addLogger}