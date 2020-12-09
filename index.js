require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));

client.login(process.env.token);
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', /** @param {import('discord.js').Message} */ async (msg) => {
	if (config.channels.hasOwnProperty(msg.channel.id)) {
		var prevmsg = await (await msg.channel.messages.fetch({ limit: 1, before: msg.id })).first();
		if (prevmsg.editedAt !== null) {
			msg.delete();
			prevmsg.delete();
			msg.author.send(`Your latest message was removed due to the previous message being edited.`);
			if (config.channels[msg.channel.id].mutedrole !== "0" && config.channels[msg.channel.id].log !== "0") {
				prevmsg.member.roles.add(config.channels[msg.channel.id].mutedrole).then(() => {
					prevmsg.author.send(`You last message has been deleted and you've been temporarly restricted on suspicion of cheating.`);
					const embed = {
						'title': `Muted ${prevmsg.author.tag} on the suspicion of cheating.`,
						'color': 11141120
					}
					client.channels.cache.get(config.channels[msg.channel.id].log).send({ embed })
				}).catch((err) => {
					throw err;
				})
			}
		}
		if (msg.author.id == prevmsg.author.id) {
			msg.delete();
			msg.author.send(`You can't count further on your own. Please wait for someone else to say the next number.`);
		} else {
			msg.content = parseInt(msg.content);
			prevmsg.content = parseInt(prevmsg.content);
			var dif = msg.content - prevmsg.content;
			if (isNaN(msg.content)) {
				msg.delete();
				msg.author.send(`Please don't talk in a count-to-number channel.`);
			} else if (isNaN(prevmsg.content)) {
				msg.delete();
				prevmsg.delete();
				msg.author.send(`Apparently someone was able to talk in a count-to-number channel :thinking:.`);
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