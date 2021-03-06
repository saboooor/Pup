const fs = require('fs');
module.exports = (prefix, Embed, srvconfig) => {
	const adminCommands = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
	const commands = [];
	for (const file of adminCommands) {
		const command = require(`../commands/admin/${file}`);
		commands.push(command);
	}
	const commandlist = Object.keys(commands).map(i => {
		return `**${prefix}${commands[i].name} ${commands[i].usage}**\n${commands[i].description}\n*Permission: ${commands[i].permissions}*`;
	});
	Embed.setDescription(`
**ADMIN COMMANDS:**
*These commands require the member to have specified permissions.*
[] = Optional
<> = Required

${srvconfig.adminrole ? commandlist.join('\n').replace(/ADMINISTRATOR/g, `<@&${srvconfig.adminrole}>`) : commandlist.join('\n')}
`);
};