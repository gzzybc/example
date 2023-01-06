/**
 * Description：index
 * Created by aio on 2023/1/5.
 */
export const TEXT_ELEMENT = "TEXT ELEMENT"
class OwnReact {
  static createTextElement(value: any) {
    return OwnReact.createElement(TEXT_ELEMENT, {
      nodeValue: value,
    })
  }

  static createElement(type, config: any, ...args: any) {
    const props = Object.assign({}, config)
    props.children = args.length > 0 ? [].concat(...args) : []
    props.children = props.children
      .filter((c) => c !== null && c !== false)
      .map((c) => (c instanceof Object ? c : OwnReact.createTextElement(c)))
    return { type, props }
  }
}

export default OwnReact
