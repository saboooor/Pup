const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Get help with Pup!',
	aliases: ['commands'],
	cooldown: 2,
	guildOnly: true,
	options: [{
		type: 3,
		name: 'type',
		description: 'The type of help you need',
		required: false,
		choices: [{
			name: 'features',
			value: 'features',
		},
		{
			name: 'commands',
			value: 'commands',
		},
		{
			name: 'nsfw',
			value: 'nsfw',
		},
		{
			name: 'admin',
			value: 'admin',
		},
		{
			name: 'support',
			value: 'support',
		},
		{
			name: 'supportpanel (ADMIN ONLY)',
			value: 'supportpanel',
		}],
	}],
	async execute(message, args, client) {
		if (message.commandName) args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		const srvconfig = client.settings.get(message.guild.id);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215));
		let arg = args[0];
		if (arg) arg = arg.toLowerCase();
		if (arg == 'commands') {
			require('../../../help/commands.js')(srvconfig, Embed);
		}
		else if (arg == 'features') {
			require('../../../help/features.js')(srvconfig, Embed);
		}
		else if (arg == 'admin') {
			require('../../../help/admin.js')(srvconfig, Embed);
		}
		else if (arg == 'nsfw') {
			require('../../../help/nsfw.js')(srvconfig, Embed);
		}
		else if (arg == 'support') {
			require('../../../help/support.js')(srvconfig, Embed);
		}
		else if (arg == 'supportpanel') {
			if (!message.member.permissions.has('ADMINISTRATOR')) return;
			Embed.setDescription('Created support panel! You may now delete this message, otherwise it\'ll be deleted in 10 seconds');
			const Panel = new Discord.MessageEmbed()
				.setColor(3447003)
				.setTitle('Need help? No problem!')
				.setDescription('React with 🎫 to open a ticket!')
				.setFooter(`${message.guild.name} Support`, message.guild.iconURL());
			const msg = await message.channel.send(Panel);
			await msg.react('🎫');
		}
		else {
			Embed.setDescription(`
**HELP**

Please use the buttons below to navigate through the help menu

**Want to support the bot? [Donate here!](https://paypal.me/youhavebeenyoted)**
**Still need help with the bot? Do ${srvconfig.prefix}invite!**
`);
		}
		const row = new Discord.MessageActionRow()
			.addComponents([
				new Discord.MessageButton()
					.setCustomID('help_features')
					.setLabel('Features')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setCustomID('help_commands')
					.setLabel('Commands')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setCustomID('help_nsfw')
					.setLabel('NSFW')
					.setStyle('DANGER'),
				new Discord.MessageButton()
					.setCustomID('help_admin')
					.setLabel('Admin')
					.setStyle('SECONDARY')]);
		if (message.commandName) message.reply({ embeds: [Embed], components: [row], ephemeral: true });
		else message.reply({ embed: Embed, components: [row] });
	},
};