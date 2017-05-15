const cli = require('./lib/cli');
const {renderFiles} = require('./lib/renderer');

cli()
    .then(renderFiles)
    .catch(e => {
        console.error(e);
        log.error(e);
    });