#!/usr/bin/env node
"use strict";

import * as Discord from "discord.js";


const bot = new Discord.Client();

const config = require("../config.json");

/**
 * Pads a number with zeroes
 * @param {number} num The number
 * @param {number} [len] The desired string length
 * @returns {string} The result
 */
function padZero(num: number, len?: number): string {
	let txt = String(num);
	len = len || 2;
	while (txt.length < len) txt = "0" + txt;
	return txt;
}

/**
 * Gets a datetime string to use for the log prefix
 * @returns {string} The prefix
 */
function getLogPrefix(): string {
	const t = new Date();
	return `[${padZero(t.getDate())}-${padZero(t.getMonth() + 1)}-${t.getFullYear()} ${padZero(t.getHours())}:${padZero(t.getMinutes())}:${padZero(t.getSeconds())}:${padZero(t.getMilliseconds(), 3)}] `;
}

/**
 * Logs things with a prefix
 * @param {...{}[]} x The parameters
 */
function logPrefixed(...x: {}[]) {
	arguments[0] = getLogPrefix() + (arguments[0] as string);
	console.log.apply(console, arguments);
}

/**
 * Attempts to get a unique name/identifier for an entity
 * @param {any} entity The Entity
 * @returns A unique id string
 */
function entityToStr(entity) {
	if (!entity || typeof entity === "undefined") { return "[ErrorEntityUndefined]"; }
	if (entity instanceof Discord.GuildMember) { return `[Member#${entity.id}](@${entity.user.username}#${entity.user.discriminator})`; }
	if (entity instanceof Discord.User) { return `[User#${entity.id}](@${entity.username}#${entity.discriminator})`; }
	if (entity instanceof Discord.Guild) { return `[Guild#${entity.id}](${entity.name})`; }
	if (entity instanceof Discord.TextChannel) { return `[Channel#${entity.id}](#${entity.name})`; }
	if (entity instanceof Discord.GuildChannel) { return `[Channel#${entity.id}](${entity.name})`; }
	if (entity instanceof Discord.Emoji) { return `[Emoji#${entity.id}](:${entity.name}:)`; }
	if (entity instanceof Discord.Role) { return `[Emoji#${entity.id}](@${entity.name})`; }
	return entity.id ? `[${entity.constructor.name}#${entity.id}]` : `[${entity.id}]`;
}

/**
 * Splits a string into a parameter list.
 * Shamelessly stolen from https://github.com/mccormicka/string-argv
 * @param {string} value The input string
 * @returns {string[]} The list of parameters found
 */
function splitPars(value: string): string[] {
	// ([^\s'"]+(['"])([^\2]*?)\2) Match `text"quotes text"`

	// [^\s'"] or Match if not a space ' or "

	// (['"])([^\4]*?)\4 or Match "quoted text" without quotes
	// `\2` and `\4` are a backreference to the quote style (' or ") captured
	const myRegexp = /([^\s'"]+(['"])([^\2]*?)\2)|[^\s'"]+|(['"])([^\4]*?)\4/gi;
	const myArray: string[] = [];
	let match: RegExpExecArray | null;
	do {
		// Each call to exec returns the next regex match as an array
		match = myRegexp.exec(value);
		if (match !== null) {
			// Index 1 in the array is the captured group if it exists
			// Index 0 is the matched text, which we use if no captured group exists
			myArray.push(match[1] || match[5] || match[0]);
		}
	} while (match !== null);

	return myArray;
}

const commands = {
	shrug: (message: Discord.Message, parString: string) => {
		message.edit(parString + " ¯\\_(ツ)_/¯");
	},

	table: (message: Discord.Message, parString: string) => {
		message.edit(parString + " (╯°□°）╯︵ ┻━┻");
	},
	tableflip: (a, b) => commands.table(a, b),

	unflip: (message: Discord.Message, parString: string) => {
		message.edit(parString + " ┬─┬ ノ( ゜-゜ノ)");
	},
	untable: (a, b) => commands.unflip(a, b),

	playing: (message: Discord.Message, parString: string) => {
		bot.user.setGame(parString);
		message.delete();
	},

	info: (message: Discord.Message, parString: string) => {
		if (!message.guild) {
			return message.edit('This command is unavailable in a DM!');
		}

		const member = message.mentions.members.first() || message.guild.me;

		if (member) {
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
						name: `Joined ${message.guild.name} on`,
						value: member.joinedAt.toString()
					},
					{
						name: 'Roles',
						value: member.roles.array().splice(1).map((role: Discord.Role) => {
							return role.name;
						}).join(', ') || 'None'
					}
				]
			};

			if (member.user.bot) return message.channel.send('', {embed: embed});

			member.user.fetchProfile().then((profile) => {
				if (member !== message.guild.me) {
					embed.fields.push(
						{
							name: 'Mutual servers',
							value: profile.mutualGuilds.array().filter((guild: Discord.Guild) => guild.available).map((guild: Discord.Guild) => {
								const nickname = guild.members.get(member.id).nickname;
								return `• ${guild.name}${nickname ? ` (${nickname})` : ''}`;
							}).join('\n') || 'None'
						}
					);
				}
				embed.fields.push(
					{
						name: 'Has Nitro',
						value: `${profile.premiumSince ? `Yes (since ${profile.premiumSince.toString()})` : 'No'}`
					}
				);

				message.channel.send('', {embed: embed});
			});
		}
	},
};

let timediff = 0;
let cheeseTroll = config.bot.cheese;
cheeseTroll.chance = 1 - (cheeseTroll.chance / 100);

const events = {
	channelCreate: (channel: Discord.Channel) => {
		//
	},
	channelDelete: (channel: Discord.Channel) => {
		//
	},
	channelPinsUpdate: (channel: Discord.Channel, time) => {
		//
	},
	channelUpdate: (oldChannel: Discord.Channel, newChannel: Discord.Channel) => {
		//
	},
	debug: (info) => {
		//
	},
	disconnect: (closeEvent) => {
		logPrefixed(`Bot has been disconnected.`);
	},
	emojiCreate: (emoji: Discord.Emoji) => {
		//
	},
	emojiDelete: (emoji: Discord.Emoji) => {
		//
	},
	emojiUpdate: (emoji: Discord.Emoji) => {
		//
	},
	error: (error)	 => {
		logPrefixed(`ERROR:`, error);
	},
	guildBanAdd: (guild: Discord.Guild, user: Discord.User) => {
		//
	},
	guildBanRemove: (guild: Discord.Guild, user: Discord.User) => {
		//
	},
	guildCreate: (guild: Discord.Guild) => {
		//
	},
	guildDelete: (guild: Discord.Guild) => {
		//
	},
	guildMemberAdd: (member: Discord.GuildMember) => {
		//
	},
	guildMemberAvailable: (member: Discord.GuildMember) => {
		//
	},
	guildMemberRemove: (member: Discord.GuildMember) => {
		//
	},
	guildMembersChunk: (members: Discord.GuildMember[]) => {
		//
	},
	guildMemberSpeaking: (member: Discord.GuildMember, isSpeaking: boolean) => {
		//
	},
	guildMemberUpdate: (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
		//
	},
	guildUnavailable: (guild: Discord.Guild) => {
		//
	},
	guildUpdate: (oldGuild: Discord.Guild, newGuild: Discord.Guild) => {
		//
	},
	message: (message: Discord.Message) => {
		if (message.author.id === bot.user.id) {
			if (message.content.substring(0, config.bot.prefix.length) === config.bot.prefix) {
				const commandString = message.content.slice(config.bot.prefix.length);
				const commandParts = commandString.split(" ");
				const command = commandParts.shift();
				const remainder = commandParts.join(" ");

				if (command && commands[command]) {
					commands[command](message, remainder);
				}
			}
		} else if (message.author.id === cheeseTroll.id && Math.random() > cheeseTroll.chance) {
			message.react("🧀");
		}

		timediff = (timediff + (Date.now() - message.createdTimestamp)) / 2;
	},
	messageDelete: (message: Discord.Message) => {
		if (!message.author.bot && Date.now() - (message.createdTimestamp + timediff) < 5000) {
			logPrefixed(`Quick Message Delete Detected!`);
			console.log(`|-------------------------------`);
			console.log(`| Server: ${entityToStr(message.guild)}`);
			console.log(`| Channel: ${entityToStr(message.channel)}`);
			console.log(`| Author: ${entityToStr(message.author)}`);
			console.log(`| Created At: ${message.createdAt}`);
			if (message.editedAt) { console.log(`| Last Modified: ${message.editedAt}`); }
			console.log(`|---------- Content: ----------`);
			console.log(`| ${message.content.replace("\n", "\n| ")}`);

			const attachments = message.attachments.array();
			if (attachments.length > 0) {
				console.log(`|---------Attachments: --------`);
				attachments.forEach((attachment: Discord.MessageAttachment) => {
					console.log(`| ${attachment.url}`);
				});
			}

			console.log(`|-------------------------------`);
		}
	},
	messageDeleteBulk: (messagesCollection: Discord.Collection<string, Discord.Message>) => {
		//
	},
	messageReactionAdd: (messageReaction: Discord.MessageReaction, user: Discord.User) => {
		if (user.id === cheeseTroll.id && Math.random() > cheeseTroll.chance) {
			messageReaction.message.react('🧀');
		}
	},
	messageReactionRemove: (messageReaction: Discord.MessageReaction, user: Discord.User) => {
		//
	},
	messageReactionRemoveAll: (messageReaction: Discord.MessageReaction) => {
		//
	},
	messageUpdate: (oldMessage: Discord.Message, newMessage: Discord.Message) => {
		if (oldMessage.content !== newMessage.content) {
			
		}
	},
	presenceUpdate: (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
		//
	},
	ready: () => {
		logPrefixed(`Ready.`);
	},
	reconnecting: () => {
		//
	},
	roleCreate: (role: Discord.Role) => {
		//
	},
	roleDelete: (role: Discord.Role) => {
		//
	},
	roleUpdate: (oldRole: Discord.Role, newRole: Discord.Role) => {
		//
	},
	typingStart: (channel: Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel, user: Discord.User) => {
		if (user.id === cheeseTroll.id && Math.random() > cheeseTroll.chance) {
			channel.send('🧀');
		}
	},
	typingStop: (channel: Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel, user: Discord.User) => {
		//
	},
	userNoteUpdate: (user: Discord.User, oldNote: string, newNote: string) => {
		//
	},
	userUpdate: (oldUser: Discord.User, newUser: Discord.User) => {
		//
	},
	voiceStateUpdate: (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
		//
	},
	warn: (info) => {
		//
	}
};

for (const evId in events) {
	if (events.hasOwnProperty(evId)) {
		bot.on(evId, events[evId]);
	}
}

const resp = bot.login(config.auth.discordToken);