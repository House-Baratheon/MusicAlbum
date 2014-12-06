var app = app || {};

app.data = (function(){
    var headers = {
        'X-Parse-Application-Id': 'R9zGRvhWmcjTARZq5MFxBUB3P1RULW3aumZG4ALm',
        'X-Parse-REST-API-Key': 'aXcHxh3r16S0aF11lfxwassPTkZb5ztq5CwtiU7X'
    };

    var parseComData = {
        headers : headers,
        url: 'https://api.parse.com/1/classes/'
    };

    var parseComUsers = {
        headers : headers,
        url: 'https://api.parse.com/1/users/'
    };

    var parseComFiles = {
        headers : headers,
        url: 'https://api.parse.com/1/files/'
    };

    function Data(){
        this.songs = new Table(parseComData, 'Songs');
        this.users = new Table(parseComUsers, '');
        this.files = new File(parseComFiles);
    }

    var Table = (function(){
        function Table(service, tableName){
            this._service = service;
            this._dataUrl = service.url + tableName
        }

        Table.prototype.readAllRows = function (successFunction, errorFunction) {
            requester.get(this._dataUrl, this._service.headers, successFunction, errorFunction);
        };

        Table.prototype.readAllRowsWhere = function (column, value, successFunction, errorFunction) {
            if(value instanceof Object){
                value = JSON.stringify(value);
            } else {
                value = '"' + value + '"';
            }

            requester.get(this._dataUrl  + '?where={"' + column + '": ' + value + '}',
                this._service.headers, successFunction, errorFunction);
        };

        Table.prototype.addRow = function (row, successFunction, errorFunction) {
            requester.post( this._dataUrl, this._service.headers, row,  successFunction, errorFunction);
        };

        Table.prototype.editRow = function (objectId, row, successFunction, errorFunction) {
            requester.put( this._dataUrl + '/' + objectId, this._service.headers, row, successFunction, errorFunction)
        };

        Table.prototype.deleteRow = function (objectId, successFunction, errorFunction) {
            requester.delete( this._dataUrl + '/' + objectId, this._service.headers, successFunction, errorFunction);
        };

        return Table;
    })();

    var File = (function(service){
        function File(service){
            this._service = service;
            this._dataUrl = service.url;
        }

        File.prototype.upload = function (file, successFunction, errorFunction ) {
            fileRequester.upload(this._dataUrl + file.name, this._service.headers, file, successFunction, errorFunction );
        };

        File.prototype.delete = function (fileName, fileType, successFunction, errorFunction ) {
            fileRequester.delete(this._dataUrl + fileName, this._service.headers, fileType, successFunction, errorFunction );
        };

        return File;
    })();


    return {
        get: new Data()
    }
})();