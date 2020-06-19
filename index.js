require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
var channels = process.env.channels.split(',')

client.login(process.env.token);
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', /** @param {import('discord.js').Message} */ async (msg) => {
	if (channels.includes(msg.channel.id)) {
		var prevmsg = await (await msg.channel.messages.fetch({ limit: 1, before: msg.id })).first();
		if (msg.author.id == prevmsg.author.id) {
			msg.delete();
			msg.author.send(`You can't count further on your own. Please wait for someone else to say the next number.`);
		} else {
			var dif = parseInt(msg.content) - parseInt(prevmsg.content);
			if (isNaN(dif)) {
				msg.delete();
				msg.author.send(`Please don't talk in a count-to-number channel.`);
			} else if (dif == 0) {
				msg.delete();
				msg.author.send(`You're supposed to say the next number to the same number.`);
			} else if (dif !== 1) {
				msg.delete();
				msg.author.send(`For as far as i know ${msg.content} isn't the number that comes after ${prevmsg.content}.`);
			}
		}
	}
});