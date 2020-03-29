const {getConfig} = require('../config');
const {makeTemplateQuestion, makeFieldQuestions} = require('../questions');

jest.mock('../config');

const testConfig = [
    {
        name: 'foo',
        fields: [
            {
                templateVariable: 'LETTER',
                question: 'What is your favourite letter?',
                errorMessage: 'Nope',
                isValid(s) {
                    return s === '42';
                },
            },
            {
                templateVariable: 'NAME',
                question: 'What is your name?',
                isValid(s) {
                    return s === '42';
                },
            },
            {
                templateVariable: 'NUMBER',
                question: 'What is your favourite number?',
            },
            {
                templateVariable: 'CHOICE',
                question: 'Do you need a choice?',
                choices: ['Yes', 'No'],
            },
        ],
    },
];

getConfig.mockImplementation(() => testConfig);

it('makeTemplateQuestion() should make the right question', () => {
    expect(makeTemplateQuestion()).toMatchSnapshot();
});

it('makeFieldQuestions() should make the correct questions', () => {
    const fieldQuestions = makeFieldQuestions(testConfig[0]);

  // It should correctly handle there not being a custom error message and isValid
    expect(fieldQuestions[0].validate('this is wrong')).toBe('Nope');
    expect(fieldQuestions[0].validate('42')).toBe(true);

  // Should handle there being an error but not a custom error message
    expect(fieldQuestions[1].validate('this is also wrong')).toBe(
    'Invalid value.'
  );

  // Should error on empty values since we require all questions to require a value.
    expect(fieldQuestions[2].validate('')).toBe('This field is mandatory.');
    expect(fieldQuestions[2].validate('this is valid')).toBe(true);

    expect(fieldQuestions[3].validate('Yes')).toBe(true);
    expect(fieldQuestions[3].validate('No')).toBe(true);
});
