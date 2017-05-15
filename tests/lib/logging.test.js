const log = require('../../src/lib/logging');


it('should correctly log when a file is added', () => {
    global.console = {
        log: jest.fn()
    };
    log.addedFile('Omg does this work');
    expect(global.console.log).toHaveBeenCalledTimes(1);
    expect(global.console.log.mock.calls[0]).toMatchSnapshot();
})


it('should correctly log when a file is added', () => {
    global.console = {
        log: jest.fn(),
        error: jest.fn()
    };
    log.error({
        message: 'This is an error message',
        stack: `
            This is the first line of the stack
            This is the second line of the stack
            This is the third line of the stack
        `
    });

    expect(global.console.log).toHaveBeenCalledTimes(2);
    expect(global.console.error).toHaveBeenCalledTimes(4);

    global.console.log.mock.calls.forEach(call => {
        expect(call).toMatchSnapshot();
    });

    global.console.error.mock.calls.forEach(call => {
        expect(call).toMatchSnapshot();
    });
})