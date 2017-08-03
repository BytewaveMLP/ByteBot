/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const config = require('../config');

// Enforce selfbot mode
config.bot.selfbot = true;

const client = new Commando.Client(config.bot);

client.config = config;

client.registry
	.registerGroups([
		['admin', 'Administrative']
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
	sqlite.open(path.join(path.dirname(__dirname), 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.debug)
	.on('ready', () => {
		console.log(`Initialized - logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('guildCreate', (guild) => {
		console.log(`Joined server ${guild.name} (${guild.id})`);
	})
	.on('guildDelete', (guild) => {
		console.log(`Removed from server ${guild.name} (${guild.id})`);		
	})
	.on('message', (msg) => {
		if (msg.author.id === "194178931442581504" && Math.random() > 0.9) {
			console.debug('Say cheese!');
			msg.react('🧀');
		}
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''} blocked; ${reason}`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(`Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
		if (!guild) {
			client.user.setGame(`${client.commandPrefix || client.options.commandPrefix}help for help`);
		}
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(`Command ${command.groupID}:${command.memberName} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(`Group ${group.id} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	});

client.login(config.auth.discordToken);