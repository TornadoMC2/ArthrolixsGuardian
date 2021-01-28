function moderationUtils(client, msg, args, usage) {
  
  this.client = client
  this.msg = msg
  this.args = args
  this.usage = usage
  
  let user = this.msg.mentions[0]
  
  console.log()
  
  this.kick = async function() {
    
    if(!this.args[0] || !user) {
      let embed = {
        title: "Thats not right!",
        description: `The correct way to use this command is \`${this.usage}\``,
        color: 0xeb4034,
        footer: {
          text: "[] = Required () = Optional"
        }
      }
      return {embed}
    }
    
    if(this.args[1])
      try {
        this.args.shift()
        await client.kickGuildMember(this.msg.guildID, user.id, this.args.join(" "))
        let embed = {
          title: "Success!",
          description: `Successfully kicked <@${user.id}>! Reason: \`${this.args.join(" ")}\``,
          color: 0x23c248
        }
        return {embed}
      } catch(err) {
        console.log(err)
        let embed = {
          title: "Thats not right!",
          description: `Something went wrong while running this command`,
          color: 0xeb4034,
        }
        return {embed}
      }
    else {
      try {
        await client.kickGuildMember(msg.guildID, user.id)
        let embed = {
          title: "Success!",
          description: `Successfully kicked <@${user.id}>!`,
          color: 0x23c248
        }
        return {embed}
      } catch(err) {
        console.log(err)
        let embed = {
          title: "Thats not right!",
          description: `Something went wrong while running this command`,
          color: 0xeb4034,
        }
        return {embed}
      }
    }
    //let embed = {title: ""}
    
    //if(this.args[1])
      //await client.kickGuildMember(msg.guildID, args[0], args[1]).catch()
  }
  
  this.ban = async function() {
    
    if(!this.args[0] || !user) {
      let embed = {
        title: "Thats not right!",
        description: `The correct way to use this command is \`${this.usage}\``,
        color: 0xeb4034,
        footer: {
          text: "[] = Required () = Optional"
        }
      }
      return {embed}
    }
    
    if(this.args[1])
      try {
        this.args.shift()
        await client.banGuildMember(this.msg.guildID, user.id, 0, this.args.join(" "))
        let embed = {
          title: "Success!",
          description: `Successfully banned <@${user.id}>! Reason: \`${this.args.join(" ")}\``,
          color: 0x23c248
        }
        return {embed}
      } catch(err) {
        console.log(err)
        let embed = {
          title: "Thats not right!",
          description: `Something went wrong while running this command`,
          color: 0xeb4034,
        }
        return {embed}
      }
    else {
      try {
        await client.banGuildMember(msg.guildID, user.id, 0)
        let embed = {
          title: "Success!",
          description: `Successfully banned <@${user.id}>!`,
          color: 0x23c248
        }
        return {embed}
      } catch(err) {
        console.log(err)
        let embed = {
          title: "Thats not right!",
          description: `Something went wrong while running this command`,
          color: 0xeb4034,
        }
        return {embed}
      }
    }
    
  }
  
  
}
module.exports = moderationUtils