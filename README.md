# RN SVG Icon Generator

Create a `react-native-svg-icon` pack from a directory of SVG files.

## Install
```sh
npm install rn-svg-icon-generator
```

## Usage
1) Place SVG files in `src/icons/`.
2) Run:
```sh
npm run build:icons
```
This writes `lib/svgs.js`.

## Custom paths
```sh
node src/build.js --input ./icons --output ./lib/svgs.js
```

## Use in app
```js
import Icon from 'rn-svg-icon-generator'
```

## Development
```sh
npm run lint
```

## License
See `LICENSE`.
