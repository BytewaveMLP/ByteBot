# ByteBot

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> A custom-made selfbot for Discord

ByteBot is my own personal selfbot for Discord. He contains my own memes, custom commands, and other useful tools and utilities.

## Table of Contents

- [Install](#install)
    - [Prerequisites](#prerequisites)
	- [Installation](#installation)
- [Usage](#usage)
	- [Commands list](#commands-list)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

### Prerequisites

- Node.js (tested on v8.2.1)

### Installation

```bash
$ npm install # Install all dependencies
$ cp config.example.json config.json # Create a local config
$ $EDITOR config.json # Add your config options here
$ node ./src/bytebot.js # Run the bot (you can also use ./start.sh/start.bat)
```

## Usage

### Commands list

- `-bbuserinfo user` - Shows random information about a given user

- `-bbquote user text` - Creates a small embed that looks like a quote from another user

(This also includes the list of built-in Discord.js commands, the likes of which I'm too lazy to list.)

## Maintainers

- [BytewaveMLP](https://github.com/BytewaveMLP)

## Contribute

**Issues, suggestions, or concerns?** Submit a GitHub issue!

**Want to add a feature?** We accept PRs!

## License

Copyright (c) Eliot Partridge, 2016-17. Licensed under [the MPL v2.0](/LICENSE).