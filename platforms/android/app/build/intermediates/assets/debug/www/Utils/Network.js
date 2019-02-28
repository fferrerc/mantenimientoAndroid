sap.ui.define([], function () {
	"use strict";
	return {
		isOnline: function (yes, no) {
			if (navigator.onLine) {
				if (yes instanceof Function) {
					yes();
				}
			} else {
				if (no instanceof Function) {
					no();
				}
			}

			/*
			
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() {
				if (xhr.status === 404) {
					debugger;
				}
			};

			xhr.onload = function () {
				if (yes instanceof Function) {
					yes();
				}
			};
			xhr.onerror = function () {
				if (no instanceof Function) {
					no();
				}
			};
			xhr.open("GET", "https://www.google.com", true);
			xhr.send();
			*/
		}
	};

});