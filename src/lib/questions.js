const {getConfig} = require('./config');

/**
 * The initial inquierer question.
 */
function makeTemplateQuestion(configPath) {
    return [
        {
            type: 'list',
            name: 'templateName',
            message: 'What would you like to create?',
            choices: getConfig(configPath).map(template => template.name),
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
            type: !!field.choices ? 'list' : 'input',
            choices: field.choices || undefined,
            validate(value) {
                if (value.length === 0) {
                    return 'This field is mandatory.';
                }
                if (field.isValid) {
                    return field.isValid(value) || field.errorMessage || 'Invalid value.';
                }
                return true;
            },
        };
    });
}

module.exports = {
    makeFieldQuestions,
    makeTemplateQuestion,
};
