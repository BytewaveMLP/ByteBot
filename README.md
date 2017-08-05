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
- A TypeScript compiler

### Installation

```bash
$ yarn install # Install all dependencies (you can use npm too, but why would you??)
$ tsc # Compile the TypeScript code from src/ to JS
$ cp config.example.json config.json # Create a local config
$ $EDITOR config.json # Add your config options here
$ node ./out/index.js # Run the bot
```

## Usage

### Commands list

- `-bbinfo user` - Shows random information about a given user

## Maintainers

- [BytewaveMLP](https://github.com/BytewaveMLP)

## Contribute

**Issues, suggestions, or concerns?** Submit a GitHub issue!

**Want to add a feature?** We accept PRs!

## License

Copyright (c) Eliot Partridge, 2016-17. Licensed under [the MPL v2.0](/LICENSE).