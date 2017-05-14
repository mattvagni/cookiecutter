const inquirer = require("inquirer");

const log = require("./lib/logging");
const {renderFiles} = require('./lib/renderer');
const {getConfig, getTemplateConfig} = require('./lib/config');

/**
 * The initial inquierer question.
 */
function makeTemplateQuestion() {
    return [
        {
            type: "list",
            name: "templateName",
            message: "What would you like to create?",
            choices: getConfig().map(template => template.name),
        },
    ];
}

/**
 * Creates a list of inquierer questions from a template's fields
 */
function makeFieldQuestions(templateConfig) {
    return templateConfig.fields.map(field => {
        return {
            name: field.templateVariable,
            message: field.question,
            type: "input",
            validate(value) {
                if (value.length === 0) {
                    return 'This field is mandatory.'
                }
                if (field.isValid) {
                    return field.isValid(value) || field.errorMessage;
                }
                return true;
            },
        };
    });
}


Promise.resolve()
    .then(questions => {
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
    .then(answers => {
        renderFiles(answers);
    })
    .catch(e => {
        log.error(e);
    });

