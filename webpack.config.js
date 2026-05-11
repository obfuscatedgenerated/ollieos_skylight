/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const pkgbuild = require("ollieos_pkgbuild");

// EDIT THIS OBJECT TO ADD MORE PROGRAMS OR CHANGE THE FILE PATHS/NAMES
// key: the name of the program
// value: the path to the entry point
const programs = {
    "sl_root": "./src/root/index.ts",
    "sl_taskbar": "./src/taskbar/index.ts",
    "sl_startmenu": "./src/start_menu/index.ts",
    "sl_settings": "./src/settings/index.ts",
    "sl_desktop": "./src/desktop/index.ts",
    "sl_shutdown": "./src/shutdown/index.ts",
};

// EDIT THIS ARRAY TO ADD DEPENDENCIES FOR THE VERSION CURRENTLY BEING BUILT
// format: name@version
const deps = ["ignition_triggers"];

// EDIT THIS TO CHANGE THE HOMEPAGE URL
const homepage_url = "https://ollieg.codes";


// EDIT THIS OBJECT TO DEFINE ADDITIONAL WEBPACK EXTERNALS
// key: the name of the module
// value: the external name
const externals = {};

// EDIT THIS ARRAY TO DEFINE ADDITIONAL FILES TO BE INCLUDED IN THE PACKAGE
const additional_files = [
    {local_path: "./src/root/service.json", pkg_path: "privileged/skylight.service.json"}
];

// EDIT THIS OBJECT TO DEFINE TRIGGERS TO RUN ON INSTALL/REMOVAL
// key: the name of the trigger
// value: any data to pass to the trigger
const triggers = {
    "ignition_triggers/register_service": "privileged/skylight.service.json",
};

const config = pkgbuild(programs, deps, homepage_url, externals, triggers, additional_files);

// fix tsx resolution
config.resolve = {
    extensions: [".js", ".json", ".ts", ".tsx"],
};

// add postcss-loader for css files
config.module.rules.push({
    test: /\.css$/i,
    use: [
        {loader: "css-loader", options: {exportType: "string"}},
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            "@tailwindcss/postcss",
                            "postcss-preset-env",
                        ],
                    ],
                },
            },
        },
    ],
});

module.exports = config;
