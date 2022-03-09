declare namespace powercord {
    namespace settings {
        /**
         * Gets a setting from the settings database
         * @param {String} key Key of the setting
         * @param {Any}
         */
        function get(key: string, defaultValue?: any): any;
    }

    namespace pluginManager {
        pluginDir: string;
    }
}