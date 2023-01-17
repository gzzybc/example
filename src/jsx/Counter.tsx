import { Didact } from "../Didact"
import OwnReact from "../OwnReact"
/** @jsxRuntime classic */
/** @jsx OwnReact.createElement */
export function Counter() {
  const [state, setState] = Didact.useState(1)
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>
}
const element = <Counter />
console.log(element, "element")
export default element
