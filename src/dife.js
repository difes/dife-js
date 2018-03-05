"use strict";

var Dife = function (token) {

  this.listFeatures = function (success, error, cache) {    
    return request.get('features', success, error, cache);
  };

  this.listValues = function (feature_id, success, error, page, cache) {
    var p = '';
    if (typeof page != 'undefined' && page) {
      p = '?page='+ page;
    }
    return request.get('features/'+ feature_id + p, success, error, cache);
  };

  this.form = function (form_id, data, success, error) {
    return request.post('forms/'+ form_id, data, success, error);
  };

  var Cache = function () {

    var cache = this;

    this.key = function (k) {
      return 'DifePanel'+ k;
    };

    this.set = function (key, value, minutes) {

      if (!key || !value) {
        return;
      }

      if (!minutes) {
        minutes = 300;
      }

      if (typeof(Storage) !== 'undefined' && typeof(JSON) !== 'undefined') {
        var date = new Date();
        date.setMinutes(date.getMinutes() + minutes);

        var data = {
          value: value,
          expire: date
        };

        localStorage.setItem(this.key(key), JSON.stringify(data));
      }
    };

    this.get = function (key) {
      if (typeof(Storage) !== 'undefined' && typeof(JSON) !== 'undefined') {
        var data = localStorage.getItem(this.key(key));
        if (data) {
          data = JSON.parse(data);
          if (data.expire) {
            var date = new Date(data.expire);
            if (date > new Date()) {
              return data.value;
            }
          }
        }
      }
    };

    this.has = function (key) {
      cache.get(key) != false;
    };

    this.remove = function (key) {
      if (typeof(Storage) !== 'undefined' && typeof(JSON) !== 'undefined') {
        localStorage.removeItem(this.key(key));
      }
    };
  };

  var Request = function (token) {

    var base = 'https://dife.com.br/api/';

    this.get = function (url, success, error, cache) {
      cache = cache && cache == true;
      if (cache) {
        var cached = (new Cache()).get(url.hashCode());
        if (cached) {
          console.log('Loading cache data for URL: ' + base + url);
          cached.data = JSON.parse(cached.responseText);
          return success(cached);
        }
      } else {
        (new Cache()).remove(url.hashCode());
      }

      var http;
      if (cache) {
        http = create(success, error, function (response) {
          (new Cache()).set(url.hashCode(), response, 300);
        });
      } else {
        http = create(success, error);
      }
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

    var create = function (success, error, cache) {

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
            if (success && typeof success === 'function') {
              success(response);
            }
            if (cache && typeof cache === 'function') {
              cache(response);
            }
          } else {
            if (error && typeof error === 'function') {
              error(response);
            }
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

String.prototype.hashCode = function() {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  var char;
  for (var i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};