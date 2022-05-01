# Rikka
Rikka is a fast, powerful, and extendable Discord modification. It can load plugins, manage plugins, and features a rich API.

## About the Rikka project
Rikka was created as a true FOSS modification to Discord. Unlike some client mods, Rikka is licensed under a copyleft license, that allow anyone to make their own derivatives of it.
While most client mods are open source, some are not licensed in such a way that would permit one to create their own version of them.

## Installation
- First of all, download Node.js from https://nodejs.org/. If you're on Windows 11, you can use winget, if you're on a Mac, you can use Homebrew, and if you're on Linux, you can use the package manager of your distro. Unless you're on Ubuntu, or any other distro that uses apt, you must download from [here](https://github.com/nodesource/distributions/blob/master/README.md#debinstall) due to the one on apt is very outdated.
- Next, download Git from https://git-scm.org/. If you're on a Mac, you can use Homebrew, and if you're on Linux, you can use the package manager.
- Then, you open up your terminal and run `git clone https://github.com/V3L0C1T13S/Rikka --recursive`.
- Then, you run `cd Rikka`, and then run `npm i`. This will install the dependencies for Rikka to work.
- Then you run `npm run rikka:install (branch)`. This will compile and inject Rikka onto your Discord client. Also make sure to type one of the branches, which is the version of the Discord client you're using. e.g. If you're using Discord stable, use stable. Full command: `npm run rikka:install stable`. Oh yeah, if you're on Linux and you're using the Snap version of Discord, please don't use it because it cannot be modified.

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
