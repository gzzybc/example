/**
 * Created by aio on 2023/1/5 18:46
 */

import * as Didact from "./Didact"
import App from "./jsx/test"
import { element } from "./jsx/index"

const container = document.getElementById("root")

Didact.render(element(), container)
