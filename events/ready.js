const moment = require('moment');
require('moment-duration-format');
module.exports = async (client) => {
	client.logger.info('Bot started!');
	client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: 'PLAYING' }], status: 'dnd' });
	client.channels.cache.get('812082273393704960').messages.fetch({ limit: 1 }).then(msg => {
		const mesg = msg.first();
		if (mesg.content !== 'Started Successfully!' && !mesg.webhookId) client.channels.cache.get('812082273393704960').send({ content: 'Started Successfully!' });
	});
	if (!client.application?.owner) await client.application?.fetch();
	const commands = await client.application?.commands.fetch();
	await client.slashcommands.forEach(async command => {
		if (commands.find(c => c.name == command.name) && commands.find(c => c.description == command.description)) return;
		client.logger.info(`Detected /${command.name} has some changes! Updating command...`);
		await client.application?.commands.create({
			name: command.name,
			description: command.description,
			options: command.options,
		});
	});
	await commands.forEach(async command => {
		if (client.slashcommands.find(c => c.name == command.name)) return;
		client.logger.info(`Detected /${command.name} has been deleted! Deleting command...`);
		await command.delete();
	});
	setInterval(async () => {
		const activities = [
			['PLAYING', '{UPTIME}'],
			['PLAYING', 'with you ;)'],
			['COMPETING', `${client.guilds.cache.size} Servers`],
			['PLAYING', '{GUILD}'],
		];
		const activitynumber = Math.round(Math.random() * (activities.length - 1));
		const activity = activities[activitynumber];
		if (activity[1] == '{GUILD}') activity[1] = `in ${client.guilds.cache.get([...client.guilds.cache.keys()][Math.floor(Math.random() * client.guilds.cache.size)]).name}`;
		if (activity[1] == '{UPTIME}') activity[1] = `for ${moment.duration(client.uptime).format('D [days], H [hrs], m [mins], s [secs]')}`;
		client.user.setPresence({ activities: [{ name: activity[1], type: activity[0] }] });
	}, 5000);
	setInterval(async () => {
		const memberdata = Array.from(client.memberdata);
		memberdata.forEach(async data => {
			if (data[1].mutedUntil < Date.now() && data[1].mutedUntil != 0) {
				const guild = await client.guilds.cache.get(data[0].split('-')[1]);
				const member = await guild.members.cache.get(data[0].split('-')[0]);
				const role = await guild.roles.cache.get(client.settings.get(guild.id).muterole);
				member.user.send({ content: '**You have been unmuted**' });
				client.memberdata.set(data[0], 0, 'mutedUntil');
				client.logger.info(`Unmuted ${member.user.tag} in ${guild.name}`);
				await member.roles.remove(role);
			}
			else if (data[1].bannedUntil < Date.now() && data[1].bannedUntil != 0) {
				const guild = await client.guilds.cache.get(data[0].split('-')[1]);
				client.users.cache.get(data[0].split('-')[0]).send({ content: `**You've been unbanned in ${guild.name}**` });
				client.memberdata.set(data[0], 0, 'bannedUntil');
				client.logger.info(`Unbanned ${client.users.cache.get(data[0].split('-')[0]).tag} in ${guild.name}`);
				await guild.members.unban(data[0].split('-')[0]);
			}
			else if (data[1].mutedUntil == 0 && data[1].bannedUntil == 0) {
				client.memberdata.delete(data[0]);
			}
		});
	}, 10000);
	const timer = (Date.now() - client.startTimestamp) / 1000;
	client.logger.info(`Done (${timer}s)! I am running!`);
};