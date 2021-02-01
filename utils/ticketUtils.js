const TicketSettings = require('../models/tickets')
function ticketUtils(client, msg, args, author, prefix) {

  this.client = client
  this.msg = msg
  this.args = args
  this.author = author
  this.prefix = prefix

  let subCommands = [
    
  ]

  this.getDB = async function() {

    var storedSettings = await TicketSettings.findOne({ gid: this.msg.guildID });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new TicketSettings({
        gid: this.msg.guildID,
        tags: {}
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


}