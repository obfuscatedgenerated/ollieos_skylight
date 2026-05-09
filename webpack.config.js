/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const pkgbuild = require("ollieos_pkgbuild");

// EDIT THIS OBJECT TO ADD MORE PROGRAMS OR CHANGE THE FILE PATHS/NAMES
// key: the name of the program
// value: the path to the entry point
const programs = {
    "sl_taskbar": "./src/taskbar/index.ts",
    "sl_startmenu": "./src/start_menu/index.ts",
};

// EDIT THIS ARRAY TO ADD DEPENDENCIES FOR THE VERSION CURRENTLY BEING BUILT
// format: name@version
const deps = [];

// EDIT THIS TO CHANGE THE HOMEPAGE URL
const homepage_url = "https://ollieg.codes";


// EDIT THIS OBJECT TO DEFINE ADDITIONAL WEBPACK EXTERNALS
// key: the name of the module
// value: the external name
const externals = {};

const config = pkgbuild(programs, deps, homepage_url, externals);

// fix tsx resolution
config.resolve = {
    extensions: [".js", ".json", ".ts", ".tsx"],
};

// add postcss-loader for css files
config.module.rules.push({
    test: /\.css$/i,
    use: [
        {loader: "style-loader", options: {
            injectType: "lazyStyleTag",
            insert: require.resolve("./style_insert.js")
        }},
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            "postcss-preset-env",
                        ],
                    ],
                },
            },
        },
    ],
});

module.exports = config;
