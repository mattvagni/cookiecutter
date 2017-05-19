# cookiecutter :cookie: :scissors:

 [![CircleCI](https://circleci.com/gh/mattvagni/cookiecutter/tree/master.svg?style=svg)](https://circleci.com/gh/mattvagni/cookiecutter/tree/master) [![Greenkeeper badge](https://badges.greenkeeper.io/mattvagni/cookiecutter.svg)](https://greenkeeper.io/) [![npm version](https://badge.fury.io/js/cookiecutter.svg)](https://badge.fury.io/js/cookiecutter)

A CLI for creating boilerplate files/folders based on templates you provide. Like [Yeoman](http://yeoman.io/) or Python's [Cookiecutter](https://github.com/audreyr/cookiecutter) but much, much simpler.

Show me:

![Example with Error](https://cookiecutter-images.surge.sh/WithError.gif)

It is designed for existing projects where you want an easy way to create boilerplate files - instead of having to copy paste an existing file & then remember to make the necessary changes.

A good use-case for cookiecutter is, for example, creating a new Redux connected React component within a project. Not hard... but also not fun.

:white_check_mark: Cookiecutter supports:
- Multiple templates with the ability to pick which template to use via the CLI.
- Multiple fields per template with the ability to specify them from the CLI.
- Custom validation & error messages for fields.
- Any type of file or folder structure.

:x: Cookiecutter **doesn't** support:
- Conditionals or any other logic in templates. You can however achieve similar things by having multiple templates).
- Bootstrapping a project from scratch (i.e I have no code but need to set a project up)
- Adding code to existing files
- Lots of other things Yeoman _does_ support. If your use-case is complex, cookiecutter might not cut it.

## Quick Setup
First `npm install --save-dev cookiecutter`. You can also install this globally if you prefer.

The add the following to your package.json (no need to do this if you are using yarn):
```json
"scripts": {
    "cookiecutter": "cookiecutter"
}
```
You can now start creating your template. For example if you create a 'templates' folder in your root and add the following template:

```js
// templates/COMPONENT_NAME.js
import React from 'react';

class COMPONENT_NAME extends React.Component {
    render() {
        return <div>Hello World</div>;
    }
}

export default COMPONENT_NAME;
```

You can now configure Cookiecutter to replace the string `COMPONENT_NAME` like so by creating a file in the root of your project called `cookiecutter.config.js`. Cookiecutter will always look in your root for a file called `cookiecutter.config.js`.
```js
// cookiecutter.config.js
module.exports = [
    {
        name: "Normal React Component",
        templatePath: "templates/COMPONENT_NAME.js",
        outputPath: "src/components/",
        fields: [
            {
                templateVariable: 'COMPONENT_NAME',
                question: "What is the component's name?",
            }
        ]
    }
];

```

If you now run `npm run cookiecutter` you will be prompted to pick which template you'd like to use. After which you will be asked to answer each field's question. It should look something like this:

![Example from Tutorial](https://cookiecutter-images.surge.sh/ExampleComponent.gif)

That's it. Cookiecutter now created the following file:

```diff
    - src
      - components
+       - ExampleComponent.js
        - OtherComponent.js
        - Etc.js
```

Cookiecutter will **never** overwrite any existing files.

## Validating fields / custom validation
To do this you can add `isValid` and a custom `errorMessage` to a fields configuration.
Using the example above you could, for example, ensure component names follow a naming convention.

```diff
// in cookiecutter.config.js
module.exports = [
    {
       name: "Normal React Component",
        templatePath: "templates/COMPONENT_NAME/index.js",
        outputPath: "src/components/",
        fields: [
            {
                templateVariable: 'COMPONENT_NAME',
                question: "What is the component's name?",
+               errorMessage: 'A component must be in PascalCase and can only include letters.',
+               isValid(value) {
+                   return !!value.match(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/g);
+               }
            }
        ]
    }
];

```

## Multiple templates
You can configure multiple templates and Cookiecutter will let you pick which template to use. The template's 'name' is what will be used in the CLI when asking which template to use.

You can specify multiple templates like so:
```js
// in cookiecutter.config.js
module.exports = [
    {
       // Configuration for the 1st template
    },
    {
       // Configuration for the 2nd template
    },
];

```

## Templates with folders
If you specify a folder as a template, then the folder will be created in the output directory as well. This is useful if you have a folder structure such as:

```
- ComponentName
    - index.js
    - styles.css
```
Cookiecutter will recursively copy all files within your templates folder and replace any occurrences of your specified fields.

If you don't want this behavior, specify a file as your template's `templatePath`.

## Contributing
After cloning the repo `yarn install`.

You can play with the cli in the 'playground' folder. To do this, `cd` into it and run `. run.sh`. This is like running the cli once it's published and on npm but allows you to work on it locally.

To run tests run `yarn test`.
To lint files (this will also happen in CircleCI when you open a PR): `yarn lint`

## Roadmap/Plans
- Offer a set of helpers for validation user input. Esp. for common 'cases' such as snake_case, PascalCase etc.
- Allow users to specify a custom path for their config.
- Offer the ability for people to show a message that is only shown AFTER a template is successfully rendered. This could be helpful for things such as help-text such as: 'You can import this component like so: ...'
