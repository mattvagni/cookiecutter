#!/usr/bin/env node

const inquirer = require('inquirer');
const process = require('process');
const {renderFiles} = require('./lib/renderer');
const {makeFieldQuestions, makeTemplateQuestion} = require('./lib/questions');
const {getConfig, getTemplateConfig} = require('./lib/config');
const log = require('./lib/logging');

const configOption = process.argv.find(piece => piece.slice(0, 3) === '-c=');
const configLocation = configOption ? configOption.slice(3) : 'cookiecutter.config.js';

Promise.resolve()
    .then(() => {

        const config = getConfig(configLocation);

        // If there is only one template don't ask which template to use.
        if (config.length === 1) {
            return {templateName: config[0].name};
        }

        return inquirer.prompt(makeTemplateQuestion(configLocation));
    })
    .then(({templateName}) => {
        const templateConfig = getTemplateConfig(templateName, configLocation);
        const questions = makeFieldQuestions(templateConfig);
        return inquirer.prompt(questions).then(answers => {
            return {
                templateName,
                fields: answers,
            };
        });
    })
    .then(config => {
        return renderFiles(config, configLocation);
    })
    .catch(e => {
        log.error(e);
        process.exit(1);
    });
