var requester = (function () {
    function makeRequest(method, url, headers, userData, success, error) {
        $.ajax({
            method: method,
            headers: headers,
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(userData)
        }).success(function (data) {
            var results = data.results || data;
            success(results);
        }).error(function (data) {
            var results = data.results || data;
            error(results);
        });
    };

    function makeGetRequest(url, headers,  success, error) {
        makeRequest('GET', url, headers, undefined,  success, error)
    }

    function makePostRequest(url, headers, userData,  success, error) {
        makeRequest('POST', url, headers, userData,  success, error)
    }

    function makeDeleteRequest(url, headers,  success, error) {
        makeRequest('DELETE', url, headers, undefined,  success, error)
    }

    function makePutRequest(url, headers, userData,  success, error) {
        makeRequest('PUT', url, headers, userData,  success, error)
    }

    return {
        get: makeGetRequest,
        post: makePostRequest,
        put: makePutRequest,
        delete: makeDeleteRequest
    }
})();

var fileRequester = (function () {
    function makeRequest(method, url, headers, file, fileType, success, error) {
        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", fileType);
                if(method.toUpperCase() === 'DELETE'){
                    request.setRequestHeader("X-Parse-Master-Key", "SrdxgxMkJJj1iH2O6bLw6tdMjU0NVCFMlc2tvmpV");
                }
            },
            method: method,
            headers: headers,
            url: url,
            contentType: false,
            processData: false,
            data: file
        }).success(function (data) {
            var results = data.results || data;
            if(success){
                success(results);
            }
        }).error(function (data) {
            var results = data.results || data;
            if(error){
                error(results);
            }
        });
    };

    function makePostRequest(url, headers, file,  success, error) {
        makeRequest('POST', url, headers, file, file.type, success, error)
    }

    function makeDeleteRequest(url, headers,  fileType, success, error) {
        makeRequest('DELETE', url, headers, null, fileType,  success, error)
    }

    return {
        upload: makePostRequest,
        delete: makeDeleteRequest
    }
})();