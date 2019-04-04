#!/usr/bin/env node

const inquirer = require('inquirer');
const {renderFiles} = require('./lib/renderer');
const {makeFieldQuestions, makeTemplateQuestion} = require('./lib/questions');
const {getConfig, getTemplateConfig} = require('./lib/config');
const log = require('./lib/logging');

module.exports = function run(configLocation, outputBase) {
    return Promise.resolve()
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
        return renderFiles(config, configLocation, outputBase);
    })
    .catch(e => {
        log.error(e);
        return Promise.reject(e);
    });
};
