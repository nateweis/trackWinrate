const app = angular.module('WinRateApp', []);

app.controller('WinController', ['$http', '$window', function($http, $window){
    const ctrl = this;
    this.colorArr = []
    this.decks = []

    $window.onload = () => {
        $http({method:'GET', url: '/deck'})
        .then(res => {
            console.log(res.data)
            ctrl.decks = res.data.decks
        })
        .catch(err => console.log(err))
    }

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
            let highestNum = 0
            ctrl.decks.forEach(d =>{if(d.id >= highestNum) highestNum = d.id})
            highestNum++
            let obj = {
                name: ctrl.name,
                color: {},
                id: highestNum,
                wins : 0,
                losses : 0
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
                ctrl.decks.push(obj)
            })
            .catch(err => console.log(err))
        }
    }

}] );