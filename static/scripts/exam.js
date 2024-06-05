
const answers = $(".answers");
answers.each(function() {
    let element = $(this).children().toArray();
    console.log(element);
    element.forEach(function(ele) {
        $(ele).click(function() {
            element.forEach(function(ele) {
                $(ele).removeClass("element");
            });
            $(this).toggleClass("element");
        });
    });
});
