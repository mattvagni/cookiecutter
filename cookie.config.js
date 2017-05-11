module.exports = [
    {
        name: "Normal Component",
        template: "templates/componentName/",
        destination: "destination/",
        fields: [
            {
                templateString: 'componentName',
                question: "What is your components name?",
                errorMessage: "Can't be more than 10 characters long.",
                isValid(val) {
                    return val.length <= 10
                }
            },
            {
                templateString: 'specialNumber',
                question: "What is your favourite letter?",
                errorMessage: "Z is not valid.",
                isValid(val) {
                    return val !== 'Z'
                }
            }
        ]
    },
    {
        name: "Container Component",
        template: "templates/containerName.js",
        destination: "destination/containers",
        fields: [
            {
                templateString: 'containerName',
                question: "What is your container component's name?",
                errorMessage: "Must be at least 5 characters long.",
                isValid(val) {
                    return val.length <= 5
                }
            }
        ]
    }
];