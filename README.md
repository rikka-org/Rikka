# Rikka
![](https://img.shields.io/discord/950548233418076180?color=%23E02a6b&label=support&logo=discord&logoColor=%23fff&style=for-the-badge)

Rikka is a fast, powerful, and extendable Discord modification. It can load plugins, manage plugins, and features a rich API.

## Status: BROKEN
With Discord switching their compiler from Babel to SWC, I've decided to abandon this project until a solution is found. If you're still interested, and want to try Rikka out anyways, you can download an older version of Discord using [this guide](https://gist.github.com/mugman174/0a59efe2733407d2041449a0e5815d66).
You can also try to hack up your own fix, I've written a basic guide that should help you get started with the codebase below.

### Working with the code
#### Before we begin...
I'll be honest with you so we can avoid another Vizality vs Powercord situation, most of Rikka's UI components are from Replugged. You can tell just by going into `src/Rikka/API/components`. 

The Webpack code is very clearly taken from Replugged, and adapted to Typescript. A code comment at the top even says so.

The patcher API is a modified version of Vizality's patcher, again adapted to Typescript, although it has some Replugged code snippets in it as well.

The plugin and theme manager UI's are also adapted versions of Replugged's. However, the plugin and theme managers themselves are original.

There's a whole mix of different code snippets inside Rikka, that I'm sure I forgot about in the past couple of months I took off this project, but those are the ones I remember the most clearly. Now that we've got that out of the way, if you'd like to continue with hacking up your own code, feel free to continue.

#### Plugins
The plugin format is a bit weird if you're used to working with other client mods.
First of all, some plugins have a "preload" property inside the manifest.json. But what does this mysterious property do? Well, the Plugin Manager is loaded inside both the main and renderer process. The one in the main process will only load all plugins with the preload property set to true. It then calls the preInject() function defined by the plugin.
This is an incredibly useful feature for compatibility layers, such as [vz-compat](https://github.com/V3L0C1T13S/vz-compat) and [replugged-compat](https://github.com/V3L0C1T13S/replugged-compat), which both only need to reimplement IPC, and then call upon a modified preload.js that doesn't conflict with Rikka's preload.

#### Compilation - A (mostly) unfixable mess
Developing plugins for Rikka is extremely easy if you're dealing with plain old code, but if you use custom assets stored directly in your plugin, it can get ugly pretty quickly due to TSC not automatically moving them to the output directory.
Also, unlike other client mods which will use global modules, Rikka instead opted for AOT path translation. For example, `@rikka/API` would get translated to `../../Rikka/API` if you were in `src/plugins/example/index.js`. This becomes messy pretty quickly if you're doing something such as [multifarious plugins](https://github.com/V3L0C1T13S/rkPlugged).

This also makes updating Rikka for the average user an extremely long process, as you have to pull the code, and then recompile it all using `npm run build`, as opposed to just pulling it and then restarting your client.

## About the Rikka project
Rikka was created as a true FOSS modification to Discord. Unlike some client mods, Rikka is licensed under a copyleft license, that allow anyone to make their own derivatives of it.
While most client mods are open source, some are not licensed in such a way that would permit one to create their own version of them.

## Installation
- First of all, the obvious step, is to download a Discord desktop client. It must be official, clients like Lightcord won't work. If you're using OpenAsar, you should be fine as its compatible with Rikka, or any client mod. Also, if you're on Linux, please do not download the Snap version of Discord, as it cannot be modified. If you're using the flatpak version of Discord, it'll prompt you to add permissions to access the Rikka folder while you're in the installation process.
- Then, you'll need to download Node.js and Git. For Ubuntu users, please do not download Node.js from the official repositories because it has a very outdated version of Node.js. Instead, follow this guide on how to download the latest and greatest Node.js. (https://github.com/nodesource/distributions#debinstall)
- Then, you open up your terminal/cmd and run `git clone https://github.com/V3L0C1T13S/Rikka`. Oh, and if you're on Windows, please do **NOT** open the cmd or PowerShell as admin. It is not recommended at all to save the Rikka folder onto the System32 folder. 
- Then, you run `cd Rikka`, and then run `npm i`. This will install the dependencies for Rikka to work.
- Then you run `npm run rikka:install (version)`. This will compile and inject Rikka onto your Discord client. Also make sure to type the version of the Discord client you're using. e.g. If you're using Discord stable, use `stable`. Full command: `npm run rikka:install stable`. Rikka supports every official client version (Stable, Canary, PTB, and Development). 
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
