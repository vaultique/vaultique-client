// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', '**/*.json', '**/*.md', '**/*.d.ts', 'src-tauri', 'dist'],
}, {
  rules: {
    'ts/consistent-type-definitions': 'off',
  },
})
