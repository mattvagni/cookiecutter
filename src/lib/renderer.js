const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');

const {getTemplateConfig} = require('./config');
const log = require('./logging');

function replaceFields(string, fields) {
    let result = string;
    Object.keys(fields).forEach(fieldName => {
        result = result.replace(new RegExp(fieldName, 'g'), fields[fieldName]);
    });
    return result;
}

function renderFiles({templateName, fields}, configLocation) {
    const config = getTemplateConfig(templateName, configLocation);
    const excludeDirectory = config.excludeDirectory || false;
    const pwd = process.env.PWD;
    const destinationDirectory = path.resolve(pwd, config.outputPath);
    const templateDirectory = path.resolve(pwd, config.templatePath);
    const isFolderTemplate = isDirectory(templateDirectory);

    const templateFiles = [];
    let filesToOutput = [];

    function isDirectory(p) {
        return fs.statSync(p).isDirectory();
    }

    function getTemplateFiles(dir) {
        if (isDirectory(dir)) {
            const files = fs.readdirSync(dir);

            files.forEach(fileDir => {
                const fileDirWithFolder = path.resolve(dir, fileDir);

                if (isDirectory(fileDirWithFolder)) {
                    getTemplateFiles(fileDirWithFolder);
                } else {
                    templateFiles.push(fileDirWithFolder);
                }
            });
        } else {
            templateFiles.push(dir);
        }
    }

    getTemplateFiles(templateDirectory);

    filesToOutput = templateFiles.map(filePath => {

        if (isFolderTemplate) {
            const {base} = path.parse(templateDirectory);
            return {
                src: filePath,
                dest: path.join(
                    destinationDirectory,
                    (!excludeDirectory ? replaceFields(base, fields) : ''),
                    replaceFields(filePath.replace(templateDirectory, ''), fields)
                ),
            };

        } else {
            const {name, ext} = path.parse(templateDirectory);
            return {
                src: templateDirectory,
                dest: path.join(
                    destinationDirectory,
                    replaceFields(name + ext, fields)
                ),
            };
        }
    });

    // Check if any of the files we are about to create exist
    // and throw an error if they do.
    filesToOutput.forEach(({dest}) => {
        if (fs.pathExistsSync(dest)) {
            throw new Error(`${path.relative(pwd, dest)} already exists.`);
        }
    });

    filesToOutput.forEach(({src, dest}) => {
        const fileContent = replaceFields(fs.readFileSync(src, 'utf8'), fields);

        // Creates neccessary directories.
        fs.outputFileSync(dest, fileContent, 'utf8');
        log.addedFile(path.relative(pwd, dest));
    });

    console.log(colors.green.bold('\nHappy editing!', '\n'));
}

module.exports = {
    renderFiles,
};
