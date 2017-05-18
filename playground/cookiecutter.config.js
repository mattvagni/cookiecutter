module.exports = [
    {
        name: "Normal Component",
        templatePath: "templates/COMPONENT_NAME/",
        outputPath: "output/",
        fields: [
            {
                templateVariable: 'COMPONENT_NAME',
                question: "What is your components name?",
                errorMessage: "Can't be more than 10 characters long."
            },
            {
                templateVariable: 'specialNumber',
                question: "What is your favourite letter?",
                errorMessage: "Z is not valid.",
                isValid(val) {
                    return val !== 'Z'
                }
            }
        ]
    },
    // {
    //     name: "Container Component",
    //     templatePath: "templates/CONTAINER_NAME.js",
    //     outputPath: "output/containers",
    //     fields: [
    //         {
    //             templateVariable: 'CONTAINER_NAME',
    //             question: "What is your container component's name?",
    //             errorMessage: "Must be at least 5 characters long.",
    //             isValid(val) {
    //                 return val.length <= 5
    //             }
    //         }
    //     ]
    // }
];
