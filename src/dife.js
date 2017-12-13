"use strict";

var Dife = function (token) {

  this.listFeatures = function (success, error) {    
    return request.get('features', success, error);
  };

  this.listValues = function (feature_id, success, error, page) {
    var p = '';
    if (typeof page != 'undefined' && page) {
      p = '?page='+ page;
    }
    return request.get('features/'+ feature_id + p, success, error);
  };

  this.form = function (form_id, data, success, error) {
    return request.post('forms/'+ form_id, data, success, error);
  };

  var Request = function (token) {

    var base = 'https://dife.com.br/api/';

    this.get = function (url, success, error) {
      var http = create(success, error);
      http.open('GET', base + url, true);
      http.setRequestHeader('Authorization', 'Bearer ' + token);
      http.setRequestHeader('Content-Type', 'application/json');
      http.send();
    };

    this.post = function (url, data, success, error) {
      var http = create(success, error);
      http.open('POST', base + url, true);
      http.setRequestHeader('Authorization', 'Bearer ' + token);
      http.setRequestHeader('Content-Type', 'application/json');
      http.send(JSON.stringify({field: data}));
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

Dife.template = function (id, data) {

  var trim = function (string) {
    return string.replace(/^\s+|\s+$/gm,'');
  }

  var block = function (html, data) {
    for (var i in data) {
      html = html.replace(new RegExp("{{\\s+"+ i +"\\s+}}", "g"), data[i]);
    }
    return html;
  };

  var response = '';
  var element = document.getElementById(id);
  if (element != null && typeof data == 'object') {
    var html = trim(element.innerHTML);
    for (var i in data) {
      if (!/^\d+$/.test(i)) {
        return block(html, data);
      }
      response += block(html, data[i]);
    }
  }
  return response;
};