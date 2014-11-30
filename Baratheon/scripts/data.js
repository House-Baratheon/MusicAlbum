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

    function Data(){
        this.songs = new Table(parseComData, 'Songs');
        this.users = new Table(parseComUsers, '');
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
            requester.get(this._dataUrl + + '?where={"' + column + '": ' + value + '}',
                this._service.headers, successFunction, errorFunction);
        };

        Table.prototype.addRow = function (row, successFunction, errorFunction) {
            requester.post( this._dataUrl, this._service.headers, row, successFunction, errorFunction);
        };

        Table.prototype.editRow = function (objectId, row, successFunction, errorFunction) {
            requester.put( this._dataUrl + '/' + objectId, this._service.headers, row, successFunction, errorFunction)
        };

        Table.prototype.deleteRow = function (objectId, successFunction, errorFunction) {
            requester.delete( his._dataUrl + '/' + objectId, this._service.headers, successFunction, errorFunction);
        };

        return Table;
    })();

    return {
        get: new Data()
    }
})();