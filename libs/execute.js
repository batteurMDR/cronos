const fs = require('fs')
const { exec } = require('child_process')
const moment = require('moment')

const is = require('./is')

const CONFIGPATH = is.JSONFile(process.argv[process.argv.length-1]) ? process.argv[process.argv.length-1] : process.exit(1)

function task(id,script,recurrence,nextTime,config){

    return new Promise((resolve,reject) => {
        let result = null
        var now = null
        if(!nextTime){
            child = exec("node " + script, function (error, stdout, stderr) {
                console.log(stdout)
                // console.log('stderr: ' + stderr)
                if (error !== null) {
                    console.log('exec error: ' + error)
                }
            })
            updateTaskLast(id,config,moment().unix())
            result = setInterval(()=>{
                child = exec("node " + script, function (error, stdout, stderr) {
                    console.log(stdout)
                    // console.log('stderr: ' + stderr)
                    if (error !== null) {
                        console.log('exec error: ' + error)
                    }
                })
                updateTaskLast(id,config,moment().unix())
            },recurrence*1000)
            resolve(result)
        }else{
            setTimeout(()=>{
                child = exec("node " + script, function (error, stdout, stderr) {
                    console.log(stdout)
                    // console.log('stderr: ' + stderr)
                    if (error !== null) {
                        console.log('exec error: ' + error)
                    }
                })
                updateTaskLast(id,config,moment().unix())
                result = setInterval(()=>{
                    child = exec("node " + script, function (error, stdout, stderr) {
                        console.log(stdout)
                        // console.log('stderr: ' + stderr)
                        if (error !== null) {
                            console.log('exec error: ' + error)
                        }
                    })
                    updateTaskLast(id,config,moment().unix())
                },recurrence*1000)
                resolve(result)
            },nextTime*1000)
        }
    })

}

function updateTaskLast(id,config,now){
    for(let i = 0; i < config.tasks.length; i++){
        if(config.tasks[i].id==id){
            config.tasks[i].last = now
        }  
    }
    fs.writeFileSync(CONFIGPATH,JSON.stringify(config),(err)=>{
        if(err){
            console.log(err)
        }
    })
}

module.exports.task = task