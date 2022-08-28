# Rikka
![](https://img.shields.io/discord/950548233418076180?color=%23E02a6b&label=support&logo=discord&logoColor=%23fff&style=for-the-badge)

Rikka is a fast, powerful, and extendable Discord modification. It can load plugins, manage plugins, and features a rich API.

## About the Rikka project
Rikka was created as a true FOSS modification to Discord. Unlike some client mods, Rikka is licensed under a copyleft license, that allow anyone to make their own derivatives of it.
While most client mods are open source, some are not licensed in such a way that would permit one to create their own version of them.

## Installation
- First of all, the obvious step, is to download a Discord desktop client. It must be official, clients like Lightcord won't work. If you're using OpenAsar, you should be fine as its compatible with Rikka, or any client mod. Also, if you're on Linux, please do not download the Snap version of Discord, as it cannot be modified. If you're using the flatpak version of Discord, it'll prompt you to add permissions to access the Rikka folder while you're in the installation process.
- Then, you'll need to download Node.js and Git. For Ubuntu users, please do not download Node.js from the official repositories because it has a very outdated version of Node.js. Instead, follow this guide on how to download the latest and greatest Node.js. (https://github.com/nodesource/distributions#debinstall)
- Then, you open up your terminal/cmd and run `git clone https://github.com/V3L0C1T13S/Rikka`. Oh, and if you're on Windows, please do **NOT** open the cmd or PowerShell as admin. It is not recommended at all to save the Rikka folder onto the System32 folder. 
- Then, you run `cd Rikka`, and then run `npm i`. This will install the dependencies for Rikka to work.
- Then you run `npm run rikka:install (version)`. This will compile and inject Rikka onto your Discord client. Also make sure to type the version of the Discord client you're using. e.g. If you're using Discord stable, use `stable`. Full command: `npm run rikka:install stable`. Rikka supports every official client version (Stable, Canary, and PTB). 
 - Fully close your Discord client and reopen it, and Rikka has been injected.

## Help
You can either:
- Open an [issue](https://github.com/V3L0C1T13S/Rikka/issues/new/choose)
- Join the [Discord support server](https://discord.gg/gQ4uDbZg2u) and go to one of the 2 support channels

## License
This project is licensed under the GPL-3.0 license. For more info please go to the [LICENSE](LICENSE) file.
```
Rikka is a free and open source Discord client modification.
Copyright (C) 2022 V3L0C1T13S
Copyright (C) Rikka contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
