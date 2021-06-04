module.exports = (client, member) => {
	const srvconfig = client.settings.get(member.guild.id);
	if (srvconfig.joinmessage == 'false') return;
	if (!member.guild.systemChannel) {
		client.logger.log('warn', `${member.guild.name} (${client.users.cache.get(member.guild.ownerID).tag}) has misconfigured join messages!`);
		return client.users.cache.get(member.guild.ownerID).send(`Join messages are enabled but a system message channel isn't set! Please either go into your server settings (${member.guild.name}) and set the system message channel or turn off join messages with the command \`${srvconfig.prefix}settings joinmessage false\``);
	}
	member.guild.systemChannel.send(srvconfig.joinmessage.replace(/{USER MENTION}/g, client.users.cache.get(member.id)).replace(/{USER TAG}/g, client.users.cache.get(member.id).tag));
};