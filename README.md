node-gpw
========

This module provides a simple method to create human readable, memorable passwords.
It's based upon the JavaScript port of [GPW](http://www.multicians.org/thvv/gpw-js.html) by [Tom Van Vleck](http://www.multicians.org/thvv/) and can be considered very stable.

## Install

    $ npm install node-gpw

## Usage

The following code will print a 12-character "pronounceable" password:

```javascript
var gpw = require('node-gpw');
console.log(gpw(12));
```
