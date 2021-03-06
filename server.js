const Eris = require('eris')
const fetch = require('node-fetch')
const fs = require('fs')
const mongoose = require("mongoose");
const GuildSettings = require("./models/guildSettings");
const tags = require('./models/tags')
const TicketSettings = require('./models/tickets')

var client = new Eris.CommandClient(process.env.TOKEN, {
  getAllUsers: true,
  intents: ["guildMembers", "guilds", "guildMessages", "guildMessageReactions"]
}, {
  defaultHelpCommand: false,
  description: "An advanced Discord bot for moderating a Discord server",
  prefix: [",", "@mention"]
})

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.on('ready', async () => {
  //console.log('on')
  console.log(`Bot is ready. (${client.guilds.size} Guilds - ${client.users.size} Users)`);
  
})

let prefix = ""

client.on('messageCreate', async (msg) => {

  var storedSettings = await GuildSettings.findOne({ gid: msg.guildID });
  if (!storedSettings) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    const newSettings = new GuildSettings({
      gid: msg.guildID
    });
    await newSettings.save().catch(()=>{});
    storedSettings = await GuildSettings.findOne({ gid: msg.guildID });
  }
  
  await client.registerGuildPrefix(msg.guildID, [storedSettings.prefix, "@mention"])
  
  prefix = storedSettings.prefix

})

let commandTypes = {
  general: ["help", "ping", "tag", "server"],
  moderation: ["kick", "ban"],
  configuration: ["prefix", "ticket"],
  developer: ["log", "eval", "dev"]
}

function noPermissionsEmbed() {
  let embed = {
    title: "Thats not right!",
    description: `You don't have permission to use this command!`,
    color: 0xeb4034
  }
  return {embed}
}
function errorEmbed() {
  let embed = {
    title: "Thats not right!",
    description: `Something Went Wrong`,
    color: 0xeb4034
  }
  return {embed}
}
function incorrectUsageEmbed(usage) {
  let embed = {
    title: "Thats not right!",
    description: `The correct way to use this command is ${prefix}${usage}`,
    color: 0xeb4034
  }
  return {embed}
}


let author = 0;
let botName = "Arthrolix's Guardian"

let helpPageNum = 1

//page, maxpage, client, botname, commandTypes, command
const helpEmbed = require('./utils/helpEmbed')

client.registerCommand("help", function(msg, args) { helpPageNum = 1; let maxPages = Object.keys(commandTypes).length+1; author = msg.author.id; return new helpEmbed(helpPageNum, maxPages, client, botName, commandTypes, author, msg, prefix, args[0]).embed() }, {
  usage: 'help (command)',
  description: "Basic Help Command",
  fullDescription: "The default help command used for this bot",
  reactionButtons: [
    {
      emoji: "⏪",
      type: "edit",
      response: (msg, args, user) => {
        
        msg.removeReaction("⏪", author)
        
        helpPageNum = 1
        
        return new helpEmbed(helpPageNum, Object.keys(commandTypes).length+1, client, botName, commandTypes, author, msg, prefix, args[0]).embed()
        
      },
      filter: function(msg, emoji, user) { if(user.id == author) { return true } else { return false } }
    },
    {
      emoji: "◀️",
      type: "edit",
      response: (msg, args, user) => {
        
        msg.removeReaction("◀️", author)
        
        helpPageNum -= 1
        if(helpPageNum < 1) helpPageNum = Object.keys(commandTypes).length+1
        
        
        return new helpEmbed(helpPageNum, Object.keys(commandTypes).length+1, client, botName, commandTypes, author, msg, prefix, args[0]).embed()
        
      },
      filter: function(msg, emoji, user) { if(user.id == author) { return true } else { return false } }
    },
    {
      emoji: "⏹️",
      type: "cancel",
      response: (msg, args, user) => {
        msg.removeReactions()
        //client.createMessage(msg.channel.id, `<@${user.id}>, Session Closed!`)
      },
      filter: function(msg, emoji, user) { if(user.id == author) { return true } else { return false } }
    },
    {
      emoji: "▶️",
      type: "edit",
      response: (msg, args, userID) => {
        
        msg.removeReaction("▶️", author)
        
        helpPageNum += 1
        if(helpPageNum > Object.keys(commandTypes).length+1) helpPageNum = 1
        
        return new helpEmbed(helpPageNum, Object.keys(commandTypes).length+1, client, botName, commandTypes, author, msg, prefix, args[0]).embed()
        
      },
      filter: function(msg, emoji, user) { if(user.id == author) { return true } else { return false } }
    },
    {
      emoji: "⏩",
      type: "edit",
      response: (msg, args, user) => {
        msg.removeReaction("⏩", author)
        
        helpPageNum = Object.keys(commandTypes).length+1
        
        return new helpEmbed(helpPageNum, Object.keys(commandTypes).length+1, client, botName, commandTypes, author, msg, prefix, args[0]).embed()
        
      },
      filter: function(msg, emoji, user) { if(user.id == author) { return true } else { return false } }
    },
    {
      emoji: "❓",
      type: "edit",
      response: (msg, args, user) => {
        if(args[0])
          msg.removeReactions()
        else
          msg.removeReactionEmoji("❓")
      }
    }
  ]
})

// ---------------------------------------------

const pingEmbed = require('./utils/pingEmbed.js')

client.registerCommand("ping", async (msg, args) => { return new pingEmbed(msg).embed() }, {
  description: 'Gives latency of bot',
  fullDescription: 'Returnes a message that gives the latency of the bot in milliseconds',
  usage: 'ping'
})

// ---------------------------------------------

const tagUtils = require('./utils/tagUtils.js')

let tagCommand = client.registerCommand("tag", async (msg, args) => { return new tagUtils(client, msg, args, prefix, "tag (name)", tagCommand).main() }, {
  aliases: ["tags"],
  permissionMessage: function() {return noPermissionsEmbed()},
  usage: "tag (name)",
  description: "Main Tag Command"
})

tagCommand.registerSubcommand("create", async (msg, args) => { return new tagUtils(client, msg, args, prefix, "tag create [name] [contents]").create() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "manageGuild": true
    }
  },
  usage: "tag create [name] [contents]",
  description: "Tag Creation Command"
})

tagCommand.registerSubcommand("delete", async (msg, args) => { return new tagUtils(client, msg, args, prefix, "tag delete [name]").delete() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "manageGuild": true
    }
  },
  usage: "tag delete [name]",
  description: "Tag Deletion Command"
})

tagCommand.registerSubcommand("edit", async (msg, args) => { return new tagUtils(client, msg, args, prefix, "tag edit [name] [new contents]").edit() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "manageGuild": true
    }
  },
  usage: "tag edit [name] [contents]",
  description: "Tag Edit Command"
})

tagCommand.registerSubcommand("list", async (msg, args) => { return new tagUtils(client, msg, args, prefix, "tag list").list() }, {
  aliases: ["all"],
  permissionMessage: function() {return noPermissionsEmbed()},
  usage: "tag list",
  description: "Lists All Tags"
})

// ---------------------------------------------

const minecraftUtils = require('./utils/minecraftUtils.js')

let serverCommand = client.registerCommand("server", async(msg, args) => { return new minecraftUtils(client, msg, args, prefix, serverCommand).main() }, {
  aliases: ["mc"],
  usage: "server",
  description: "Main command for getting server info"
})

serverCommand.registerSubcommand("info", async(msg, args) => { return new minecraftUtils(client, msg, args, prefix).getInfo() }, {
  aliases: ['i'],
  usage: "server info",
  description: "Gets basic information about the server"
})

serverCommand.registerSubcommand("players", async(msg, args) => { return new minecraftUtils(client, msg, args, prefix).players() }, {
  aliases: ['online', 'p', 'o'],
  usage: "server players",
  description: "Shows online players"
})

// ---------------------------------------------

const moderationUtils = require('./utils/moderationUtils.js')

client.registerCommand("kick", async (msg, args) => { return new moderationUtils(client, msg, args, "kick [user] (reason)").kick() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "kickMembers": true
    }
  },
  usage: "kick [user] (reason)",
  description: "Kicks User",
  fullDescription: "Allows moderators to kick a user for a specified reason",
})

// ---------------------------------------------

client.registerCommand("ban", async (msg, args) => { return new moderationUtils(client, msg, args, "ban [user] (reason)").ban() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "banMembers": true
    }
  },
  usage: "ban [user] (reason)",
  description: "Bans a User",
  fullDescription: "Allows moderators to ban a user for a specified reason",
})


// ---------------------------------------------

const prefixEmbed = require('./utils/prefixEmbed.js')

client.registerCommand("prefix", async (msg, args) => { return new prefixEmbed(client, args, author, msg, prefix).embed() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "manageGuild": true
    }
  },
  usage: "prefix (new prefix)",
  desription: "Sets the server's prefix",
  fullDescription: "Lets people with the permission `Manage Server` set the server's prefix"
})

// ---------------------------------------------

const configUtils = require('./utils/configUtils.js')

client.registerCommand("config", async (msg, args) => { return new configUtils(client, msg, args).main() }, {
  usage: "config",
  desription: "Shows the main menu for setting up configs",
  fullDescription: "Shows the main menu for server configuration that shows which settings are enabled and/or what value they have"
})

// ---------------------------------------------

const ticketUtils = require('./utils/ticketUtils.js')

let ticketCommand = client.registerCommand("ticket", async (msg, args) => { author = msg.author.id; return new ticketUtils(client, msg, args, author, prefix, ticketCommand).main() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  /*requirements: {
    permissions: {
      "manageGuild": true
    }
  },*/
  usage: "ticket",
  description: "Main ticket command"
})

ticketCommand.registerSubcommand("create", async (msg, args) => { author = msg.author.id; return new ticketUtils(client, msg, args, author, prefix).create() }, {
  aliases: ["new"],
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "manageGuild": true
    }
  },
  usage: "ticket create",
  description: "Ticket creation command"
})

ticketCommand.registerSubcommand("close", async (msg, args) => { author = msg.author.id; return new ticketUtils(client, msg, args, author, prefix).close() }, {
  aliases: ["delete"],
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "manageGuild": true
    }
  },
  usage: "ticket close",
  description: "Ticket closing commmand"
})

ticketCommand.registerSubcommand("auto", async (msg, args) => { author = msg.author.id; return new ticketUtils(client, msg, args, author, prefix).auto() }, {
  aliases: ["autoSetup"],
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    permissions: {
      "manageGuild": true
    }
  },
  usage: "ticket auto",
  description: "Ticket closing commmand"
})
// let ticketConfig = ticketCommand.registerSubcommand("config")

// ---------------------------------------------

client.registerCommand("log", async (msg, args) => { console.log("nothing to see here"); return "Logged Results in Console" }, {
  aliases: ["test"],
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    userIDs: ["425624104901541888"]
  },
  hidden: true,
  usage: 'log',
  description: "Logs in console",
  fullDescription: "Logs a set item into the console. Used by the developer to debug."
})

// ---------------------------------------------

async function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

let evalCommand = client.registerCommand("eval", async (msg, args) => { 
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      return clean(evaled)
    } catch (err) {
      return `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``
    }
  }, {
  permissionMessage: function() { return noPermissionsEmbed() },
  requirements: {
    userIDs: ["425624104901541888"]
  },
  hidden: true,
  usage: 'eval [command]',
  description: 'Runs a command as the bot',
  fullDescription: 'Runs the command as the bot, allowing the owner to debug certain things.'
})

evalCommand.registerSubcommand("test", async (msg, args) => { return "test" }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    userIDs: ["425624104901541888"]
  },
  hidden: true,
  usage: 'eval test',
  description: 'test subcommand'
})

const devUtils = require('./utils/devUtils')

let devCommand = client.registerCommand("dev", async (msg, args) => { return "dev" }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    userIDs: ["425624104901541888"]
  },
  hidden: true,
  usage: 'dev',
  description: 'Main command for the developer'
})

devCommand.registerSubcommand("modifydb", async(msg, args) => { 
  if(!args[2]) return "do the command right mr dev"
  
  if(args[0] == "guild") { return new devUtils(client, msg, args).guild() } 
  else if(args[0] == "tags") { return new devUtils(client, msg, args).tags() } 
  else if(args[0] == "tickets") { return new devUtils(client, msg, args).tickets() }
}, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    userIDs: ["425624104901541888"]
  },
  hidden: true,
  usage: 'dev modifydb [database] [index] [value]',
  description: 'Database modification command'
})

devCommand.registerSubcommand("stop", async(msg, args) => { return new devUtils(client, msg, args).stop() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    userIDs: ["425624104901541888"]
  },
  hidden: true,
  usage: 'dev stop',
  description: 'Stops the bot'
})

devCommand.registerSubcommand("test", async(msg, args) => { return new minecraftUtils(client, msg, args).getInfo() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    userIDs: ["425624104901541888"]
  },
  hidden: true,
  usage: 'dev test',
  description: 'Runs a test'
})

devCommand.registerSubcommand("console", async(msg, args) => { return new minecraftUtils(client, msg, args).console() }, {
  permissionMessage: function() {return noPermissionsEmbed()},
  requirements: {
    userIDs: ["425624104901541888"]
  },
  hidden: true,
  usage: 'dev console',
  description: 'Runs a command from the minecraft server'
})

// ---------------------------------------------------------------------------

client.on('messageReactionAdd', async (msg, emoji) => {

  var storedSettings = await TicketSettings.findOne({ gid: msg.guildID });
  if (!storedSettings) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    const newSettings = new TicketSettings({
      gid: msg.guildID
    });
    await newSettings.save().catch(()=>{});
    storedSettings = await TicketSettings.findOne({ gid: msg.guildID });
  }

  if(msg.id !== storedSettings.ticketCreationMessageID || emoji.id !== storedSettings.ticketCreationMessageEmojiID) return
  
  console.log("pp")

})

client.connect()
