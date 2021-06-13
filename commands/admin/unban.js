const Discord = require('discord.js');
module.exports = {
	name: 'unban',
	description: 'Unban someone that was banned from the guild',
	args: true,
	usage: '<User>',
	permissions: 'BAN_MEMBERS',
	cooldown: 5,
	guildOnly: true,
	options: [{
		type: 3,
		name: 'user',
		description: 'User to unban',
		required: true,
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		if (!client.users.cache.get(args[0])) return message.reply('Invalid user! Please use a user ID or unban through server settings.');
		const user = client.users.cache.get(args[0]);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`Unbanned ${user.tag}`);
		await user.send(`**You've been unbanned in ${message.guild.name}`).catch(e => {
			message.channel.send('Could not DM user! You may have to manually let them know that they have been unbanned.');
		});
		if (message.commandName) message.reply({ embeds: [Embed], ephemeral: true });
		else message.reply(Embed);
		message.guild.members.unban(args[0]);
		client.logger.info(`Unbanned user: ${user.tag} in ${message.guild.name}`);
	},
};