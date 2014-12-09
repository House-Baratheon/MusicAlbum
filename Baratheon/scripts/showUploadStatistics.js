var objectUrl;

$("#file-information-upload #audio").on("canplaythrough", function (e) {
    var seconds = e.currentTarget.duration;
    var duration = moment.duration(seconds, "seconds");
    
    var time = "";
    var hours = duration.hours();
    if (hours > 0) { time = hours + ":"; }
    
    time = time + duration.minutes() + ":" + duration.seconds();
    $("#duration").text(time);
    
    window.URL.revokeObjectURL(objectUrl);
});

$("#fileselect").change(function (e) {
    var file = e.currentTarget.files[0];
    
    $("#filename").text(file.name);
    $("#filetype").text(file.type);
    $("#filesize").text(humanFileSize(file.size, 1024));
    
    objectUrl = URL.createObjectURL(file);
    $("#audio").prop("src", objectUrl);
});

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};