import antfu from '@antfu/eslint-config'
import { serverLayeringPlugin } from '@soubiran/eslint'

export default antfu(
  {},
  {
    name: 'quick-news/server-layering',
    files: ['src/server/**/*.ts'],
    plugins: {
      'server-layering': serverLayeringPlugin,
    },
    rules: {
      'server-layering/repositories-only-in-services': 'error',
      'server-layering/services-only-in-controllers': 'error',
    },
  },
)
