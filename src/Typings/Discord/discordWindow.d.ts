export interface discordWindow {
    __SPLASH__: boolean;
    __SENTRY__: {
        globalEventProcessors: Array<Function>;
        hub: {
            addBreadcrumb: () => undefined;
            getClient: () => any;
            getScope: () => any;
            _stack: Array<any>;
            _version: 3;
        };
        logger: {
            _enabled: boolean
        };
    };
    webpackChunkdiscord_app: Array<any>;
}
