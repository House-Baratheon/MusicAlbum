var file;
// Set an event listener on the Choose File field.
$('#fileselect').on("change", function(e) {
    var files = e.target.files || e.dataTransfer.files;
    // Our file var now holds the selected file
    file = files[0];
});

// This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
$('#uploadbutton').click(function() {
    var serverUrl = 'https://api.parse.com/1/files/' + file.name;

  if (file.type === 'audio/mp3') {
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("X-Parse-Application-Id", 'R9zGRvhWmcjTARZq5MFxBUB3P1RULW3aumZG4ALm');
                request.setRequestHeader("X-Parse-REST-API-Key", 'aXcHxh3r16S0aF11lfxwassPTkZb5ztq5CwtiU7X');
                request.setRequestHeader("Content-Type", file.type);
            },
            url: serverUrl,
            data: file,
            processData: false,
            contentType: false,
            success: function(data) {
                alert("success");
            },
            error: function(data) {
                var obj = jQuery.parseJSON(data);
                alert(obj.error);
            }
        });
    } else {
        alert("Test");
    }
});
