// component.js
class Component{
    constructor(props){
        this.props = props
    }
    setState(partialState){
        // 第一个参数是新的元素，第二个参数是新的状态
        this._currentUnit.update(null,partialState)
    }
}

export {
    Component
}