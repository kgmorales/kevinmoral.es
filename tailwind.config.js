const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.js',
    './components/**/*.js',
    './layouts/**/*.js',
    './lib/**/*.js',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    animation: {
      wiggle: 'wiggle 1s ease-in-out infinite',
      'photo-spin': 'photo-spin 2s 1 linear forwards',
      blinker: 'blinker 1.2s cubic-bezier(0.5, 0, 1, 1) infinite alternate',
      equalizer: 'equalizer 1.9s steps(20, end) infinite',
      marquee: 'marquee 5s linear infinite alternate',
    },
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
      'photo-spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      blinker: {
        from: { opacity: '0.9' },
        to: { opacity: '0.1' },
      },
      equalizer: {
        '0%': { height: '60%' },
        '4%': { height: '50%' },
        '8%': { height: '40%' },
        '12%': { height: '30%' },
        '16%': { height: '20%' },
        '20%': { height: '30%' },
        '24%': { height: '40%' },
        '28%': { height: '10%' },
        '32%': { height: '40%' },
        '36%': { height: '60%' },
        '40%': { height: '20%' },
        '44%': { height: '40%' },
        '48%': { height: '70%' },
        '52%': { height: '30%' },
        '56%': { height: '10%' },
        '60%': { height: '30%' },
        '64%': { height: '50%' },
        '68%': { height: '60%' },
        '72%': { height: '70%' },
        '76%': { height: '80%' },
        '80%': { height: '70%' },
        '84%': { height: '60%' },
        '88%': { height: '50%' },
        '92%': { height: '60%' },
        '96%': { height: '70%' },
        '100%': { height: '80%' },
      },
      marquee: {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(calc(-1 * var(--overflow-distance, 0px)))' },
      },
    },
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      letterSpacing: {
        tightest: '-.075em',
      },
      boxShadow: {
        neon: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff',
        normal: '2px 3px 5px 0px rgba(0, 0, 0, 0.25)',
      },
      fontSize: {
        '8.5xl': '7rem',
      },
      colors: {
        primary: colors.sky,
        gray: colors.neutral,
        cardBg: 'transparent',
        logoColor: '#46CDCF',
        darkSecondary: '#25282A',
        customDark: '#181A18',
        themeColor: '#171717',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')} !important`,
              },
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.900'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.900'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            'h4,h5,h6': {
              color: theme('colors.gray.900'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
            },
            code: {
              color: theme('colors.pink.500'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            details: {
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: theme('colors.gray.200') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.gray.500'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.gray.500'),
            },
            strong: { color: theme('colors.gray.600') },
            blockquote: {
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.gray.200'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')} !important`,
              },
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.100'),
            },
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.100'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.100'),
            },
            'h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
            },
            details: {
              backgroundColor: theme('colors.gray.800'),
            },
            hr: { borderColor: theme('colors.gray.700') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.gray.400'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.gray.400'),
            },
            strong: { color: theme('colors.gray.100') },
            thead: {
              th: {
                color: theme('colors.gray.100'),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700'),
              },
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
