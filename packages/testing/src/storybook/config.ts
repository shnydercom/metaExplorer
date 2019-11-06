import { configure } from '@storybook/react'
import './storybook.css'

const req = require.context('../src', true, /\.story\.(ts|tsx)$/)

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module);
