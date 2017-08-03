/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class FirstCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			guildOnly: true,
			name: 'userinfo',
			aliases: ['ui'],
			group: 'util',
			memberName: 'userinfo',
			description: 'Gets the first image uploaded to Derpibooru matching the given query',
			examples: ['userinfo @somedude#1234'],
			args: [
				{
					key: 'member',
					label: 'member',
					prompt: 'Who should I fetch the user info for?',
					type: 'member'
				}
			]
		});
	}

	async run(msg, args) {
		let {member} = args;

		let embed = {
			color: member.displayColor,
			thumbnail: {
				url: member.user.avatarURL
			},
			title: member.nickname ? (`${member.nickname} (@${member.user.tag})`) : member.user.tag,
			fields: [
				{
					name: 'ID',
					value: member.user.id
				},
				{
					name: 'Joined Discord on',
					value: member.user.createdAt.toString()
				},
				{
					name: `Joined ${msg.guild.name} on`,
					value: member.joinedAt.toString()
				},
				{
					name: 'Roles',
					value: member.roles.array().splice(1).join(', ') || 'None'
				}
			]
		};

		if (member.user.bot) return msg.channel.sendEmbed(embed);

		member.user.fetchProfile().then((profile) => {
			embed.fields.push(
				{
					name: 'Mutual servers',
					value: profile.mutualGuilds.array().join(', ') || 'None'
				},
				{
					name: 'Has Nitro',
					value: `${profile.premiumSince ? `Yes (since ${profile.premiumSince.toString()})` : 'No'}`
				}
			);

			msg.channel.sendEmbed(embed);
		});
	}
};