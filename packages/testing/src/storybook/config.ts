import { configure } from '@storybook/react'
//import './storybook.css'

export function createStoryBookConfig(req: __WebpackModuleApi.RequireContext) {
  configure(() => {
    req.keys().forEach(filename => req(filename))
  }, module);
}