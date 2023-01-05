/**
 * Created by aio on 2023/1/5 20:34
 */

export const TEXT_ELEMENT = 'TEXT ELEMENT'
function createTextElement (value:any) {
  return createElement(TEXT_ELEMENT, {
    nodeValue: value
  })
}
export function createElement (type:any, config:any, ...args:any) {
  console.log(type, config, ...args)
  const props = Object.assign({}, config)
  const hasChildren = args.length > 0
  const rawChildren = hasChildren
    ? [].concat(...args)
    : []
  props.children = rawChildren
    .filter((c) => c !== null && c !== false)
    .map((c: any) =>
      c instanceof Object
        ? c
        : createTextElement(c)
    )

  return { props, type }
}

export const jsxDEV = createElement
