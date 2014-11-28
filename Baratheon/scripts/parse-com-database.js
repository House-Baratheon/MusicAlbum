var ParseComDB = (function () {
    function ParseComDB(parseAppId, parseRestApiKey) {
        this._headers = {
            'X-Parse-Application-Id': parseAppId,
            'X-Parse-REST-API-Key': parseRestApiKey
        };
    }

    ParseComDB.prototype.setTableName = function (tableName) {
        this._tableName = tableName;
    };

    function makeRequest(method, url, userData, success, error) {
        $.ajax({
            method: method,
            headers: this._headers,
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(userData)
        }).success(function (data) {
            success(data.results);
        }).error(function (data) {
            error(data.results);
        });
    };

    ParseComDB.prototype.readAllRows = function (successFunction) {
        var _this = this,
            url = 'https://api.parse.com/1/classes/' + this._tableName;
        makeRequest.call(this, 'GET', url, undefined, successFunction,
            function () {
                console.log('Cannot read rows of table: ' + _this._tableName);
            });
    };

    ParseComDB.prototype.readAllRowsWhere = function (column, value, successFunction) {
        var _this = this,
            url = 'https://api.parse.com/1/classes/' + this._tableName + '?where={"' + column + '": ' + value + '}';
        makeRequest.call(this,'GET', url, undefined, successFunction,
            function () {
                console.log('Cannot read rows of table: ' + _this._tableName);
            });
    };

    ParseComDB.prototype.addRow = function (row, successFunction) {
        var _this = this,
            url = 'https://api.parse.com/1/classes/' + this._tableName;
        makeRequest.call(this,'POST', url, row, successFunction,
            function () {
                console.log('THe row is not added to table: ' + _this._tableName);
            });
    };

    ParseComDB.prototype.editRow = function (objectId, row, successFunction) {
        var _this = this,
            url = 'https://api.parse.com/1/classes/' + this._tableName + '/' + objectId;
        makeRequest.call(this,'PUT', url, row, successFunction,
            function () {
                console.log('The row is not edited (table: ' + _this._tableName + ')');
            });
     };

    ParseComDB.prototype.deleteRow = function (objectId, successFunction) {
        var _this = this,
            url = 'https://api.parse.com/1/classes/' + this._tableName + '/' + objectId;
        makeRequest.call(this,'DELETE', url, undefined, successFunction,
            function () {
                console.log('The row is not deleted (table: ' + _this._tableName + ')');
            });

    };

    ParseComDB.prototype.readAllUsers = function (successFunction) {
        var _this = this,
            url = 'https://api.parse.com/1/users';
        makeRequest.call(this, 'GET', url, undefined, successFunction,
            function () {
                console.log('Cannot read users');
            });
    };

    return ParseComDB;
})();

