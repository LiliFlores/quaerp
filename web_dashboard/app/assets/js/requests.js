var requests = (function(){

    function createXHR(){
        return new XMLHttpRequest();
    }

    function request(url, method, data, async, callback) {

        var xhr = createXHR();
        xhr.open(method, url, async);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200){
                    changeTextType(callback, xhr.responseText);
                } else {
                    console.log("Request Error:", xhr.statusText);
                    console.log("URL:", url);
                    console.log("METHOD:", method);
                    console.log("DATA:", data);
                }
            }
        };

        xhr.send(data);
    }

    function get(options, callback){
        if (typeof(options) !== 'undefined'){
            if (typeof(options.url) === 'undefined'){
                throw new Error('No url defined in requests');
            }
            if (typeof(options.async) !== 'boolean'){
                options.async = false;
            }
        }

        request(options.url, 'GET', null, options.async, callback);
    }

    function post(options, callback){
        if (typeof(options) !== 'undefined'){
            if (typeof(options.url) === 'undefined'){
                throw new Error('No url defined in requests');
            }
            if (typeof(options.async) !== 'boolean'){
                options.async = false;
            }
            if (typeof(options.data) === 'undefined'){
                options.data = null;
            }
        }

        payload = JSON.stringify(options.data);
        request(options.url, 'POST', payload, options.async, callback);
    }

    function changeTextType(callback, text_to_verify){
        if (isJSON(text_to_verify)){
            var json_text = JSON.parse(text_to_verify);
            callback(json_text);
        } else {
            callback(text_to_verify);
        }
    }

    function isJSON(json_text){
        try{
            JSON.parse(json_text);
            return true;
        } catch(e){
            return false;
        }
    }

    return {
        get:  get,
        post: post
    };
})();
