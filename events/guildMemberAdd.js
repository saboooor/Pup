module.exports = (client, member) => {
	const srvconfig = client.settings.get(member.guild.id);
	if (srvconfig.joinmessage == 'false') return;
	if (!member.guild.systemChannel) {
		client.logger.warn(`${member.guild.name} (${member.guild.fetchOwner().tag}) has misconfigured join messages!`);
		return member.guild.fetchOwner().send({ content: `Join messages are enabled but a system message channel isn't set! Please either go into your server settings (${member.guild.name}) and set the system message channel or turn off join messages with the command \`${srvconfig.prefix}settings joinmessage false\`` });
	}
	member.guild.systemChannel.send({ content: srvconfig.joinmessage.replace(/{USER MENTION}/g, client.users.cache.get(member.id)).replace(/{USER TAG}/g, client.users.cache.get(member.id).tag) });
};