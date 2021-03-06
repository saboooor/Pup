const cron = require('node-cron');
const Discord = require('discord.js');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const hastebin = require('hastebin');
module.exports = client => {
	cron.schedule('0 0 * * *', () => {
		client.channels.cache.forEach(async channel => {
			if (client.tickets.get(channel.id) && client.tickets.get(channel.id).resolved == 'true' && channel.name.includes('ticket-')) {
				channel.setName(channel.name.replace('ticket', 'closed'));
				await sleep(1000);
				if (channel.name.includes(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return channel.send({ content: 'Failed to close ticket, please try again in 10 minutes' });
				client.tickets.set(channel.id, 'false', 'resolved');
				client.tickets.get(channel.id).users.forEach(userid => {
					channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false });
				});
				const messages = await channel.messages.fetch({ limit: 100 });
				const logs = [];
				await messages.forEach(async msg => {
					const time = new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
					logs.push(`[${time}] ${msg.author.tag}\n${msg.content}`);
				});
				logs.reverse();
				const link = await hastebin.createPaste(logs.join('\n\n'), { server: 'https://bin.birdflop.com' });
				const users = [];
				await client.tickets.get(channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
				const EmbedDM = new Discord.MessageEmbed()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Closed ${channel.name}`)
					.addField('**Users in ticket**', `${users}`)
					.addField('**Transcript**', `${link}.txt`)
					.addField('**Closed by**', 'Automatically closed');
				client.logger.info(`Created transcript of ${channel.name}: ${link}.txt`);
				users.forEach(usr => { usr.send({ embeds: [EmbedDM] }); });
				const Embed = new Discord.MessageEmbed()
					.setColor(15105570)
					.setDescription('Ticket automatically closed resolved ticket');
				if (client.settings.get(channel.guild.id).tickets == 'buttons') {
					const row = new Discord.MessageActionRow()
						.addComponents([
							new Discord.MessageButton()
								.setCustomId('delete_ticket')
								.setLabel('Delete Ticket')
								.setEmoji('⛔')
								.setStyle('DANGER'),
							new Discord.MessageButton()
								.setCustomId('reopen_ticket')
								.setLabel('Reopen Ticket')
								.setEmoji('🔓')
								.setStyle('PRIMARY'),
						]);
					channel.send({ embeds: [Embed], components: [row] });
				}
				else {
					channel.send({ embeds: [Embed] });
				}
				if (client.settings.get(channel.guild.id).tickets == 'reactions') {
					Embed.setColor(3447003);
					Embed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
					const embed = await channel.send({ embeds: [Embed] });
					embed.react('🔓');
					embed.react('⛔');
				}
				client.logger.info(`Closed resolved ticket #${channel.name}`);
			}
		});
	});
	client.logger.info('Ticket autoclose loaded');
};