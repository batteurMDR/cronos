const fs = require('fs')
const moment = require('moment')

const is = require('./libs/is')
const execute = require('./libs/execute')

const VERBOSE = true
const CONFIGPATH = is.JSONFile(process.argv[process.argv.length-1]) ? process.argv[process.argv.length-1] : process.exit(1)

if(VERBOSE){
    console.info("=== CRONOS ===")
    console.info("Config path : " + CONFIGPATH)
}

let config = JSON.parse(fs.readFileSync(CONFIGPATH))

if(!is.CronosConfig(config)){
    if(VERBOSE){
        console.info("Bad config")
    }
    process.exit(1)
}

let tasks = {}

if(VERBOSE){
    console.info("------------------Tasks------------------")
}
for(let i = 0; i < config.tasks.length; i++){
    if(VERBOSE){
        console.info("Task " + i + "  : " + config.tasks[i].name)
        console.info("Execute : " + config.tasks[i].script)
        console.info("Each    : " + config.tasks[i].recurrence + " seconds")
        console.info("And was executed for the last time : ")
        console.info((config.tasks[i].last===null) ? "never" : moment("" + config.tasks[i].last,"X").format("DD/MM/YYYY à HH:mm:ss"))
        console.info("And on those specific days : ")
        for(let j = 0; j < config.tasks[i].scheduled.length; j++){
            console.info(" - " + moment("" + config.tasks[i].scheduled[j],"X").format("DD/MM/YYYY à HH:mm:ss"))
        }

    }
    if(config.tasks[i].recurrence!=null){
        if(config.tasks[i].last===null){
            execute.task(config.tasks[i].id,config.tasks[i].script,config.tasks[i].recurrence,false,config).then((timer) => {
                tasks[config.tasks[i].id] = timer
            })
        }else{
            let diff = moment().unix() - config.tasks[i].last
            let nextTime = null
            if(diff < config.tasks[i].recurrence){
                nextTime = config.tasks[i].recurrence - diff
            }else{
                nextTime = config.tasks[i].recurrence - (diff % config.tasks[i].recurrence)
            }
            execute.task(config.tasks[i].id,config.tasks[i].script,config.tasks[i].recurrence,nextTime,config).then((timer) => {
                tasks[config.tasks[i].id] = timer
            })
        }
    }
    if(config.tasks[i].scheduled.length>0){
    }
    if(VERBOSE){
        console.info('-----------------------------------------')
    }
}