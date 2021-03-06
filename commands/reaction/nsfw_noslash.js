function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'nsfw',
	description: 'Toggle the NSFW role',
	async execute(message, user, client, reaction) {
		if (message.guild.id !== '661736128373719141' && message.guild.id !== '811354612547190794' && client.user.id !== '765287593762881616') return;
		if (reaction) message.author = user;
		const member = await message.guild.members.cache.find(m => m.id === message.author.id);
		const role = await message.guild.roles.cache.find(r => r.name.toLowerCase() === 'nsfw');
		if (!member.roles.cache.has(role.id)) {
			await member.roles.add(role);
			const msg = await message.channel.send({ content: `✅ **Added NSFW Role to ${message.author}**` });
			if (reaction) {
				await sleep(1000);
				await msg.delete();
			}
		}
		else {
			await member.roles.remove(role);
			const msg = await message.channel.send({ content: `❌ **Removed NSFW Role from ${message.author}**` });
			if (reaction) {
				await sleep(1000);
				await msg.delete();
			}
		}
	},
};