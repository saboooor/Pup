const Discord = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Pong!',
	aliases: ['pong'],
	cooldown: 10,
	execute(message, args, client) {
		const row = new Discord.MessageActionRow()
			.addComponents(new Discord.MessageButton()
				.setCustomId('ping_again')
				.setLabel('Click here to ping again!')
				.setStyle('PRIMARY'));
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Pong!')
			.setDescription(`${Date.now() - message.createdTimestamp}ms`);
		message.reply({ embeds: [Embed], components: [row], ephemeral: true });
	},
};