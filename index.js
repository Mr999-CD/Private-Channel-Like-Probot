client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldowns = new Discord.Collection();
let prefix = "+";
client.prefix = prefix;
let colors = require("colors")
let { readdir } = require("fs");
let { readdirSync } = require("fs");
let fs = require("fs");
let table = require("ascii-table")
let command = new table("Commands")
command.setHeading("Commands","Status","Enable","cooldown")
let event = new table("Commands")
event.setHeading("Events","Status")
let error = new table("Error")
error.setHeading("File","Error")
const config = async () => {
  //Command
  console.log("================".grey)
  console.log("[LOG]- Loading commands - [LOAD]".bold.cyan)
  console.log("================".grey)
  readdirSync("./commands/").forEach(dir => {
    const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
      for (let file of commands) {
        let c = require(`./commands/${dir}/${file}`);
        if(!c.help) {
          //console.log(`[LOG] - Unable to load file ${file} , Error : Missing help.name - [ERROR]`.red)
          error.addRow(file,"Missing help.name")
          console.log(error.toString().red)
          console.log("================".grey)
          continue
        }
        if (c.help.name) {
          client.commands.set(c.help.name, c);
          command.addRow(file, '✅',c.conf.enabled,c.conf.cooldown);
        } else {
          command.addRow(file, `❌`,"Error","Error");
          continue;
        }
        if (c.conf.aliases && Array.isArray(c.conf.aliases)) c.conf.aliases.forEach(alias => client.aliases.set(alias, c.help.name));        
      }
    });
  console.log(command.toString().blue)
  //Events
  console.log("================".grey)
  console.log("[LOG]- Loading events - [LOAD]".bold.cyan)
  console.log("================".grey)
  readdirSync("./events/").forEach(dir => {
    let events = readdirSync(`./events/${dir}/`).filter(file =>
      file.endsWith(".js")
    );
    for(let file of events){
      let e = require(`./events/${dir}/${file}`)
      if(e.name){
        client.events.set(e.name , e)
        event.addRow(file , "✅")
        client.on(e.name , (...args) => e.execute(...args , client))
      } else {
        event.addRow(file , "❌")
        continue;
      }
    }
  });
  console.log(event.toString().brightBlue)
}
config()
