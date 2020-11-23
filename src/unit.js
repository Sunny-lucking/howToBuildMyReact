// Unit.js
import { Element } from "./element" // 新增代码
import $ from "jquery"
class Unit {
    constructor(element) {
        this._currentElement = element
    }
    getMarkUp() {
        throw Error("此方法应该被重写，不能直接被使用")
    }
}
class TextUnit extends Unit {
    getMarkUp(reactid) {
        this._reactid = reactid
        return `<span data-reactid=${reactid}>${this._currentElement}</span>`
    }
    update(nextElement){
        if(this._currentElement !== nextElement){
            this._currentElement = nextElement
             $(`[data-reactid="${this._reactid}"]`).html(nextElement)
        }
    }
}

class NativeUnit extends Unit {
    getMarkUp(reactid) {
        this._reactid = reactid
        let { type, props } = this._currentElement;
        let tagStart = `<${type} data-reactid="${this._reactid}"`
        let childString = ''
        let tagEnd = `</${type}>`
        for (let propName in props) {
            if (/^on[A-Z]/.test(propName)) { // 添加绑定事件
                let eventName = propName.slice(2).toLowerCase(); // 获取click对象
                $(document).delegate(`[data-reactid="${this._reactid}"]`, `${eventName}.${this._reactid}`, props[propName])
            } else if (propName === 'style') { // 如果是一个样式对象
                let styleObj = props[propName]
                let styles = Object.entries(styleObj).map(([attr, value]) => {
                    return `${attr.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${value}`;
                }).join(';')
                tagStart += (` style="${styles}" `)
            } else if (propName === 'className') { // 如果是一个类名
                tagStart += (` class="${props[propName]}"`)
            } else if (propName === 'children') { // 如果是子元素
                let children = props[propName];
                children.forEach((child, index) => {
                    let childUnit = createUnit(child); // 可能是字符串 ，也可能是原生标签，也可能是自定义属性
                    let childMarkUp = childUnit.getMarkUp(`${this._reactid}.${index}`)
                    childString += childMarkUp;
                })
            } else { // 其他 自定义的属性 例如 reactid
                tagStart += (` ${propName}=${props[propName]} `)
            }
        }
        return tagStart + '>' + childString + tagEnd
    }
}
function shouldDeepCompare(oldElement,newElement){
    if(oldElement != null && newElement != null){
        let oldType = typeof oldElement
        let newType = typeof newElement
        if((oldType === 'string' || oldType === "number")&&(newType === "string" || newType === "number")){
            return true
        }
        if(oldElement instanceof Element && newElement instanceof Element){
            return oldElement.type === newElement.type
        }
    }
}
class CompositeUnit extends Unit{
    update(nextElement,partialState){
        // 有传新元素的话就更新currentElement为新的元素
        this._currentElement = nextElement || this._currentElement; 
        // 获取新的状态,并且更新组件的state
        let nextState = this._componentInstance.state = Object.assign(this._componentInstance.state,partialState);
        // 新的属性对象
        let nextProps = this._currentElement.props
        if(this._componentInstance.shouldComponentUpdate && !this._componentInstance.shouldComponentUpdate(nextProps,nextState)){
            return;
        }
        // 下面要进行比较更新
        // 先得到上次渲染的unit
        let preRenderedUnitInstance = this._renderUnit;
        // 通过上次渲染的unit得到上次渲染的元素
        let preRenderElement = preRenderedUnitInstance._currentElement
        // 得到最新的渲染元素
        let nextRenderElement = this._componentInstance.render()
        // 如果新旧两个元素类型一样，则可以进行深度比较，如果不一样，直接干掉老的元素，新建新的
        if(shouldDeepCompare(preRenderElement,nextRenderElement)){
            // 如果可以进行深度比较，则把更新的工作交给上次渲染出来的那个Element元素对应的unit来处理
            preRenderedUnitInstance.update(nextRenderElement)
            this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate()
        }else{
            this._renderUnit = createUnit(nextRenderElement)
            let nextMarkUp = this._renderUnit.getMarkUp(this._reactid)
            $(`[data-reactid="${this._reactid}"]`).replaceWith(nextMarkUp)
        }

    }
    getMarkUp(reactid){
      this._reactid = reactid
      let {type:Component,props} = this._currentElement // 实际上，在例子中type === Counter
      let componentInstance = this._componentInstance = new Component(props); // 把 实例对象 保存到这个 当前的 unit
      componentInstance._currentUnit = this // 把 unit 挂到 实例componentInstance 
      componentInstance.componentWillMount && componentInstance.componentWillMount()
      let renderElement = componentInstance.render();
      let renderUnit = this._renderUnit = createUnit(renderElement); // 把渲染内容对象也挂载到当前 unit
      $(document).on("mounted",()=>{
          componentInstance.componentDidMount &&  componentInstance.componentDidMount()
      })
      return renderUnit.getMarkUp(this._reactid)
    }
}
function createUnit(element) {
    if (typeof element === 'string' || typeof element === "number") {
        return new TextUnit(element)
    }
    if (element instanceof Element && typeof element.type === "string") {
        return new NativeUnit(element)
    }
    // 新增代码
    if(element instanceof Element && typeof element.type === 'function'){
        return new CompositeUnit(element)
    }

}


export {
    createUnit
}