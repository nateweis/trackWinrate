const app = angular.module('WinRateApp', []);

app.controller('WinController', ['$http', function($http){
    const ctrl = this;

    this.addColor = (str) => {
        console.log(str)
    }

    this.displayInputs = () => {
        if(ctrl.name){
            console.log(ctrl.name)
            ctrl.name= ""
        }
    }

}] );