LogSchema = require('./schema/logs.js');

module.exports.fetchuser = async function(key){

    let log = await LogSchema.findOne({ token: key });

    if(log){
        return log;
    }else{
        log = new LogSchema({
            token: key,
            registeredAt: Date.now()
        })
        await log.save().catch(err => console.log(err));
        return log;
    }
};