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
  maxHeight={ 42 }                         // Required: Pixel value (number)
  text={ title }                           // Required: Some text to trim! (strictly strings only, no HTML)
  tag="p"                                  // HTML tag name (string, optional - defaults to div)
  className="stock-matrix__product-title"  // custom class (string, optional)
/>
```


# v0.0.2 Release Notes
- TODO: allow for units in maxHeight
- TODO: does not handle resize event. this is coming soon
- TODO: needs to give more things as options, like the fade in effect
