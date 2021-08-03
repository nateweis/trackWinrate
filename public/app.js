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

                d.wl_catigories.forEach(cat => {cat.selected = false})
                d.wl_catigories[0].selected = true
                d.selected_cat = d.wl_catigories[0]
            })
            ctrl.decks = decks
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

    this.displayLI = (id, bool) => {
        ctrl.decks.forEach(d => {
            if(d.id === id) d.dropdown = bool
        })
    }

    this.selectLI = (deck, catig) => {
        ctrl.decks.forEach(d =>{
            if(d.id === deck){
                for(let i = 0; i < d.wl_catigories.length; i++){
                    d.wl_catigories[i].selected = false;

                    if(d.wl_catigories[i].catigorie === catig.catigorie){
                        d.wl_catigories[i].selected = true;
                        d.selected_cat = catig;
                    }
                }
            }
        })
        ctrl.displayLI(deck, false)
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
                wl_logg: '[{"catigorie" : "General", "w" :0, "l":0, "selected" : true}]',
                wl_catigories : '[' +
                    '{"catigorie" : "General", "w" :0, "l":0, "selected" : true} ,' +
                    '{"catigorie" : "Play", "w":0,"l":0, "selected" : false} ,'+
                    '{"catigorie" : "Standard Ranked", "w":0,"l":0, "selected" : false} ,'+
                    '{"catigorie" : "Standard Event", "w":0,"l":0, "selected" : false} ,'+
                    '{"catigorie" : "Standard Play 2022", "w":0,"l":0, "selected" : false} ,'+
                    '{"catigorie" : "Standard Ranked 2022", "w":0,"l":0, "selected" : false}'+
                ']',
                selected_cat : '{"catigorie" : "General", "w" :0, "l":0, "selected" : true}',
                dropdown: false
            }
            let color = ""
            ctrl.colorArr.forEach(c => {color += `${c},`});
            obj.color = color
            
            $http({method:'POST', url: '/deck', data: obj})
            .then(res => {
                obj.color = ctrl.colorArr
                obj.wl_logg = [{w :0, l: 0}]
                obj.wl_catigories = JSON.parse(obj.wl_catigories)
                obj.selected_cat = JSON.parse(obj.selected_cat)

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

                let daDeck = ctrl.decks[i]
                daDeck.wl_catigories.forEach(cat => {
                    if(str === 'wipe'){
                        cat.w = 0;
                        cat.l = 0;
                    }

                    if(cat.selected){
                        if(str === 'win'){
                            cat.w += 1;
                            if(cat.catigorie !== daDeck.wl_catigories[0].catigorie) daDeck.wl_catigories[0].w += 1
                        }
                        else if (str === 'loss'){
                            cat.l += 1;
                            if(cat.catigorie !== daDeck.wl_catigories[0].catigorie) daDeck.wl_catigories[0].l += 1;
                        }

                        daDeck.selected_cat = cat;
                    }
                })
                


                daDeck.selected_cat = JSON.stringify(daDeck.selected_cat)
                ctrl.decks[i].wl_catigories = JSON.stringify(ctrl.decks[i].wl_catigories)

                // adding new record to a logg
                let arr = daDeck.wl_catigories
                ctrl.decks[i].wl_logg.unshift(arr)
                if(ctrl.decks[i].wl_logg.length > 6) ctrl.decks[i].wl_logg.pop() //keeping only 5 logs stored max
                ctrl.decks[i].wl_logg = JSON.stringify(ctrl.decks[i].wl_logg)


                $http({method:'PUT', url: '/deck', data: ctrl.decks[i]})
                .then(res => {
                    ctrl.decks[i].wl_logg = JSON.parse(ctrl.decks[i].wl_logg);
                    ctrl.decks[i].wl_catigories = JSON.parse(ctrl.decks[i].wl_catigories);
                    ctrl.decks[i].selected_cat = JSON.parse(ctrl.decks[i].selected_cat);
                })
                .catch(err => console.log(err))
            }
        }
    }

    // ///////////////////////////////////
    // deleteing deck (delete)
    // //////////////////////////////////
    this.deleteDeck = (id) => {
        if(confirm("Are you sure you want to delete deck? Deleting deck can not be undone.")){
            $http({method:'DELETE', url: '/deck/' + id})
            .then(res => {
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
                    dRef.wl_catigories = dRef.wl_logg[0]
                    
                    ctrl.decks[i].wl_logg = JSON.stringify(ctrl.decks[i].wl_logg)   

                    $http({method:'PUT', url: '/deck', data: ctrl.decks[i]})
                    .then(res => {
                        ctrl.decks[i].wl_logg = JSON.parse(ctrl.decks[i].wl_logg);
                        ctrl.decks[i].wl_catigories = JSON.parse(ctrl.decks[i].wl_catigories);
                        ctrl.decks[i].wl_catigories.forEach(cat => {if(cat.selected) ctrl.decks[i].selected_cat = cat})
                    })
                    .catch(err => console.log(err))

                }
                else{alert("Data Logg Empty")}
            }
        }
    }

}] );