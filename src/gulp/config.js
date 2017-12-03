'use strict';

var project = require('../../project.json'),
flags     = require('minimist')(process.argv.slice(2));

var envOpts = {};

if (flags.watch) {
    envOpts.watch = true;
    envOpts.debug = true;
    envOpts.minify = false;
    envOpts.env = 'dev';
}

if (flags.staging) {
    envOpts.watch = false;
    envOpts.debug = false;
    envOpts.minify = true;
    envOpts.env = 'staging';
}

if (flags.live) {
    envOpts.watch = false;
    envOpts.debug = false;
    envOpts.minify = true;
    envOpts.env = 'live';
}

var options = {
    
    cssEntry   : project.foldersName.entry + '/scss/',
    cssDest    : project.foldersName.build + '/css/',
    jsEntry    : project.foldersName.entry + '/js/',
    jsDest     : project.foldersName.build + '/js/',
    jsVendorsEntry  : project.foldersName.entry + '/js/vendors/',
    jsVendorsDest   : project.foldersName.build + '/js/vendors/',
    nunjucksEntry: project.foldersName.entry,
    nunjucksDest: project.foldersName.build,
    mainJS     : 'app.js',
    imageEntry : project.foldersName.entry + '/assets/img/',
    imageDest  : project.foldersName.build + '/assets/img/',
    copyBase   : project.foldersName.entry + '/assets/',
    copyDest   : project.foldersName.build + '/assets/',
    envOpts    : envOpts

}

module.exports = options;