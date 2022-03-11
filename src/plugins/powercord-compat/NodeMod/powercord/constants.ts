/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powercord.dev/porkord-license
 */

const { join } = require('path');
import { RikkaPowercord } from '../../Common/Constants';

export = Object.freeze({
  I18N_WEBSITE: 'https://i18n.powercord.dev/projects/powercord',
  REPO_URL: 'powercord-org/powercord',
  WEBSITE: 'https://powercord.dev',

  // Runtime
  SETTINGS_FOLDER: join(RikkaPowercord.Constants.RKPOWERCORD_FOLDER, 'settings'),
  CACHE_FOLDER: join(RikkaPowercord.Constants.RKPOWERCORD_FOLDER, '.cache'),
  LOGS_FOLDER: join(RikkaPowercord.Constants.RKPOWERCORD_FOLDER, '.logs'),

  // Powercords promotional stuff
  DISCORD_INVITE: 'gs4ZMbBfCh',
  GUILD_ID: '538759280057122817',
  
  SpecialChannels: Object.freeze({
    SUPPORT_INSTALLATION: '755004656463249479',
    SUPPORT_MISC: '755004872201470022',
    SUPPORT_PLUGINS: '755004260902764646',
    KNOWN_ISSUES: '755012685963460620',

    STORE_PLUGINS: '649571600764633088',
    STORE_THEMES: '649571547350302741',

    JS_SNIPPETS: '755005784999329883',
    CSS_SNIPPETS: '755005803303403570'
  })
});
