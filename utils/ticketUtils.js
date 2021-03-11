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

    if(storedSettings.ticketCategory == "null" || storedSettings.ticketStaffRoleID == "null") {
      return this.notSetup()
    }
    
    let name = `ticket-${storedSettings.tickets}`
    
    storedSettings.tickets += 1

    await this.client.createChannel(this.msg.guildID, name, 0, {
      parentID: storedSettings.ticketCategory,
      permissionOverwrites: [
        {
          id: this.msg.guildID,
          type: 0,
          deny: 1024
        },
        {
          id: this.author,
          type: 1,
          allow: 1024
        },
        {
          id: storedSettings.ticketStaffRoleID,
          type: 0,
          allow: 1024
        }
      ]
    })
    
    await storedSettings.save().catch(()=>{})
    
    let embed = {
      title: `Ticket Created Successfully`,
      description : `Please look for your ticket by scrolling down!`,
      color: 0x23c248,
    }
    
    return {embed}
    
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
  
  this.auto = async function() {
    
    let storedSettings = await this.getDB()
    
    storedSettings.ticketCategory = "805966702076100609"
    storedSettings.ticketCreationMessageID = "818549181672325160"
    
    await storedSettings.save().catch(()=>{})
    
    console.log(this.author)
    console.log(this.msg.guildID)
    
    await this.client.createChannel(this.msg.guildID, "test-ticket", 0, {
      parentID: storedSettings.ticketCategory,
      permissionOverwrites: [
        {
          id: this.msg.guildID,
          type: 0,
          deny: 1024
        },
        {
          id: this.author,
          type: 1,
          allow: 1024
        },
      ]
    })
    
    return "Creating Channel..."
    
  }
  
  
  this.dev = async function() {
    
    let storedSettings = await this.getDB()
    
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

}
module.exports = ticketUtils