/**
 * Created by aio on 2023/1/6 12:44
 */
import { TEXT_ELEMENT } from "../OwnReact"

/**
 * 元素结构
 */
interface Element {
  /**
   * 元素类型
   */
  type: typeof TEXT_ELEMENT | string
  /**
   * 元素属性
   */
  props: {
    children: Element[]
  }
}

/**
 * 当前元素实例
 */
interface Instance {
  /**
   * 当前dom
   */
  dom: HTMLElement
  /**
   * 新的节点
   */
  element: Element
  /**
   * 子元素实例
   */
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
    // 实例不存在 直接新建
    if (instance === null) {
      const newInstance = this.instantiate(element)
      parentDom.appendChild(newInstance.dom)
      return newInstance
    } else if (element === null) {
      // 新的元素不存在直接删除
      parentDom.removeChild(instance.dom)
      return null
    } else if (instance.element.type === element.type) {
      // 相同元素 更新属性
      this.updateDomProperties(instance.dom, instance.element.props, element.props)
      //  递归处理子元素
      instance.childInstances = this.reconcileChildren(instance, element)
      instance.element = element
      return instance
    } else {
      // 直接替换掉
      const newInstance = this.instantiate(element)
      parentDom.replaceChild(newInstance.dom, instance.dom)
      return newInstance
    }
  }

  /**
   * 对比子元素的实例
   * 返回新的 元素实例
   * @param instance 元素实例
   * @param element 元素
   */
  reconcileChildren(instance: Instance, element: Element): Instance[] {
    const dom = instance.dom
    const childInstance = instance.childInstances
    const children = element.props.children
    const newChildInstances: Array<Instance> = []

    const len = Math.max(childInstance.length, children.length)
    // 遍历比较实例和元素
    for (let i = 0; i < len; i++) {
      newChildInstances.push(this.reconcile(dom, childInstance[i], children[i]) as Instance)
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
