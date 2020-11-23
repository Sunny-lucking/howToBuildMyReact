// index.js
import React from './react';
import ReactDOM from './react-dom';

var li1 = React.createElement('li', {onClick:()=>{alert("click")}}, 'First');
var li2 = React.createElement('li', {style:{backgroundColor:"red"}}, 'Second');
var li3 = React.createElement('li', {}, 'Third');
var ul = React.createElement('ul', {className: 'list'}, li1, li2, li3);
console.log(ul);
ReactDOM.render(ul,document.getElementById('root'))