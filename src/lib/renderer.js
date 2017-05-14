const fs = require("fs-extra");
const path = require("path");
const os = require('os');
const colors = require('colors');

const {getTemplateConfig} = require('./config');
const log = require("./logging");

function replaceFields(string, fields) {
    let result = string;
    Object.keys(fields).forEach(fieldName => {
         result = result.replace(new RegExp(fieldName, 'g'), fields[fieldName]);
    });
    return result;
}

function renderFiles({ templateName, fields }) {
    const config = getTemplateConfig(templateName);
    const pwd = process.env.PWD;
    const destinationDirectory = path.resolve(pwd, config.outputPath);
    const templateDirectory = path.resolve(pwd, config.templatePath);
    const templateStats = fs.statSync(templateDirectory);

    let filesToOutput = [];

    if (templateStats.isDirectory()) {
        const files = fs.readdirSync(templateDirectory);
        const {base: folderName} = path.parse(templateDirectory);

        filesToOutput = files.map(file => {
            return {
                src: path.join(templateDirectory, file),
                dest: path.join(
                    destinationDirectory,
                    replaceFields(folderName, fields),
                    replaceFields(file, fields)
                )
            };
        });
    } else if (templateStats.isFile()) {
        const {name, ext} = path.parse(templateDirectory);
        filesToOutput = [
            {
                src: path.join(templateDirectory),
                dest: path.join(destinationDirectory, replaceFields(name, fields) + ext),
            }
        ];
    }

    // Check if any of the files we are about to create exist
    // and throw an error if they do.
    filesToOutput.forEach(({src, dest}) => {
        if (fs.pathExistsSync(dest)) {
           throw new Error(`${path.relative(pwd, dest)} already exists.`);
        }
    });

    filesToOutput.forEach(({src, dest}) => {
        const fileContent = replaceFields(fs.readFileSync(src, "utf8"), fields);

        // Creates neccessary directories.
        fs.outputFileSync(dest, fileContent, "utf8");
        log.addedFile(path.relative(pwd, dest));
    });

    console.log(colors.green.bold('\nHappy editing!', '\n'));
}

module.exports = {
    renderFiles,
};