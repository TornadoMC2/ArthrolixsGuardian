//dev modifydb [type of database (guild, tags, tickets)] 
const GuildSettings = require('../models/guildSettings')
const TicketSettings = require('../models/tickets')
const TagSettings = require('../models/tags')
function devUtils(client, msg, args) {
  
  this.guild = async function() {
    
    var storedSettings = await GuildSettings.findOne({ gid: msg.guildID });
    
    args.shift()
    
    let index = args[0]
    let oldValue = storedSettings[index]
    
    args.shift()
    
    storedSettings[index] = args.join(" ")
    
    await storedSettings.save().catch(()=>{})
    
    let embed = {
      title: `Updated Database Successfully`,
      description : `Changed Values\n\`${index}\`: \`${oldValue}\` -> \`${storedSettings[index]}\``,
      color: 0x23c248,
    }
    
    return {embed}
    
  }
  
  this.tags = async function() {
    
    var storedSettings = await TagSettings.findOne({ gid: msg.guildID });
    
    args.shift()
    
    let index = args[0]
    let oldValue = storedSettings[index]
    
    args.shift()
    
    storedSettings[index] = args.join(" ")
    
    await storedSettings.save().catch(()=>{})
    
    let embed = {
      title: `Updated Database Successfully`,
      description : `Changed Values\n\`${index}\`: \`${oldValue}\` -> \`${storedSettings[index]}\``,
      color: 0x23c248,
    }
    
    return {embed}
    
  }
  
  this.tickets = async function() {
    
    var storedSettings = await TicketSettings.findOne({ gid: msg.guildID });
    
    args.shift()
    
    let index = args[0]
    let oldValue = storedSettings[index]
    
    args.shift()
    
    storedSettings[index] = args.join(" ")
    
    await storedSettings.save().catch(()=>{})
    
    let embed = {
      title: `Updated Database Successfully`,
      description : `Changed Values\n\`${index}\`: \`${oldValue}\` -> \`${storedSettings[index]}\``,
      color: 0x23c248,
    }
    
    return {embed}
    
  }
  
  this.stop = async function() {
    
    client.disconnect({
      reconnect: "auto"
    })
    
  }
  
  
}

module.exports = devUtils