$(() => {
    
    $('body').click(() => {
        const $selectBox = $('.options')
        // const $selectBox = $('.options').children()
        for(let i = 0; i < $selectBox.length; i++){
            const individualList = $selectBox.eq(i).children()
            for(let j = 0; j < individualList.length; j++){
                let n = 29 * j
                individualList.eq(j).css({transform: `translateY(-${n}px)`})
            }
        }
    })

})