const TicketSettings = require('../models/tickets')
function ticketUtils(client, msg, args, author, prefix, command) {

  this.client = client
  this.msg = msg
  this.args = args
  this.author = author
  this.prefix = prefix
  this.command = command

  let subCommands = [
    "create",
    "close"
  ]

  this.notSetup = async function() {
    let embed = {
      title: "Thats not right!",
      description: `Please setup tickets with \`${this.prefix}ticket setup\``,
      color: 0xeb4034,
    }
    return {embed}
  }
  this.notATicket = async function() {
    let embed = {
      title: "Thats not right!",
      description: `This is not a ticket!`,
      color: 0xeb4034,
    }
    return {embed}
  }

  this.getDB = async function() {

    var storedSettings = await TicketSettings.findOne({ gid: this.msg.guildID });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new TicketSettings({
        gid: this.msg.guildID
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await TicketSettings.findOne({ gid: this.msg.guildID });
    }
    
    return storedSettings

  }

  this.main = async function() {
    
    let storedSettings = await this.getDB()
    
    let commands = this.command.subcommands
    
    let ctn = `\`${this.prefix}${this.command.usage}\` - ${this.command.description}`
    for(var i in subCommands) {
      ctn += `\n\n\`${this.prefix}${commands[subCommands[i]].usage}\` - ${commands[subCommands[i]].description}`
    }
    
    let embed = {
      title: `Arthrolix's Guardian Ticket Help`,
      description : ctn,
      color: 0x23c248,
      footer: {
        text: `[] = Required () = Optional`
      }
    }
    
    return {embed}
    
  }
  
  this.create = async function() {

    let storedSettings = await this.getDB()

    if(storedSettings.ticketCategory == 0) {
      return this.notSetup()
    }

  }

  this.close = async function() {

    let storedSettings = await this.getDB()

    // if(storedSettings.ticketCategory == 0) {
    //   return this.notSetup()
    // }

    // if(this.channel.parentID !== storedSettings.ticketCategory) {
    //   return this.notATicket()
    // }

    await msg.channel.delete()

  }

}
module.exports = ticketUtils