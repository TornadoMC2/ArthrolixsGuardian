const utils = require('minecraft-server-util')
function minecraftUtils(client, msg, args, prefix, command) {
  
  let subCommands = [
    "info",
    "players"
  ]
  
  this.main = async function() {
    
    let commands = command.subcommands
    
    let ctn = `\`${prefix}${command.usage}\` - ${command.description}`
    for(var i in subCommands) {
      ctn += `\n\n\`${prefix}${commands[subCommands[i]].usage}\` - ${commands[subCommands[i]].description}`
    }
    
    let embed = {
      title: `Arthrolix's Guardian Server Help`,
      description : ctn,
      color: 0x23c248,
      footer: {
        text: `[] = Required () = Optional`
      }
    }
    
    return {embed}
    
  }
  
  
  this.getInfo = async function() {
    
    let data;    
    
    await utils.queryFull('51.79.105.235', { port: 25582, timeout: 10000 }).then(res => {
      data = res
    })
    
    let embed = {
      title: `Arthrolix SMP Server Info`,
      description : `IP: \`${data.host}:${data.port}\`\n\nVersion: \`${data.version}\`\n\nPlayers: \`${data.onlinePlayers}\`/\`${data.maxPlayers}\``,
      color: 0x23c248,
    }
    
    return {embed}
    
  }
  
  this.players = async function() {
    
    let data;    
    
    await utils.queryFull('51.79.105.235', { port: 25582, timeout: 10000 }).then(res => {
      data = res
    })
    
    
    let ctn = `Online: \`${data.onlinePlayers}\`/\`${data.maxPlayers}\`\n`
    
    for(var i in data.players) { 
      ctn += `\n\`${data.players[i]}\``
    }
    
    let embed = {
      title: `Arthrolix SMP Online Players`,
      description : ctn,
      color: 0x23c248,
    }
    
    return {embed}
    
  }
  
  this.console = async function() {
    
    const server = new utils.RCON('51.79.105.235', { port: 8145, password: process.env.RCON_PASS})
    
    server.on('output', (message) => {
      console.log("e")
      console.log(message)
    })
    
    server.connect().then(async () => {
      await server.run(args.join(" ")).then(() => { server.close() }).catch((e) => { console.log(e) })
    })
    
  }
  
}

module.exports = minecraftUtils