var config =  [
    {
        name: "Normal Component",
        templatePath: "templates/componentName/",
        outputPath: "destination/",
        fields: [
            {
                templateVariable: "componentName",
                question: "What is your components name?",
                errorMessage: "Can't be more than 10 characters long.",
            },
            {
                templateVariable: "specialNumber",
                question: "What is your favourite letter?",
                errorMessage: "Z is not valid.",
                isValid(val) {
                    return val !== "Z";
                },
            },
        ],
    },
    {
        name: "Container Component",
        templatePath: "templates/containerName.js",
        outputPath: "destination/containers",
        fields: {},
    },
];




validate(configSchema, config);

