> **Under construction...**: Don't use this in production until this notice is removed! Ironing out some problems with some use cases.

# react-shears
[![npm](https://img.shields.io/npm/v/react-shears.svg)](https://www.npmjs.com/package/react-shears) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-shears.svg) [![GitHub stars](https://img.shields.io/github/stars/edc123/react-shears.svg?style=social)](https://github.com/edc123/react-shears)

✂️ Multiline ellipsis for text ... that refreshes on window resize. Just define a maximum height!

![Demo with resizing browser](https://i.imgur.com/Jcf1bKF.gif)

**react-shears** places an ellipsis (...) in your text! All you have to do is define a maximum height and the component takes care of the rest.

### Other benefits
- _Fits as much text in as possible._ This is because it uses a binary search as well as a per-character fitting algorithm.

- _Accessible._ Text that is hidden is still visible to screen readers and the ellipsis is hidden away.

- _Browser compatibility._ Supports IE >= 8 by default. If you use the built-in fade effect (fadeInDuration), it uses CSS `transition` which is IE >= 10.

---

# Get some shears!

```
npm i react-shears
yarn add react-shears
```

> **Note**: Your project must support the use of React Hooks. (React >= 16.8.0)

# Example usage

```
import Shears from 'react-shears'

<Shears
  maxHeight={ 42 }
  text={ title }
  tag="p"
  className="title"
  fadeInDuration={ 200 }
  debounceDuration={ 200 }
/>
```

# Props

Option | Type | Default | Description
------ | ---- | ------- | -----------
maxHeight | number of pixels | - | _Required._ This is how high you want to limit your multiline trimmed text to.
text | string | `''` | _Required._ This is the text you want to trim. Strictly strings only, no HTML.
tag | string | `'div'` | _Optional._ Customise the HTML tag the `<Shears / >` component returns.
className | string | `''` | _Optional._ A custom class name.
fadeInDuration | number of ms | `0` | _Optional._ Turns on a fade in effect on component mount (done with CSS `transition` property).
debounceDuration | number of ms | `200` | _Optional._ Change the debounce time if desired.

# v1.0.0 Release Notes
- added options for fade in and debounce durations
- now dynamically updates with text prop change
- performance improvements


---

### Limitations

- Does not handle when the container itself resizes due transforming it's width with say, CSS. It only looks for width changes due to window resize events.
- Currently only takes pure text input, and will not work with HTML.
- Developer needs to handle sanitising input on their side.

# Contributing & Bugs
PRs, feature requests and bug reports are welcome!
