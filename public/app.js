const app = angular.module('WinRateApp', []);

app.controller('WinController', ['$http', '$window', function($http, $window){
    const ctrl = this;
    this.colorArr = []
    this.decks = []
    this.display = false;

    $window.onload = () => {
        $http({method:'GET', url: '/deck'})
        .then(res => {
            let decks = res.data.decks
            
            decks.forEach(d => {
                let colors = d.color.split(",")
                colors.pop()
                d.color = colors

                d.wl_logg = JSON.parse(d.wl_logg)
                d.wl_catigories = JSON.parse(d.wl_catigories)
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

    this.displayLI = (bool) => {
        if(bool) ctrl.display = true
        else ctrl.display = false
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
                losses : 0,
                wl_logg: '[{"w":0,"l":0}]',
                wl_catigories : '[' +
                    '{"catigorie" : "General", "w" :0, "l":0} ,' +
                    '{"catigorie" : "Play", "w":0,"l":0} ,'+
                    '{"catigorie" : "Standard Ranked", "w":0,"l":0} ,'+
                    '{"catigorie" : "Standard Event", "w":0,"l":0} ,'+
                    '{"catigorie" : "Standard Play 2022", "w":0,"l":0} ,'+
                    '{"catigorie" : "Standard Ranked 2022", "w":0,"l":0}'+
                ']'
            }
            let color = ""
            ctrl.colorArr.forEach(c => {color += `${c},`});
            obj.color = color
            
            console.log(obj)
            $http({method:'POST', url: '/deck', data: obj})
            .then(res => {
                obj.color = ctrl.colorArr
                obj.wl_logg = [{w :0, l: 0}]
                obj.wl_catigories = JSON.parse(obj.wl_catigories)

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
                if(str === 'win') {
                    ctrl.decks[i].wins += 1
                    ctrl.decks[i].wl_catigories[0].w += 1
                }
                else if(str === 'loss') {
                    ctrl.decks[i].losses += 1
                    ctrl.decks[i].wl_catigories[0].l += 1
                }
                else if(str === 'wipe') {
                    ctrl.decks[i].losses = 0;
                    ctrl.decks[i].wins = 0;
                    ctrl.decks[i].wl_catigories.forEach(c =>{
                        c.w = 0;
                        c.l = 0;
                    })
                }

                ctrl.decks[i].wl_catigories = JSON.stringify(ctrl.decks[i].wl_catigories)

                // adding new record to a logg
                let obj = {w: ctrl.decks[i].wins, l :ctrl.decks[i].losses}
                ctrl.decks[i].wl_logg.unshift(obj)
                if(ctrl.decks[i].wl_logg.length > 6) ctrl.decks[i].wl_logg.pop() //keeping only 5 logs stored max
                ctrl.decks[i].wl_logg = JSON.stringify(ctrl.decks[i].wl_logg)


                $http({method:'PUT', url: '/deck', data: ctrl.decks[i]})
                .then(res => {
                    ctrl.decks[i].wl_logg = JSON.parse(ctrl.decks[i].wl_logg);
                    ctrl.decks[i].wl_catigories = JSON.parse(ctrl.decks[i].wl_catigories)
                })
                .catch(err => console.log(err))
            }
        }
        console.log(ctrl.decks)
    }

    // ///////////////////////////////////
    // deleteing deck (delete)
    // //////////////////////////////////
    this.deleteDeck = (id) => {
        if(confirm("Are you sure you want to delete deck? Deleting deck can not be undone.")){
            $http({method:'DELETE', url: '/deck/' + id})
            .then(res => {
                console.log(res.data)
                for(let i = 0; i < ctrl.decks.length; i++) {if(ctrl.decks[i].id === id) ctrl.decks.splice(i, 1)}
            })
            .catch(err => console.log(err))
        }
    }

    // ///////////////////////////////////
    // undo w/l update
    // //////////////////////////////////
    this.undo = (id) => {
        for(let i = 0; i < ctrl.decks.length; i++){
            if(ctrl.decks[i].id === id){
                let dRef = ctrl.decks[i]
                
                if(dRef.wl_logg.length > 1){
                    dRef.wl_logg.shift()
                    dRef.wins = dRef.wl_logg[0].w
                    dRef.losses = dRef.wl_logg[0].l
                    ctrl.decks[i].wl_logg = JSON.stringify(ctrl.decks[i].wl_logg)
                              

                    $http({method:'PUT', url: '/deck', data: ctrl.decks[i]})
                    .then(res => ctrl.decks[i].wl_logg = JSON.parse(ctrl.decks[i].wl_logg))
                    .catch(err => console.log(err))

                }
                else{alert("Data Logg Empty")}
            }
        }
    }

}] );