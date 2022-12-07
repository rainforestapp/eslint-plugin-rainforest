# eslint-plugin-eslint-plugin

Custom rules built for Rainforest QA

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@rainforestqa/eslint-plugin`:

```sh
npm install @rainforestqa/eslint-plugin --save-dev
```

## Usage

Add `@rainforestqa/eslint-plugin` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["@rainforestqa/eslint-plugin"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "eslint-plugin/rule-name": 2
  }
}
```

## Supported Rules

- `no-dangerous-conditional-literals-in-jsx`: Certain use of conditional rendering can be broken by browser auto translate / similar dom modifying extensions.
