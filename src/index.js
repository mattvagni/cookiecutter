#!/usr/bin/env node

const cookiecutter = require('./cookiecutter');
const process = require('process');

const configOption = process.argv.find(piece => piece.slice(0, 3) === '-c=');
const configLocation = configOption ? configOption.slice(3) : 'cookiecutter.config.js';

cookiecutter(configLocation, process.env.PWD).catch(() => {
    process.exit(1);
});
