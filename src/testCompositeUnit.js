// index.js
import React from './react';
import ReactDOM from './react-dom';
import $ from 'jquery'
class Counter extends React.Component{
    constructor(props){
        super(props)
        this.state = {number:0};
    }
    componentWillMount(){
        console.log("阳光你好，我是componentWillMount");
        $(document).on("mounted",()=>{
            console.log(456);
            
        })
    }
    componentDidMount(){
        console.log("我是componentDidMount");
    }
    render(){
        let p = React.createElement('p',{style:{color:'red'}},this.state.number);
        let button = React.createElement('button',{},"+")
        return React.createElement('div',{id:'counter'},p,button)
    }
}
let element = React.createElement(Counter,{name:"计时器"})
ReactDOM.render(element,document.getElementById('root'))