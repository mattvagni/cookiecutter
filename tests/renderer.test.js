const {renderFiles} = require('../src/lib/renderer');
const {getTemplateConfig} = require('../src/lib/config');
const fs = require('fs-extra');

jest.mock('../src/lib/config');

global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('renderFiles()', () => {

    const outputPath = __dirname + '/test-templates-output';

    afterEach(() => {
        fs.removeSync(outputPath);
    });

    it('should correctly render the files when the template is just a path', () => {

        getTemplateConfig.mockImplementation(() => {
            return {
                templatePath: __dirname + '/test-templates/containerName.js',
                outputPath: outputPath,
            };
        });

        renderFiles({
            templateName: '',
            fields: {
                containerName: 'Baz'
            }
        });

        expect(fs.readFileSync(outputPath + '/Baz.js', 'utf8')).toMatchSnapshot();
    });

    it('should correctly render the files when the template is a folder', () => {

        getTemplateConfig.mockImplementation(() => {
            return {
                templatePath: __dirname + '/test-templates/componentName',
                outputPath: outputPath,
            };
        });

        renderFiles({
            templateName: '',
            fields: {
                componentName: 'Bar',
                specialNumber: 'A'
            }
        });

        expect(fs.readFileSync(outputPath + '/Bar/index.js', 'utf8')).toMatchSnapshot();
        expect(fs.readFileSync(outputPath + '/Bar/sub-file.js', 'utf8')).toMatchSnapshot();
    });

    it('should throw an error if the output of a template allready exists', () => {

        getTemplateConfig.mockImplementation(() => {
            return {
                templatePath: __dirname + '/test-templates/componentName',
                outputPath: outputPath,
            };
        });

        const func = () => {
            renderFiles({
                templateName: '',
                fields: {
                    componentName: 'Bar',
                    specialNumber: 'A'
                }
            });
        }

        // Render the template the first time.
        func();

        // Render the template the second time, this time it should error
        // because it already exists.
        expect(func).toThrowErrorMatchingSnapshot();
    });

});