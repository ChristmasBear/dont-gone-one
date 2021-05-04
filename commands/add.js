const settingsSchema = require('../schemas/settings-schema');
const index = require('../index');
module.exports = {
	name: 'add',

	async execute(message, args) {
		if (args.length !== 1) message.reply('smh cant use a simple bot');

        let roles = await settingsSchema.findOne({ _id: message.guild.id })
        roles = roles['roles']

        if (!isNaN(args[0])) {
            if (roles === undefined) roles = args[0]; else roles.push(args[0]);
        } else if (message.mentions.roles.first()) {
            const role = message.mentions.roles.first()
            if (roles === undefined) roles = role.id; else roles.push(role.id);
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
        index.update(message.guild.id, roles)
        console.log(roles)
	},
};