const app = angular.module('WinRateApp', []);

app.controller('WinController', ['$http', function($http){
    const ctrl = this;
    this.colorArr = []

    this.addColor = (str) => {
        let hasColor = false
        for(let i = 0; i < ctrl.colorArr.length; i++){
            if(ctrl.colorArr[i] === str) hasColor = true
        }
        if(!hasColor) ctrl.colorArr.push(str)
    }

    this.removeColor = (str) => {
        for(let i = 0; i < ctrl.colorArr.length; i++){
            if(ctrl.colorArr[i] === str) ctrl.colorArr.splice(i, 1)
        }
    }

    this.displayInputs = () => {
        if(ctrl.name){
            console.log(ctrl.name)
            ctrl.name= ""
        }
    }

}] );