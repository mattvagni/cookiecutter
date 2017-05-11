const inquirer = require("inquirer");
const colors = require("colors/safe");
const fs = require("fs-extra");
const path = require("path");
const os = require('os');

const config = require("../cookie.config.js");

const templateQuestion = [
    {
        type: "list",
        name: "templateName",
        message: "What would you like to create?",
        choices: config.map(template => template.name),
    },
];

/**
 * Utilities
 */
function getConfigByName(templateName) {
    return config.find(c => c.name === templateName);
}

function logAddedFile(filePath) {
    console.log(colors.green('+'), colors.bold('Added:'), colors.cyan(filePath));
}

function logError(err) {
    console.log(colors.red('!'), colors.red(err.message));

    const errorLines = err.stack.split(os.EOL);

    // Remove the first line since it's the message and that's already been logged.
    errorLines.shift();

    // Log each line of the stack trace.
    errorLines.forEach(line => {
        console.error(' ', colors.dim(line.trim()));
    });

    console.log('');
}


/**
 * Creates a list of inquierer questions from a template's fields
 */
function makeQuestions(templateConfig) {
    return templateConfig.fields.map(field => {
        return {
            name: field.templateString,
            message: field.question,
            type: "input",
            validate(value) {
                if (value.length === 0) {
                    return 'This field is mandatory.'
                }
                return field.isValid(value) || field.errorMessage;
            },
        };
    });
}

function replaceFields(string, fields) {
    let result = string;
    Object.keys(fields).forEach(fieldName => {
         result = result.replace(new RegExp(fieldName, 'g'), fields[fieldName]);
    });
    return result;
}

function renderFiles({ templateName, fields }) {
    const config = getConfigByName(templateName);
    const pwd = process.env.PWD;
    const destinationDirectory = path.resolve(pwd, config.destination);
    const templateDirectory = path.resolve(pwd, config.template);
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
        logAddedFile(path.relative(pwd, dest));
    });

    console.log(colors.green.bold('\nHappy editing!', '\n'));
}

inquirer
    .prompt(templateQuestion)
    .then(({ templateName }) => {
        const questions = makeQuestions(getConfigByName(templateName));
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
        logError(e);
    });
