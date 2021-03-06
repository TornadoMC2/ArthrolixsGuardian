const TagSettings = require('../models/tags')
function tagUtils(client, msg, args, prefix, usage, command) {
  
  this.client = client
  this.msg = msg
  this.args = args
  this.prefix = prefix
  this.usage = usage
  this.command = command
  
  let subCommands = [
    "create",
    "delete",
    "edit",
    "list"
  ]
  
  this.getDB = async function() {

    var storedSettings = await TagSettings.findOne({ gid: this.msg.guildID });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new TagSettings({
        gid: this.msg.guildID,
        tags: {}
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await TagSettings.findOne({ gid: this.msg.guildID });
    }
    
    return storedSettings

  }

  this.tagExistError = function() {
    let embed = {
      title: "Thats not right!",
      description: `A tag by that name doesn't exist`,
      color: 0xeb4034,
    }
    return {embed}
  }

  this.tagAlreadyExists = function() {
    let embed = {
      title: "Thats not right!",
      description: `A tag by that name already exists`,
      color: 0xeb4034,
    }
    return {embed}
  }

  this.incorrectUsageEmbed = function() {
    let embed = {
      title: "Thats not right!",
      description: `The correct way to use this command is \`${this.prefix}${this.usage}\``,
      color: 0xeb4034,
      footer: {
        text: "[] = Required () = Optional"
      }
    }
    return {embed}
  }

  this.main = async function() {
    
    let storedSettings = await this.getDB()
    
    if(this.args[0]) {
      
      if(storedSettings.tags.get(this.args[0]) == undefined) {
        return this.tagExistError()
      }
        
      return storedSettings.tags.get(this.args[0])
      
    }
    
    let commands = this.command.subcommands
    
    let ctn = `\`${this.prefix}${this.command.usage}\` - ${this.command.description}`
    for(var i in subCommands) {
      ctn += `\n\n\`${this.prefix}${commands[subCommands[i]].usage}\` - ${commands[subCommands[i]].description}`
    }
    
    let embed = {
      title: `Arthrolix's Guardian Tag Help`,
      description : ctn,
      color: 0x23c248,
      footer: {
        text: `[] = Required () = Optional`
      }
    }
    
    return {embed}
    
  }
  
  this.create = async function() {
    
    let storedSettings = await this.getDB();
    
    if(!this.args[0] || !this.args[1]) {
      return this.incorrectUsageEmbed();
    }
    
    if(storedSettings.tags.get(this.args[0])) {
      return this.tagAlreadyExists();
    }
    
    let tagName = this.args[0]
    this.args.shift()
    storedSettings.tags.set(tagName, this.args.join(" "))
    
    await storedSettings.save().catch(()=>{});
    
    let embed = {title: "Success!", description: `Successfully created tag \`${tagName}\``, color: 0x23c248}
    
    return {embed}
    
  }
  
  this.delete = async function() {
    
    let storedSettings = await this.getDB()
    
    if(!this.args[0]) {
      return this.incorrectUsageEmbed()
    }
    
    if(storedSettings.tags.get(this.args[0]) == undefined) {
      return this.tagExistError()
    }
    
    storedSettings.tags.delete(this.args[0])
    
    await storedSettings.save().catch(()=>{});
    
    let embed = {title: "Success!", description: `Successfully deleted tag \`${args[0]}\``, color: 0x23c248}
    
    return {embed}
    
  }
  
  this.list = async function() {
    
    let storedSettings = await this.getDB()
    
    let entries = storedSettings.tags.entries()
    
    let ctn = ""
    
    if(storedSettings.tags.size == 0)
      ctn += `There are no tags!\n\nCreate some with \`${this.prefix}tag create [name] [contents]\``
    
    for(var i = 0; i < storedSettings.tags.size; i++) {
      let next = entries.next()
      ctn += `${i == 0 ? `` : `\n`}\`${next.value[0]}\``
    }
    
    let embed = {title: `List of Tags`, description: ctn, color: 0x23c248}
    
    return {embed}
    
  }
  
  this.edit = async function() {
    
    let storedSettings = await this.getDB()
    
    if(!args[0] || !args[1]) {
      return this.incorrectUsageEmbed()
    }
    
    if(storedSettings.tags.get(args[0]) == undefined) {
      return this.tagExistError()
    }
    
    let tagName = this.args[0]
    this.args.shift()
    storedSettings.tags.set(tagName, this.args.join(" "))
    
    await storedSettings.save().catch(()=>{});
    
    let embed = {title: "Success!", description: `Successfully updated tag \`${tagName}\``, color: 0x23c248}
    
    return {embed}
    
  } 
  
}
module.exports = tagUtils