# react-shears
Trim text with ease!

# Get some shears!

```
npm i react-shears
yarn add react-shears
```

# Usage


```
<Shears
  maxHeight={ 42 }     // Required: Pixel value (number)
  text={ title }       // Required: Some text to trim! (strictly strings only, no HTML)
  tag="p"              // HTML tag name (string, optional - defaults to div)
  className="title"    // custom class (string, optional)
/>
```


# v0.0.3 Release Notes
- dep free, and works for IE8+
- TODO: allow for units in maxHeight
- TODO: needs to give more things as options, like the fade in effect
