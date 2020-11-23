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
        setInterval(()=>{
            this.setState({number:this.state.number+1})
        },1000)
    }
    componentDidUpdate(){
        console.log("阳光你好，我是update");
    }
    render(){
        
        return this.state.number
    }
}
let element = React.createElement(Counter,{name:"计时器"})
ReactDOM.render(element,document.getElementById('root'))