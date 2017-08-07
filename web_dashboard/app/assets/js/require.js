function require(file, asyncDownload) {
    var response = {
        "status": false,
        "content": '',
        "message": 'error'
    };

    if (typeof(file) === 'undefined') {
        response["message"] = "no provided file";
        return response;
    }
    if (typeof(asyncDownload) === 'undefined') {
        asyncDownload = false;
    }

    file_ext = file.substring(file.lastIndexOf('.') + 1);
    switch (file_ext) {
        case 'js':
            requests.get({
                url: file
            }, function(response){
                script = document.createElement('script');
                prior = document.getElementsByTagName('script')[0];

                script.async = 0;
                script.text  = response;
                prior.parentNode.insertBefore(script, prior);
            });
            break;
        case 'css':
            requests.get({
                url: file
            }, function(response){
                var style   = document.createElement('style');
                style.text  = response;
                document.getElementsByTagName('head')[0].appendChild(style);
            });
            break;
        default:
    }

    return response;
}
