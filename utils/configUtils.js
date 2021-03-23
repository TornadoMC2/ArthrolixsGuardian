const GuildSettings = require('../models/guildSettings')
function configUtils(client, msg, args) {

  let settings = [
    "prefix"
  ]

  let descriptions = {
    "prefix": "The bot's prefix for this server."
  }

  this.getDB = async function() {

    var storedSettings = await GuildSettings.findOne({ gid: msg.guildID });
    if (!storedSettings) {
      const newSettings = new GuildSettings({
        gid: msg.guildID,
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ gid: msg.guildID });
    }
    
    return storedSettings

  }

  this.main = async function() {

    let ctn = ``

    let storedSettings = await this.getDB()

    for(var i = 0; i < settings.length; i++) {
      if(settings[i] in storedSettings) {
        ctn += `${(i == 0 ? `` : `\n`)}${settings[i].charAt(0).toUpperCase() + settings[i].slice(1)}: \`${storedSettings[settings[i]]}\``
      }
    }

    ctn += `\n\nYou can see more information at \`${storedSettings.prefix}config help\``

    let embed = {
      title: `${msg.channel.guild.name}'s Bot Config`,
      description: ctn
    }

    return {embed}

  }

  this.help = async function() {
    
  }


}
module.exports = configUtils