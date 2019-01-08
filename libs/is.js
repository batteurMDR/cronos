const fs = require('fs')
    
function JSONFile(path){
    if (fs.existsSync(path)){
        let content = fs.readFileSync(path)
        try{
            if(JSON.parse(content)){
                return true
            }
        }catch(e){
            return false
        }
    }
    return false
}

function CronosConfig(config){
    if("tasks" in config){
        let result = true
        for(let i = 0; i < config.tasks.length; i++){
            let task = config.tasks[i]
            if(
                !("id" in task) ||
                !("name" in task) ||
                !("script" in task) ||
                !("recurrence" in task) ||
                !("last" in task)
                ){
                    result = false
            }
            if(
                !(typeof task.id == "number") ||
                !(typeof task.name == "string") ||
                !(typeof task.script == "string") ||
                !(typeof task.recurrence == "number" || task.recurrence == null) ||
                !(typeof task.last == "number" || task.last == null)
                ){
                    result = false
            }
            for(let j = 0; j < config.tasks.length; j++){
                if(i!=j && config.tasks[i].id==config.tasks[j].id){
                    result = false
                }
            }
        }
        return result
    }
    return false
}

module.exports.JSONFile = JSONFile
module.exports.CronosConfig = CronosConfig