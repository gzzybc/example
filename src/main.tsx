/**
 * Created by aio on 2023/1/5 18:46
 */

import { Didact } from "./Didact"
import { element } from "./jsx/index"
import App, { Counter } from "./jsx/Counter"

console.log(Counter, App)
debugger
const container = document.getElementById("root")
Didact.render(App, container)
