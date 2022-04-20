import API from "../../NodeMod/powercord/entities/API";
import strings from "../../i18n";
import overrides from "../../i18n/overrides";
const { getModule, i18n } = require('powercord/webpack');

export = class I18nAPI extends API {
    locale: string = "en";
    messages: { [key: string]: { [key: string]: string } } = {};

    constructor() {
        super();

    }

    async startAPI() {
        getModule(['locale', 'theme']).then((module: { locale: string; addChangeListener: (arg0: () => void) => void; }) => {
            this.locale = module.locale;
            module.addChangeListener(() => {
                if (module.locale !== this.locale) {
                    this.locale = module.locale;
                    i18n.loadPromise.then(() => this.addPowercordStrings());
                }
            });
            this.addPowercordStrings();
        });
    }

    addPowercordStrings() {
        const i18nContextProvider = i18n._provider?._context || i18n._proxyContext;

        Object.assign(i18nContextProvider.messages, this.messages[this.locale]);
        Object.assign(i18nContextProvider.defaultMessages, this.messages['en-US']);
    }

    loadAllStrings(locale: string, strings: { [key: string]: string }) {
        this.messages[locale] = strings;
        this.addPowercordStrings();
    }
}