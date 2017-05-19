const {validateConfig} = require('../config');

function getCorrectConfig() {
    return [
        {
            name: 'the name',
            templatePath: 'templates/',
            outputPath: 'src/app/components/',
            fields: [
                {
                    templateVariable: 'MY COMPONENT NAME',
                    question: 'What should your component be called?',
                    errorMessage: 'A component name must be at least 1 character long.',
                    isValid(s) {
                        return s.length > 1;
                    },
                },
            ],
        },
    ];
}

describe('validateConfig()', () => {

    it('should return the config if it is valid', () => {
        function func() {
            return validateConfig(getCorrectConfig());
        }
        expect(func).not.toThrow();
        expect(func()).toMatchSnapshot();
    });

    it('should throw if config is incorrect', () => {
        [
            () => {},
            () => undefined,
            config => config[0].name = 1 && config,
            config => config[0].templatePath = [] && config,
            config => config[0].templatePath = '' && config,
            config => config[0].outputPath = {} && config,
            config => config[0].outputPath = NaN && config,
            config => config[0].fields = 'nope' && config,
            config => config[0].fields = {} && config,
            config => config[0].fields[0].templateVariable = '' && config,
            config => config[0].fields[0].templateVariable = 1 && config,
            config => config[0].fields[0].question = 1 && config,
            config => config[0].fields[0].isValid = 1 && config,
            config => {
                delete config[0].fields[0].question;
                return config;
            },
            config => {
                delete config[0].fields[0].templateVariable;
                return config;
            },
            config => {
                delete config[0].templatePath;
                return config;
            },
            () => [],
        ].forEach(incorrectConfig => {
            function func() {
                return validateConfig(incorrectConfig(getCorrectConfig()));
            }
            expect(func).toThrowErrorMatchingSnapshot();
        });
    });
});
