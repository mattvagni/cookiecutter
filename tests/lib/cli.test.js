const {getConfig, getTemplateConfig} = require('../../src/lib/config');
const {renderFiles} = require('../../src/lib/renderer');
const cli = require('../../src/lib/cli');
const inquirer = require('inquirer');

jest.mock('inquirer');
jest.mock('../../src/lib/renderer');
jest.mock('../../src/lib/config');

const templateConfigs = [
    {
        name: 'foo',
        fields: [
            {
                templateVariable: 'LETTER',
                question: 'What is your favourite letter?',
                errorMessage: 'Nope',
                isValid: function(s) {
                    return s === '42'
                }
            },
            {
                templateVariable: 'NAME',
                question: 'What is your name?',
                isValid: function(s) {
                    return s === '42'
                }
            },
            {
                templateVariable: 'NUMBER',
                question: 'What is your favourite number?'
            },
        ]
    }
]

it('cli should call inquierer with the correct questions', () => {

    getConfig.mockImplementation(() => {
        return templateConfigs;
    });

    getTemplateConfig.mockImplementation(() => {
        return templateConfigs[0];
    });

    let callIdx = 0;

    inquirer.prompt = jest.fn(() => {

        if (callIdx === 0) {
            callIdx++;
            return Promise.resolve({
                templateName: 'foo',
            });
        }

        return Promise.resolve({
            LETTER: 1,
            NUMBER: 2
        })
    });

    return cli().then(() => {
        expect(inquirer.prompt.mock.calls[0]).toMatchSnapshot();
        expect(inquirer.prompt.mock.calls[1]).toMatchSnapshot();
    });

    const secondCall = inquirer.prompt.mock.calls[1];

    // It should correctly handle there not being a custom error message and isValid
    expect(secondCall[0].isValid('this is wrong')).toBe('Nope');
    expect(secondCall[0].isValid('42')).toBe(true);

    // Should handle there being an error but not a custom error message
    expect(secondCall[1].isValid('this is also wrong')).toBe('Invalid value.');

    // Should error on empty values since we require all questions to require a value.
    expect(secondCall[2].isValid('')).toBe('This field is mandatory.');
});