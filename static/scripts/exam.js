// // show and hide choices 
// $(".title .plus").click(function () {
//     var titleDiv = $(this).parent();
//     titleDiv.toggleClass("appear");
//     if (titleDiv.hasClass("appear")) {
//         $(this).html('<i class="fa-solid fa-angles-up"></i>');
//     } else {
//         $(this).html('<i class="fa-solid fa-angles-down"></i>');
//     }
// });

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