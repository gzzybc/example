/**
 * Created by aio on 2023/1/5 18:46
 */

// nodeValue: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeValue

import App from './jsx/test'
import { TEXT_ELEMENT } from './OwnReact'

console.log(App())

const element = {
  type: 'div',
  props: {
    id: 'container',
    children: [
      { type: 'input', props: { value: 'foo', type: 'text' } },
      { type: 'a', props: { href: '/bar' } },
      {
        type: 'span',
        props: {
          children: [{
            type: TEXT_ELEMENT, // 1
            props: { nodeValue: 'Foo' } // 2
          }]
        }
      }
    ]
  }
}

function render (element, parentDom) {
  const { type, props } = element
  const isTextElement = type === TEXT_ELEMENT

  const dom = isTextElement
    ? document.createTextNode('')
    : document.createElement(type)
  const isListener = event => event.startsWith('on')
  Object.keys(props).filter(isListener).forEach(key => {
    const eventType = key.toLowerCase().substring(2)
    dom.addEventListener(eventType, props[key])
  })
  const isAttribute = name => !isListener(name) && name !== 'children'
  Object.keys(props).filter(isAttribute).forEach(key => {
    dom[key] = props[key]
  })

  const childrenElement = props.children || []

  childrenElement.forEach(child => {
    console.dir(dom, 'dom')
    render(child, dom)
  })
  // console.dir(parentDom)
  parentDom.appendChild(dom)
}
const container = document.getElementById('root')

render(element, container)
