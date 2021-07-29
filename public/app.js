const app = angular.module('WinRateApp', []);

app.controller('WinController', ['$http', '$window', function($http, $window){
    const ctrl = this;
    this.colorArr = []
    this.decks = []

    $window.onload = () => {
        $http({method:'GET', url: '/deck'})
        .then(res => {
            let decks = res.data.decks
            
            decks.forEach(d => {
                let colors = d.color.split(",")
                colors.pop()
                d.color = colors
            })

            ctrl.decks = decks
            console.log(ctrl.decks)
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

    // ///////////////////////////////////
    // Add a New Deck (post)
    // //////////////////////////////////
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
                obj.color = ctrl.colorArr

                ctrl.decks.unshift(obj)
                ctrl.name= ""
                ctrl.colorArr = []
            })
            .catch(err => console.log(err))
        }
        else if (!ctrl.name)alert("Need to name the deck")
        else if (ctrl.colorArr.length <= 0)alert("Need to select deck colors")
    }

    // ///////////////////////////////////
    // changing the win/loss record (put)
    // //////////////////////////////////

    this.changeRecord = (str, id) => {
        for(let i = 0; i < ctrl.decks.length; i++){
            if(ctrl.decks[i].id === id){
                if(str === 'win') ctrl.decks[i].wins += 1
                else if(str === 'loss') ctrl.decks[i].losses += 1
                else if(str === 'wipe') {
                    ctrl.decks[i].losses = 0;
                    ctrl.decks[i].wins = 0;
                }

                $http({method:'PUT', url: '/deck', data: ctrl.decks[i]})
                .then(res => console.log(res.data))
                .catch(err => console.log(err))
            }
        }
    }

    // ///////////////////////////////////
    // changing the win/loss record
    // //////////////////////////////////
    this.deleteDeck = (id) => {
        $http({method:'DELETE', url: '/deck/' + id})
        .then(res => {
            console.log(res.data)
            for(let i = 0; i < ctrl.decks.length; i++) {if(ctrl.decks[i].id === id) ctrl.decks.splice(i, 1)}
        })
        .catch(err => console.log(err))
    }

}] );