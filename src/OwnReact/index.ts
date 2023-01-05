/**
 * Description：index
 * Created by aio on 2023/1/5.
 */

export const TEXT_ELEMENT = 'TEXT ELEMENT'
class OwnReact {
  static createTextElement (value:any) {
    return OwnReact.createElement(TEXT_ELEMENT, {
      nodeValue: value
    })
  }
  static createElement (type:any, config:any, ...args:any) {
    console.log(type, 'type')
    console.log( config, 'config')
    console.log( ...args, 'args')
    console.log('====')
    console.log('\n')
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
          : OwnReact.createTextElement(c)
      )

    return { props, type }
  }
}


export default OwnReact
