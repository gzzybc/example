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
  type: any
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
   * 子元素实例列表
   */
  childInstances: Instance[]
  /**
   * 类组件 子元素
   */
  childInstance: Instance | any
  /**
   * 自身的实例
   */
  publicInstance?: any
}

// eslint-disable-next-line no-use-before-define
let rootInstance: any = null

export function render(element: Element, container?: HTMLElement | null) {
  debugger
  if (container) {
    rootInstance = reconcile(container, rootInstance, element)
  }
}
function createPublicInstance(element, internalInstance) {
  const { type: Type, props } = element
  const publicInstance = new Type(props)
  publicInstance.__internalInstance = internalInstance
  return publicInstance
}
/**
 * 是否渲染和 更新
 * @param parentDom 挂载节点
 * @param instance 根实例
 * @param element 新的节点
 */
export function reconcile(
  parentDom: HTMLElement,
  instance: Instance,
  element: Element
): null | Instance {
  // 实例不存在 直接新建
  if (instance === null) {
    const newInstance = instantiate(element)
    parentDom.appendChild(newInstance.dom)
    return newInstance
  } else if (element === null) {
    // 新的元素不存在直接删除
    parentDom.removeChild(instance.dom)
    return null
  } else if (instance.element.type !== element.type) {
    // 直接替换掉
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  } else if (typeof element.type === "string") {
    // 相同元素 更新属性
    updateDomProperties(instance.dom, instance.element.props, element.props)
    //  递归处理子元素
    instance.childInstances = reconcileChildren(instance, element)
    instance.element = element
    return instance
  } else {
    debugger
    instance.publicInstance.props = element.props
    const childElement = instance.publicInstance.render()
    const oldChildInstance = instance.childInstance
    const childInstance = reconcile(parentDom, oldChildInstance, childElement)
    instance.dom = childInstance.dom // 更新-dom
    instance.childInstance = childInstance // 更新-虚拟dom数
    instance.element = element // 更新-Didact元素
    return instance
  }
}

/**
 * 对比子元素的实例
 * 返回新的 元素实例
 * @param instance 元素实例
 * @param element 元素
 */
export function reconcileChildren(instance: Instance, element: Element): Instance[] {
  const dom = instance.dom
  const childInstance = instance.childInstances
  const children = element.props.children
  const newChildInstances: Array<Instance> = []

  const len = Math.max(childInstance.length, children.length)
  // 遍历比较实例和元素
  for (let i = 0; i < len; i++) {
    newChildInstances.push(reconcile(dom, childInstance[i], children[i]) as Instance)
  }
  return newChildInstances.filter((instance) => instance !== null)
}

/**
 * 创建实例
 * @param element 新节点
 */
export function instantiate(element): Instance {
  const { type, props } = element
  if (typeof type === "string") {
    const isTextElement = type === TEXT_ELEMENT

    const dom: any = isTextElement ? document.createTextNode("") : document.createElement(type)
    updateDomProperties(dom, [], props)

    const childrenElement = props.children || []
    const childInstances = childrenElement.map((child) => instantiate(child))
    childInstances.forEach((childDom) => dom.appendChild(childDom.dom))
    return {
      dom,
      element,
      childInstances,
      childInstance: null,
    }
  } else {
    const instance = {} as Instance
    const publicInstance = createPublicInstance(element, instance)
    const childElement = publicInstance.render()
    const childInstance = instantiate(childElement)
    const dom = childInstance.dom

    Object.assign(instance, {
      dom,
      element,
      childInstance,
      publicInstance,
    })
    return instance
  }
}

/**
 * 更新dom 属性
 * @param dom
 * @param prevProps
 * @param nextProps
 */
export function updateDomProperties(dom: HTMLElement, prevProps, nextProps): void {
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

export function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode
  const element = internalInstance.element

  reconcile(parentDom, internalInstance, element) // 对比-虚拟dom树
}
export class Component {
  state: Object = {}
  props: Object = {}
  __internalInstance!: any
  constructor(props) {
    this.props = props
    this.state = this.state || {}
  }

  setState(props) {
    this.state = Object.assign({}, this.props, props)
    updateInstance(this.__internalInstance) // 更新 虚拟-Dom树和 更新 html
  }
}
