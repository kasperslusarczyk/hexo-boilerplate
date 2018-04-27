module.exports = {
  parser: 'postcss-scss',
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
          browsers:
          [
            '> 1%',
            'last 2 versions',
            'firefox >= 4',
            'safari 7',
            'safari 8',
            'IE 8',
            'IE 9',
            'IE 10',
            'IE 11'
          ]
    },
    'postcss-opacity': {},
    'lost': {},
    'cssnano': {
      autoprefixer: false,
      discardComments: {removeAll: true}
    }
  }
}
