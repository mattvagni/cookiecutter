const colors = require("colors/safe");
const os = require('os');

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

module.exports = {
    error: logError,
    addedFile: logAddedFile,
}