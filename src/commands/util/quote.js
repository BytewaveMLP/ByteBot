/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class FirstCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			guildOnly: true,
			name: 'quote',
			aliases: ['q'],
			group: 'util',
			memberName: 'quote',
			description: 'Sends an embed with the specified user as the author with the given text',
			examples: ['quote @somedude#1234 i\'m gay'],
			args: [
				{
					key: 'member',
					label: 'member',
					prompt: '',
					default: '',
					type: 'member'
				},
				{
					key: 'text',
					label: 'text',
					prompt: '',
					default: '',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		let {member, text} = args;

		if (member === '') {
			return msg.reply('You forgot to tell me who to quote!');
		}

		if (text === '') {
			return msg.reply('You forgot to tell me what to say!');
		}

		msg.channel.send('', {
			embed: {
				color: member.displayColor,
				description: text,
				author: {
					name: member.nickname ? (`${member.nickname} (@${member.user.tag})`) : member.user.tag,
					icon_url: member.user.displayAvatarURL()
				}
			}
		});
	}
};