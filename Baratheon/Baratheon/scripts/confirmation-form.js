var app = app || {};

app.confirmationForm = (function(){
    var $form = $('<div class="forms">');

    function show(parentSelector, question, yesFunction, noFunction) {
        $form.load('htmlElements/confirmationForm.html', function () {
            console.log('Successful load confirmationForm.html.');
            $form.find('#question').text(question);
        }, function () {
            console.log('Can not load confirmationForm.html.');
        });

        $form.on('click', '#yesButton', function(){
            $form.remove();
            yesFunction();
        });
        $form.on('click', '#noButton', function(){
            $form.remove();
            noFunction();
        });

        $(parentSelector).append($form);
    }

    return {
        show: show
    }
})();