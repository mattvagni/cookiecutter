#!/usr/bin/env node

const inquirer = require('inquirer');
const {renderFiles} = require('./lib/renderer');
const {makeFieldQuestions, makeTemplateQuestion} = require('./lib/questions');
const {getTemplateConfig} = require('./lib/config');
const log = require('./lib/logging');

Promise.resolve()
    .then(() => {
        return inquirer.prompt(makeTemplateQuestion());
    })
    .then(({ templateName }) => {
        const templateConfig = getTemplateConfig(templateName);
        const questions = makeFieldQuestions(templateConfig);
        return inquirer.prompt(questions).then(answers => {
            return {
                templateName,
                fields: answers,
            };
        });
    })
    .then(config => {
        return renderFiles(config);
    })
    .catch(e => {
        log.error(e);
    });