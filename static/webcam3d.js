var Webcam3D = (function(){
	console.log("Webcam3D loaded");

	var _video = document.getElementById("firstVideo"),
		_canvas = document.getElementById("firstCanvas"),
		_context = _canvas.getContext("2d"),
		_controls = document.getElementById("controls"),
		_startRecording = document.getElementById("startRecording"),
		_stopRecording = document.getElementById("stopRecording"),
		_clearRecording = document.getElementById("clearRecording"),
		_img = document.getElementById("image"),
		_recording,
		_imgURLs = [],
		_width = 600,
		_height = 400,

	createVideoSrc = function() {
		navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

		if (navigator.getUserMedia) {
			navigator.getUserMedia({
					video: true,
					audio: false
				},

				function(stream) {
					var url = window.URL
					_video.src = url.createObjectURL(stream);
					_video.play();
				},

				function(error) {
					console.log("THERE WAS AN ERROR");
					console.log(error);
				}
			);
		} else {
			console.log("NOT SUPPORTED");
		}
	},

	getHeightAndWidth = function() {
		_canvas.style.width = _width + "px";
		_canvas.style.height = _height + "px";
		_canvas.setAttribute('width', _width);
		_canvas.setAttribute('height', _height);
		_img.style.width = _width;
		_img.style.height = _height;
		_context.translate(_width, 0);
		_context.scale(-1, 1);
	},

	setupListeners = function() {
		_video.addEventListener("canplay", videoCanStartPlaying, false);
		_startRecording.addEventListener("click", startRecording, false);
		_stopRecording.addEventListener("click", stopRecording, false);
		_clearRecording.addEventListener("click", clearRecording, false);
	},

	videoCanStartPlaying = function() {
		getHeightAndWidth();
		copyVideoToCanvas();

		_controls.style.display = "block";
	},

	startRecording = function() {
		_startRecording.style.display = "none";
		_stopRecording.style.display = "block";

		_recording = setInterval(function(){
			var	dataURL = _canvas.toDataURL("image/jpeg");
			_imgURLs.push(dataURL);
		}, 33);
	},

	stopRecording = function() {
		_video.style.opacity = "0.6";
		_stopRecording.style.display = "none";
		_clearRecording.style.display = "block";
		clearInterval(_recording);
		setUpReel();
	},

	clearRecording = function() {
		var imgReel = document.getElementById("image-reel");

		_img.style.display = "none";
		_img.src = "static/clear.png";

		// _canvas.style.display = "block";

		_clearRecording.style.display = "none";
		_startRecording.style.display = "block";

		_video.style.opacity = "1";

		_imgURLs = [];

		$(imgReel).remove();
	},

	setUpReel = function() {
		var img,
			combined = _imgURLs.join(", "),
			count;

		_img.src = _imgURLs[0];

		$(_img).reel({
			images: _imgURLs,
			cursor: "hand",
			loops: false,
			frames: _imgURLs.length,
			revolution: 400,
			frame: 1
		});

		setupSuccess();
	},

	setupSuccess = function() {
		_canvas.style.display = "none";

	},

	copyVideoToCanvas = function() {
		_copyVideoToCanvas = setInterval(function(){
			_context.fillRect(0, 0, _width, _height);
			_context.drawImage(_video, 0, 0, _width, _height);
		}, 33);
	};

	return {
		init: function(){
			createVideoSrc();
			setupListeners();
		}
	}
})();
Webcam3D.init();