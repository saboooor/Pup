const nodeactyl = require('nodeactyl');
const servers = require('../../config/pterodactyl.json');
module.exports = {
	name: 'bungee',
	description: 'Nether Depths proxy console',
	aliases: ['b'],
	args: true,
	usage: '<Command>',
	async execute(message, args, client) {
		const server = servers['nether depths bungee'];
		const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
		if (!client.guilds.cache.get(server.guildid).members.cache.get(message.member.id) || !client.guilds.cache.get(server.guildid).members.cache.get(message.member.id).roles.cache.has(server.roleid)) return message.reply({ content: 'You can\'t do that!' });
		Client.sendServerCommand(server.id, args.join(' '));
		message.reply({ content: `Sent command \`${args.join(' ')}\` to Bungee` });
	},
};