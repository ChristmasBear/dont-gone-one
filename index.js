const Discord = require('discord.js');
const { MessageEmbed, ReactionCollector } = Discord;
const client  = new Discord.Client();
const { key } = require('./keys.json');
const mongo = require('./mongo');
const settingsSchema = require('./schemas/settings-schema');
const fs = require('fs')
const cache = {}

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
	console.log('ready');
    await mongo().then(mongoose => {
        mongoose.set('useFindAndModify', false)
        console.log('Connected to MongoDB:', true)
    })
})

client.on('message', async (message) => {
    if (!message.content.startsWith('.') || message.author.bot) return;

	const args = message.content.slice(1).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
    
})

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember._roles.length !== newMember._roles.length) {
        const difference = (oldMember._roles.length < newMember._roles.length) ? newMember._roles.filter(( el ) => !oldMember._roles.includes( el )) : oldMember._roles.filter(( el ) => !newMember._roles.includes( el ));
        const add = (oldMember._roles.length < newMember._roles.length) ? true : false;
        const role = newMember.guild.roles.cache.find(r => r.id === difference[0]);
        if (!cache[newMember.guild.id]) {
            cache[newMember.guild.id] = await settingsSchema.findOne({ _id: newMember.guild.id })
            if (!cache[newMember.guild.id]) return
        }
        if (cache[newMember.guild.id]['roles'].includes(role.id)) {
            (add) ? newMember.setNickname(`${role.name} >> ${(newMember.nickname) ? newMember.nickname : newMember.user.username}`) : newMember.setNickname(newMember.user.username);
        } else {
            console.log('dont change that')
        }
        
        
    } else {
        console.log((newMember.nickname) ? newMember.nickname : newMember.user.username)
    }
});
    


module.exports.update = function update (id, _new) {
    cache[id] = _new
}

client.login(key).then(r => {
	r = r !== null;
	console.log('Logged in:', r);
});