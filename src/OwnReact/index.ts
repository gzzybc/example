/**
 * Description：index
 * Created by aio on 2023/1/5.
 */
export const TEXT_ELEMENT = "TEXT ELEMENT"
class OwnReact {
  static createTextElement(text) {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    }
  }

  static createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) =>
          typeof child === "object" ? child : OwnReact.createTextElement(child)
        ),
      },
    }
  }
}

export default OwnReact
