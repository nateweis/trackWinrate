$(() => {
    
    $('body').click(() => {
        const $selectBox = $('.options').children()
        for(let i = 0; i < $selectBox.length; i++){
            let n = 30 * i
            $selectBox.eq(i).css({transform: `translateY(${n}px)`})
        }
    })

})