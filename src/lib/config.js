const path = require('path');

const CONFIG_SCHEMA = {
    root: [
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
    ],
};

function getConfig() {
    const pwd = process.env.PWD;
    var config = require(path.join(pwd, 'cookie.config.js'));
    return validateConfig(config);
}

function getTemplateConfig(templateName) {
    const config = getConfig();
    return config.find(c => c.name === templateName);
}

function isString(minLength = 0) {
    return (key, val) => {
        if (typeof val === "string" && val.length >= 0) {
            return;
        };
        throw new Error(`'${key}' should be a string at least ${minLength} characters in length. Received: ${val}`);
    }
}

function isPath() {
    return (key, val) => {
        if (typeof val === "string" && val) {
            return;
        };
        throw new Error(`'${key}' should be a should be a path (string). Received: ${val}`);
    }
}

function isFunction(val) {
    return (key, val) => {
        if (typeof val === "function") {
            return;
        };
        throw new Error(`'${key}' should be a function. Received: ${val}`);
    }
}

function isArray(minLength = 0) {
    return (key, val) => {
        if (Array.isArray(val, (minLength = 1))) {
            return;
        };
        throw new Error(`'${key}' should be an array. Received: ${val}`);
    }
}

function isOptional(fieldTypeFunc) {
    return (key, val) => typeof val === "undefined" || fieldTypeFunc(key, val);
}

function validate(schema, config) {

    Object.keys(schema).forEach(key => {
        const currentSchema = schema[key];

        // If it's the top level of the schema
        if (key === 'root') {
            let [isValid, subSchema] = currentSchema;
            isValid(key, config);
            config.forEach(c => validate(subSchema, c));
        }
        // If it's an array
        else if (Array.isArray(currentSchema)) {
            let [isValid, subSchema] = currentSchema;
            isValid(key, config[key]);
            config[key].forEach(c => validate(subSchema, c));
        }
        // It's a function
        else {
            let isValid = schema[key];
            isValid(key, config[key]);
        }
    });
}

function validateConfig(config) {

    try {
        validate(CONFIG_SCHEMA, config);
        return config;
    }
    catch (e) {
        throw new Error(`In your config, ${e.message}`);
    }
}

module.exports = {
    getConfig,
    getTemplateConfig
}


