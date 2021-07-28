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

    this.saveDeck = () => {
        if(ctrl.name && ctrl.colorArr.length > 0){
            let obj = {
                name: ctrl.name,
                color: {}
            }
            let color = ""
            ctrl.colorArr.forEach(c => {color += `${c},`});
            obj.color = color
            
            // console.log(obj)
            $http({method:'POST', url: '/deck', data: obj})
            .then(res => {
                alert(res.data.message)
                ctrl.name= ""
                ctrl.colorArr = []
                console.log(res.data)
            })
            .catch(err => console.log(err))
        }
    }

}] );