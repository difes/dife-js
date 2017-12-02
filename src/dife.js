"use strict";

var Dife = function (token) {

  this.listFeatures = function (success, error) {    
    return request.get('features', success, error);
  };

  this.listValues = function (feature_id, callback) {
    return request.get('features/'+ feature_id, callback);
  };

  var Request = function (token) {

    var base = 'http://dev.dife.com.br/api/';

    this.get = function (url, success, error) {
      var http = create(success, error);
      http.open('GET', base + url, true);
      http.setRequestHeader('Authorization', 'Bearer ' + token);
      http.setRequestHeader('Content-Type', 'application/json');
      http.send();
    };

    var create = function (success, error) {

      var http = new XMLHttpRequest();

      http.onreadystatechange = function() {
        if (this.readyState == 4) {
          var response = {
            response: this.response,
            responseText: this.responseText,
            status: this.status,
            statusText: this.statusText,
            data: this.data
          };
          if (http.getResponseHeader('Content-Type') == 'application/json') {
            response.data = JSON.parse(this.responseText);
          }
          if (this.status == 200) {
            success(response);
          } else {
            error(response);
          }
        }
      };

      return http;
    };
  };

  var request = new Request(token);
};