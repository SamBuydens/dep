'use strict';

export const post = (url, argument) => {
  return new Promise((resolve, reject) => {
    console.log('post');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.response));
      }else{
        reject('ERROR');
      }
    };
    if(argument){
      xhr.send(JSON.stringify(argument));
    }else{
      xhr.send();
    }
  });
};

export const del = (url, argument) => {
  return new Promise((resolve, reject) => {
    console.log('delete');
    var xhr = new XMLHttpRequest();
    xhr.open('POST','delete/' + url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.response));
      }else{
        reject('ERROR');
      }
    };
    if(argument){
      xhr.send(argument);
    }else{
      xhr.send();
    }
  });
};

export const get = (url) => {
  console.log('get');
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.response));
      }else {
        reject('ERROR');
      }
    };
    xhr.send();
  });
}
