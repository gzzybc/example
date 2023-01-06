/**
 * Created by aio on 2023/1/5 18:46
 */

import { Didact } from "./Didact"
import App from "./jsx/test"

const container = document.getElementById("root")

const didact = new Didact(container)
didact.render(App())
