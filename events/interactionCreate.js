const Discord = require('discord.js');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
module.exports = (client, interaction) => {
	if (interaction.isButton()) {
		const button = client.buttons.get(interaction.customId);
		if (!button) return;

		if (button.permissions && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(button.permissions)) {
				interaction.deferUpdate();
				return interaction.user.send({ content: 'You can\'t do that!' });
			}
		}

		try {
			client.logger.info(`${interaction.user.tag} clicked button: ${button.name}`);
			button.execute(interaction, client);
		}
		catch (error) {
			const interactionFailed = new Discord.MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor(interaction.user.tag, interaction.user.avatarURL())
				.addField('**Type:**', 'Button')
				.addField('**Interaction:**', button.name)
				.addField('**Error:**', clean(error));
			if (interaction.guild) interactionFailed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] });
			client.logger.error(error);
		}
	}
	else if (interaction.isSelectMenu()) {
		const dropdown = client.dropdowns.get(interaction.values[0]);
		if (!dropdown) return;

		if (dropdown.permissions && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(dropdown.permissions)) {
				interaction.deferUpdate();
				return interaction.user.send({ content: 'You can\'t do that!' });
			}
		}

		try {
			client.logger.info(`${interaction.user.tag} clicked dropdown: ${interaction.values[0]}`);
			dropdown.execute(interaction, client);
		}
		catch (error) {
			const interactionFailed = new Discord.MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor(interaction.user.tag, interaction.user.avatarURL())
				.addField('**Type:**', 'Dropdown')
				.addField('**Interaction:**', interaction.values[0])
				.addField('**Error:**', clean(error));
			if (interaction.guild) interactionFailed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] });
			client.logger.error(error);
		}
	}
	else if (interaction.isCommand()) {
		const command = client.slashcommands.get(interaction.commandName);
		const args = interaction.options;
		if (!command) return;

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1200;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			const random = Math.floor(Math.random() * 4);
			const messages = ['Do I look like Usain Bolt to u?', 'BRUH IM JUST A DOG SLOW DOWN', 'can u not', 'leave me alone ;-;'];
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				if ((expirationTime - now) < 1200) return;
				const Embed = new Discord.MessageEmbed()
					.setColor(Math.round(Math.random() * 16777215))
					.setTitle(messages[random])
					.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
				return interaction.reply({ embeds: [Embed], ephemeral: true });
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		if (!interaction.guild && command.guildOnly) {
			return interaction.reply({ content: 'You can only execute this command in a Discord Server!', ephemeral: true });
		}

		if (command.permissions && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return interaction.reply({ content: 'You can\'t do that!', ephemeral: true });
			}
		}

		try {
			client.logger.info(`${interaction.user.tag} issued slash command: /${command.name}`);
			command.execute(interaction, args, client);
		}
		catch (error) {
			const interactionFailed = new Discord.MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor(interaction.user.tag, interaction.user.avatarURL())
				.addField('**Type:**', 'Slash')
				.addField('**Interaction:**', command.name)
				.addField('**Error:**', clean(error));
			if (interaction.guild) interactionFailed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] });
			client.logger.error(error);
		}
	}
};