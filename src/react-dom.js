// react-dom.js
import {createUnit} from './unit'
import $ from "jquery"
let ReactDOM = {
    render,
    rootIndex:0
}
function render(element,container){
    let unit = createUnit(element)
    let markUp = unit.getMarkUp(ReactDOM.rootIndex);// 用来返回HTML标记
    $(container).html(markUp)
    $(document).trigger("mounted")
}

export default ReactDOM