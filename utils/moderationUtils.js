function moderationUtils(client, msg, args, usage) {
  
  this.client = client
  this.msg = msg
  this.args = args
  this.usage = usage
  
  let user = this.msg.mentions[0]
  
  this.incorrectUsageEmbed = function() {
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
  this.errorEmbed = function() {
    let embed = {
      title: "Thats not right!",
      description: `Something went wrong while running this command`,
      color: 0xeb4034,
    }
    return {embed}
  }
  
  this.kick = async function() {
    
    if(!this.args[0] || !user) {
      return this.incorrectUsageEmbed();
    }
    
    try {
      this.args.shift()
      await this.client.kickGuildMember(this.msg.guildID, user.id, 0, (this.args[1] ? this.args.join(" ") : "No reason"))
      let embed = {
        title: "Success!",
        description: `Successfully kicked <@${user.id}>!\n\nReason: \`${this.args[1] ? this.args.join(" ") : "No reason"}\``,
        color: 0x23c248
      }
      return {embed}
    } catch(err) {
      console.log(err)
      return this.errorEmbed();
    }

  }
  
  this.ban = async function() {
    
    if(!this.args[0] || !user) {
      return this.incorrectUsageEmbed()
    }
    
    try {
      this.args.shift()
      await this.client.banGuildMember(this.msg.guildID, user.id, 0, (args[1] ? this.args.join(" ") : "No reason"))
      let embed = {
        title: "Success!",
        description: `Successfully banned <@${user.id}>!\n\nReason: \`${args[1] ? this.args.join(" ") : "No reason"}\``,
        color: 0x23c248
      }
      return {embed}
    } catch(err) {
      console.log(err)
      return this.errorEmbed();
    }
    
  }
  
}
module.exports = moderationUtils