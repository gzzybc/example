/**
 * Description：index
 * Created by aio on 2023/1/5.
 */

// const element = () => {
//   return /*#__PURE__*/React.createElement("div", {
//     id: "container"
//   }, /*#__PURE__*/React.createElement("input", {
//     value: "foo",
//     type: "text"
//   }), /*#__PURE__*/React.createElement("a", {
//     href: "/bar"
//   }, "bar"), /*#__PURE__*/React.createElement("span", {
//     onClick: e => alert('Hi')
//   }, "click me"), /*#__PURE__*/React.createElement("p", null, new Date().toLocaleTimeString()));
// };
export const TEXT_ELEMENT = "TEXT ELEMENT"
class OwnReact {
  static createTextElement(value: any) {
    return OwnReact.createElement(TEXT_ELEMENT, {
      nodeValue: value,
    })
  }

  static createElement(type, config: any, ...args: any) {
    console.log(type, "type")
    console.log(config, "config")
    console.log(...args, "args")
    console.log("====")
    console.log("\n")
    const props = Object.assign({}, config)
    props.children = args.length > 0 ? [].concat(args) : []

    props.children = props.children
      .filter((c) => c !== null && c !== false)
      .map((c) => (c instanceof Object ? c : OwnReact.createTextElement(c)))

    return { type, props }
  }
}

export default OwnReact
