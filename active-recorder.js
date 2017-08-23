// ==UserScript==
// @name         Ray's Active Recorder
// @namespace    https://ray-another-world.ga/
// @version      0.1 beta
// @description  record your friend active time.
// @author       Ray's Another World Studio
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	
	
    var checkers = winsx();
    if(checkers.rayActiveRecord == "enable"){
        if(checkers.rayID){
            var active = isActive(checkers.rayID);
            recordActive(active, checkers.rayID);
			var rec = getRecord(checkers.rayID);
			showRecord(rec, checkers.rayID);
			
			setTimeout(function(){
				location.reload();
			}, (5 * 60 * 1000));
			
        }
        else{
            var uid = prompt('請輸入要紀錄的用戶uid','');
            if(uid){
                window.location = location.origin + location.pathname +
                    "?rayActiveRecord=enable&&rayID=" + uid;
            }
        }
    }

	function showRecord(arr, uid){		
		var dom0 = '<div id="ray-wrapper"><h1 onclick="window.open(\'https://ray-another-world.ga/\')">Ray\'s Active Recorder</h1><h2><span id="her_uid"></span> 的紀錄 <a href="#" id="ray_del">清除</a></h2><div id="log-wrapper">log:<div id="log">08/07 08:07 上線中;<br>08/07 08:07 上線中;<br>08/07 08:07 上線中;<br>08/07 08:07 上線中;<br>08/07 08:07 上線中;<br>08/07 08:07 上線中;<br></div></div><div id="ret"></div></div>';
		dom0 += '<style>#ray-wrapper{position:fixed;z-index:48763;top:0;left:0;background:#000;width:100vw;height:100vh;color:#00e400;font-weight:900;font-family:"pixel", "微軟正黑體";}h1,h2{text-align:center;}div#log-wrapper {    width:20em;    margin:auto;    border-radius:3px;    color:#000;overflow:hidden;    background:#9e9e9e;    padding:1em;padding-bottom:0.3em;}div#log {    padding-left:2em;    margin:5px;margin-top:0.5em;    line-height:1.4em;height:10em;width:110%;overflow-y:scroll;}#ret {width:80vw;height:5em;background:#000;border:solid 5px #000;overflow:hidden;margin:1em auto;margin-top:5em;}#ret>div{height:100%;border:none;margin:0;display:inline-block;padding-left:5px;background:#FFF;}#ret .green{background:#0F0;}#ret .border {border-left:solid 5px #333;padding-left:0;}#ret .border:first-child {border:none;}@font-face {font-family:"pixel";src:url(\'https://init.kobeengineer.io/font/ETenMing15Minimal-Regular.woff\');}a{color:rgb(0,0,238);}#ray_del{color:rgb(238,0,0);}</style>';
			
		document.write(dom0);
		console.log(dom0);
		
		
		var el = document.getElementById("ret");
		var log = document.getElementById("log");
		var uidEl = document.getElementById("her_uid");
		var delEl = document.getElementById("ray_del");
		
		delEl.onclick = function(){
			setCookie("rayRecord_" + uid, null, -1);
			location.reload();
		};
		
		uidEl.innerHTML = '<a target="_BLANK" href="https://facebook.com/' + uid + '">' + uid + '</a>';
		
		var singleWidth = ((el.offsetWidth - 10) / arr.record.length) - 5;
		var dom = "";
		
		var myLog = "";
			
		for(var i = 0;i < arr.record.length;i++){
			
			var classStr = "";
			if(arr.record[i].active){
				classStr += " green";
			}				
			if((i % 24) == 0){
				classStr += " border";
			}
			dom += '<div class="' + classStr + '" style="width:' + singleWidth + ';"></div>';
			
			myLog += arr.record[i].time + ": " + (arr.record[i].active ? "上線中" : "下線") + "<br />";
		
		}
			
		el.innerHTML = "";
		el.innerHTML += dom;
			
		log.innerHTML = "";
		log.innerHTML += myLog;
		
	}

    function isActive(uid){
        var acativeList = document.documentElement.innerHTML.replace(/\n/g, "").replace(/^.*activeList.*?\{/g, "{").replace(/\}.*/g, "}");
        while(acativeList.indexOf('"1') > -1){
            acativeList = acativeList.replace("\"1", "\"u1");
        }
        acativeList = JSON.parse(acativeList);
        var thatUser = eval("acativeList." + "u" + uid);

        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);
        var howManySec = timestamp - thatUser;
        return (howManySec < 5 * 60);

    }
	
	
	
	function /*json obj*/ getRecord(uid){
		var obj = {};
		var rayRecord = getCookie("rayRecord_" + uid);
		if(rayRecord){
			obj = JSON.parse(rayRecord);
		}
		else {
			obj.record = [];
			
		}
		
		return obj;
		
	}
	
	
	function recordActive(active, uid, time){		
		var obj = getRecord(uid);		
		
		
		if(!time){
			var myDate = new Date();
			var month = myDate.getMonth() < 10 ? "0" + myDate.getMonth() : myDate.getMonth();
			var date = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
			var hour = myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours();
			var min = myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes();
			
			time = month + "/" + date + " " + hour + ":" + min;
		}
		
		
		obj.record[obj.record.length] = {
			"time": time,
			"active": active
		};
		
		var jsonStr = JSON.stringify(obj);
		
		setCookie("rayRecord_" + uid, jsonStr, 7);
		
	}


	
	
	
	
	

    function winsx(search) {

        var returns = {};
        search = search ? search : location.search;
        search = search.replace("?","");
        var arr = [];
        if(search.indexOf("&") > -1){

            arr = search.split("&");
        }
        else {

            arr[0] = search;
        }
        for(var i = 0; i < arr.length; i++){
            var splitArr = arr[i].split("=");
            if(splitArr.length == 2){
                var objIndex = splitArr[0];
                var objValue = splitArr[1];
                eval("returns." + objIndex + " = '" + objValue + "'");
            }
        }
        return returns;
    }
	
	
	function setCookie(cookieName, cookieValue, exdays) {
		if(document.cookie.indexOf(cookieName) >= 0) {
			var expD = new Date();
			expD.setTime(expD.getTime() + (-1*24*60*60*1000));
			var uexpires = "expires="+expD.toUTCString();
			document.cookie = cookieName + "=" + cookieValue + "; " + uexpires;
		}
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cookieName + "=" + cookieValue + "; " + expires;
	}

	function getCookie(cookieName) {
		var name = cookieName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	}
})();