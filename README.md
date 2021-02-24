# d2l-labs-attribute-picker

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui-labs/attribute-picker.svg)](https://www.npmjs.org/package/@brightspace-ui-labs/attribute-picker)
[![Dependabot badge](https://flat.badgen.net/dependabot/BrightspaceUILabs/attribute-picker?icon=dependabot)](https://app.dependabot.com/)
[![Build status](https://travis-ci.com/@brightspace-ui-labs/attribute-picker.svg?branch=master)](https://travis-ci.com/@brightspace-ui-labs/attribute-picker)

> Note: this is a ["labs" component](https://github.com/BrightspaceUI/guide/wiki/Component-Tiers). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#working-with-design)
> - [ ] [design.d2l entry](http://design.d2l/)
> - [ ] [Architectural sign-off](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#web-component-architecture)
> - [ ] [Continuous integration](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-continuously-with-travis-ci)
> - [ ] [Cross-browser testing](https://github.com/BrightspaceUI/guide/wiki/Testing#cross-browser-testing-with-sauce-labs)
> - [ ] [Unit tests](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-polymer-test) (if applicable)
> - [ ] [Accessibility tests](https://github.com/BrightspaceUI/guide/wiki/Testing#automated-accessibility-testing-with-axe)
> - [ ] [Visual diff tests](https://github.com/BrightspaceUI/visual-diff)
> - [ ] [Localization](https://github.com/BrightspaceUI/guide/wiki/Localization) with Serge (if applicable)
> - [ ] Demo page
> - [ ] README documentation

Autocompleting dropdown to choose one or more new or pre-existing attributes

## Installation

To install from NPM:

```shell
npm install @brightspace-ui-labs/attribute-picker
```

## Usage

```html
<script type="module">
    import '@brightspace-ui-labs/attribute-picker/attribute-picker.js';
</script>
<d2l-labs-attribute-picker>My element</d2l-labs-attribute-picker>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| allow-freeform | Boolean | When enabled, the user can manually type any attribute they wish. If false, they must select from the dropdown. |
| aria-label | String | Required. When true, the autocomplete dropdown will not be displayed to the user. |
| attributes | Array |  An array of strings representing the attributes currently selected in the picker. |
| assignable-attributes | Array | An array of strings available in the dropdown list. |
| hide-dropdown | Boolean | When enabled, the autocomplete dropdown will not be displayed to the user. |
| limit | Number | The maximum number of attributes permitted. |

**Accessibility:**

To make your usage of `d2l-labs-attribute-picker` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| aria-label | The label should provide context for the attribute picker, such as type of attribute. |

**Events:**
The `d2l-labs-attribute-picker` dispatches the `attributes-changed` event each time an attribute has been added or removed. It will return the updated list of attributes:
```javascript
attributePicker.addEventListener('attributes-changed', (e) => {
  console.log(e.detail.attributes.toString());
});
```

The `d2l-labs-attribute-picker` dispatches the `attribute-limit-reached` event when the user attempts to enter an attribute greater than the limit. This can be used to send feedback to the user.

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Running the demos

To start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo page and tests:

```shell
npm start
```

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint

# lit-analyzer only
npm run lint:lit
```

### Testing

```shell
# lint, unit test and visual-diff test
npm test

# lint only
npm run lint

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

### Visual Diff Testing

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

```shell
# run visual-diff tests
npm run test:diff

# subset of visual-diff tests:
npm run test:diff -- -g some-pattern

# update visual-diff goldens
npm run test:diff:golden
```

Golden snapshots in source control must be updated by Travis CI. To trigger an update, press the "Regenerate Goldens" button in the pull request `visual-difference` test run.

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version and create a tag.
