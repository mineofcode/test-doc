'use strict';

var message = {},
    wrapper = {},
    buttonNewPhoto = {},
    buttonDownload = {},
    video = {},
    videoImg = {};

function initElement() {
    message = document.getElementById('msg');

    buttonNewPhoto = document.getElementById('newphoto');
    buttonDownload = document.getElementById('download');
    video = document.querySelector('video');
    videoImg = document.querySelector('#videoImg');

    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {

            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            })
        }
    }
}

function onTakeAPhoto() {
    videoImg.getContext('2d').drawImage(video, 0, 0, 133, 91);
    document.getElementById("pic").value = videoImg.toDataURL("image/jpeg");
    onupdate();
    //  var gradCanvas = new fabric.Canvas('videoImg', { width: 50, height: 50, background: black });
    // fabric.Image.fromURL(videoImg.toDataURL("image/jpeg"), function(img) {
    //     img.set({
    //         left: 230,
    //         top: 125,
    //         height: 90.49,
    //         width: 132.28,
    //         "scaleX": 0.52,
    //         "scaleY": 0.69
    //     });
    //     canvas.add(img);
    // });
    // buttonDownload.removeAttribute('disabled');
}

function onDownloadPhoto() {
    videoImg.toBlob(function(blob) {
        var link = document.createElement('a');
        link.download = 'photo.jpg';
        link.setAttribute('href', URL.createObjectURL(blob));
        link.dispatchEvent(new MouseEvent('click'));

    }, 'image/jpeg', 1);
}

function onLoadVideo() {
    video.setAttribute('width', this.videoWidth);
    video.setAttribute('height', this.videoHeight);
    videoImg.setAttribute('width', this.videoWidth);
    videoImg.setAttribute('height', this.videoHeight);
    video.play();
}

function onMediaStream(stream) {
    if ('srcObject' in video) {
        video.srcObject = stream;
    } else {
        video.src = window.URL.createObjectURL(stream);
    }

    //message.style.display = 'none';
    //   wrapper.style.display = 'block';
    buttonNewPhoto.addEventListener('click', onTakeAPhoto);
    // buttonDownload.addEventListener('click', onDownloadPhoto);
    video.addEventListener('loadedmetadata', onLoadVideo);
}

function onMediaError(err) {
    alert(err);
    message.innerHTML = err.name + ': ' + err.message;
}

function initEvent() {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(onMediaStream)
        .catch(onMediaError);
}

function init() {
    initElement();
    initEvent();
}

// if (window.location.protocol != 'https:' && window.location.protocol != 'file:') {
//     window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
// }

window.addEventListener('DOMContentLoaded', init);