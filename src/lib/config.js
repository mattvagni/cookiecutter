const path = require('path');

const ROOT_KEY = Math.random() * 42 + '__root';

const CONFIG_SCHEMA = [
    isArray(1),
    {
        name: isString(1),
        templatePath: isPath(),
        outputPath: isPath(),
        fields: [
            isArray(1),
            {
                templateVariable: isString(1),
                question: isString(1),
                errorMessage: isOptional(isString(1)),
                isValid: isOptional(isFunction()),
            },
        ],
    },
];

function errorPrefix(key) {
    if (key === ROOT_KEY) {
        return 'Your config';
    }
    return `In your config, "${key}"`;
}

function errorReceived(val) {
    // Node console.logs arrays as just their values. That means
    // that without this an array with a single string is indistinguishable
    // from a string when console logged.
    if (Array.isArray(val)){
        return `Received an array: ${val}`;
    }
    return `Received: ${val}`;
}

function isString(minLength = 0) {
    return (key, val) => {
        if (typeof val === "string" && val.length >= minLength) {
            return;
        };
        throw new Error(`${errorPrefix(key)} should be a string at least ${minLength} characters in length. ${errorReceived(val)}`);
    }
}

function isPath() {
    return (key, val) => {
        if (typeof val === "string" && val) {
            return;
        };
        throw new Error(`${errorPrefix(key)} should be a should be a path (string). ${errorReceived(val)}`);
    }
}

function isFunction(val) {
    return (key, val) => {
        if (typeof val === "function") {
            return;
        };
        throw new Error(`${errorPrefix(key)} should be a function. ${errorReceived(val)}`);
    }
}

function isArray(minLength = 0) {
    return (key, val) => {
        if (Array.isArray(val) && val.length >= minLength) {
            return;
        };
        throw new Error(`${errorPrefix(key)} should be an array. ${errorReceived(val)}`);
    }
}

function isOptional(fieldTypeFunc) {
    return (key, val) => typeof val === "undefined" || fieldTypeFunc(key, val);
}

function validate(schema, config, key=ROOT_KEY) {

    if (Array.isArray(schema)) {
        let [isValid, subSchema] = schema;
        isValid(key, config);
        config.forEach(c => validate(subSchema, c));
        return;
    }

    Object.keys(schema).forEach(key => {
        const currentConfigValue = config[key];

        if (Array.isArray(schema[key])) {
           validate(schema[key], currentConfigValue, key);
        } else {
            let isValid = schema[key];
            isValid(key, currentConfigValue);
        }
    });
}

function getConfig() {
    const pwd = process.env.PWD;
    var config = require(path.join(pwd, 'cookiecutter.config.js'));
    return validateConfig(config);
}

function getTemplateConfig(templateName) {
    const config = getConfig();
    return config.find(c => c.name === templateName);
}

function validateConfig(config) {
    validate(CONFIG_SCHEMA, config);
    return config;
}

module.exports = {
    getConfig,
    getTemplateConfig,
    validateConfig
}


