import { TEXT_ELEMENT } from "../OwnReact"

const isEvent = (name) => name.startsWith("on")

const isAttribute = (name) => !isEvent(name) && name !== "children" && name !== "style"

const isNew = (prev, next) => (key) => prev[key] !== next[key]
const isGone = (prev, next) => (key) => !(key in next)

function updateDomProperties(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps[key]))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  Object.keys(prevProps)
    .filter(isAttribute)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => (dom[name] = null))
  Object.keys(nextProps)
    .filter(isAttribute)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => (dom[name] = nextProps[name]))

  prevProps.style = prevProps.style || {}
  nextProps.style = nextProps.style || {}
  Object.keys(nextProps.style)
    .filter(isNew(prevProps.style, nextProps.style))
    .forEach((key) => {
      dom.style[key] = nextProps.style[key]
    })
  Object.keys(prevProps)
    .filter(isGone(prevProps.style, nextProps.style))
    .forEach((key) => {
      dom.style[key] = ""
    })

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

function createDomElement(fiber) {
  const isTextElement = fiber.type === TEXT_ELEMENT
  const dom = isTextElement ? document.createTextNode("") : document.createElement(fiber.type)

  updateDomProperties(dom, [], fiber.props)
  return dom
}

const HOST_COMPONENT = "host"
const CLASS_COMPONENT = "class"
const HOST_ROOT = "root"

const updateQueue: any = []
let nextUnitOfWork: any = null
const pendingCommit = null

const ENOUGH_TIME = 1

function render(elements, containerDom) {
  updateQueue.push({
    from: HOST_ROOT,
    dom: containerDom,
    newProps: {
      children: elements,
    },
  })
  requestIdleCallback(performWork)
}

function scheduleUpdate(instance, partialState) {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance,
    partialState,
  })
  requestIdleCallback(performWork)
}

function performWork(deadline) {
  workLoop(deadline)
  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork)
  }
}

function workLoop(deadline) {
  if (!nextUnitOfWork) {
    //
  }
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}

function commitAllWork() {}
function performUnitOfWork(wipFiber) {
  beginWork(wipFiber)
  if (wipFiber.child) {
    return wipFiber.child
  }

  let uow = wipFiber

  while (uow) {
    completeWork(uow)
    if (uow.sibling) {
      return uow.sibling
    }
    uow = uow.parent
  }
}
function completeWork() {}
function beginWork(wipFiber) {
  if (wipFiber.tag === CLASS_COMPONENT) {
    updateClssComponent(wipFiber)
  } else {
    updateHostComponent(wipFiber)
  }
}

function updateClssComponent(wipFiber) {
  if (!wipFiber.stateNode) {
    wipFiber.stateNode = createDomElement(wipFiber)
  }
  const newChildElements = wipFiber.props.children
  reconcileChildArray(wipFiber, newChildElements)
}

function updateHostComponent(wipFiber) {
  let instance = wipFiber.stateNode
  if (instance === null) {
    instance = wipFiber.stateNode = createInstance(wipFiber)
  } else if (wipFiber.props === instance.props && !wipFiber.partialState) {
    cloneChildFibers(wipFiber)
    return
  }

  instance.props = wipFiber.props
  instance.state = Object.assign({}, instance.state, wipFiber.partialState)
  wipFiber.partialState = null

  const newChildElements = wipFiber.stateNode.render()
  reconcileChildArray(wipFiber, newChildElements)
}

function reconcileChildArray(wipFiber, newChildElements) {}
function resetNextUnitOfWork() {
  const update = updateQueue.shift()
  if (!update) {
    return
  }

  if (update.partialState) {
    update.instance.__fiber.partialState = update.partialState
  }
  const root =
    update.from === HOST_ROOT ? update.dom._rootContainerFiber : getRoot(update.in.__fiber)

  nextUnitOfWork = {
    tag: HOST_ROOT,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root,
  }
}

function getRoot(fiber) {
  let node = fiber
  while (node.parent) {
    node = node.parent
  }
  return node
}
