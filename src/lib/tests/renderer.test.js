const {renderFiles} = require('../renderer');
const {getTemplateConfig} = require('../config');
const fs = require('fs-extra');

jest.mock('../config');

global.console = {
    log: jest.fn(),
    error: jest.fn(),
};

describe('renderFiles()', () => {

    const outputPath = `${__dirname }/test-templates-output`;

    afterEach(() => {
        fs.removeSync(outputPath);
    });

    it('should correctly render the files when the template is just a path', () => {

        getTemplateConfig.mockImplementation(() => {
            return {
                templatePath: `${__dirname }/test-templates/CONTAINER_NAME.js`,
                outputPath,
            };
        });

        renderFiles({
            templateName: '',
            fields: {
                CONTAINER_NAME: 'Baz',
            },
        });

        expect(fs.readFileSync(`${outputPath }/Baz.js`, 'utf8')).toMatchSnapshot();
    });

    it('should correctly render the files when the template is a folder', () => {

        getTemplateConfig.mockImplementation(() => {
            return {
                templatePath: `${__dirname }/test-templates/COMPONENT_NAME`,
                outputPath,
            };
        });

        renderFiles({
            templateName: '',
            fields: {
                COMPONENT_NAME: 'Bar',
                specialNumber: 'A',
            },
        });

        expect(fs.readFileSync(`${outputPath }/Bar/index.js`, 'utf8')).toMatchSnapshot();
        expect(fs.readFileSync(`${outputPath }/Bar/styles.css`, 'utf8')).toMatchSnapshot();
        expect(fs.readFileSync(`${outputPath }/Bar/sub-folder/Bar.js`, 'utf8')).toMatchSnapshot();
    });

    it('should throw an error if the output of a template allready exists', () => {

        getTemplateConfig.mockImplementation(() => {
            return {
                templatePath: `${__dirname }/test-templates/COMPONENT_NAME`,
                outputPath,
            };
        });

        function func() {
            renderFiles({
                templateName: '',
                fields: {
                    COMPONENT_NAME: 'Bar',
                    specialNumber: 'A',
                },
            });
        }

        // Render the template the first time.
        func();

        // Render the template the second time, this time it should error
        // because it already exists.
        expect(func).toThrowErrorMatchingSnapshot();
    });

});
