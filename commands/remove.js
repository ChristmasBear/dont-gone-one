const settingsSchema = require('../schemas/settings-schema');
const index = require('../index');
module.exports = {
	name: 'remove',
    
	async execute(message, args) {
		if (args.length !== 1) return message.reply('smh cant use a simple bot');

        let roles = await settingsSchema.findOne({ _id: message.guild.id })
        roles = roles['roles']
        
        if (!isNaN(args[0])) {
            if (roles === undefined || !roles.includes(args[0])) return message.reply('bad at video games');
            roles = roles.filter(e => e !== args[0])
        } else if (message.mentions.roles.first()) {
            const role = message.mentions.roles.first()
            if (roles === undefined || !roles.includes(role.id)) return message.reply('bad at video games');
            roles = roles.filter(e => e !== role.id)
        } else {
            return message.reply('smh cant use a simple bot')
        }

        await settingsSchema.findByIdAndUpdate({
            _id: message.guild.id
        }, {
            roles: roles
        }, {
            upsert: true,
        }).exec()
        message.reply('you finally did it')
        console.log(roles)
        index.update(message.guild.id, roles)
	},
};