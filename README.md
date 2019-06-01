# react-shears
Trim text with ease!

# Get some shears!

```
npm i react-shears
yarn add react-shears
```

> **Note**: Your project must support the use of react hooks. (React >= 16.8.0)

# Usage


```
<Shears
  maxHeight={ 42 }          // Required: Pixel value (number)
  text={ title }            // Required: Some text to trim! (strictly strings only, no HTML)
  tag="p"                   // HTML tag name (string, optional - defaults to div)
  className="title"         // custom class (string, optional)
  fadeInDuration={ 200 }    // time to fade in (number of ms, optional - defaults to 0)
  debounceDuration={ 200 }  // time to fade in (number of ms, optional - defaults to 200)
/>
```


# v1.0.0 Release Notes
- added options for fade in and debounce durations
- now dynamically updates with text prop change
- performance improvements