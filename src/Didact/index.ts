/**
 * Created by aio on 2023/1/6 12:44
 */
import { TEXT_ELEMENT } from "../OwnReact"

interface Element {
  type: typeof TEXT_ELEMENT | string
  props: {
    children: Element[]
  }
}
interface Instance {
  dom: HTMLElement
  element: Element

  childInstances: Instance[]
}

const defaultDom = document.getElementsByName("body")[0]
// eslint-disable-next-line no-use-before-define
let singleton: Didact
export class Didact {
  container: HTMLElement = defaultDom
  rootInstance: any = null
  constructor(container?: HTMLElement | null) {
    if (!singleton) {
      this.container = container || defaultDom
      singleton = this
    }
    return singleton
  }

  static get instance() {
    if (singleton) {
      return singleton
    }
    return new Didact()
  }

  render(element: Element) {
    if (this.container) {
      this.rootInstance = this.reconcile(this.container, this.rootInstance, element)
    }
  }

  /**
   * 是否渲染和 更新
   * @param parentDom 挂载节点
   * @param instance 根实例
   * @param element 新的节点
   */
  reconcile(parentDom: HTMLElement, instance: Instance, element: Element): null | Instance {
    if (instance === null) {
      const newInstance = this.instantiate(element)
      parentDom.appendChild(newInstance.dom)
      return newInstance
    } else if (element === null) {
      parentDom.removeChild(instance.dom)
      return null
    } else if (instance.element.type === element.type) {
      this.updateDomProperties(instance.dom, instance.element.props, element.props)
      instance.childInstances = this.reconcileChildren(instance, element)
      instance.element = element
      return instance
    } else {
      const newInstance = this.instantiate(element)
      parentDom.replaceChild(newInstance.dom, instance.dom)
      return newInstance
    }
  }

  reconcileChildren(instance: Instance, element: Element): Instance[] {
    const dom = instance.dom
    const childInstance = instance.childInstances
    const children = element.props.children
    const newChildInstances: any = []

    const len = Math.max(childInstance.length, children.length)

    for (let i = 0; i < len; i++) {
      newChildInstances.push(this.reconcile(dom, childInstance[i], children[i]))
    }
    return newChildInstances.filter((instance) => instance !== null)
  }

  /**
   * 创建实例
   * @param element 新节点
   */
  instantiate(element): Instance {
    const { type, props } = element
    const isTextElement = type === TEXT_ELEMENT

    const dom: HTMLElement = isTextElement
      ? document.createTextNode("")
      : document.createElement(type)
    this.updateDomProperties(dom, [], props)

    const childrenElement = props.children || []
    const childInstances = childrenElement.map((child) => this.instantiate(child))
    childInstances.forEach((childDom) => dom.appendChild(childDom.dom))
    return {
      dom,
      element,
      childInstances,
    }
  }

  /**
   * 更新dom 属性
   * @param dom
   * @param prevProps
   * @param nextProps
   */
  updateDomProperties(dom: HTMLElement, prevProps, nextProps): void {
    const isListener = (event) => event.startsWith("on")
    const isAttribute = (name) => !isListener(name) && name !== "children"

    Object.keys(prevProps)
      .filter(isListener)
      .forEach((key) => {
        const eventType = key.toLowerCase().substring(2)
        dom.removeEventListener(eventType, prevProps[key])
      })

    Object.keys(prevProps)
      .filter(isAttribute)
      .forEach((key) => {
        dom[key] = null
      })

    Object.keys(nextProps)
      .filter(isListener)
      .forEach((key) => {
        const eventType = key.toLowerCase().substring(2)
        dom.addEventListener(eventType, nextProps[key])
      })
    // nodeValue: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeValue
    Object.keys(nextProps)
      .filter(isAttribute)
      .forEach((key) => {
        dom[key] = nextProps[key]
      })
  }
}
