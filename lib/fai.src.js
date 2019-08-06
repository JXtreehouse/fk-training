// 修正IE6每次从服务器读取背景图片的BUG
try {
	if ($.browser.msie && $.browser.version == '6.0') {
		document.execCommand('BackgroundImageCache', false, true);
	}
} catch (e) {
}

if (typeof Fai == 'undefined') {
	Fai = {};
	Fai.top = top;
}

Fai.openLog = false;

Fai.isDbg = function() {
	var faiDebug = Fai.Cookie.get('_fai_debug');
	return faiDebug == 'true';
};

(function(FUNC, undefined) {
	FUNC.fkEval = function(data) {
		return eval(data);
	};
})(Fai);

/**
 * logDog
 */ 
Fai.logDog = function(dogId, dogSrc) {
	var dogSiteId = typeof (Fai.top.siteId) == 'undefined' ? 0 : Fai.top.siteId;
	$.ajax({
		type: 'get',
		url: '/ajax/log_h.jsp?cmd=dog&dogId=' + Fai.encodeUrl(dogId) + '&dogSrc=' + Fai.encodeUrl(dogSrc) + '&siteId=' + Fai.encodeUrl(dogSiteId)
	});
};

/**
 * 调试Fai.logDbg(args...);
 * 用于网站调式，这里会拿对应的cookie来判断
 * cookie标志位写入设置在WebAppFilter中Response中自动写入debug模式下的cookies(完成) [fai.website, fai.webportal]
 */
Fai.logDbg = function() {
	var faiDebug = Fai.isDbg();
	if (faiDebug || Fai.openLog) {
		var args = $.makeArray(arguments);
		if (Fai.isIE()) {
			var html = '<div id="faiDebugMsg" style="position:absolute; top:30px; left:45%; margin:0px auto; width:auto; height:auto; z-index:9999;"></div>';
			var faiDebugMsg = Fai.top.$('#faiDebugMsg');
			if (faiDebugMsg.length == 0) {
				faiDebugMsg = Fai.top.$(html);
				faiDebugMsg.appendTo('body');
			}
			Fai.top.$('<div class="tips" style="position:relative; top:0px; left:-50%; width:auto; _width:50px; height:24px; margin:3px 0; line-height:24px; color:#000000; border:1px solid #EAEA00; background:#FFFFC4; z-index:9999;"><div class="msg" style="width:auto; margin:0 3px; height:24px; line-height:24px; word-break:keep-all; white-space:nowrap;">' + args.join('') + '</div></div>').appendTo(faiDebugMsg);
		} else {
			console.log(args.join(''));
		}
	}
};

/**
 * 调试Fai.logAlert(args...);
 * 直接alert的
 */
Fai.logAlert = function() {
	var faiDebug = Fai.Cookie.get('_fai_debug');
	if (faiDebug == 'true' || Fai.openLog) {
		var args = $.makeArray(arguments);
		alert(args.join(''));
	}
};

// 注意不能用于未声明的顶层变量的判断，例如不能Fai.isNull(abc)，只能Fai.isNull(abc.d)
Fai.isNull = function(obj) {
	return (typeof obj == 'undefined') || (obj == null);
};

Fai.isNumber = function(obj) {//数字则返回true
	if (/[^\d]/.test(obj)) {
		return false;
	} else {
		return true;
	}
};

/**
 * check is Number
 * 判断是否浮点数字
 * e.g. -1 1.12
 * @param {numVal} @return boolean isFloat:true/false
 *     $.isFloat(numVal)
 */
Fai.isFloat = function(numVal) {
	return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(numVal);
};

/**
 * check is Integer
 * 判断是否整数
 * e.g. -1 0 1
 * @param {numVal} @return boolean isInteger:true/false
 *     $.isInteger(numVal)
 */
Fai.isInteger = function(numVal) {
	return /^-?\d+$/.test(numVal);
};

/**
 * 判断是小写
 */
Fai.isLowerCase = function(value) {
	return /^[a-z]+$/.test(value);
};

/**
 * 决断是大写
 */
Fai.isUpperCase = function(value) {
	return /^[A-Z]+$/.test(value);
};

/**
 * 把首字母转成小写
 */
Fai.toLowerCaseFirstOne = function(string) {
	if (typeof string === 'undefined' || Fai.isLowerCase(string.charAt(0))) {
		return string;
	} else {
		var h = string.substring(0, 1).toLowerCase();
		var t = string.substring(1, string.length);
		return h + t;
	}
};

/**
 * 把首字母转成大写
 */
Fai.toUpperCaseFirstOne = function(string) {
	if (typeof string === 'undefined' || Fai.isUpperCase(string.charAt(0))) {
		return string;
	} else {
		var h = string.substring(0, 1).toUpperCase();
		var t = string.substring(1, string.length);
		return h + t;
	}
};

/*
 * 判断是否整数数字
 */
Fai.isDigit = function(numVal) {
	if (numVal < '0' || numVal > '9') {
		return false;
	}
	
	return true;
};

/*
 * 判断是否字母
 */
Fai.isLetter = function(val) {
	if ((val < 'a' || val > 'z') && (val < 'A' || val > 'Z')) {
		return false;
	}
	
	return true;
};

/*
 * 判断是否中文
 */
Fai.isChinese = function(val) {
	if (val < '一' || val > '龥') {
		return false;
	}
	
	return true;
};

Fai.isIp = function(ipaddr) {
	if (typeof ipaddr != 'string' || $.trim(ipaddr) == '') {
		return false;
	}
	var ss = ipaddr.split('.');
	if (ss.length != 4) {
		return false;
	}
	var result = true;
	$.each(ss, function(i, e) {
		if (!Fai.isNumber(e) || parseInt(e) < 0 || parseInt(e) > 255) {
			result = false;
			return true;
		}
	});
	return result;
};

Fai.isDomain = function(obj) {
	if (/^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/.test(obj)) {
		if (obj.indexOf('--') >= 0) {
			return false;
		}
		return true;
	} else { 
		return false;
	}
};

Fai.isWord = function(word) {
	var pattern = /^[a-zA-Z0-9_]+$/;   
	return pattern.test(word);
};

Fai.isEmail = function(email) {
	var pattern = /^[a-zA-Z0-9][a-zA-Z0-9_=\&\-\.\+]*[a-zA-Z0-9]*@[a-zA-Z0-9][a-zA-Z0-9_\-\.]+[a-zA-Z0-9]$/;
	return pattern.test(email);
};

Fai.isEmailDomain = function(email) {
	var pattern = /^[a-zA-Z0-9][a-zA-Z0-9_\-]*\.[a-zA-Z0-9\-][a-zA-Z0-9_\-\.]*[a-zA-Z0-9]$/;
	return pattern.test(email);
};

// 校验手机号（针对大陆手机 11位号码，新增对16和19开头的校验）
Fai.isMobile = function(mobile) {
	var pattern = /^1[3456789]\d{9}$/;
	return pattern.test(mobile);
};

Fai.isPhone = function(phone) {
	var pattern1 = /^([^\d])+([^\d])*([^\d])$/;
	var pattern2 = /^([\d\+\s\(\)-])+([\d\+\s\(\)-])*([\d\+\s\(\)-])$/;
	//var p1 = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
	if (pattern1.test(phone)) {
		return false;
	}
	return pattern2.test(phone);
};

// 校验手机号（海内外）
Fai.isNationMobile = function(mobile) {
	var pattern = /^\d{7,11}$/;
	return pattern.test(mobile);
};

// 校验给定范围手机号（海内外, 传入给定长度）
Fai.isLimitedRangeNationMobile = function(mobile, minLength, maxLength) {
	/*var range = "11";
	if(minLength == maxLength){
		range = minLength;
	}else{
		range = minLength + "," + maxLength;
	}*/
	var pattern = new RegExp("^\\d{" + minLength + "," + maxLength + "}$");
	return pattern.test(mobile);
};

//验证身份证号码
Fai.isCardNo = function(card) {
	var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
	return pattern.test(card);
};

//supAbsuRoot   是否支持绝对路径
Fai.isUrl = function(str_url, supAbsuRoot) {
	if (typeof supAbsuRoot == 'undefined') {
		supAbsuRoot = true;
	}
	if (supAbsuRoot && str_url.length >= 1 && str_url.charAt(0) == '/') {
		return true;
	}
	if (supAbsuRoot && str_url.length >= 1 && str_url.charAt(0) == '#') {
		return true;
	}

	var re = /^(\w+:).+/;
	var result = re.test(str_url);	
	return result;
};

Fai.fixUrl = function(url, supAbsuRoot) {
	if (Fai.isUrl(url, supAbsuRoot)) {
		return url;
	}
	return 'http://' + url;
};

Fai.checkBit = function(flag, bitFlag) {
	//return (flag & bitFlag) == bitFlag;
	/*
	因为js位操作有关的超过了32位后无效。所有位置0。第32位代表负数。且32位的左移1位就是直接跳回到第1位。  与java long类型移位操作不符。
	20131225修改  支持long 类型62位内的checkBit 
	*/
	var bit_31 = true;
	//31位皆置1为：2147483647
	if (flag > 2147483647 || flag < 0 || bitFlag > 2147483647 || bitFlag < 0) {
		bit_31 = false;
	}
	if (bit_31) {
		return (flag & bitFlag) == bitFlag;
	}
	
	var flagBinary = flag.toString(2);
	var bitFlagBinary = bitFlag.toString(2);
	if (flagBinary.length > 62 || bitFlagBinary.length > 62) {
		alert('Does not support more than 62 bit. flagBinary.length=' + flagBinary.length + ',bitFlagBinary.length' + bitFlagBinary.length + '.');
		return false;
	}
	//flagBinary = flagBinary.split("").reverse().join("");
	//bitFlagBinary = bitFlagBinary.split("").reverse().join("");
	var flagLow;
	var bitFlagHight;
	var bitFlagLow;
	var flagHight;
	var lowStr;
	var hightStr;
	flagHight = flagLow = bitFlagHight = bitFlagLow = 0;
	//拆分高低位处理
	if (flagBinary.length > 31) {
		hightStr = flagBinary.slice(0, flagBinary.length - 31);
		lowStr = flagBinary.slice(flagBinary.length - 31);
		flagHight = parseInt(hightStr, '2');
		flagLow = parseInt(lowStr, '2');
	} else {
		flagLow = parseInt(flagBinary.slice(0, flagBinary.length), '2');
	}
	if (bitFlagBinary.length > 31) {
		hightStr = bitFlagBinary.slice(0, bitFlagBinary.length - 31);
		lowStr = bitFlagBinary.slice(bitFlagBinary.length - 31);
		bitFlagHight = parseInt(hightStr, '2');
		bitFlagLow = parseInt(lowStr, '2');
	} else {
		bitFlagLow = parseInt(bitFlagBinary.slice(0, bitFlagBinary.length), '2');
	}
	
	var result = (flagLow & bitFlagLow) == bitFlagLow;
	if (result) {
		result = (flagHight & bitFlagHight) == bitFlagHight;
	}
	return result;
};

Fai.andBit = function(flag, bitFlag) {
	var bit_31 = true;
	//31位皆置1为：2147483647
	if (flag > 2147483647 || flag < 0 || bitFlag > 2147483647 || bitFlag < 0) {
		bit_31 = false;
	}
	if (bit_31) {
		return flag &= bitFlag;
	}
	
	var flagBinary = flag.toString(2);
	var bitFlagBinary = bitFlag.toString(2);
	if (flagBinary.length > 62 || bitFlagBinary.length > 62) {
		alert('Does not support more than 62 bit. flagBinary.length=' + flagBinary.length + ',bitFlagBinary.length' + bitFlagBinary.length + '.');
		return 0;
	}
	var flagLow;
	var bitFlagHight;
	var bitFlagLow;
	var flagHight;
	var lowStr;
	var hightStr;
	flagHight = flagLow = bitFlagHight = bitFlagLow = 0;
	//拆分高低位处理
	if (flagBinary.length > 31) {
		hightStr = flagBinary.slice(0, flagBinary.length - 31);
		lowStr = flagBinary.slice(flagBinary.length - 31);
		flagHight = parseInt(hightStr, '2');
		flagLow = parseInt(lowStr, '2');
	} else {
		flagLow = parseInt(flagBinary.slice(0, flagBinary.length), '2');
	}
	if (bitFlagBinary.length > 31) {
		hightStr = bitFlagBinary.slice(0, bitFlagBinary.length - 31);
		lowStr = bitFlagBinary.slice(bitFlagBinary.length - 31);
		bitFlagHight = parseInt(hightStr, '2');
		bitFlagLow = parseInt(lowStr, '2');
	} else {
		bitFlagLow = parseInt(bitFlagBinary.slice(0, bitFlagBinary.length), '2');
	}
	flagLow &= bitFlagLow;
	flagHight &= bitFlagHight;
	flagBinary = flagLow.toString(2);
	//低位补0
	for (;flagBinary.length < 31;) {
		flagBinary = '0' + flagBinary;
	}
	flagBinary = flagHight.toString(2) + flagBinary;
	return parseInt(flagBinary, '2');
};

Fai.orBit = function(flag, bitFlag) {
	var bit_31 = true;
	if (flag > 2147483647 || flag < 0 || bitFlag > 2147483647 || bitFlag < 0) {
		bit_31 = false;
	}
	if (bit_31) {
		return flag |= bitFlag;
	}
	
	var flagBinary = flag.toString(2);
	var bitFlagBinary = bitFlag.toString(2);
	if (flagBinary.length > 62 || bitFlagBinary.length > 62) {
		alert('Does not support more than 62 bit. flagBinary.length=' + flagBinary.length + ',bitFlagBinary.length' + bitFlagBinary.length + '.');
		return 0;
	}
	var flagLow;
	var bitFlagHight;
	var bitFlagLow;
	var flagHight;
	var lowStr;
	var hightStr;

	flagHight = flagLow = bitFlagHight = bitFlagLow = 0;
	if (flagBinary.length > 31) {
		hightStr = flagBinary.slice(0, flagBinary.length - 31);
		lowStr = flagBinary.slice(flagBinary.length - 31);
		flagHight = parseInt(hightStr, '2');
		flagLow = parseInt(lowStr, '2');
	} else {
		flagLow = parseInt(flagBinary.slice(0, flagBinary.length), '2');
	}
	if (bitFlagBinary.length > 31) {
		hightStr = bitFlagBinary.slice(0, bitFlagBinary.length - 31);
		lowStr = bitFlagBinary.slice(bitFlagBinary.length - 31);
		bitFlagHight = parseInt(hightStr, '2');
		bitFlagLow = parseInt(lowStr, '2');
	} else {
		bitFlagLow = parseInt(bitFlagBinary.slice(0, bitFlagBinary.length), '2');
	}
	flagLow |= bitFlagLow;
	flagHight |= bitFlagHight;
	flagBinary = flagLow.toString(2);
	//低位补0
	for (;flagBinary.length < 31;) {
		flagBinary = '0' + flagBinary;
	}
	flagBinary = flagHight.toString(2) + flagBinary;
	return parseInt(flagBinary, '2');
};

Fai.isEnterKey = function(e) {
	if ($.browser.msie) {   
		if (event.keyCode == 13) {   
			return true;   
		} else {   
			return false;   
		}   
	} else {   
		if (e.which == 13) {   
			return true;   
		} else {   
			return false;   
		}   
	}   
};

Fai.isNumberKey = function(e, iSminus) {//按下数字键则返回true,用法：<input type="text" onkeypress="javascript:return Fai.isNumberKey(event);"/>
	if ($.browser.msie) {
		if (iSminus && event.keyCode == 45) {
			return true; 
		}
		if (((event.keyCode > 47) && (event.keyCode < 58)) ||   
			(event.keyCode == 8)) {   
			return true;   
		} else {   
			return false;   
		}   
	} else {
		if (iSminus && e.which == 45) {
			return true; 
		}
		if (((e.which > 47) && (e.which < 58)) ||   
			(e.which == 8)) {   
			return true;   
		} else {   
			return false;   
		}   
	} 
};

//按下数字键则返回true,用法：<input type="text" onkeypress="javascript:return Fai.isNumberKey(event);"/>
//在isNumberKey函数下增加一个","逗号键入，兼容直拨分机号
Fai.isPhoneNumberKey = function(e, iSminus) {
	if ($.browser.msie) {
		if (iSminus && event.keyCode == 45) {
			return true; 
		}   
		if (((event.keyCode > 47) && (event.keyCode < 58)) ||   
              (event.keyCode == 8) || (event.keyCode == 44)) {   
			return true;   
		} else {   
			return false;   
		}   
	} else {
		if (iSminus && e.which == 45) {
			return true; 
		}
		if (((e.which > 47) && (e.which < 58)) ||   
              (e.which == 8) || (e.which == 44)) {   
			return true;   
		} else {   
			return false;   
		}   
	} 
};

//控制只能输入小数点后两位
Fai.checkTwoDecimal  = function(e, id) {
	var val = $('#' + id).val();
	var reg = /^[0-9]\d*(?:\.\d{1,2}|\d*)$/;
	var keyVal;
	if ($.browser.msie) {
		if (event.keyCode > 47 && event.keyCode < 58) {
			keyVal = String.fromCharCode(e.which);  
			val = val + '' + keyVal;
			return reg.test(val);
		}
		
	} else {
		if (e.which > 47 && e.which < 58) {
			keyVal = String.fromCharCode(e.which);  
			val = val + '' + keyVal;
			return reg.test(val);
		}
		
	} 
};

//控制只能输入小数点后一位
Fai.checkOneDecimal = function(e, id) {
	var val = $('#' + id).val();
	var reg = /^[0-9]\d*(?:\.\d{1}|\d*)$/;
	var keyVal;
	if ($.browser.msie) {
		if (event.keyCode > 47 && event.keyCode < 58) {
			keyVal = String.fromCharCode(e.which);  
			val = val + '' + keyVal;
			return reg.test(val);
		}
		
	} else {
		if (e.which > 47 && e.which < 58) {
			keyVal = String.fromCharCode(e.which);  
			val = val + '' + keyVal;
			return reg.test(val);
		}
		
	} 
};

/*按下数字键则返回true,(iSminus:是否允许输入‘-’)
使用onafterpaste事件可防止黏贴强制输入
用法：<input type="text" onkeyup="javascript:Fai.isNumberUJs(this);" onafterpaste="javascript:Fai.isNumberUJs(this)"/>
*/
Fai.isNumberKey2 = function(obj, iSminus) {
	/*if ($.browser.msie) {
		if(event.keyCode == 37 || event.keyCode == 39) return;
	} else {
		if(e.which == 37 || e.which == 39) return;
	}*/
	if (iSminus) {
		$(obj).val($(obj).val().replace(/[^0-9\-]/g, ''));
	} else {
		$(obj).val($(obj).val().replace(/[^0-9]/g, ''));
	}
};

Fai.isFloatKey = function(e) {//按下数字键和小数点则返回true,用法：<input type="text" onkeypress="javascript:return Fai.isFloatKey(event);"/>
	if ($.browser.msie) {   
		if (((event.keyCode > 47) && (event.keyCode < 58)) ||   
              (event.keyCode == 8) || (event.keyCode == 46)) {   
			return true;   
		} else {   
			return false;   
		}   
	} else {   
		if (((e.which > 47) && (e.which < 58)) ||   
              (e.which == 8) || (e.which == 46)) {   
			return true;   
		} else {   
			return false;   
		}   
	}   
};

/*
用法：
var fls=Fai.flashChecker(); 
if(fls.f) document.write("您安装了flash,当前flash版本为: "+fls.v+".x"); 
else document.write("您没有安装flash"); 
*/
Fai.flashChecker = function() {
	var hasFlash = 0;//是否安装了flash
	var flashVersion = 0;//flash版本
	var isIE =/*@cc_on!@*/0;//是否IE浏览器
	var swf;
	var VSwf;

	if (isIE) {
		try {
			swf = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			if (swf) {
				hasFlash = 1;
				VSwf = swf.GetVariable('$version');
				flashVersion = parseInt(VSwf.split(' ')[1].split(',')[0]);
			}
		} catch (ex) {}
	} else {
		if (navigator.plugins && navigator.plugins.length > 0) {
			swf = navigator.plugins['Shockwave Flash'];
			if (swf) {
				hasFlash = 1;
				var words = swf.description.split(' ');
				for (var i = 0; i < words.length; ++i) {
					if (isNaN(parseInt(words[i]))) continue;
					flashVersion = parseInt(words[i]);
				}
			}
		}
	}
	return {f: hasFlash, v: flashVersion};
};

/**
 * Leyewen check is IE
 * @return boolean :true/false
 *     $.isIE()
 */
Fai.isIE = function() {
	return !!$.browser.msie;
};

Fai.isIE6 = function() {
	if ($.browser.msie) {
		if ($.browser.version == '6.0') return true;
	}
	return false;
};

Fai.isIE7 = function() {
	if ($.browser.msie) {
		if ($.browser.version == '7.0') return true;
	}
	return false;
};

Fai.isIE8 = function() {
	if ($.browser.msie) {
		if ($.browser.version == '8.0') return true;
	}
	return false;
};

Fai.isIE9 = function() {
	if ($.browser.msie) {
		if ($.browser.version == '9.0') return true;
	}
	return false;
};

Fai.isIE10 = function() {
	if ($.browser.msie) {
		if ($.browser.version == '10.0') return true;
	}
	return false;
};

Fai.isIE11 = function() {
	if ($.browser.msie) {
		// browser.rv: IE11 has a new token so we will assign it msie to avoid breaking changes
		if ($.browser.version == '11.0' || $.browser.rv) return true;
	}
	return false;
};

/**
 * Leyewen check is Safari
 * @return boolean :true/false
 *     $.isSafari()
 */
Fai.isSafari = function() {
	//alert($.toJSON($.browser));
	return !!$.browser.safari;
};

/**
 * Marcoli check is Weixin
 * @return boolean :true/false
 *     $.isWeixin()
 */
Fai.isWeixin = function() {
	var ua = navigator.userAgent.toLowerCase();
	var isWeixin = ua.indexOf('micromessenger') != -1;
	return isWeixin;
};

/**
 * Leyewen check is Webkit
 * @return boolean :true/false
 *     $.isWebkit()
 */
Fai.isWebkit = function() {
	return !!$.browser.webkit;
};

/**
 * Leyewen check is Chrome
 * @return boolean :true/false
 *     $.isChrome()
 */
Fai.isChrome = function() {
	return !!$.browser.chrome;
};

/**
 * Leyewen check is Mozilla
 * @return boolean :true/false
 *     $.isMozilla()
 */
Fai.isMozilla = function() {
	return !!$.browser.mozilla;
};

Fai.isAppleWebKit = function() {
	var ua = window.navigator.userAgent;
	if (ua.indexOf('AppleWebKit') >= 0) {
		return true;
	}
	return false;
};

/**
 * Leyewen check is Opera
 * @return boolean :true/false
 *     $.isOpera()
 */
Fai.isOpera = function() {
	return !!($.browser.opera || $.browser.opr);
};

Fai.isAndroid = function() {
	return !!$.browser.android;
};

Fai.isIpad = function() {
	return !!$.browser.ipad;
};

Fai.isIphone = function() {
	return !!$.browser.iphone;
};

//判断是PC端还是mobi端
Fai.isPC = function() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ['Android', 'iPhone',
		'SymbianOS', 'Windows Phone',
		'iPad', 'iPod'];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
};

Fai.getBrowserType = function() {
	/**
	 * 屏幕类型定义
	 * type的定义在JAVA的fai.web.Request中定义，要求一模一样
	 */
	var BrowserType = {
		'UNKNOWN': 0,
		'SPIDER': 1,
		'CHROME': 2,
		'FIREFOX': 3,			// Mozilla
		'MSIE8': 4,
		'MSIE7': 5,
		'MSIE6': 6,
		'MSIE9': 7,
		'SAFARI': 8,
		'MSIE10': 9,
		'MSIE11': 10,
		'OPERA': 11,
		'APPLE_WEBKIT': 12
	};

	if (Fai.isIE6()) {
		return BrowserType.MSIE6;
	} else if (Fai.isIE7()) {
		return BrowserType.MSIE7;
	} else if (Fai.isIE8()) {
		return BrowserType.MSIE8;
	} else if (Fai.isIE9()) {
		return BrowserType.MSIE9;
	} else if (Fai.isIE10()) {
		return BrowserType.MSIE10;
	} else if (Fai.isIE11()) {
		return BrowserType.MSIE11;
	} else if (Fai.isMozilla()) {
		return BrowserType.FIREFOX;
	} else if (Fai.isOpera()) {
		return BrowserType.OPERA;
	} else if (Fai.isChrome()) {
		return BrowserType.CHROME;
	} else if (Fai.isSafari()) {
		return BrowserType.SAFARI;
	} else if (Fai.isAppleWebKit()) {
		return BrowserType.APPLE_WEBKIT;
	} else {
		return BrowserType.UNKNOWN;
	}
};

/**
 * 返回屏幕宽高
 */
Fai.Screen = function() {
	return {
		'width': window.screen.width,
		'height': window.screen.height
	};
};

Fai.getScreenType = function(width, height) {
	/**
	 * 屏幕类型定义
	 * type的定义在JAVA的fai.web.Request中定义，要求一模一样
	 */
	var ScreenType = {
		'OTHER': 0,				// 其他分辨率
		'W1920H1080': 1,			// 1920*1080
		'W1680H1050': 2,			// 1680*1050
		'W1600H1200': 3,			// 1600*1200
		'W1600H1024': 4,			// 1600*1024
		'W1600H900': 5,			// 1600*900
		'W1440H900': 6,			// 1440*900
		'W1366H768': 7,			// 1366*768
		'W1360H768': 8,			// 1360*768
		'W1280H1024': 9,			// 1280*1024
		'W1280H960': 10,			// 1280*960
		'W1280H800': 11,			// 1280*800
		'W1280H768': 12,			// 1280*768
		'W1280H720': 13,			// 1280*720
		'W1280H600': 14,			// 1280*600
		'W1152H864': 15,			// 1152*864
		'W1024H768': 16,			// 1024*768
		'W800H600': 17				// 800*600
	};

	return ScreenType['W' + $.trim(String(width)) + 'H' + $.trim(String(height))] || ScreenType.Other;
};

Fai.getCssInt = function(ctrl, css) {
	if (ctrl.css(css)) {
		var tmp = parseInt(ctrl.css(css).replace('px', ''));
		if (isNaN(tmp)) {
			return 0;
		}
		return tmp;
	} else {
		return 0;
	}
};

Fai.addUrlParams = function(url, param) {
	if (Fai.isNull(param)) {
		return url;
	}
	if (url.indexOf('?') < 0) {
		return url + '?' + param;
	}
	return url + '&' + param;
};

//向数组中添加元素，不重复
Fai.addArrElementsNoRepeat = function(arr, elements) {
	if (arr.length > 0) {
		var repeat = 0;
		$.each(arr, function(i) {
			if (arr[i] == elements) {
				repeat++;
			}
		});
		if (repeat == 0) {
			arr[arr.length] = elements;
		}
	} else {
		arr[arr.length] = elements;
	}
	return arr;
};

Fai.getUrlRoot = function(url) {
	var pos = url.indexOf('://');
	if (pos < 0) {
		return url;
	}
	pos = url.indexOf('/', pos + 3);
	if (pos < 0) {
		return '/';
	}
	return url.substring(pos);
};

Fai.getUrlParam = function(url, name) {
	var paramStrings = url.substring(url.indexOf('?') + 1, url.length).split('&');
	var value;
	$.each(paramStrings, function(index, str) {
		var tmpKey = decodeURIComponent(str.substring(0, str.indexOf('=')));
		if (tmpKey === name) {
			value = decodeURIComponent(str.substring(str.indexOf('=') + 1, str.length));
			return false;
		}
	});
	return value;
};

Fai.getHashParam = function(hash, name) {
	var paramStrings = hash.substring(hash.indexOf('#') + 1, hash.length).split('&');
	var value;
	$.each(paramStrings, function(index, str) {
		var tmpKey = decodeURIComponent(str.substring(0, str.indexOf('=')));
		if (tmpKey === name) {
			value = decodeURIComponent(str.substring(str.indexOf('=') + 1, str.length));
			return false;
		}
	});
	return value;
};

// 进行html编码
// .replace(/ /g, "&nbsp;").replace(/\b&nbsp;+/g, " ")用于替换空格 再查找单个或者连续的空格，把单个或连续串中第一个替换为原来的“ ”。
Fai.encodeHtml = function(html) {
	return html && html.replace ? (html.replace(/&/g, '&amp;').replace(/ /g, '&nbsp;').replace(/\b&nbsp;+/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\/g, '&#92;').replace(/\'/g, '&#39;').replace(/\"/g, '&quot;').replace(/\n/g, '<br/>').replace(/\r/g, '')) : html;
};

// 进行html解码
Fai.decodeHtml = function(html) {
	return html && html.replace ? (html.replace(/&nbsp;/gi, ' ').replace(/&lt;/gi, '<').replace(/&gt;/g, '>')
		.replace(/&#92;/gi, '\\').replace(/&#39;/gi, '\'').replace(/&quot;/gi, '"').replace(/\<br\/\>/gi, '\n').replace(/&amp;/gi, '&')) : html;
};

// 把字符串转换为写在html标签中javascript的字符串，例如<div onclick="alert('xxx')">
Fai.encodeHtmlJs = function(html) {
	return html && html.replace ? (html.replace(/\\/g, '\\\\').replace(/\'/g, '\\x27').replace(/\"/g, '\\x22').replace(/\n/g, '\\n').replace(/</g, '\\x3c').replace(/>/g, '\\x3e')) : html;
};

// 把字符串转换为写在html中属性值，例如<div title="xxx">
Fai.encodeHtmlAttr = function(html) {
	return html && html.replace ? (html.replace(/\"/g, '&#x22;').replace(/\'/g, '&#x27;').replace(/</g, '&#x3c;').replace(/>/g, '&#x3e;').replace(/&/g, '&#x26;')).replace(/\\/g, '&#5c;') : html;
};

// 进行url编码
Fai.encodeUrl = function(url) {
	return typeof url === 'undefined' ? '' : encodeURIComponent(url);
};

// 进行url解码
Fai.decodeUrl = function(url) {
	var backUrl = '';
	try {
		// 如果decodeURIComponent失败, 会爆Uncaught URIError
		backUrl = (typeof url === 'undefined' ? '' : decodeURIComponent(url));
	} catch (e) {
		backUrl = '';
	}
	return backUrl;
};

//  解码在html中属性值，例如<div title="xxx">
Fai.decodeHtmlAttr = function(html) {
	return html && html.replace ? (html.replace(/&#x22;/gi, '"').replace(/&#x27;/gi, '\'').replace(/&#x3c;/gi, '<').replace(/&#x3e;/gi, '>').replace(/&#x26;/gi, '&')).replace(/&#5c;/gi, '\\') : html;
};

// 提取文件名，suffix表示是否返回后缀名
Fai.parseFileName = function(path, suffix) {
	
	var pos = path.lastIndexOf('/');
	if (pos < 0) {
		pos = path.lastIndexOf('\\');
	}
	if (pos >= 0) {
		path = path.substring(pos + 1);
	}
	if (suffix) {
		return path;
	} else {
		var doPos = path.lastIndexOf('.');
		if (doPos >= 0) {
			return path.substring(0, doPos);
		} else {
			return path;
		}
	}
};

// 格式化字符串
Fai.format = function() {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++) {       
		var reg = new RegExp('\\{' + i + '\\}', 'gm');             
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
};

Fai.checkValid = function(value, label, errCtrlId, minlen, maxlen) {
	var msg;
	if (!value && minlen > 0) {
		msg = Fai.format('您还未输入{0}', label);
	} else if (value.length < minlen) {
		msg = Fai.format('{0}不能少于{1}个字', label, minlen);
	} else if (value.length > maxlen) {
		msg = Fai.format('{0}不能多于{1}个字，请裁减后重试。', label, maxlen);
	}
	var errCtrl = $('#' + errCtrlId);
	if (msg) {
		errCtrl.show();
		errCtrl.text(msg);
	} else {
		errCtrl.hide();
	}
	return !msg;
};

Fai.getBrowserWidth = function() {
	return document.documentElement.clientWidth;
};

Fai.getBrowserHeight = function() {
	return document.documentElement.clientHeight;
};

/**
 * Fai.Cookie在新增的方法内容中暂停使用，使用$.cookie()代替
 * Fai.Cookie将在未来版本中删除
 */
Fai.Cookie = {};

Fai.Cookie.set = function(name, value) {
	name = Fai.top._siteId == 0 ? name : name + '_' + Fai.top._siteId;
	var argv = arguments;
	var argc = arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	var path = (argc > 3) ? argv[3] : '/';
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : false;
	document.cookie = name + '=' + escape(value) +
       ((expires == null) ? '' : ('; expires=' + expires.toGMTString())) +
       ((path == null) ? '' : ('; path=' + path)) +
       ((domain == null) ? '' : ('; domain=' + domain)) +
       ((secure == true) ? '; secure' : '');
};

Fai.Cookie.get = function(name) {
	name = Fai.top._siteId == 0 ? name : name + '_' + Fai.top._siteId;
	var arg = name + '=';
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	var j = 0;
	while (i < clen) {
		j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return Fai.Cookie.getCookieVal(j);
		i = document.cookie.indexOf(' ', i) + 1;
		if (i == 0)
			break;
	}
	return null;
};

Fai.Cookie.clear = function(name) {
	if (Fai.Cookie.get(name)) {
		var expdate = new Date(); 
		expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
		Fai.Cookie.set(name, '', expdate); 
	}
};

Fai.Cookie.clearCloseClient = function(name) {
	if (Fai.Cookie.get(name)) {
		Fai.Cookie.set(name, '', null); 
	}
};

Fai.Cookie.getCookieVal = function(offset) {
	var endstr = document.cookie.indexOf(';', offset);
	if (endstr == -1) {
		endstr = document.cookie.length;
	}
	return unescape(document.cookie.substring(offset, endstr));
};

Fai.Conn = {};

// 跨域访问，返回一段js代码。（在ie6下，如果是用<a/>还调用，必须是href="javascript:xxx()"的方式，而不能onclick，否则返回的js没有作用）
Fai.Conn.requestJs = function(id, url, options) { 
	var oScript = document.getElementById(id);
	var target = null;
	if (typeof options == 'object' && options.target) {
		target = document.getElementsByName(options.target)[0]; 
	} else {
		target = document.getElementsByTagName('head')[0]; 
	}
	if (oScript) { 
		target.removeChild(oScript); 
	} 
	if (typeof options == 'object' && options.callback) {
		url = Fai.addUrlParams(url, '_callback=' + options.callback);
	}
	if (typeof options == 'object' && options.refresh) {
		url = Fai.addUrlParams(url, '_random=' + Math.random());
	}
	oScript = document.createElement('script'); 
	oScript.setAttribute('src', url); 
	oScript.setAttribute('id', id); 
	oScript.setAttribute('type', 'text/javascript'); 
	oScript.setAttribute('language', 'javascript'); 
	target.appendChild(oScript); 
	return oScript; 
};

Fai.ptInRect = function(pt, rect) {
	if (pt.x >= rect.left && pt.x <= rect.left + rect.width &&
		pt.y >= rect.top && pt.y <= rect.top + rect.height) {
		return true;
	}
	return false;
};

Fai.Img = {};

Fai.Img = {
	MODE_SCALE_FILL: 1,				// 根据区域能够填满的最大值等比例缩放。图片100x50，区域50x50，结果50x25。
	MODE_SCALE_WIDTH: 2,			// 根据区域宽度等比例缩放，结果高度将不受区域高度限制，即可能撑大高度。图片100x50，区域50x10，结果50x25。
	MODE_SCALE_HEIGHT: 3,			// 根据区域高度等比例缩放，结果宽度将不受区域宽度限制，即可能撑大宽度。图片100x50，区域50x50，结果100x50。
	MODE_SCALE_DEFLATE_WIDTH: 4,	// 根据区域宽度等比例缩小，不放大，结果高度将不受区域高度限制。图片100x50，区域50x10，结果50x25；图片100x50，区域200x100，结果100x50。
	MODE_SCALE_DEFLATE_HEIGHT: 5,	// 根据区域高度等比例缩小，不放大，结果宽度将不受区域高度限制。图片100x50，区域50x50，结果100x50；图片100x50，区域200x100，结果100x50。
	MODE_SCALE_DEFLATE_FILL: 6,		// 根据区域能够填满的最大值等比例缩小，不放大。图片100x50，区域50x50，结果50x25。
	MODE_SCALE_DEFLATE_MAX: 7 		// 根据区域等比例缩小，不放大，结果的宽度和高度不能同时超过区域限制。图片200x100，区域100x100，结果200x100；图片100x200，区域100x100，结果100x200。
};

// 使用此函数时，不要在img标签中先设置大小，会使得调整img大小时失败；先隐藏图片，避免出现图片从原始图片变为目标图片的过程
// <img src="xx.jpg" style="display:none;" onload="Fai.Img.optimize(this, {width:100, height:50, mode:Fai.Img.MODE_SCALE_FILL});"/>
Fai.Img.optimize = function(img, option) {
	// ie下对于display:none的img不会加载
	// 这里要用临时图片，是因为当动态改变图片src时，由于图片的大小已经被设置，因此再次获取会失败
	var imgTmp = new Image();   
	// 这里还不能先置空，否则将会引起对''文件的一次访问
	//	imgTmp.src = '';
	imgTmp.src = img.src;
	var imgWidth = imgTmp.width;
	var imgHeight = imgTmp.height;
	if (Fai.isNull(imgWidth) || imgWidth == 0 || Fai.isNull(imgHeight) || imgHeight == 0) {
		// chrome似乎对临时图片的加载会有延迟，立即取大小会失败
		imgWidth = img.width;
		imgHeight = img.height;
	}
	var size = Fai.Img.calcSize(imgWidth, imgHeight, option.width, option.height, option.mode);
	img.width = size.width;
	img.height = size.height;
	if (option.display == 1) {
		img.style.display = 'inline';
	} else if (option.display == 2) {
		img.style.display = 'none';
	} else if (option.display == 3) {
		img.style.display = 'inline-block';
	} else {
		img.style.display = 'block';
	}
	return {width: img.width, height: img.height};
};

Fai.Img.calcSize = function(width, height, maxWidth, maxHeight, mode) {
	var size = {width: width, height: height};
	var rateWidth;
	var rateHeight;
	if (mode == Fai.Img.MODE_SCALE_FILL) {
		rateWidth = width / maxWidth;      
		rateHeight = height / maxHeight;      
		if (rateWidth > rateHeight) {      
			size.width =  maxWidth;      
			size.height = height / rateWidth;      
		} else {      
			size.width = width / rateHeight;      
			size.height = maxHeight;      
		}      
	} else if (mode == Fai.Img.MODE_SCALE_WIDTH) {
		rateWidth = width / maxWidth;      
		size.width =  maxWidth;      
		size.height = height / rateWidth;      
	} else if (mode == Fai.Img.MODE_SCALE_HEIGHT) {
		rateHeight = height / maxHeight;      
		size.width = width / rateHeight;      
		size.height = maxHeight;      
	} else if (mode == Fai.Img.MODE_SCALE_DEFLATE_WIDTH) {
		rateWidth = width / maxWidth; 
		if (rateWidth > 1) {
			size.width =  maxWidth;      
			size.height = height / rateWidth;      
		}
	} else if (mode == Fai.Img.MODE_SCALE_DEFLATE_HEIGHT) {
		rateHeight = height / maxHeight;      
		if (rateHeight > 1) {
			size.width = width / rateHeight;      
			size.height = maxHeight;      
		}
	} else if (mode == Fai.Img.MODE_SCALE_DEFLATE_FILL) {
		rateWidth = width / maxWidth;
		rateHeight = height / maxHeight;
		
		if (rateWidth > rateHeight) {   
			if (rateWidth > 1) {
				size.width =  maxWidth;      
				size.height = height / rateWidth;
			}
		} else {
			if (rateHeight > 1)	{
				size.width = width / rateHeight;      
				size.height = maxHeight;      
			}
		}
	} else if (mode == Fai.Img.MODE_SCALE_DEFLATE_MAX) {
		if (width > maxWidth && height > maxHeight) {
			rateWidth = width / maxWidth;
			rateHeight = height / maxHeight;

			if (rateWidth < rateHeight) {
				size.width = maxWidth;
				size.height = height / rateWidth;
			} else {
				size.width = width / rateHeight;
				size.height = maxHeight;
			}
		}
	}
	size.width = Math.floor(size.width);
	size.height = Math.floor(size.height);
	if (size.width == 0) {
		size.width = 1;
	}
	if (size.height == 0) {
		size.height = 1;
	}
	return size;
};

/*
灰色透明背景，正在运行的图标
提交的时候使用Fai.ing(str, autoClose):str为要显示的语句，如果为空则显示"正在处理"
如果autoClose == true，则在2秒钟后自动close便签，否则不自动关闭。
得到结果后使用Fai.removeIng()
提供autoTime参数，用于自定义提示自动关闭的等待时间————Front 2015-03-17
*/
Fai.ing = function(str, autoClose, autoTime) {
	var msg = (str == null || str == '') ? '正在处理...' : str;
	var html = '';
	var ingStyle = 'position:fixed; top:50px; left: 50%; margin:0px auto; width:auto;  z-index:9999;';
	var animateStyle = 'transition: opacity ease .6s; -moz-transition: opacity ease .6s; -webkit-transition: opacity ease .6s; -o-transition: opacity ease .6s; opacity: 0; -webkit-opacity: 0; -moz-opacity: 0; -khtml-opacity: 0; filter:alpha(opacity=0);';
	html = '<div id=\'ing\' style=\'' + ingStyle + animateStyle + '\'></div>';

	if (Fai.top.$('#ing').length == 0) {
		Fai.top.$(html).appendTo('body');
	}
	var ing = Fai.top.$('#ing');

	var bodyTop = Fai.top.$(document).scrollTop();
	if (Fai.isIE() && bodyTop == 0) {
		bodyTop = Fai.top.$('html').scrollTop();
	}
	// if (bodyTop > 0) {
	// 	ing.css('top', ((bodyTop) + 50) + 'px');
	// }
	var id = parseInt(Math.random() * 10000);
	var tips = '';
	tips += '<div id="' + id + '" class="tips">'
			+ 	'<div class="msg">' + msg + '</div><div class=\'close\' onclick="Fai.top.Fai.removeIng(false, ' + id + ');"></div>'
			+ '</div>';
	ing.find('.tips').remove();
	Fai.top.$(tips).appendTo(ing);
	
	// 居中处理
	var ingWidth = Fai.top.$(ing).width();
	Fai.top.$(ing).css('left', (Fai.top.document.documentElement.clientWidth - ingWidth) / 2);

	if (autoClose) {
		Fai.top.Fai.removeIng(autoClose, id, autoTime);
	}

	/* 渐变出现 */
	var isIe = Fai.isIE6() || Fai.isIE7() || Fai.isIE8();
	if (isIe) {
		Fai.top.$('#ing').animate({opacity: 1, filter: 'alpha(opacity=100)'}, 300);
	} else {
		Fai.top.$('#ing').css({opacity: 1});
	}
	
	Fai.top.$('#ing').find('.close').bind('mouseenter', function() {
		$(this).addClass('close_hover');
	}).bind('mouseleave', function() {
		$(this).removeClass('close_hover');
	});
};


/*购物车用的*/
Fai.ing2 = function(str, autoClose, autoTime) {
	var msg = (str == null || str == '') ? '正在处理...' : str;
	var html = '';
	var ingStyle = ' margin:180px auto; width:500px;  height:auto; z-index:9999;';
	var animateStyle = 'transition: opacity ease .6s; -moz-transition: opacity ease .6s; -webkit-transition: opacity ease .6s; -o-transition: opacity ease .6s; opacity: 0; -webkit-opacity: 0; -moz-opacity: 0; -khtml-opacity: 0; filter:alpha(opacity=0);';
	html = '<div id=\'ing2\' style=\'' + ingStyle + animateStyle + '\'></div>';
	if (Fai.top.$('#ing2').length == 0) {
		Fai.top.$(html).appendTo('body');
	}
	var ing = Fai.top.$('#ing2');
	var bodyTop = Fai.top.$('body').scrollTop();
	if (Fai.isIE() && bodyTop == 0) {
		bodyTop = Fai.top.$('html').scrollTop();
	}

	if (bodyTop > 0) {
		ing.css('top', (bodyTop) + 50 + 'px');
	} else {
		ing.css('top', (bodyTop) + 200 + 'px');
	}
	
	var id = parseInt(Math.random() * 10000);
	var tips = '';
	tips += '<div id="' + id + '" class="tips2">'
			+ 	'<div class="msg2">' + msg + '</div><div class=\'close\' onclick="Fai.top.Fai.removeIng2(false, ' + id + ');Fai.top.Fai.removeBg();"></div>'
			+ '</div>';
	ing.find('.tips2').remove();
	Fai.top.$(tips).appendTo(ing);
	
	// 居中处理
	var ingWidth = Fai.top.$(ing).width();
	Fai.top.$(ing).css('left', (Fai.top.document.documentElement.clientWidth - ingWidth) / 2);

	if (autoClose) {
		Fai.top.Fai.removeIng(autoClose, id, autoTime);
	}

	/* 渐变出现 */
	var isIe = Fai.isIE6() || Fai.isIE7() || Fai.isIE8();
	if (isIe) {
		Fai.top.$('#ing2').animate({opacity: 1, filter: 'alpha(opacity=100)'}, 300);
	} else {
		Fai.top.$('#ing2').css({opacity: 1});
	}
	
	Fai.top.$('#ing2').find('.close').bind('mouseenter', function() {
		$(this).addClass('close_hover');
	}).bind('mouseleave', function() {
		$(this).removeClass('close_hover');
	});
};

Fai.removeIng = function(autoClose, id, autoTime) {
	if (autoClose) {
		if (typeof id != 'undefined' && Fai.top.$('#' + id).length > 0) {
			Fai.top.window.setTimeout(function() {
				$('#' + id).fadeOut(1000); 
			}, (autoTime ? autoTime : 3000));
			Fai.top.window.setTimeout(function() {
				$('#' + id).remove(); 
			}, (autoTime ? autoTime + 1500 : 4500));
		} else {
			Fai.top.$('.tips').fadeOut(1000);
			Fai.top.window.setTimeout(function() {
				$('#ing').remove(); 
			}, (autoTime ? autoTime : 3000));
		}
	} else {
		if (typeof id != 'undefined' && Fai.top.$('#' + id).length > 0) {
			Fai.top.$('#' + id).fadeOut(500);
			Fai.top.window.setTimeout(function() {
				$('#' + id).remove(); 
			}, 1000);
		} else {
			Fai.top.$('.tips').fadeOut(500);
			Fai.top.window.setTimeout(function() {
				$('#ing').remove(); 
			}, 1000);
		}
	}
	Fai.top.$('#ing').css('opacity', 0);
};

Fai.removeIng2 = function(autoClose, id, autoTime) {
	if (autoClose) {
		if (typeof id != 'undefined' && Fai.top.$('#' + id).length > 0) {
			Fai.top.window.setTimeout(function() {
				$('#' + id).fadeOut(1000); 
			}, (autoTime ? autoTime : 3000));
			Fai.top.window.setTimeout(function() {
				$('#' + id).remove(); 
			}, (autoTime ? autoTime + 1500 : 4500));
		} else {
			Fai.top.$('.tips').fadeOut(1000);
			Fai.top.window.setTimeout(function() {
				$('#ing2').remove(); 
			}, (autoTime ? autoTime : 3000));
		}
	} else {
		if (typeof id != 'undefined' && Fai.top.$('#' + id).length > 0) {
			Fai.top.$('#' + id).fadeOut(500);
			Fai.top.window.setTimeout(function() {
				$('#' + id).remove(); 
			}, 1000);
		} else {
			Fai.top.$('.tips').fadeOut(500);
			Fai.top.window.setTimeout(function() {
				$('#ing2').remove(); 
			}, 1000);
		}
	}
	Fai.top.$('#ing2').css('opacity', 0);
};

/*
灰色透明背景
*/
Fai.bg = function(id, opacity, zIndex, extClass) {
	try{
		// url带参_noCover, 支持代建网站去掉弹窗的灰度遮罩层
		if((window.Fai && window.Fai.top && window.Fai.top._noCover == 1) || (top && top.Fai && top.Fai.top._noCover == 1)){
			Fai.logDog(200106, 1);
			return;
		}
	}catch(e){
		console.log(e);
	}
	var html = '',
		opacityHtml = '',
		zIndexHtml = '';
	extClass = extClass || '';
	//背景遮罩一弹的时候0.5  二弹以上的都是0.15
	// J_popup_bg可以给其他地方的遮罩设置，用于解决遮罩重叠时的颜色加深问题
	if (Fai.top.$('.popupBg').length > 0 || Fai.top.$('.J_popup_bg').length > 0) {
		opacity = 0.15;
	}
	if (opacity) {
		opacityHtml = 'filter: alpha(opacity=' + opacity * 100 + '); opacity:' + opacity + ';';
	}
	if (zIndex) {
		zIndexHtml = ' z-index:' + (zIndex - 1);
	}
	var scrollTop;
	if (Fai.isIE6()) {
		scrollTop = Fai.top.$('html').scrollTop();
		Fai.top.$('html').data('scrollTop', scrollTop);
		Fai.top.$('html').scrollTop(0);
		scrollTop = Fai.top.$('body').scrollTop();
		Fai.top.$('body').data('scrollTop', scrollTop);
		Fai.top.$('body').scrollTop(0);
		Fai.top.$('html').data('overflow-x', Fai.top.$('html').css('overflow-x'));
		Fai.top.$('html').data('overflow-y', Fai.top.$('html').css('overflow-y'));
		Fai.top.$('html').css('overflow-x', 'hidden');
		Fai.top.$('html').css('overflow-y', 'hidden');
		Fai.top.$('body').data('overflow-x', Fai.top.$('body').css('overflow-x'));
		Fai.top.$('body').data('overflow-y', Fai.top.$('body').css('overflow-y'));
		Fai.top.$('body').css('overflow-x', 'hidden');
		Fai.top.$('body').css('overflow-y', 'hidden');
	}
	// 处理网站置灰的情况
	if (Fai.isIE6() || Fai.isIE7() || Fai.isIE8()) {
		if (Fai.top.$('html').css('filter')) {
			Fai.top.$('html').data('filter', Fai.top.$('html').css('filter'));
			Fai.top.$('html').css('filter', 'none');
		}
	}
	//加上popupBgForWin为了将z-index提到9032  避免直接修改popupBg影响其它使用了popupBg的地方
	html = '<div id="popupBg' + id + '" class="J_popup_bg popupBg popupBgForWin ' + extClass + '" style=\'' + opacityHtml + zIndexHtml + '\' onclick=\'Fai.logDog(200046, 40);\'>' +
		($.browser.msie && $.browser.version == 6.0 ?
			'<iframe id="fixSelectIframe' + id + '" wmode="transparent" style="filter: alpha(opacity=0);opacity: 0;" class="popupBg" style="z-index:-111" src="javascript:"></iframe>' 	
			: '')
	+ '</div>';
	
	Fai.top.$(html).appendTo('body');
	if (Fai.top._isTemplateVersion2 && Fai.top._useBannerVersionTwo && !Fai.top._bannerData.h
		&& typeof Site != 'undefined' && typeof Fai.top._bannerV2Data != 'undefined' 
		&& Fai.top._bannerV2Data.bl && Fai.top._bannerV2Data.bl.length > 1) {

		Site.bannerV2.stopBannerInterval();
	}
	Fai.stopInterval(null);
};

Fai.removeBg = function(id) {
	if (id) {
		Fai.top.$('#popupBg' + id).remove();
	} else {
		Fai.top.$('.popupBg').not('.popupZoneDelOnlyById').last().remove();
	}
	if (Fai.isIE6()) {
		Fai.top.$('html').css('overflow-x', Fai.top.$('html').data('overflow-x'));
		Fai.top.$('html').css('overflow-y', Fai.top.$('html').data('overflow-y'));
		Fai.top.$('body').css('overflow-x', Fai.top.$('body').data('overflow-x'));
		Fai.top.$('body').css('overflow-y', Fai.top.$('body').data('overflow-y'));
		Fai.top.$('html').scrollTop(Fai.top.$('html').data('scrollTop'));
		Fai.top.$('body').scrollTop(Fai.top.$('body').data('scrollTop'));
	}
	// 处理网站置灰的情况
	if (Fai.isIE6() || Fai.isIE7() || Fai.isIE8()) {
		if (Fai.top.$('html').data('filter')) {
			Fai.top.$('html').css('filter', Fai.top.$('html').data('filter'));
		}
	}
	if (Fai.top._isTemplateVersion2 && Fai.top._useBannerVersionTwo && !Fai.top._bannerData.h
		&& typeof Site != 'undefined' && typeof Fai.top._bannerV2Data != 'undefined' 
		&& Fai.top._bannerV2Data.bl && Fai.top._bannerV2Data.bl.length > 1) {
		Site.bannerV2.startBannerInterval();
	}
	Fai.startInterval(null);
};

/**
* @function 灰色透明背景（在当前页面）
* @param {int} id -- 弹出层id
* @param {float} opacity -- 弹出层透明度
* @param {object} options -- 弹出层扩展
**/
Fai.bodyBg = function(id, opacity, options) {
	// url带参_noCover, 支持代建网站去掉弹窗的灰度遮罩层
	if (top.Fai.top._noCover == 1) {
		return;
	}
	var html = '',
		opacityHtml = '',
		opt = options || {},
		extClass = opt.extClass || '';
	
	if (opacity) {
		opacityHtml = 'filter: alpha(opacity=' + opacity * 100 + '); opacity:' + opacity + ';';
	}

	if (Fai.isIE6()) {
		$('body').data('height', $('body').css('height'));
		$('body').css('height', '100%');
	}

	html = '<div id="popupBg' + id + '" class="popupBg ' + extClass + '" style=\'' + opacityHtml + '\' >' + 
		($.browser.msie && $.browser.version == 6.0 ?
			'<iframe id="fixSelectIframe' + id + '" wmode="transparent" style="filter: alpha(opacity=0);opacity: 0;" class="popupBg" style="z-index:-111" src="javascript:"></iframe>' 	
			: '')
	+ '</div>';
	$(html).appendTo('body');
};

Fai.removeBodyBg = function(id) {
	if (Fai.isIE6()) {
		$('body').css('height', $('body').data('height'));
	}

	if (id) {
		$('#popupBg' + id).remove();
	} else {
		$('.popupBg').not('.popupZoneDelOnlyById').last().remove();
	}
};

/*
弹出框（在top显示）
title				弹出框的标题
width				内容区宽度（数字/字符串）
height				内容区高度（数字/字符串）
opacity				背景遮盖层的透明度，默认0.3
displayBg			是否加背景遮盖层，默认true
frameSrcUrl			内容区iframe的src地址
frameScrolling		iframe是否有scrolling(yes/no/auto)，默认auto
bannerDisplay		是否显示标题栏和边框，默认true
closeBtnClass		关闭按钮样式
framePadding		是否去掉内容区的padding
bgClose				是否点击背景关闭，默认false
divId				以div的html来作为内容
divContent			以html来作为内容

closeFunc			关闭popup window时执行的函数，可以通过Fai.closePopupWindow(popupID, closeArgs)来传递closeFunc的回调参数，即调用：closeFunc(closeArgs)
msg                 关闭popup window时提示的语句（点击右上角那个×）
helpLink			帮助按钮的link url
waitingPHide		是否隐藏loading面板（前后端分离后，交由加载的文件控制）
*/
Fai.popupWindow = function(options) {
	//settings走默认设置
	var settings = {
		title: '',
		width: 500,
		height: 300,
		frameSrcUrl: 'about:_blank',
		frameScrolling: 'auto',
		bannerDisplay: true,
		framePadding: true,
		opacity: '0.5',
		displayBg: true,
		bgClose: false,
		closeBtnClass: '',
		waitingPHide: true,
		popUpWinZIndex: 0
	};
	settings = $.extend(settings, options);

	var contentWidth = parseInt(settings.width),
		contentHeight = parseInt(settings.height);

	var browserWidth = Fai.top.document.documentElement.clientWidth;
	if (!$.browser.msie) {
		browserWidth = Fai.top.document.body.clientWidth;
	}
	var browserHeight = Fai.top.document.documentElement.clientHeight;

	var leftMar = (browserWidth - contentWidth) / 2;
	if (settings.leftMar != null) {
		leftMar = parseInt(settings.leftMar);
	}
	var topDiff = 80;
	if (!settings.bannerDisplay) {
		topDiff = 0;
	}
	var topMar = (browserHeight - contentHeight - topDiff) / 2;
	if (settings.topMar != null) {
		topMar = parseInt(settings.topMar);
	}

	var bgDisplay = '',
		bannerStyle = '',
		trans = '';
	if (!settings.bannerDisplay) {
		bannerStyle = 'display:none;';
		bgDisplay = 'background:none;';
		if (!settings.closeBtnClass) {
			settings.closeBtnClass = 'formX_old';	// 没有边框时使用另一个样式（如幻灯片）
		}
	}
	if (!settings.framePadding) {
		bgDisplay += 'padding:0;';
		trans = 'allowtransparency="true"';
	}
	
	var id = parseInt(Math.random() * 10000),
		displayModeContent = '<iframe ' + trans + ' id=\'popupWindowIframe' + id + '\' class=\'popupWindowIframe\' src=\'\' frameborder=\'0\' scrolling=\'' + settings.frameScrolling + '\' style=\'width:100%;height:100%;\'></iframe>',
		iframeMode = true;
	if (settings.divId != null) {
		iframeMode = false;
		displayModeContent = $(settings.divId).html();
	}
	if (settings.divContent != null)	{
		iframeMode = false;
		displayModeContent = settings.divContent;
	}
	//加背景
	if (settings.displayBg) {
		Fai.bg(id, settings.opacity);
	}

	var html = '';
	//加弹出窗口
	var scrollTop = Fai.top.$('body').scrollTop();
	if (scrollTop == 0) {
		scrollTop = Fai.top.$('html').scrollTop();
	}
	
	var winStyle = 'left:' + leftMar + 'px; top:' + (topMar + scrollTop) + 'px;';
	// ie6/7 popupWin的width无法自动，所以先写死再动态修正
	if (Fai.isIE6() || Fai.isIE7()) {
		winStyle += 'width:' + contentWidth + 'px;';
	}
	if (settings.popUpWinZIndex) {
		winStyle += 'z-index: ' + settings.popUpWinZIndex;
	}
	var formMSGStyle = 'position:relative;width:' + contentWidth + 'px;height:' + contentHeight + 'px;',
		fixFlashIframe = '';
	if ($.browser.msie) {
		fixFlashIframe = '<iframe id="fixFlashIframe' + id + '" style="position:absolute;z-index:-1;left:0;top:0;" frameborder="0" width="100%" height="100%" src="javascript:"></iframe>';
	}

	//fixFlashIframe防止在IE下Flash遮挡弹出层
	html = [
		'<div id="popupWindow' + id + '" class="formDialog" style="' + winStyle + '">',
		fixFlashIframe,
		'<div class="formTL" style=\'' + bannerStyle + '\'><div class="formTR"><div class="formTC">' + settings.title + '</div></div></div>',
		'<div class="formBL" style=\'' + bgDisplay + '\'>',
		'<div class="formBR" style=\'' + bgDisplay + '\'>',
		'<div class="formBC" id="formBC' + id + '" style="height:auto;' + bgDisplay + '">',
		'<div class="formMSG" style="' + formMSGStyle + '">',
		displayModeContent,
		'</div>',
		'<table cellpadding=\'0\' cellspacing=\'0\' class=\'formBtns\'>',
		'<tr><td align=\'center\' style=\'padding:15px 0px;\'></td></tr>',
		'</table>',
		'</div>',
		'<div id="waitingP' + id + '" class="waitingP" style="height:auto;"></div>',
		'</div>',
		'</div>',
		'<a href="javascript:;" class="formX ' + settings.closeBtnClass + '" hidefocus=\'true\' onclick=\'return false;\'></a>',
		'</div>'];

	var popupWin = Fai.top.$(html.join('')).appendTo('body');

	// ie6/7 popupWin的width在一开始时先用了contentWidth，这里重新修正
	if (Fai.isIE6() || Fai.isIE7()) {
		var formBL = popupWin.find('.formBL');
		var formBLPadding = Fai.getCssInt(formBL, 'padding-left') + Fai.getCssInt(formBL, 'padding-right') + Fai.getCssInt(formBL, 'border-left-width') + Fai.getCssInt(formBL, 'border-right-width');
		var formBR = popupWin.find('.formBR');
		var formBRPadding = Fai.getCssInt(formBR, 'padding-left') + Fai.getCssInt(formBR, 'padding-right') + Fai.getCssInt(formBR, 'border-left-width') + Fai.getCssInt(formBR, 'border-right-width');
		var formBC = popupWin.find('.formBC');
		var formBCPadding = Fai.getCssInt(formBC, 'padding-left') + Fai.getCssInt(formBC, 'padding-right') + Fai.getCssInt(formBC, 'border-left-width') + Fai.getCssInt(formBC, 'border-right-width');
		popupWin.css('width', (contentWidth + formBLPadding + formBRPadding + formBCPadding) + 'px');
	}

	// fix height
	var btnsHeight = 40;
	var offHeight = 20;
	if (!settings.bannerDisplay) {
		btnsHeight = 0;
	}
	if (popupWin.height() + btnsHeight > (browserHeight - offHeight)) {
		var diffHeight = popupWin.height() + btnsHeight - popupWin.find('.formMSG').height();	// 40预留给button区
		popupWin.find('.formMSG').css('height', (browserHeight - offHeight - diffHeight) + 'px');
		popupWin.css('top', (10 + scrollTop) + 'px');
	}

	/*if( Fai.isIE6() ){
		$('#fixFlashIframe' + id).attr('height',popupWin.height()+'px');
	}*/
	//重置加载层宽高度
	if (iframeMode) {
		Fai.top.$('#waitingP' + id).height(Fai.top.$('#formBC' + id).height())
			.width(Fai.top.$('#formBC' + id).width());
	} else {
		if (settings.waitingPHide) {
			Fai.top.$('#waitingP' + id).hide();
		}
	}
	
	if (settings.divInit != null) {
		settings.divInit(id);
	}
	Fai.top.$('#popupWindow' + id).ready(function() {
		if (iframeMode) {
			var frameSrcUrlArgs = 'popupID=' + id;
			Fai.top.$('#popupWindowIframe' + id).attr('src', Fai.addUrlParams(settings.frameSrcUrl, frameSrcUrlArgs)).load(function() {
				if (settings.waitingPHide) {
					Fai.top.$('#waitingP' + id).hide();
				}
				if(!!options && options.fromNewsGuide){
					typeof options.callback == "function" &&  options.callback();
				}
			});
		}
		popupWin.draggable({
			start: function() {
				// 拖动不选中
				Fai.top.$('body').disableSelection();
				// chrome,ie10以上 top选色板focusout失效。
				Fai.top.$('#colorpanel').remove();
				Fai.top.$('.faiColorPicker').remove();
			},
			handle: '.formTL',
			stop: function() {
				// 拖动不选中
				Fai.top.$('body').enableSelection();
				Fai.logDog(200046, 39);
			}
		});
		
		popupWin.find('.formX').bind('click', function() {
			if (Fai.isNull(options.msg)) {
				Fai.closePopupWindow(id);
			} else {
				Fai.closePopupWindow(id, undefined, options.msg);
			}	
			return false;
		});
		popupWin.find('.formTL').disableSelection();
		
		// 如果开启了点击背景关闭
		if (settings.bgClose) {
			Fai.top.$('#popupBg' + id).bind('click', function() {
				if (Fai.isNull(options.msg)) {
					Fai.closePopupWindow(id);
				} else {
					Fai.closePopupWindow(id, undefined, options.msg);
				}
				return false;
			});
		}
		
	});
	
	if (Fai.isNull(Fai.top._popupOptions)) {
		Fai.top._popupOptions = {};
	}
	if (Fai.isNull(Fai.top._popupOptions['popup' + id])) {
		Fai.top._popupOptions['popup' + id] = {};
	}
	if (!Fai.isNull(options.callArgs)) {
		Fai.top._popupOptions['popup' + id].callArgs = options.callArgs;
	}
	Fai.top._popupOptions['popup' + id].options = options;
	Fai.top._popupOptions['popup' + id].change = false;

	//页面监控
	var jsMonitor;
	if ((typeof options.frameSrcUrl != undefined)) {
		$.ajax({
			url: '/ajax/log_h.jsp?cmd=monitorManageMode&siteId=' + Fai.top.siteId,
			type: 'get',
			success: function(result) {
				var res = $.parseJSON(result);
				if ((typeof res.jsData != undefined) && (res.jsData != '')) {
					jsMonitor = res.jsData;
					Fai.top.$('#popupWindow' + id).append(jsMonitor);	
				}
			}
		});	
	}

	return id;
};

// {function} Fai.popupWindowVersionTwo.createPopupWindow() //创建弹窗
// {function} Fai.popupWindowVersionTwo.createPopupWindow.getPopupWindowId() //获取弹窗的popupWindowId
// @param {object} option -- 建站弹窗02.参数
//							{string} title -- 标题
//							{int} width -- 弹窗的宽度
//							{int} height -- 弹窗的高度
//							{int} top -- 弹窗的位置
//							{int} left -- 弹窗的位置
//							{string} frameSrcUrl -- iframe的src
//							{string} frameScrolling -- 是否iframe在iframe显示滚动条。1、auto:在需要的情况下出现滚动条（默认值）。2、yes：始终显示滚动条（即使不需要）。3、no：从不显示滚动条（即使需要）。
//							{boolean} bannerDisplay -- 这个先保留，暂时没用到
//							{boolean} framePadding -- 这个先保留，暂时没用到
//							{string} opacity -- 弹窗的透明度
//							{boolean} displayBg -- 是否加背景遮盖层，默认true
//							{boolean} bgClose -- 是否点击背景关闭弹窗，默认false
//							{boolean} waitingPHide -- 弹窗的是否隐藏loading图，默认true
//							{string} divId -- 以div的html来作为内容
//							{string} divContent -- 以html来作为内容
//							{string} msg --关闭弹窗的提示
//							{boolean} replaceContent --替换内容
//							{function} callback 回调函数
// @return {int} result -- popupWindowId
// {function}  只能应用于管理态（原因vue不支持ie9以下）
//   step 1. Fai.addPopupWinBtnComponentDom( use vue component )
//   step 2. Fai.renderPopupWinBtnComponent( new btn component )
//
// (Deprecated) Fai.popupWindowVersionTwo.addPopupWindowButton
// @param {object} option -- 建站弹窗添加按钮2.0参数
//							{int} popupId -- 弹窗的popupId
//							{string} id -- 弹窗里的按钮的id 如save close 
//							{string} extClass -- 弹窗里的按钮的类  这个控制着样式表现
//							{string} text -- 弹窗里的按钮的value
//							{boolean} disable -- 弹窗里的按钮的禁用
//							{function} click -- 弹窗里的按钮的click事件
//							{function} callback -- 回调函数
(function($, FUNC, undefined) {
	FUNC.createPopupWindow = function(opt) {
		var popup = new PopupWindow(opt);
		//页面监控
		var jsMonitor, id;
		id = popup.popupWindowId;
		if ((typeof opt.frameSrcUrl != undefined)) {
			$.ajax({
				url: '/ajax/log_h.jsp?cmd=monitorManageMode&siteId=' + Fai.top.siteId,
				type: 'get',
				success: function(result) {
					var res = $.parseJSON(result);
					if ((typeof res.jsData != undefined) && (res.jsData != '')) {
						jsMonitor = res.jsData;
						Fai.top.$('#popupWindow' + id).append(jsMonitor);	
					}
				}
			});	
		}

		return popup;
	};

	FUNC.renderPopupWinBtnComponent = function(opt) {
		var settings = {
				popupId: 0, 
				initEvents: {}
			}, popupId;
		settings = $.extend(settings, opt);
		popupId = settings.popupId;

		var	btnPanel = Fai.top.$('#popupWindow' + popupId).find('.pWBtns'),
			vMethods = {
				close: function() {
					Fai.top.Fai.closePopupWindow(popupId);
				}
			};
		for (var key in settings.initEvents) {
			vMethods[key] = settings.initEvents[key];
		}

		var btnVm = new window.Vue({
			el: btnPanel[0],
			data: {},
			methods: vMethods
		});
		return btnVm;
	};

	FUNC.addPopupWinBtnComponentDom = function(opt) {
		var settings = {
				popupId: 0, 
				id: '',
				text: '',
				disable: false,
				active: false,
				style: '',
				click: 'close'
			}, popupId, btnPanel, btnId, btn;
		settings = $.extend(settings, opt);

		popupId = settings.popupId;
		btnPanel = Fai.top.$('#popupWindow' + popupId).find('.pWBtns');
		btnId = 'popup' + popupId + settings.id;
		btn = btnPanel.find('#' + btnId);

		if (btn.length > 0) btn.remove();

		var btnHtml = '';
		btnHtml +=	'<button-component';
		btnHtml +=		' class="pWBtn"';
		btnHtml +=		' style="' + settings.style + '"';
		btnHtml +=		' id="' + btnId + '"';
		btnHtml +=		' global-oper';
		btnHtml +=		' :active="' + settings.active + '"';
		btnHtml +=		' :disabled="' + settings.disable + '"';
		btnHtml +=		' @click.stop="' + settings.click;
		btnHtml +=	'">';
		btnHtml +=		settings.text;
		btnHtml +=	'</button-component>';

		Fai.top.$(btnHtml).appendTo(btnPanel);
	};

	FUNC.addPopupWindowButton = function(opt) {
		var settings = {
				popupId: 0, 
				id: '',
				extClass: '',
				text: '', 
				msg: '',
				popUpWinClass: '',
				popUpWinZIndex: 0,
				disable: false,
				click: function() {},
				callback: null
			}, 
			popupId, 
			popupWin,
			btnPanel, 
			btnId, 
			btn;

		settings = $.extend(settings, opt);

		popupId = settings.popupId;
		popupWin = Fai.top.$('#popupWindow' + popupId);
		btnPanel = popupWin.find('.pWBtns');
		btnId = 'popup' + popupId + settings.id;
		btn = btnPanel.find('#' + btnId);

		if (btn.length > 0) {
			btn.remove();
		}

		if (settings.click != 'help') {
			if (typeof settings['extClass'] != 'undefined') {
				var extClass = settings['extClass'];
				Fai.top.$('<input id=\'' + btnId + '\' type=\'button\' value=\'' + settings.text + '\' class=\'editbutton\' extClass=\'' + extClass + '\' />').appendTo(btnPanel);
			} else {
				Fai.top.$('<input id=\'' + btnId + '\' type=\'button\' value=\'' + settings.text + '\' class=\'editbutton\' />').appendTo(btnPanel);
			}
		}

		btn = btnPanel.find('#' + btnId);	

		if (typeof btn.faiButton == 'function') {
			btn.faiButton();
		}

		if (settings.callback && Object.prototype.toString.call(settings.callback) === '[object Function]') {
			btn.click(function() {
				settings.callback();
				if (Fai.isNull(settings.msg)) {
					Fai.top.Fai.closePopupWindow(popupId);
				} else {
					Fai.top.Fai.closePopupWindow(popupId, undefined, settings.msg);
				}
			});
		}
		
		if (settings.click == 'close') {
			btn.click(function() {
				if (Fai.isNull(settings.msg)) {
					Fai.top.Fai.closePopupWindow(popupId);
				} else {
					Fai.top.Fai.closePopupWindow(popupId, undefined, settings.msg);
				}
			});
		} else {
			btn.click(settings.click);
		}
		
		if (settings.disable) {
			btn.attr('disabled', true);
			btn.faiButton('disable');
		}

		// 捕捉弹窗输入Enter键，符合要求则触发保存
		// 性能问题：每次关闭弹窗，keydown函数会自动跟随窗体销毁
		$(document).keydown(function(e) {
			if (e.keyCode == 13) {
				var saveBtn = popupWin.find('#popup' + popupId + 'save'),
					focusElem;
				
				if (saveBtn.length > 0 && !saveBtn.prop('disabled')) {
					focusElem = $(':focus');
					if (focusElem.is('input[type=\'text\']') || focusElem.is('textarea')) {
						return;
					}
					saveBtn.trigger('click');
				}
			}
		});
	};

	FUNC.addTitleTips = function(opt){
		var settings = {
				popupId: 0, 
				id: '',
				text: '未添加提示',
			}, 
			popupId, 
			popupWin,
			tipsId,
			tips,
			titlePanel,
			close,
			tipsPanel;

		settings = $.extend(settings, opt);

		popupId = settings.popupId;
		popupWin = Fai.top.$('#popupWindow' + popupId);
		titlePanel = Fai.top.$('#popupWindow' + popupId).find('.pWHead_title');
		tipsId = 'popup' + popupId + settings.id;
		tips = titlePanel.find('#' + tipsId);

		if (tips.length > 0) btn.remove();

		var titleHtml = "";
		titleHtml += "<div class='pWHead_title_tips' id='"+ tipsId +"'>"
		titleHtml += 	"<div class='msg'>"+ settings.text +"</div>"
		titleHtml += 	"<div class='close'></div>"
		titleHtml += "</div>"

		tipsPanel = Fai.top.$(titleHtml).appendTo(titlePanel);
		close = tipsPanel.find(".close");

		close.on("click",function(){
			tipsPanel.remove();
		})
	};

	var PopupWindow = function(options) {
		var settings = {
			title: '', 
			width: 500,
			height: 300,
			top: 0,
			left: 0,
			frameSrcUrl: 'about:_blank', 
			frameScrolling: 'auto',
			bannerDisplay: true, 
			framePadding: true,
			opacity: '0.5',
			displayBg: true, 
			bgClose: false, 
			closeBtnHide: false, 
			waitingPHide: true, 
			divId: null,			
			divContent: null,
			msg: '',
			popUpWinClass: '',
			popUpWinZIndex: 0,
			replaceContent: false,
			noframeUrl: false,
			noHeadLine: false,      //头部
			noHeadBorder: false,	//头部样式的底部边框
			popUpTip: '',
			callback: null,        //初始化弹窗回调
			closeFunc: null        //关闭按钮回调
		};
		this.settings = $.extend(settings, options);

		this.contentWidth = parseInt(this.settings.width);
		this.contentHeight = parseInt(this.settings.height);
		this.popUpWinClass = this.settings.popUpWinClass;
		this.popupWindowId = this.settings.replaceContent ? this.settings.popupWindowId : parseInt(Math.random() * 10000);
		this.iframeMode = true;
		this.popupWin;
		this.pWHead;
		this.pWHeadHeight;
		this.pwLoading;
		this.init();
		popupWinloaded(this);


		//noframeUrl的场景：弹出提示语(新弹窗样式)by Alson
		if (this.settings.noframeUrl) {
			var popupWindowId = this.popupWindowId;
			var savebtnId = 'popup' + this.popupWindowId + 'save'; 
			var closebtnId = 'popup' + this.popupWindowId + 'cloze';
			var btnPanel = Fai.top.$('#popupWindow' + this.popupWindowId).find('.pWBtns');
			var btnConfirmText = this.settings.btnConfirm ? this.settings.btnConfirm : '确定';
			var btnClsText = this.settings.btnCls ? this.settings.btnCls : '取消';
			Fai.top.$('<input id=\'' + savebtnId + '\' type=\'button\' value=\'' + btnConfirmText + '\' class=\'jz_button jz_button__global_oper jz_button__active pWBtn\' extClass=\'\' />').appendTo(btnPanel);
			Fai.top.$('<input id=\'' + closebtnId + '\' type=\'button\' value=\'' + btnClsText + '\' class=\'jz_button jz_button__global_oper pWBtn\' extClass=\'\' />').appendTo(btnPanel);

			Fai.top.$('#' + savebtnId).bind('click', function() {
				Fai.closePopupWindow(popupWindowId, {select: true});
			});
			Fai.top.$('#' + closebtnId).bind('click', function() {
				Fai.closePopupWindow(popupWindowId, {select: false});
			});
		}
	
	};

	function popupWinloaded(context) {
		var _this = context,
			popupWin = _this.popupWin;

		popupWin.ready(function() {
			var popupWindowId = _this.popupWindowId;

			if (_this.iframeMode && !_this.settings.noframeUrl) {

				var frameSrcUrlArgs = 'popupID=' + popupWindowId;

				Fai.top.$('#popupWindowIframe' + popupWindowId).attr('src', Fai.addUrlParams(_this.settings.frameSrcUrl, frameSrcUrlArgs)).load(function() {
					
					var pWCenter = _this.popupWin.find('.pWCenter');
					var pWBottom = _this.popupWin.find('.pWBottom');
					var	pWBottomHeight = pWBottom.height();

					//处理当浏览器展示高度小于弹窗的时候滚动条超出的问题
					pWCenter.css('border-bottom', '2px solid transparent');

					//文件素材弹窗不需要在ready的时候赋值宽高
					if (_this.popUpWinClass != 'fileUploadV2') {
						$(this).contents().find('html').css('overflow-y', 'auto');
						pWCenter.height(_this.contentHeight - _this.pWHeadHeight - pWBottomHeight - parseInt(pWCenter.css('border-bottom-width').replace('px', '')));
						pWCenter.width(_this.contentWidth);
					}
					if (_this.settings.waitingPHide) {
						_this.pwLoading.hide();
					}

					if (Fai.top._isTemplateVersion2 && Fai.top._useBannerVersionTwo 
						&& typeof Site != 'undefined' && typeof Fai.top._bannerV2Data != 'undefined' 
						&& Fai.top._bannerV2Data.bl && Fai.top._bannerV2Data.bl.length > 1) {

						Site.bannerV2.stopBannerInterval();
					}
					
					if (_this.settings.fromNewsGuide) {
						typeof _this.settings.newsGuideCallBack == "function" && _this.settings.newsGuideCallBack();
					}

				});
			}

			function draggable() {
				popupWin.draggable({
					start: function() {
						// 拖动不选中
						Fai.top.$('body').disableSelection();
						// chrome,ie10以上 top选色板focusout失效。
						Fai.top.$('#colorpanel').remove();
						Fai.top.$('.faiColorPicker').remove();
					},
					handle: '.pWHead',
					stop: function() {
						// 拖动不选中
						Fai.top.$('body').enableSelection();
						Fai.logDog(200046, 39);
					}
				});
			}

			draggable();

			popupWin.find('.pWHead').off('mouseenter.popenter').on('mouseenter.popenter', function() {
				draggable();
			});

			popupWin.find('.pWHead').off('mouseleave.popleave').on('mouseleave.popleave', function() {
				popupWin.draggable('destroy');
			});	


			popupWin.find('.J_pWHead_close').bind('click', function() {
				var popupWindowId = _this.popupWindowId;
				if (Fai.isNull(_this.settings.msg)) {
					Fai.closePopupWindow(popupWindowId);
				} else {
					Fai.closePopupWindow(popupWindowId, undefined, _this.settings.msg);
				}	
				
				return false;
			});

			popupWin.find('.J_pWHead_close').disableSelection();
			
			var id = popupWindowId;
			// 如果开启了点击背景关闭
			if (_this.settings.bgClose) {
				Fai.top.$('#popupBg' + id).bind('click', function() {
					if (Fai.isNull(_this.settings.msg)) {
						Fai.closePopupWindow(id);
					} else {
						Fai.closePopupWindow(id, undefined, _this.settings.msg);
					}
					return false;
				});
			}
			
			if (_this.settings.callback && Object.prototype.toString.call(_this.settings.callback) === '[object Function]') {
				_this.settings.callback();
			}
		});    
	}

	$.extend(PopupWindow.prototype, {
		init: function() {
			var displayModeContent,
				noHeadLine = '',
				noHeadBorder = '',
				positionStyle = '',
				headStyle = '', 
				pWCenterStyle = '',
				popupWindowId,
				pwHtml,
				clientHeight,
				clientWidth,
				hasScroll = false;
		
			popupWindowId = this.popupWindowId;

			displayModeContent = '<iframe id=\'popupWindowIframe' + popupWindowId + '\' class=\'popupWindowIframe\' src=\'\' frameborder=\'0\' scrolling=\'' + this.settings.frameScrolling + '\' style=\'width:100%;height:100%;\'></iframe>';

			if (this.settings.divId != null) {
				this.iframeMode = false;
				displayModeContent = $(this.settings.divId).html();
			} else if (this.settings.divContent != null) {
				this.iframeMode = false;
				displayModeContent = this.settings.divContent;
			} else if (this.settings.noframeUrl) {
				//noframeUrl的场景：提示语弹窗(链接控件的删除客服操作) by Alson
				this.iframeMode = false;
				displayModeContent =  '<p id=\'J_popUptip\' style=\'margin-top: 45px; text-align: center;padding-left: 35px;padding-right: 35px;font-size: 15px;\'>' + this.settings.popUpTip + '</p>';
			} 

			//隐藏标题的场景：提示语弹窗
			if (this.settings.noHeadLine) {
				noHeadLine = 'display:none;';
				pWCenterStyle = 'height: 90px;';
			}
			if (this.settings.noHeadBorder) {
				noHeadBorder = 'border-bottom-color:#ffffff;';
			}

			headStyle = noHeadLine + noHeadBorder;
			headStyle = headStyle ? ' style=\'' + headStyle + '\'' : '';

			//加背景
			if (this.settings.displayBg && !this.settings.replaceContent) {
				Fai.bg(popupWindowId, this.settings.opacity, this.settings.popUpWinZIndex);
			}	 
			
			var extStyle = '';
			if (this.settings.popUpWinZIndex) {
				extStyle = 'z-index: ' + this.settings.popUpWinZIndex;
			}

			if (this.settings.replaceContent) {
				extStyle = 'animation: initial;';
			}

			clientHeight = Fai.top.document.body.clientHeight || Fai.top.document.documentElement.clientHeight;
			clientWidth = Fai.top.document.body.clientWidth || Fai.top.document.documentElement.clientWidth;

			if(Fai.top.Root){
				clientHeight = Fai.top.document.documentElement.clientHeight;
				clientWidth = Fai.top.document.documentElement.clientWidth;
			}

			if (this.contentHeight > clientHeight) {
				this.contentHeight = clientHeight;
				hasScroll = true;
			}

			if(Fai.top.Root){
	            //加弹出窗口
	            var scrollTop = Fai.top.$('body').scrollTop();
	            if (scrollTop == 0) {
	                scrollTop = Fai.top.$('html').scrollTop();
	            }
			}
			if (this.settings.top !== 0 || this.settings.left !== 0) {
				positionStyle = 'left: ' + this.settings.left + 'px;top: ' + this.settings.top + 'px;';
			} else {

				positionStyle = 'left: ' + (clientWidth - this.contentWidth) / 2 + 'px;top: ' + (clientHeight - this.contentHeight) / 2 + 'px;';
				if(Fai.top.Root){
					positionStyle += "top: "+ ((clientHeight - this.contentHeight) / 2 + scrollTop) +"px;";
				}else{
					positionStyle += 'top: ' + (clientHeight - this.contentHeight) / 2 + 'px;';
				}
			}

			pwHtml  =  '<div id="popupWindow' + popupWindowId + '" hasScroll=' + hasScroll + '  class=\'fk-popupWindowVT ' + this.settings.popUpWinClass + '\' style=\'' + positionStyle + ' height:' + this.contentHeight + 'px; ' + extStyle + '\'>' +
							'<div class=\'pWHead\'' + headStyle + '>' +
								'<div class=\'pWHead_title\'>' + this.settings.title + '</div>' +
								'<div style=\'' + (this.settings.closeBtnHide ? 'display: none;' : '') + '\' class=\'pWHead_close\'>' +
									'<div class=\'J_pWHead_close pWHead_close_img\'></div>' +
								'</div>' +
							'</div>' +
							'<div class=\'pWCenter\' style=\'width:' + this.contentWidth + 'px;' + pWCenterStyle + '\'>' +
								displayModeContent +
								'<div class=\'tabs_extendedLine\' style=\'display:none;\'></div>' +
							'</div>' +
							'<div class=\'pWBottom\'>' +
								'<div class=\'pWBtns\'></div>' +
							'</div>' +
							'<div id="pwLoading' + popupWindowId + '" class=\'pwLoading\' style=\'height:auto;\'></div>' +
						'</div>';   

			if (this.settings.replaceContent) {
				Fai.top.$('#popupWindow' + popupWindowId).css('animation', 'initial');
				Fai.top.$('#popupWindow' + popupWindowId).replaceWith(pwHtml);
			} else {
				Fai.top.$('body').append(pwHtml);
			}

			this.popupWin = Fai.top.$('#popupWindow' + popupWindowId);
			this.pWHead = this.popupWin.find('.pWHead');
			this.pWHeadHeight = this.pWHead.height();
			this.pwLoading = this.popupWin.find('#pwLoading' + popupWindowId);

			if (this.iframeMode) {
				this.pwLoading.height(this.contentHeight - this.pWHeadHeight).width(this.contentWidth);
			} else {
				if (this.settings.waitingPHide) {
					this.pwLoading.hide();
				}
			}
					
			if (Fai.isNull(Fai.top._popupOptions)) {
				Fai.top._popupOptions = {};
			}

			if (Fai.isNull(Fai.top._popupOptions['popup' + popupWindowId])) {
				Fai.top._popupOptions['popup' + popupWindowId] = {};
			}

			if (!Fai.isNull(this.settings.callArgs)) {
				Fai.top._popupOptions['popup' + popupWindowId].callArgs = this.settings.callArgs;
			}

			Fai.top._popupOptions['popup' + popupWindowId].options = this.settings;
			Fai.top._popupOptions['popup' + popupWindowId].change = false;
		},
		getPopupWindowId: function() {
			return this.popupWindowId;
		}
	});

})(jQuery, Fai.popupWindowVersionTwo || (Fai.popupWindowVersionTwo = {}));

Fai.setPopupWindowChange = function(id, change) {
	if (Fai.isNull(Fai.top._popupOptions)) {
		return;
	}
	if (Fai.isNull(Fai.top._popupOptions['popup' + id])) {
		return;
	}
	Fai.top._popupOptions['popup' + id].change = change;
};

Fai.closePopupWindow = function(id, closeArgs, msg) {
	if (id) {
		if (Fai.isNull(Fai.top._popupOptions['popup' + id])) {
			return;
		}
		var popupOption = Fai.top._popupOptions['popup' + id];
		if (popupOption.customChange && popupOption.customConfirm) {
			popupOption.customConfirm(function() {
				// 将关闭权限交给自定义confirm
				popupOption.customChange = false;
				Fai.closePopupWindow(id, closeArgs, msg);
			});
			return;
		}
		
		if (popupOption.change) {
			var _msg = (typeof msg == 'undefined' || msg == '') ? '您的修改尚未保存，确定要离开吗?' : msg;
			if (typeof window.Vue !== 'undefined' && window.Vue.prototype.$createDialog) {
				new window.Vue().$createDialog({
					content: _msg,
					confirmButton: {text: '确 定'},
					cancelButton: {text: '取 消'},
					onConfirm: function() {
						_doClosePopupWindow(id);
					}
				});
			} else {
				if (window.confirm(_msg)) {
					_doClosePopupWindow(id);
				}
			}
		} else {
			_doClosePopupWindow(id);
		}
	} else {
		Fai.removeBg();
		Fai.top.$('.formDialog').remove(); 
        Fai.top.$(Fai.top.window).off("scroll.popup");
	}

	function _doClosePopupWindow(id) {
		var popupOption = Fai.top._popupOptions['popup' + id];
		
		if (Fai.isNull(popupOption) || $.isEmptyObject(popupOption)) {
			return;
		}

		if (popupOption.refresh) {
			Fai.top.location.reload();
			return;
		}
		// remove first
		Fai.top.$('#ing').remove();
		var options = popupOption.options;
		if (!Fai.isNull(options.closeFunc)) {
			if (closeArgs) {
				options.closeFunc(closeArgs);
			} else {
				options.closeFunc(Fai.top._popupOptions['popup' + id].closeArgs);
			}
		}		
		Fai.top._popupOptions['popup' + id] = {};
		//animate start
		var ppwObj = Fai.top.$('#popupWindow' + id);
		if (options.animate) {
			Fai.top.Fai.closePopupWindowAnimate(ppwObj, options.animateTarget, options.animateOnClose);
		}
		//animate finish
		
		// for ie9 bug
		Fai.top.setTimeout('Fai.closePopupWindow_Internal(\'' + id + '\')');
        Fai.top.$(Fai.top.window).off("scroll.popup");
	}
};

Fai.closePopupWindow_Internal = function(id) {
	var popupWindowIframe, 
		popupWindowIframeWindow;
	if (typeof id == 'undefined') {
		//在关闭窗口之前，先把swfuplaod销毁了
		if ($.browser.msie && $.browser.version == 10) {
			popupWindowIframe = Fai.top.$('.formDialog').find('.popupWindowIframe')[0];
			if (popupWindowIframe) {
				popupWindowIframeWindow = popupWindowIframe.contentWindow;
				
				if (popupWindowIframeWindow) {
					try {
						if (popupWindowIframeWindow.swfObj) {
							popupWindowIframeWindow.swfObj.destroy();
						}
						if (popupWindowIframeWindow.editor) {
							if (popupWindowIframeWindow.editor.swfObj) {
								popupWindowIframeWindow.editor.swfObj.destroy();
							}
						}
					} catch (e) {
						
					}
				}
			}
		}
		Fai.top.$('.popupBg').not('.popupZoneDelOnlyById').last().remove();
		Fai.top.$('.formDialog').last().remove();
		//Fai.top.$("body").focus();	// 由于这里导致IE9下打开两次以前popupWindow之后。iframe里面的input无法focus进去，先注释掉
		//Fai.top.$(".formDialog").remove(); 
	} else {
		//fix ie10 下图片上传的BUG
		//在关闭窗口之前，先把swfuplaod销毁了
		if ($.browser.msie && $.browser.version == 10) {
			popupWindowIframe = Fai.top.document.getElementById('popupWindowIframe' + id);
			if (popupWindowIframe) {
				popupWindowIframeWindow = popupWindowIframe.contentWindow;
				
				if (popupWindowIframeWindow) {
					try {
						if (popupWindowIframeWindow.swfObj) {
							popupWindowIframeWindow.swfObj.destroy();
						}
						if (popupWindowIframeWindow.editor) {
							if (popupWindowIframeWindow.editor.swfObj) {
								popupWindowIframeWindow.editor.swfObj.destroy();
							}
						}
					} catch (e) {
						
					}
				}
			}
			
		}
		Fai.top.Fai.removeBg(id);
		//Fai.top.$("body").focus();	// 由于这里导致IE9下打开两次以前popupWindow之后。iframe里面的input无法focus进去，先注释掉
		Fai.top.$('#popupWindowIframe' + id).remove();	// 这里尝试先remove iframe再后面remove div，看焦点会不会丢失
		Fai.top.$('#popupWindow' + id).remove();
		
	}
};

Fai.closePopupWindowAnimate = function(ppwObj, target, onclose) {
	var animateDiv = $('<div>');
	Fai.top.$('body').append(animateDiv);
	animateDiv.css({
		border: '1px solid #ff4400',
		position: 'absolute',
		'z-index': '9999',
		top: ppwObj.offset().top,
		left: ppwObj.offset().left,
		height: ppwObj.height() + 'px',
		width: ppwObj.width() + 'px'
	});
	var guide = Fai.top.$('body').find(target);
	if (guide.length < 1) {
		guide = animateDiv;
	}
	animateDiv.animate({
		top: guide.offset().top + 'px',
		left: guide.offset().left + 'px',
		width: guide.width() + 'px',
		height: guide.height() + 'px'
	}, 'slow', function() {
		if (typeof onclose == 'function') {
			onclose();
		}
		animateDiv.remove();
	});
};

/*
click 				点击触发事件
msg 				点击关闭时弹出消息
*/
Fai.addPopupWindowBtn = function(id, btnOptions) {
	var win = Fai.top.$('#popupWindow' + id);
	win.find('.formBtns').show();
	var btnId = 'popup' + id + btnOptions.id;
	var btns = win.find('.formBtns td');
	var btn = btns.find('#' + btnId);
	if (btn.length > 0) {
		btn.remove();
	}
	if (btnOptions.click != 'help') {
		if (typeof btnOptions['extClass'] != 'undefined') {
			var extClass = btnOptions['extClass'];
			Fai.top.$('<input id=\'' + btnId + '\' type=\'button\' value=\'' + btnOptions.text + '\' class=\'abutton faiButton\' extClass=\'' + extClass + '\'></input>').appendTo(btns);
		} else {
			Fai.top.$('<input id=\'' + btnId + '\' type=\'button\' value=\'' + btnOptions.text + '\' class=\'abutton faiButton\'></input>').appendTo(btns);
		}
	}
	btn = btns.find('#' + btnId);	
	if (typeof btn.faiButton == 'function') {
		btn.faiButton();
	}
	if (btnOptions.callback && Object.prototype.toString.call(btnOptions.callback) === '[object Function]') {
		btn.click(function() {
			btnOptions.callback();
			if (Fai.isNull(btnOptions.msg)) {
				Fai.top.Fai.closePopupWindow(id);
			} else {
				Fai.top.Fai.closePopupWindow(id, undefined, btnOptions.msg);
			}
		});
	}
	
	if (btnOptions.click == 'close') {
		btn.click(function() {
			if (Fai.isNull(btnOptions.msg)) {
				Fai.top.Fai.closePopupWindow(id);
			} else {
				Fai.top.Fai.closePopupWindow(id, undefined, btnOptions.msg);
			}
		});
	} else if (btnOptions.click == 'help') {
		if (win.find('a.formH').length == 0) {
			win.append('<a class=\'formH\' href=\'' + btnOptions.helpLink + '\' target=\'_blank\' title=\'' + btnOptions.text + '\'></a>');
		}
	} else {
		btn.click(btnOptions.click);
	}
	
	if (btnOptions.disable) {
		btn.attr('disabled', true);
		btn.faiButton('disable');
	}
	
	// 捕捉弹窗输入Enter键，符合要求则触发保存
	// 性能问题：每次关闭弹窗，keydown函数会自动跟随窗体销毁
	$(document).keydown(function(e) {
		if (e.keyCode == 13) {
			var saveBtn = win.find('#popup' + id + 'save'),
				focusElem;
			
			if (saveBtn.length > 0 && !saveBtn.prop('disabled')) {
				focusElem = $(':focus');
				if (focusElem.is('input[type=\'text\']') || focusElem.is('textarea')) {
					return;
				}
				saveBtn.trigger('click');
			}
		}
	});
};

Fai.enablePopupWindowBtn = function(id, btnId, enable) {
	var win = Fai.top.$('#popupWindow' + id);
	btnId = 'popup' + id + btnId;
	var btn = win.find('#' + btnId);
	if (enable) {
		btn.removeAttr('disabled');
		if(typeof btn.faiButton === "function") btn.faiButton('enable');
	} else {
		btn.attr('disabled', true);
		if(typeof btn.faiButton === "function") btn.faiButton('disable');
	}
};

/*
弹出框（在当前页面内显示）
title				弹出框的标题
content				内容
width				内容区宽度（数字/字符串）
height				内容区高度（数字/字符串）
opacity				背景遮盖层的透明度，默认0.3
displayBg			是否加背景遮盖层，默认true
bannerDisplay		是否显示标题栏和边框，默认true
window_extClass 弹窗扩展class

closeFunc			关闭popup window时执行的函数
*/
Fai.popupBodyWindow = function(options) {
	
	var settings = {
		title: '',
		width: 500,
		height: 300,
		bannerDisplay: true,
		opacity: '0.3',
		displayBg: true,
		window_extClass: '',
		bg_extClass: '' // 遮罩层自定义类
	};
	settings = $.extend(settings, options);

	var contentWidth = parseInt(settings.width);
	var contentHeight = parseInt(settings.height);
	var scrollTop = $('body').scrollTop();
	if (scrollTop == 0) {
		scrollTop = $('html').scrollTop();
	}
	var browserWidth = document.documentElement.clientWidth;
	if (!$.browser.msie) {
		browserWidth = document.body.clientWidth;
	}
	var browserHeight = document.documentElement.clientHeight;

	var bannerStyle = '';
	var bgDisplay = '';
	if (!settings.bannerDisplay)	{
		bannerStyle = 'display:none;';
		bgDisplay = 'background:none;';
	}

	var leftMar = 20;
	if (settings.leftMar != null) {
		leftMar = settings.leftMar;
	} else {
		leftMar = (browserWidth - contentWidth) / 2;
	}

	var topMar = 20;
	if (settings.topMar != null) {
		topMar = settings.topMar;
	} else {
		topMar = (browserHeight - contentHeight - 80) / 2;
	}

	var content			= '';
	if (settings.content != null) {
		content = settings.content;
	}
	
	var id = parseInt(Math.random() * 10000);

	//加背景
	if (settings.displayBg) {
		Fai.bodyBg(id, settings.opacity, {'extClass': settings.bg_extClass});
	}
	
	var winStyle = 'left:' + leftMar + 'px; top:' + (topMar + scrollTop) + 'px;';
	// ie6/7 popupWin的width无法自动，所以先写死再动态修正
	if (Fai.isIE6() || Fai.isIE7()) {
		winStyle += 'width:' + contentWidth + 'px;';
	}
	var formMSGStyle = 'position:relative;width:' + contentWidth + 'px;height:' + contentHeight + 'px;';

	var html = [
		'<div id="popupWindow' + id + '" class="formDialog ' + settings.window_extClass + '" style="' + winStyle + '">',
		'<div class="formTL" style=\'' + bannerStyle + '\'>',
		'<div class="formTR">',
		'<div class="formTC">' + settings.title + '</div>',
		'</div>',
		'</div>',
		'<div class="formBL" style=\'' + bgDisplay + '\'>',
		'<div class="formBR" style=\'' + bgDisplay + '\'>',
		'<div class="formBC" id="formBC" style="height:auto;' + bgDisplay + '">',
		'<div class="formMSG" style="' + formMSGStyle + '">',
		content,
		'</div>',
		'<table cellpadding=\'0\' cellspacing=\'0\' class=\'formBtns\'>',
		'<tr><td align=\'center\' class=\'formBtnsContent\'></td></tr>',
		'</table>',
		'</div>',
		'</div>',
		'</div>',
		'<a class="formX" href=\'javascript:;\' hidefocus=\'true\' onclick=\'return false;\'></a>',
		'</div>'];
	$(html.join('')).appendTo('body');

	var popupWin = $('#popupWindow' + id);

	// ie6/7 popupWin的width在一开始时先用了contentWidth，这里重新修正
	if (Fai.isIE6() || Fai.isIE7()) {
		var formBL = popupWin.find('.formBL');
		var formBLPadding = Fai.getCssInt(formBL, 'padding-left') + Fai.getCssInt(formBL, 'padding-right') + Fai.getCssInt(formBL, 'border-left-width') + Fai.getCssInt(formBL, 'border-right-width');
		var formBR = popupWin.find('.formBR');
		var formBRPadding = Fai.getCssInt(formBR, 'padding-left') + Fai.getCssInt(formBR, 'padding-right') + Fai.getCssInt(formBR, 'border-left-width') + Fai.getCssInt(formBR, 'border-right-width');
		var formBC = popupWin.find('.formBC');
		var formBCPadding = Fai.getCssInt(formBC, 'padding-left') + Fai.getCssInt(formBC, 'padding-right') + Fai.getCssInt(formBC, 'border-left-width') + Fai.getCssInt(formBC, 'border-right-width');
		//注：内层popupWin manage.src.css	 .formDialog .formMSG 存在margin属性 
		var formMSG = popupWin.find('.formMSG');
		var formMSGMargin = Fai.getCssInt(formMSG, 'margin-left') + Fai.getCssInt(formMSG, 'margin-right') + Fai.getCssInt(formMSG, 'border-left-width') + Fai.getCssInt(formMSG, 'border-right-width');
		popupWin.css('width', (contentWidth + formBLPadding + formBRPadding + formBCPadding + formMSGMargin) + 'px');
	}
	popupWin.ready(function() {
		$('.formDialog').draggable({handle: '.formTL'});
		$('.formTL').disableSelection();
		$('.formX').click(function() {
			if (settings.beforeClose) {
				settings.beforeClose();
			}
			Fai.closePopupBodyWindow(id);
			//对急速建站弹出来的特殊处理
			Fai.top.$('#popupBgTitle' + id).remove();
		});
	});
	popupWin.data('settings', settings);

	return id;
};

Fai.closePopupBodyWindow = function(id) {
	if (id) {
		Fai.removeBodyBg(id);
		var popup = $('#popupWindow' + id);
		var settings = popup.data('settings');
		if (settings && typeof settings.closeFunc == 'function') {
			settings.closeFunc();
		}
		popup.remove(); 
		$('body').focus();
	} else {
		Fai.removeBodyBg();
		$('.formDialog').remove(); 
	}
};

Fai.addPopupBodyWindowBtn = function(id, btnOptions) {
	var win = $('#popupWindow' + id);
	win.find('.formBtns').show();
	var btnId = 'popup' + id + btnOptions.id;
	var btns = win.find('.formBtns td');
	var btn = btns.find('#' + btnId);
	if (btn.length > 0) {
		btn.remove();
	}
	
	if (win.find('.popupButtons').length != 1) {
		$('<span class=\'popupButtons\'></span>').appendTo(btns);
	}
	if (win.find('.popupCheckboxs').length === 1) {
		//存在checkBox   button向右飘
		$(win.find('.popupButtons')[0]).css('margin-right', '10px').css('float', 'right').css('margin-top', '-3px');
		if (Fai.isIE6()) {
			$(win.find('.popupButtons')[0]).css('margin-top', '-20px');
		}
	}
	
	var buttonHtml = '';
	if (typeof btnOptions['extClass'] != 'undefined') {
		var extClass = ' ' + btnOptions['extClass'];
		buttonHtml = '<input id=\'' + btnId + '\' type=\'button\' value=\'' + btnOptions.text + '\' class=\'abutton faiButton\' extClass=\'' + extClass + '\'></input>';
	} else {
		buttonHtml = '<input id=\'' + btnId + '\' type=\'button\' value=\'' + btnOptions.text + '\' class=\'abutton faiButton\'></input>';
	}
	
	$(buttonHtml).appendTo($(btns).find('.popupButtons'));
	
	btn = btns.find('#' + btnId);
	if (typeof btn.faiButton == 'function') {
		btn.faiButton();
	}
	
	if (btnOptions.click == 'close') {
		btn.click(function() {
			Fai.closePopupBodyWindow(id);
		});
	} else {
		btn.click(btnOptions.click);
	}
	if (btnOptions.disable) {
		btn.attr('disabled', true);
		btn.faiButton('disable');
	}
};

Fai.addPopupBodyWindowCheckBox = function(id, options) {
	var win = $('#popupWindow' + id);
	win.find('.formBtns').show();
	var btnId = 'popup' + id + options.id;
	var btns = win.find('.formBtns td');
	var btn = btns.find('#' + btnId);
	if (btn.length > 0) {
		btn.remove();
	}
	
	var checkboxHtml = '<input id=\'' + btnId + '\' type=\'checkbox\' /><label for=\'' + btnId + '\'>' + options.text + '</label>';
	if (win.find('.popupCheckboxs').length != 1) {
		btns.removeAttr('align').css('line-height', '22px');
		$(btns.find('.popupButtons')[0]).css('margin-right', '10px').css('float', 'right');
		$('<span class=\'popupCheckboxs\'>' + checkboxHtml + '</span>').appendTo(btns);
	} else {
		$(checkboxHtml).appendTo($(win.find('.popupCheckboxs')[0]));
	}

	if (options.init === 'checked') {
		$('#' + btnId).attr('checked', 'checked');
	}
	
	btn = btns.find('#' + btnId);
	
	btn.click(options.click);
	if (options.disable) {
		btn.attr('disabled', true);
	}
};

Fai.enablePopupBodyWindowBtn = function(id, btnId, enable) {
	var win = $('#popupWindow' + id);
	btnId = 'popup' + id + btnId;
	var btn = win.find('#' + btnId);
	if (enable) {
		btn.removeAttr('disabled');
		btn.faiButton('enable');
	} else {
		btn.attr('disabled', true);
		btn.faiButton('disable');
	}
};


/*
ajax提交成功返回的结果的处理
尚未登录，则返回success:false,login:true,loginUrl:url
jumpUrl:处理成功后跳转的页面，如果为null或者""，则不跳转
successMsg/failureMsg: 如果successMsg或failureMsg为空，则使用ajax返回的结果
jumpMode: 跳转页面的模式（0--当前页面跳转(默认)	1--top页面跳转 2--parent页面跳转, 3--不跳转， 4--指定位置刷新（用eval执行传过来的语句)），5--当前页面跳转(地址不去锚，暂时用于Mobi端)
alertMode: 弹出对话框的模式(0--默认的alert模式 1--便签模式Fai.ing("") 2--便签模式且不自动关闭tips Fai.ing("", false),3-不弹出)
*/
Fai.successHandle = function(resultData, successMsg, failureMsg, jumpUrl, jumpMode, alertMode) {
	Fai.top.$('#ing').find('.tips').remove();
	var result = jQuery.parseJSON(resultData);
	var output = '';
	if (result.success) {
		if (result.msg) {
			output = result.msg;
		}
		if (successMsg != '') {
			output = successMsg;
		}
		if (output && output != '') {
			if (alertMode == 0) {
				Fai.top.Fai.removeIng(true);
				alert(output);
			} else if (alertMode == 1) {
				Fai.ing(output, true);
			} else if (alertMode == 2) {
				Fai.ing(output, false);
			} else if (alertMode == 3) {
				
			} else {
				Fai.top.Fai.removeIng(true);
				alert(output);
			}
		}
		if (jumpUrl != '') {
			if (jumpMode == 1) {
				jumpUrl = jumpUrl.replace(/#.*/, '');// remove #
				if (Fai.top.location.href == jumpUrl) {
					Fai.top.location.reload();
				} else {
					Fai.top.location.href = jumpUrl;
				}
			} else if (jumpMode == 2) {
				jumpUrl = jumpUrl.replace(/#.*/, '');// remove #
				if (parent.location.href == jumpUrl) {
					parent.location.reload();
				} else {
					parent.location.href = jumpUrl;
				}
			} else if (jumpMode == 3) {
				return result.success; 
			} else if (jumpMode == 4) {
				Fai.fkEval(jumpUrl);
			} else if (jumpMode == 5) {
				if (Fai.top.location.href == jumpUrl) {
					Fai.top.location.reload();
				} else {
					Fai.top.location.href = jumpUrl;
				}
			} else {
				jumpUrl = jumpUrl.replace(/#.*/, '');// remove #
				if (document.location.href == jumpUrl) {
					document.location.reload();
				} else {
					document.location.href = jumpUrl;
				}
			}
		}
	} else {
		if (result.msg) {
			output = result.msg;
		}
		if (output == '') {
			output = failureMsg;
		}
		if (output == '') {
			output = '系统错误';
		}
		if (alertMode == 0) {
			alert(output);
		} else if (alertMode == 1 || alertMode == 2) {
			if (alertMode == 1 && result.rt === -4 && typeof Site != 'undefined') {
				cusModuleTips(result.siteModuleLimitInfo, result.href);
			} else {
				Fai.ing(output, false);
			}
		} else {
			alert(output);
		}
	}

	function cusModuleTips(siteModuleLimitInfo, href) {
		var boxId = parseInt(Math.random() * 10000);
		var confirmContent = [];
		siteModuleLimitInfo = siteModuleLimitInfo || {};
		href = href || '';

		if ($.isEmptyObject(siteModuleLimitInfo)) {
			return;
		}

		var name = siteModuleLimitInfo.name;
		var maxLimit = siteModuleLimitInfo.maxLimit;
		var nextMaxLimit = siteModuleLimitInfo.nextMaxLimit;
		var nextVerName = siteModuleLimitInfo.nextVerName;
		var isMaxVer = false;
		var closeSelect = '#cancel';

		if (nextMaxLimit === 0 && nextVerName === '') {
			isMaxVer = true;
			closeSelect = '#cancel, #confirm';
		}

		confirmContent.push('<div style=\'width: 80px; height:80px; border-radius:50%; border: 4px solid gray; margin: 20px auto; padding: 0; position: relative; top: 15px; box-sizing: content-box; border-color: #F8BB86;\'>');
		confirmContent.push('<div>');
		confirmContent.push('<span style=\'position: absolute; width: 5px; height: 47px; left: 50%; top: 10px; webkit-border-radius: 2px; border-radius: 2px; margin-left: -2px; background-color: #F8BB86;\'></span>');
		confirmContent.push('<span style=\'position: absolute; width: 7px; height: 7px; -webkit-border-radius: 50%; border-radius: 50%; margin-left: -3px; left: 50%; bottom: 10px; background-color: #F8BB86;\'></span>');
		confirmContent.push('</div>');
		confirmContent.push('</div>');
		confirmContent.push('<div style=\'margin-top: 62px;margin-left: 36px;\'>');
		confirmContent.push('<div style=\'font-size: 16px; color: #333;\'>');

		if (isMaxVer) {
			confirmContent.push('您已达到版本自定义模块数量限制，无法继续添加模块。');
		} else {
			confirmContent.push('您已达到<a target=\'_blank\' onclick=\'Site.logDog(200355, 0)\' href=\'' + href + '#cusModuleAmount\' style=\'color: #5874d8; text-decoration: underline; font-size: 16px; cursor: pointer;\'>' + name + '</a>自定义模块' + maxLimit + '个，升级<a target=\'_blank\' onclick=\'Site.logDog(200355, 0)\' href=\'' + href + '#cusModuleAmount\' style=\'color: #5874d8; text-decoration: underline; font-size: 16px; cursor: pointer;\'>' + nextVerName + '</a>可扩容到' + nextMaxLimit + '个。');
		}

		confirmContent.push('</div>');
		confirmContent.push('<div style=\'font-size: 14px; margin-top: 20px; color: #999;\'>（如果您已删除模块，请保存网站设计后再添加）</div>');
		confirmContent.push('</div>');
		confirmContent.push('<div style=\'text-align: center; margin-top: 90px;\'> ');
		confirmContent.push('<button id=\'confirm\' style=\'font-size: 13px; margin: 0 20px; padding: 8px 37px; border: 1px solid #e3e2e8; background: #fff; border-radius: 2px; font-family: 微软雅黑; color: #333; cursor: pointer;\' type=\'button\'>');
		
		if (isMaxVer) {
			confirmContent.push('确定');
		} else {
			confirmContent.push('<a style=\'color: #333;\' target=\'_blank\' onclick=\'Site.logDog(200355, 0)\' href=\'' + href + '#cusModuleAmount\'>查看详情</a>');
		}

		confirmContent.push('</button>');
		confirmContent.push('<button id=\'cancel\' style=\'font-size: 13px; margin: 0 20px; padding: 8px 37px; border: 1px solid #e3e2e8; background: #fff; border-radius: 2px; font-family: 微软雅黑; color: #333; cursor: pointer; outline:none;\'>取消</button>');
		confirmContent.push('</div>');
		
		var options = {
			boxId: boxId,
			htmlContent: confirmContent.join(''),
			width: 580,
			height: 420
		};
		
		var popupWin = Site.popupBox(options);
		var popupBtn = popupWin.find('button');

		Site.logDog(200355, 2);

		popupWin.on('click', closeSelect, function() {
			popupWin.find('.popupBClose').click();
		});

		popupBtn.hover(function() {
			$(this).css({
				'background': '#5874d8', 
				'border-color': '#5874d8', 
				'color': '#fff'
			});
			$(this).find('a').css({
				'border-color': '#5874d8', 
				'color': '#fff'
			});
		}, function() {
			$(this).css({
				'background': '#fff',
				'border-color': '#e3e2e8', 
				'color': '#333'
			});
			$(this).find('a').css({
				'border-color': '#e3e2e8', 
				'color': '#333'
			});
		});
	}

	return result.success;
};

$(function() {	
	try {
		// 环境问题：在对数值0.005进行四舍五入保留2为数字时，在ie8会发现0.005.toFixed(2)=0.00  
		// 四舍五入在数值很小时的精度问题：在toFixed使用小数点后为0的数字都被忽略， 没有保留0作为小数位
		Number.prototype.toFixed = function(s) {
			var changenum = (parseInt(Math.round(this * Math.pow(10, s) + Math.pow(10, -(s + 2)))) / Math.pow(10, s)).toString();
			var index = changenum.indexOf('.');
			var i;
			if (index < 0 && s > 0) {
				changenum = changenum + '.';
				for (i = 0;i < s;i++) {
					changenum = changenum + '0';
				}
			
			} else {
				index = changenum.length - index;
				for (i = 0;i < (s - index) + 1;i++) {
					changenum = changenum + '0';
				}
			}
			return  changenum;
		};
	} catch (exp) {
	}
});

// 检查html中所有的img，如果有faiSrc属性，则把属性值设置到src
Fai.delayLoadImg = function(countPer) {
	if (typeof countPer == 'undefined' || countPer <= 0) {
		countPer = 10;
	}
	setTimeout('Fai.doDelayLoadImg(' + countPer + ')', 200);
};

Fai.doDelayLoadImg = function(countPer) {
	// 每次只加载10张新图
	var count = 0;
	$('img').each(function() {
		var faiSrc = $(this).attr('faiSrc');
		if (!Fai.isNull(faiSrc) && faiSrc != '') {
			if (faiSrc != $(this).attr('src')) {
				++count;
				$(this).show();
				$(this).attr('src', faiSrc);
				if (count >= countPer) {
					return false;
				}
			}
		}
	});
	if (count >= countPer) {
		setTimeout('Fai.doDelayLoadImg(' + countPer + ')', 200);
	}
};

//对曝光的素材加dog，素材库专用
Fai.doDelayLoadMaterial = function(countPer) {
	// 每次只加载10张新图
	var count = 0;
	var dogArray = [];
	$('img').each(function() {
		var faiSrc = $(this).attr('faiSrc');
		if (!Fai.isNull(faiSrc) && faiSrc != '') {
			if (faiSrc != $(this).attr('src')) {
				++count;
				$(this).show();
				$(this).attr('src', faiSrc);
				var dog = parseInt($(this).attr('dog'));
				if (!isNaN(dog)) {
					dogArray.push(dog);
				}
				if (count >= countPer) {
					return false;
				}
			}
		}
	});
	if (dogArray.length != 0) {
		Site.logDog(200167, $.toJSON(dogArray));
	}
	if (count >= countPer) {
		setTimeout('Fai.doDelayLoadMaterial(' + countPer + ')', 200);
	}
};

Fai.refreshClass = function(e) {
	e.children().each(function() {
		$(this).attr('class', $(this).attr('class'));
		Fai.refreshClass($(this));
	});
};

// 注册时间处理函数（这些函数会在Fai.bg调用是被停止处理）
Fai.addInterval = function(id, func, interval) {
	if (Fai.isNull(Fai.intervalFunc)) {
		Fai.intervalFunc = new Array();
	}
	// 检查是否有重复 20121217新增：有重复的，先删掉旧的，再添加新的
	for (var i = 0; i < Fai.intervalFunc.length; ++i) {
		if (Fai.intervalFunc[i].id == id) {
			Fai.intervalFunc.splice(i, 1);
			break;
		}
	}
	Fai.intervalFunc.push({id: id, func: func, interval: interval, type: 1});
};

// 注册时间处理函数（这些函数会在Fai.bg调用是被停止处理）
Fai.addTimeout = function(id, func, interval) {
	if (Fai.isNull(Fai.intervalFunc)) {
		Fai.intervalFunc = new Array();
	}
	// 检查是否有重复 20121217新增：有重复的，先删掉旧的，再添加新的
	for (var i = 0; i < Fai.intervalFunc.length; ++i) {
		if (Fai.intervalFunc[i].id == id) {
			Fai.intervalFunc.splice(i, 1);
			break;
		}
	}
	Fai.intervalFunc.push({id: id, func: func, interval: interval, type: 0});
};

// 启动时间处理函数，id为null表示启动所有
Fai.startInterval = function(id) {
	if (Fai.isNull(Fai.intervalFunc)) {
		return;
	}
	for (var i = 0; i < Fai.intervalFunc.length; ++i) {
		var x = Fai.intervalFunc[i];
		if (id == null || x.id == id) {
			if (x.timer) {
				clearInterval(x.timer);
			}
			if (x.type == 1) {
				if (id == 'marquee1168') {
					x.func();
				}
				x.timer = setInterval(x.func, x.interval);
			} else {
				x.timer = setTimeout(x.func, x.interval);
			}
		}
	}
};

// 停止时间处理函数，id为null表示停止所有
Fai.stopInterval = function(id) {
	if (Fai.isNull(Fai.intervalFunc)) {
		return;
	}
	for (var i = 0; i < Fai.intervalFunc.length; ++i) {
		var x = Fai.intervalFunc[i];
		if (id == null || x.id == id) {
			if (x.timer) {
				clearInterval(x.timer);
			}
		}
	}
};

// 相同的opacity不再设置，避免占用cpu
jQuery.extend(jQuery.fx.step, {
	opacity: function(fx) {
		var o = jQuery.style(fx.elem, 'opacity');
		if (o == null || o == '' || o != fx.now) {
			jQuery.style(fx.elem, 'opacity', fx.now);
		}
	}
});

// failinear是限制了效果的修改次数，以便降低CPU的使用，即不管效果的时间多长，都只修改10次
jQuery.extend(jQuery.easing,
	{
	// t: current time, b: begInnIng value, c: change In value, d: duration
		faicount: 10,
		failinear: function(x, t, b, c, d) {
		// 只修改jQuery.easing.faicount次
			var interval = Math.abs(c - b) / jQuery.easing.faicount;
			if (interval == 0) {
				return c;
			}
			x = parseInt(x / interval) * interval;
			return jQuery.easing['linear'](x, t, b, c, d);
		},
		easeOutQuart: function(x, t, b, c, d) {  
		// 先快速后慢速
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		}
	});

Fai.showTip = function(options) {
	//options
	//	1.tid (*) -- jQuery selector
	//	2.content html (*)
	//	3.closeSwitch -- true/false
	//	4.autoTimeout -- it is close timeout
	//	5.showMode -- left,right,top,bottom (*)
	//  6.beforeClose -- function
	//  7.cls -- extend class name
	var frameContent = new Array();
	if (!options.content) {
		options.content = '';
	}
	frameContent.push('<div class=\'tip-content\'>');
	if (options.closeSwitch) {
		frameContent.push('<div class=\'tip-content\'>');
		frameContent.push('<a class=\'tip-btnClose\'></a>');
	} else {
		frameContent.push('<div class=\'tip-content\'>');
	}
	frameContent.push(options.content);
	frameContent.push('</div>');
	var finalContent = frameContent.join('');
	
	var defaultOptions = {
		content: finalContent,
		className: 'tip-yellowsimple',
		showTimeout: 1,
		hideTimeout: 0,
		alignTo: 'target',
		alignX: 'center',
		alignY: 'top',
		offsetY: 5,
		showOn: 'none',
		hideAniDuration: 0,
		id: 'tip-yellowsimple' + parseInt(Math.random() * 10000)
	};
	
	if (options.id) {
		$.extend(defaultOptions, {id: options.id});
	}
	
	if (options.showMode) {
		if (options.showMode == 'left') {
			$.extend(defaultOptions, {alignX: 'left', alignY: 'center', offsetY: 0, offsetX: 5});
		} else if (options.showMode == 'right') {
			$.extend(defaultOptions, {alignX: 'right', alignY: 'center', offsetY: 0, offsetX: 5});
		} else if (options.showMode == 'top') {
			$.extend(defaultOptions, {alignX: 'center', alignY: 'top', offsetY: 0, offsetX: 5});
		} else if (options.showMode == 'bottom') {
			$.extend(defaultOptions, {alignX: 'center', alignY: 'bottom', offsetY: 0, offsetX: 5});
		}
	}
	
	if (options.data) {
		$.extend(defaultOptions, options.data);
	}
	if (options.appendToId) { // 插入位置
		$.extend(defaultOptions, {appendToId: options.appendToId});
	}
	if (options.autoLocation) {	// 动态改变位置
		$.extend(defaultOptions, {autoLocation: options.autoLocation});
	}
	if (options.cusStyle) {	// 自定义属性
		$.extend(defaultOptions, {cusStyle: options.cusStyle});
	}
	
	var faiTarget = $(options.tid);
	faiTarget.poshytip('destroy');
	faiTarget.poshytip(defaultOptions);	
	faiTarget.poshytip('show');
	if (options.cls) {
		$('#' + defaultOptions.id).addClass(options.cls);
	}
	
	$('#' + defaultOptions.id).find('.tip-btnClose').live('click', function() {
		if (options.beforeClose) {
			options.beforeClose();
		}
		Fai.closeTip(options.tid);
	});
	if (options.autoTimeout) {
		window.setTimeout( 
			function() {
				if (options.beforeClose) {
					options.beforeClose();
				}
				Fai.closeTip(options.tid);
			}, options.autoTimeout);
	}
};

Fai.closeTip = function(tid) {
	if (typeof $(tid).poshytip == 'function') {
		$(tid).poshytip('destroy');
	}
};

Fai.refreshTip = function(tid) {
	$(tid).poshytip('hide');
	$(tid).poshytip('show');
};

Fai.rgb2hex = function(rgb) { 
	if (rgb.charAt(0) == '#') 
		return rgb; 
	var ds = rgb.split(/\D+/); 
	var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]); 
	var s = decimal.toString(16); 
	while (s.length < 6) 
		s = '0' + s; 
	return '#' + s; 
};

Fai.int2hex = function(rgb) { 
	var hex = rgb.toString(16);
	while (hex.length < 6) 
		hex = '0' + hex; 
	return '#' + hex;
};

(function() {

	Fai.setCtrlStyleCss = function(sid, id, cls, key, value) {
		var style = $('#' + sid);
		var list = new Array();
		if (style.length == 1) {
			// ie6下会把没换行的也自动加了换行，例如#id .xxx{\n\tDISPLAY: none\n}
			var html = style.html();
			html = html.replace(/{\r\n/g, '{').replace(/\t/g, '').replace(/\r\n}/g, ';}');
			list = html.split('\n');
			style.remove();
		}
		var reg = new RegExp('#' + id + ' +' + fixRegSpecialCharacter(cls) + ' *{ *' + key + '\s*:[^;]*;', 'gi');
		if (id == '' || id == 'undefined') {	//没有传ID的情况
			reg = new RegExp(fixRegSpecialCharacter(cls) + ' *{ *' + key + '\s*:[^;]*;', 'gi');
		}
	
		for (var i = list.length - 1; i >= 0; --i) {
			var line = list[i];
			if (line.length == 0 || /^\s$/.test(line) || reg.test(line)) {
				list.splice(i, 1);
			}
		}
	
		if (id == '' || id == 'undefined') {	//没有传ID的情况
			list.push(cls + '{' + key + ':' + value + ';}');
		} else {
			list.push('#' + id + ' ' + cls + '{' + key + ':' + value + ';}');
		}
	
		$('head').append('<style type="text/css" id="' + sid + '">' + list.join('\n') + '</style>');
	};

	Fai.setCtrlStyleCssList = function(sid, id, css, options) {	
		var style = $('#' + sid);
		var list = new Array();
		var n;
		if (style.length == 1) {
		// ie6下会把没换行的也自动加了换行，例如#id .xxx{\n\tDISPLAY: none\n}
			var html = style.html();
			html = html.replace(/{\r\n/g, '{').replace(/\t/g, '').replace(/\r\n}/g, ';}');
			list = html.split('\n');
			style.remove();
		}
	
		for (var i = list.length - 1; i >= 0; --i) {
			var line = list[i];
			for (n = 0; n < css.length; ++n) {
				var cls = css[n].cls;
				var key = css[n].key;
				var reg = new RegExp('#' + id + ' +' + fixRegSpecialCharacter(cls) + ' *{ *' + key + '\s*:[^;]*;', 'gi');
			
				if (id == '' || id == 'undefined') {	//没有传ID的情况
					reg = new RegExp(fixRegSpecialCharacter(cls) + ' *{ *' + key + '\s*:[^;]*;', 'gi');
				}
			
				if (line.length == 0 || /^\s$/.test(line) || reg.test(line)) {
					list.splice(i, 1);
					break;
				}
			}
		}
		for (n = 0; n < css.length; ++n) {
			if (id == '' || id == 'undefined') {	//没有传ID的情况
				list.push(css[n].cls + '{' + css[n].key + ':' + css[n].value + ';}');
			} else {
				list.push('#' + id + ' ' + css[n].cls + '{' + css[n].key + ':' + css[n].value + ';}');
			}
		
		}
	
		//默认减减组成新的列表是倒序，覆盖插入的样式是插后面
		if (options && options.rev) {
			list.reverse();
		}
		$('head').append('<style type="text/css" id="' + sid + '">' + list.join('\n') + '</style>');
	};

	Fai.getCtrlStyleCss = function(sid, id, cls, key) {
		var style = $('#' + sid);
		if (style.length == 0) {
			return '';
		}
		var list = style.html().split('\n');
		var reg = new RegExp('#' + id + ' +' + fixRegSpecialCharacter(cls) + ' *{ *' + key + '[^;]*;', 'gi');
		if (id == '' || id == 'undefined') {	//没有传ID的情况
			reg = new RegExp(fixRegSpecialCharacter(cls) + ' *{ *' + key + '[^;]*;', 'gi');
		}
		for (var i = list.length - 1; i >= 0; --i) {
			var line = list[i];
			var matchs = line.match(reg);
			if (matchs && matchs.length >= 2) {
				return matchs[1];
			}
		}
		return '';
	};

	Fai.removeCtrlStyleCss = function(sid, id, cls, key) {
		var style = $('#' + sid);
		var list = new Array();
		if (style.length == 1) {
		// ie6下会把没换行的也自动加了换行，例如#id .xxx{\n\tDISPLAY: none\n}
			var html = style.html();
			html = html.replace(/{\r\n/g, '{').replace(/\t/g, '').replace(/\r\n}/g, ';}');
			list = html.split('\n');
			style.remove();
		}
		var reg = new RegExp('#' + id + ' +' + fixRegSpecialCharacter(cls) + ' *{ *' + key + '\s*:[^;]*;', 'gi');
		if (id == '' || id == 'undefined') {	//没有传ID的情况
			reg = new RegExp(fixRegSpecialCharacter(cls) + ' *{ *' + key + '\s*:[^;]*;', 'gi');
		}
		for (var i = list.length - 1; i >= 0; --i) {
			var line = list[i];
			if (line.length == 0 || /^\s$/.test(line) || reg.test(line)) {
				list.splice(i, 1);
			}
		}
		$('head').append('<style type="text/css" id="' + sid + '">' + list.join('\n') + '</style>');
	
	};

	Fai.removeCtrlStyleCssList = function(sid, id, css) {
		var style = $('#' + sid);
		var list = new Array();
		if (style.length == 1) {
		// ie6下会把没换行的也自动加了换行，例如#id .xxx{\n\tDISPLAY: none\n}
			var html = style.html();
			html = html.replace(/{\r\n/g, '{').replace(/\t/g, '').replace(/\r\n}/g, ';}');
			list = html.split('\n');
			style.remove();
		}
		for (var i = list.length - 1; i >= 0; --i) {
			var line = list[i];
			for (var n = 0; n < css.length; ++n) {
				var cls = css[n].cls;
				var key = css[n].key;
				var reg = new RegExp('#' + id + ' +' + fixRegSpecialCharacter(cls) + ' *{ *' + key + '\s*:[^;]*;', 'gi');
				if (id == '' || id == 'undefined') {	//没有传ID的情况
					reg = new RegExp(fixRegSpecialCharacter(cls) + ' *{ *' + key + '\s*:[^;]*;', 'gi');
				}
				if (line.length == 0 || /^\s$/.test(line) || reg.test(line)) {
					list.splice(i, 1);
					break;
				}
			}
		}
		$('head').append('<style type="text/css" id="' + sid + '">' + list.join('\n') + '</style>');
	};

	// 正则匹配中，特殊字符 * . ?  $ ^ [ ] ( ) { } | \ /
	// 针对以上特殊字符，进行相应转义处理
	function fixRegSpecialCharacter(cls) {
		var specialCharacter = ['\\', '.', '?', '$', '*', '^', '[', ']', '{', '}', '|', '(', ')', '/'];

		for (var i = 0, len = specialCharacter.length; i < len; i++) {
			cls = cls.replace(specialCharacter[i], '\\' + specialCharacter[i]);
		}

		return cls;
	};

})();

Fai.addCtrlStyle = function(sid, styles) {
	var style = $('#' + sid);
	var list = new Array();
	if (style.length == 1) {
		// ie6下会把没换行的也自动加了换行，例如#id .xxx{\n\tDISPLAY: none\n}
		var html = style.html();
		html = html.replace(/{\r\n/g, '{').replace(/\t/g, '').replace(/\r\n}/g, ';}');
		list = html.split('\n');
		style.remove();
	}
	list.push(styles);
	
	$('head').append('<style type="text/css" id="' + sid + '">' + list.join('\n') + '</style>');
};

Fai.scrollTop = function(){
	Fai.top.$('#g_main').animate({scrollTop: 0}, {duration: 500, easing: "swing"});
	Fai.top.$('html, body').animate({scrollTop: 0}, {duration: 500, easing: "swing"});
}

Fai.addBookmark = function(title, url) {
	title = title == '' ? document.title : title ; 
	url = url == '' ? 'http://' + window.location.host : url;
	try {
		try {
			window.sidebar.addPanel(title, url, '');
		} catch (e) {
			window.external.AddFavorite(url, title);
		}
	} catch (e1) {
		alert('收藏网站失败，请使用Ctrl+D进行添加。');
	}
};

/*
**单个TextArea 限制长度
**@Time 2011-08-11
**
**用法：
**1、加载时执行，传入TextArea的ID和最大字符值
*/
Fai.singleTextAreaAddMaxLength = function(objId, maxLength) {
	if (typeof objId != 'undefined' && typeof maxLength != 'undefined') {
		var textAreaObj = $('#' + objId);		//获取textArea对象
		textAreaObj.attr('maxlength', maxLength);
		textAreaObj.bind('keydown keyup change blur', function() {
			var textAreaObjVal = textAreaObj.val();
			var textAreaObjLength = textAreaObjVal.length;
			if (textAreaObjLength > maxLength) {
				var tmp = textAreaObjVal.substr(0, maxLength);
				textAreaObj.val(tmp);
			}
		});
	}
};

/**
 * 文件单位转换(B)转成(KB/MB)
 */
Fai.parseFileSize = function(bit) {
	
	if (typeof bit != 'undefined' && typeof bit == 'number') {
		var newFileSize;
		var tmpSize;
		if (bit < 1024) {
			newFileSize = bit + 'B';
		} else if (bit < 1024 * 1024) {
			tmpSize = bit / 1024;
			//alert(tmpSize);
			newFileSize = tmpSize.toFixed(2) + 'KB';
		} else {
			tmpSize = bit / (1024 * 1024);
			newFileSize = tmpSize.toFixed(2) + 'MB';
		}
		
		return newFileSize;
	} else {
		return '-';
	}
};

/**
 * compareObj
 * function: compareObj
 * 
 * @param Fai.compareObj(firstVal, secondVal, desc);
 */
Fai.compareObj = function(firstVal, secondVal, desc) {
	if (firstVal === '') {
		if (secondVal === '') {
			return 0;
		}
		return 1;
	}
	if (secondVal === '') {
		return -1;
	}
	if (!isNaN(firstVal)) { // isNumber
		if (!isNaN(secondVal)) { // isNumber
			firstVal = Math.floor(firstVal);
			secondVal = Math.floor(secondVal);
		} else {
			//a is num , b not num
			if (desc) {
				return 1;
			} else {
				return -1;
			}
		}
	} else {
		if (!isNaN(secondVal)) {
			//a not num, b is num
			if (desc) {
				return -1;
			} else {
				return 1;
			}
		}
	}

	if (firstVal > secondVal) {
		if (desc) {
			return -1;
		} else {
			return 1;
		}
	} else if (firstVal == secondVal) {
		return 0;
	} else {
		if (desc) {
			return 1;
		} else {
			return -1;
		}
	}
};
/***************************** End compareObj *****************************/

//2014.11.26
//获取浏览器滚动条的宽度
//不同操作系统,不同浏览器下,滚动条的宽度是不相同的.
Fai.getScrollWidth = function() {
	var w;
	var tmp = document.createElement('div');

	tmp.style.cssText = 'overflow:scroll; width:100px; height:100px; background:transparent;';
	document.body.appendChild(tmp);
	w = tmp.offsetWidth - tmp.clientWidth; //得到滚动条宽度
	document.body.removeChild(tmp);

	return w;
};

/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 */

/**
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 */
;(function($) {
	$.cookie = function(key, value, options) {
	
		// key and value given, set cookie...
		if (arguments.length > 1 && (value === null || typeof value !== 'object')) {
			options = $.extend({}, options);
	
			if (value === null) {
				options.expires = -1;
			}
	
			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}
	
			return (document.cookie = [
				encodeURIComponent(key), '=',
				options.raw ? String(value) : encodeURIComponent(String(value)),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}
	
		// key and possibly options given, get cookie...
		options = value || {};
		var result, decode = options.raw ? function(s) {
			return s; 
		} : decodeURIComponent;
		return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
	};

})(jQuery);

/**
 * jQuery JSON Plugin
 * Time 2011-09-17 version: 2.3
 *
 * Usage:
 * Serializes a javascript object, number, string, or array into JSON. 
 *     $.toJSON()
 * Converts from JSON to Javascript, quickly, and is trivial.
 *     $.evalJSON()
 * Converts from JSON to Javascript, but does so while checking to see if the source is actually JSON, and not with other Javascript statements thrown in. 
 *     $.secureEvalJSON()
 * Places quotes around a string, and intelligently escapes any quote, backslash, or control characters. 
 *     $.quoteString()
 */
(function($) {
	'use strict';

	var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
		meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		},
		hasOwn = Object.prototype.hasOwnProperty;

	/**
	 * jQuery.toJSON
	 * Converts the given argument into a JSON representation.
	 *
	 * @param o {Mixed} The json-serializable *thing* to be converted
	 *
	 * If an object has a toJSON prototype, that will be used to get the representation.
	 * Non-integer/string keys are skipped in the object, as are keys that point to a
	 * function.
	 *
	 */
	//$.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
	$.toJSON = function(o) {
		if (o === null) {
			return 'null';
		}

		var pairs, k, name, val,
			type = $.type(o);

		if (type === 'undefined') {
			return undefined;
		}

		// Also covers instantiated Number and Boolean objects,
		// which are typeof 'object' but thanks to $.type, we
		// catch them here. I don't know whether it is right
		// or wrong that instantiated primitives are not
		// exported to JSON as an {"object":..}.
		// We choose this path because that's what the browsers did.
		if (type === 'number' || type === 'boolean') {
			return String(o);
		}
		if (type === 'string') {
			return $.quoteString(o);
		}
		if (typeof o.toJSON === 'function') {
			return $.toJSON(o.toJSON());
		}
		if (type === 'date') {
			var month = o.getUTCMonth() + 1,
				day = o.getUTCDate(),
				year = o.getUTCFullYear(),
				hours = o.getUTCHours(),
				minutes = o.getUTCMinutes(),
				seconds = o.getUTCSeconds(),
				milli = o.getUTCMilliseconds();

			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (milli < 100) {
				milli = '0' + milli;
			}
			if (milli < 10) {
				milli = '0' + milli;
			}
			return '"' + year + '-' + month + '-' + day + 'T' +
				hours + ':' + minutes + ':' + seconds +
				'.' + milli + 'Z"';
		}

		pairs = [];

		if ($.isArray(o)) {
			for (k = 0; k < o.length; k++) {
				pairs.push($.toJSON(o[k]) || 'null');
			}
			return '[' + pairs.join(',') + ']';
		}

		// Any other object (plain object, RegExp, ..)
		// Need to do typeof instead of $.type, because we also
		// want to catch non-plain objects.
		if (typeof o === 'object') {
			for (k in o) {
				// Only include own properties,
				// Filter out inherited prototypes
				if (hasOwn.call(o, k)) {
					// Keys must be numerical or string. Skip others
					type = typeof k;
					if (type === 'number') {
						name = '"' + k + '"';
					} else if (type === 'string') {
						name = $.quoteString(k);
					} else {
						continue;
					}
					type = typeof o[k];

					// Invalid values like these return undefined
					// from toJSON, however those object members
					// shouldn't be included in the JSON string at all.
					if (type !== 'function' && type !== 'undefined') {
						val = $.toJSON(o[k]);
						pairs.push(name + ':' + val);
					}
				}
			}
			return '{' + pairs.join(',') + '}';
		}
	};

	/**
	 * jQuery.evalJSON
	 * Evaluates a given json string.
	 *
	 * @param str {String}
	 */
	$.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function(str) {
		/*jshint evil: true */
		return Fai.fkEval('(' + str + ')');
	};

	/**
	 * jQuery.secureEvalJSON
	 * Evals JSON in a way that is *more* secure.
	 *
	 * @param str {String}
	 */
	$.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function(str) {
		var filtered =
			str
				.replace(/\\["\\\/bfnrtu]/g, '@')
				.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
				.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		if (/^[\],:{}\s]*$/.test(filtered)) {
			/*jshint evil: true */
			return Fai.fkEval('(' + str + ')');
		}
		throw new SyntaxError('Error parsing JSON, source is not valid.');
	};

	/**
	 * jQuery.quoteString
	 * Returns a string-repr of a string, escaping quotes intelligently.
	 * Mostly a support function for toJSON.
	 * Examples:
	 * >>> jQuery.quoteString('apple')
	 * "apple"
	 *
	 * >>> jQuery.quoteString('"Where are we going?", she asked.')
	 * "\"Where are we going?\", she asked."
	 */
	$.quoteString = function(str) {
		if (str.match(escape)) {
			return '"' + str.replace(escape, function(a) {
				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + str + '"';
	};

}(jQuery));

/**
 * jquery.dateFormat
 * v: 1.0
 */
(function(jQuery) {
		
	var daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var shortMonthsInYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var longMonthsInYear = ['January', 'February', 'March', 'April', 'May', 'June', 
		'July', 'August', 'September', 'October', 'November', 'December'];
	var shortMonthsToNumber = [];
	shortMonthsToNumber['Jan'] = '01';
	shortMonthsToNumber['Feb'] = '02';
	shortMonthsToNumber['Mar'] = '03';
	shortMonthsToNumber['Apr'] = '04';
	shortMonthsToNumber['May'] = '05';
	shortMonthsToNumber['Jun'] = '06';
	shortMonthsToNumber['Jul'] = '07';
	shortMonthsToNumber['Aug'] = '08';
	shortMonthsToNumber['Sep'] = '09';
	shortMonthsToNumber['Oct'] = '10';
	shortMonthsToNumber['Nov'] = '11';
	shortMonthsToNumber['Dec'] = '12';
	
	jQuery.format = (function() {
		function strDay(value) {
			return daysInWeek[parseInt(value, 10)] || value;
		}

		function strMonth(value) {
			var monthArrayIndex = parseInt(value, 10) - 1;
			return shortMonthsInYear[monthArrayIndex] || value;
		}

		function strLongMonth(value) {
			var monthArrayIndex = parseInt(value, 10) - 1;
			return longMonthsInYear[monthArrayIndex] || value;					
		}

		var parseMonth = function(value) {
			return shortMonthsToNumber[value] || value;
		};

		var parseTime = function(value) {
			var retValue = value;
			var millis = '';
			if (retValue.indexOf('.') !== -1) {
				var delimited = retValue.split('.');
				retValue = delimited[0];
				millis = delimited[1];
			}

			var values3 = retValue.split(':');

			if (values3.length === 3) {
				var hour = values3[0];
				var minute = values3[1];
				var second = values3[2];

				return {
					time: retValue,
					hour: hour,
					minute: minute,
					second: second,
					millis: millis
				};
			} else {
				return {
					time: '',
					hour: '',
					minute: '',
					second: '',
					millis: ''
				};
			}
		};

		return {
			date: function(value, format) {
				/* 
					value = new java.util.Date()
                 	2009-12-18 10:54:50.546 
				*/
				try {
					var date = null;
					var year = null;
					var month = null;
					var dayOfMonth = null;
					var dayOfWeek = null;
					var time = null;
					var values;
					if (typeof value.getFullYear === 'function') {
						year = value.getFullYear();
						month = value.getMonth() + 1;
						dayOfMonth = value.getDate();
						dayOfWeek = value.getDay();
						time = parseTime(value.toTimeString());
					} else if (value.search(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[-+]?\d{2}:?\d{2}/) != -1) { /* 2009-04-19T16:11:05+02:00 */											
						values = value.split(/[T\+-]/);
						year = values[0];
						month = values[1];
						dayOfMonth = values[2];
						time = parseTime(values[3].split('.')[0]);
						date = new Date(year, month - 1, dayOfMonth);
						dayOfWeek = date.getDay();
					} else {
						values = value.split(' ');
						switch (values.length) {
						case 6:
							/* Wed Jan 13 10:43:41 CET 2010 */
							year = values[5];
							month = parseMonth(values[1]);
							dayOfMonth = values[2];
							time = parseTime(values[3]);
							date = new Date(year, month - 1, dayOfMonth);
							dayOfWeek = date.getDay();
							break;
						case 2:
							/* 2009-12-18 10:54:50.546 */
							var values2 = values[0].split('-');
							year = values2[0];
							month = values2[1];
							dayOfMonth = values2[2];
							time = parseTime(values[1]);
							date = new Date(year, month - 1, dayOfMonth);
							dayOfWeek = date.getDay();
							break;
						case 7:
							/* Tue Mar 01 2011 12:01:42 GMT-0800 (PST) */
						case 9:
							/*added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0800 (China Standard Time) */
						case 10:
							/* added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0200 (W. Europe Daylight Time) */
							year = values[3];
							month = parseMonth(values[1]);
							dayOfMonth = values[2];
							time = parseTime(values[4]);
							date = new Date(year, month - 1, dayOfMonth);
							dayOfWeek = date.getDay();
							break;
						default:
							return value;
						}
					}

					var pattern = '';
					var retValue = '';
					/*
						Issue 1 - variable scope issue in format.date 
                    	Thanks jakemonO
					*/
					var hour;
					for (var i = 0; i < format.length; i++) {
						var currentPattern = format.charAt(i);
						pattern += currentPattern;
						switch (pattern) {
						case 'ddd':
							retValue += strDay(dayOfWeek);
							pattern = '';
							break;
						case 'dd':
							if (format.charAt(i + 1) == 'd') {
								break;
							}
							if (String(dayOfMonth).length === 1) {
								dayOfMonth = '0' + dayOfMonth;
							}
							retValue += dayOfMonth;
							pattern = '';
							break;
						case 'MMMM':
							retValue += strLongMonth(month);
							pattern = '';
							break;
						case 'MMM':
							if (format.charAt(i + 1) === 'M') {
								break;
							}
							retValue += strMonth(month);
							pattern = '';
							break;
						case 'MM':
							if (format.charAt(i + 1) == 'M') {
								break;
							}
							if (String(month).length === 1) {
								month = '0' + month;
							}
							retValue += month;
							pattern = '';
							break;
						case 'yyyy':
							retValue += year;
							pattern = '';
							break;
						case 'yy':
							if (format.charAt(i + 1) == 'y' &&
								format.charAt(i + 2) == 'y') {
								break;
							}
							retValue += String(year).slice(-2);
							pattern = '';
							break;
						case 'HH':
							retValue += time.hour;
							pattern = '';
							break;
						case 'hh':
							/* time.hour is "00" as string == is used instead of === */
							hour = (time.hour == 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);
							hour = String(hour).length == 1 ? '0' + hour : hour;
							retValue += hour;
							pattern = '';
							break;
						case 'h':
							if (format.charAt(i + 1) == 'h') {
								break;
							}
							hour = (time.hour == 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);                           
							retValue += hour;
							pattern = '';
							break;
						case 'mm':
							retValue += time.minute;
							pattern = '';
							break;
						case 'ss':
							/* ensure only seconds are added to the return string */
							retValue += time.second.substring(0, 2);
							pattern = '';
							break;
						case 'SSS':
							retValue += time.millis.substring(0, 3);
							pattern = '';
							break;
						case 'a':
							retValue += time.hour >= 12 ? 'PM' : 'AM';
							pattern = '';
							break;
						case ' ':
							retValue += currentPattern;
							pattern = '';
							break;
						case '/':
							retValue += currentPattern;
							pattern = '';
							break;
						case ':':
							retValue += currentPattern;
							pattern = '';
							break;
						default:
							if (pattern.length === 2 && pattern.indexOf('y') !== 0 && pattern != 'SS') {
								retValue += pattern.substring(0, 1);
								pattern = pattern.substring(1, 2);
							} else if ((pattern.length === 3 && pattern.indexOf('yyy') === -1)) {
								pattern = '';
							}
						}
					}
					return retValue;
				} catch (e) {
					return value;
				}
			}
		};
	}());
}(jQuery));

/*
 * jQuery Lazy loading images
 *
 * Version:  1.7.0
 * e.g:
 *    <img class="lazy" src="img/grey.gif" data-original="img/example.jpg"  width="640" heigh="480">
 *    $("img.lazy").lazyload();
 */
(function($, window) {
    
	var $window = $(window);
    
	$.fn.lazyload = function(options) {
		var settings = {
			threshold: 0,
			failure_limit: 0,
			event: 'scroll',
			effect: 'show',
			container: window,
			data_attribute: 'original',
			skip_invisible: true,
			appear: null,
			load: null,
			lazyRemoveclass: ''
		};
		
		if (options) {
			/* Maintain BC for a couple of version. */
			if (undefined !== options.failurelimit) {
				options.failure_limit = options.failurelimit; 
				delete options.failurelimit;
			}
			if (undefined !== options.effectspeed) {
				options.effect_speed = options.effectspeed; 
				delete options.effectspeed;
			}
            
			$.extend(settings, options);
		}        

		/* Fire one scroll event per scroll. Not one scroll event per image. */
		var elements = this;
		if (0 == settings.event.indexOf('scroll')) {
			//$(settings.container).unbind(settings.event).bind(settings.event, function(event) {
			$(settings.container).off('scroll.lazy');
			$(settings.container).on('scroll.lazy', function() {
				var counter = 0;
				elements.each(function() {
					var $this = $(this);
					if (settings.skip_invisible && !$this.is(':visible')) return;
					/*
					//暂时先注释，因没有考虑到mobi这边情况，导致图片一直loading
					//already load no check
					if (!$($this).hasClass("loadingPlaceholderBackground")) return;
					*/
					if ($.abovethetop(this, settings) ||
                        $.leftofbegin(this, settings)) {
						/* Nothing. */
					} else if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
						$this.trigger('appear');
					} else {
						if (++counter > settings.failure_limit) {
							//alert( $this.attr("data-original") )
							// return false;
							/*if($this.attr("data-original"))
							 return false;*/
						}
					}
				});
			});
		}
                
		this.each(function() {
			var self = this;
			var $self = $(self);
            
			self.loaded = false;
            
			/* When appear is triggered load original image. */
			$self.one('appear', function() {
				if (!this.loaded) {
					if (settings.appear) {
						var elements_left = elements.length;
						settings.appear.call(self, elements_left, settings);
					}
					$('<img />')
						.bind('load', function() {
							$self
								.hide()
								.removeClass(settings.lazyRemoveclass)
								.attr('src', $self.data(settings.data_attribute));

							$self[settings.effect](settings.effect_speed);
							self.loaded = true;
                            
							/* Remove image from array so it is not looped next time. */
							var temp = $.grep(elements, function(element) {
								return !element.loaded;
							});
							elements = $(temp);

							if (settings.load) {
								var elements_left = elements.length;
								settings.load.call(self, elements_left, settings);
							}

							$(this).unbind('load');
						})
						.attr('src', $self.data(settings.data_attribute)).removeClass(settings.lazyRemoveclass);
				};                
			});

			/* When wanted event is triggered load original image */
			/* by triggering appear.                              */
			if (0 != settings.event.indexOf('scroll')) {
				$self.bind(settings.event, function() {
					if (!self.loaded) {
						$self.trigger('appear');
					}
				});
			}
		});
        
		/* Check if something appears when window is resized. */
		$window.bind('resize', function() {
			$(settings.container).trigger(settings.event);
		});
        
		/* Force initial check if images should appear. */
		$(settings.container).trigger(settings.event);
        
		return this;

	};

	/* Convenience methods in jQuery namespace.           */
	/* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

	$.belowthefold = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.height() + $window.scrollTop();
		} else {
			fold = $(settings.container).offset().top + $(settings.container).height();
		}
		return fold <= $(element).offset().top - settings.threshold;
	};
    
	$.rightoffold = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.width() + $window.scrollLeft();
		} else {
			fold = $(settings.container).offset().left + $(settings.container).width();
		}
		return fold <= $(element).offset().left - settings.threshold;
	};
        
	$.abovethetop = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.scrollTop();
		} else {
			fold = $(settings.container).offset().top;
		}
		return fold >= $(element).offset().top + settings.threshold  + $(element).height();
	};
    
	$.leftofbegin = function(element, settings) {
		var fold;
		if (settings.container === undefined || settings.container === window) {
			fold = $window.scrollLeft();
		} else {
			fold = $(settings.container).offset().left;
		}
		return fold >= $(element).offset().left + settings.threshold + $(element).width();
	};

	$.inviewport = function(element, settings) {
		return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && 
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
	};

	/* Custom selectors for your convenience.   */
	/* Use as $("img:below-the-fold").something() */

	$.extend($.expr[':'], {
		'below-the-fold': function(a) {
			return $.belowthefold(a, {threshold: 0, container: window}); 
		},
		'above-the-top': function(a) {
			return !$.belowthefold(a, {threshold: 0, container: window}); 
		},
		'right-of-screen': function(a) {
			return $.rightoffold(a, {threshold: 0, container: window}); 
		},
		'left-of-screen': function(a) {
			return !$.rightoffold(a, {threshold: 0, container: window}); 
		},
		'in-viewport': function(a) {
			return !$.inviewport(a, {threshold: 0, container: window}); 
		},
		/* Maintain BC for couple of versions. */
		'above-the-fold': function(a) {
			return !$.belowthefold(a, {threshold: 0, container: window}); 
		},
		'right-of-fold': function(a) {
			return $.rightoffold(a, {threshold: 0, container: window}); 
		},
		'left-of-fold': function(a) {
			return !$.rightoffold(a, {threshold: 0, container: window}); 
		}
	});
    
})(jQuery, window);

/**
 * Leyewen jQuery flag
 * use Binary to represent 32bit true/false
 * Time: 20120313 version: 1.02
 * 
 * key: enter key(number only && key>0), options: flag get/set, flag number start from 0~31;
 * @usage:
 * 		get: $.flag(key, optionsNumber);			@get optionsNumber's status from key, return true/false
 *		set: $.flag(key, optionsNumber, value);		@set optionsNumber's status to key, return new key
 * 		set: $.flag(key, options);					@set options(e.g {0:true, 1:false, 5:true}) to key, return new key
 * 		set: $.flag(key, options);					@set options(e.g {"true":[0, 1, 2], "false":[3]}) to key, return new key
**/

(function($) {
	$.flag = function(key, options, value) {
		if (typeof key != 'number') {
			return null;
		}
		
		var settings = {
			key:	0,
			digit:	32,
			options:	'',
			setBoolean:	''
		};
		var checkFlag;
		var i;
		
		if (options || options === 0) {
			$.extend(settings, {key: key, options: options, setBoolean: value});
			
			if (typeof options === 'number') {
				if (typeof settings.setBoolean != 'boolean') {
					if (settings.options >= 0 && settings.options < settings.digit) {
						checkFlag = 0x1 << settings.options;
						return (settings.key & checkFlag) == checkFlag;
					} else {
						return false;
					}
				} else {
					if (settings.options >= 0 && settings.options < settings.digit) {
						checkFlag = 0x1 << settings.options;
						if (settings.setBoolean) {
							key |= checkFlag;
						} else {
							key &= ~checkFlag;
						}
					}
					return key;
				}
			} else if (typeof options === 'object') {
				var ot = options['true'];
				var of = options['false'];
				if ((typeof ot != 'undefined' || typeof of != 'undefined') && (ot.length > 0 || of.length > 0)) {
					var newOptions = {};
					for (i = 0; i < ot.length; i++) {
						newOptions[ot[i]] = true;
					}
					for (i = 0; i < of.length; i++) {
						newOptions[of[i]] = false;
					}
					$.extend(settings, {options: newOptions});
				}
				
				for (i = 0; i < settings.digit; i++) {
					var setFlag = settings.options[i];
					checkFlag = 0x1 << i;
					if (typeof setFlag != 'undefined' && typeof setFlag === 'boolean') {
						if (setFlag) {
							key |= checkFlag;
						} else {
							key &= ~checkFlag;
						}
					}
				}
				return key;
			}
		} else {
			return null;
		}
	};
})(jQuery);

/*
 * jQuery MD5 Plugin 1.2.1
 * https://github.com/blueimp/jQuery-MD5
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, jQuery */
(function($) {
	'use strict';

	/*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF),
			msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
    * Bitwise rotate a 32-bit number to the left.
    */
	function bit_rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
    * These functions implement the four basic operations the algorithm uses.
    */
	function md5_cmn(q, a, b, x, s, t) {
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	}
	function md5_ff(a, b, c, d, x, s, t) {
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t) {
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t) {
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t) {
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
	function binl_md5(x, len) {
		/* append padding */
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var i, olda, oldb, oldc, oldd,
			a =  1732584193,
			b = -271733879,
			c = -1732584194,
			d =  271733878;

		for (i = 0; i < x.length; i += 16) {
			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;

			a = md5_ff(a, b, c, d, x[i],       7, -680876936);
			d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
			b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
			d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
			c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
			d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
			d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

			a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
			d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
			c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
			b = md5_gg(b, c, d, a, x[i],      20, -373897302);
			a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
			d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
			c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
			d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
			c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
			a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
			d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
			c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
			b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
			d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
			b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
			d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
			c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
			d = md5_hh(d, a, b, c, x[i],      11, -358537222);
			c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
			a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
			d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
			b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

			a = md5_ii(a, b, c, d, x[i],       6, -198630844);
			d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
			c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
			d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
			d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
			a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
			d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
			b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
		}
		return [a, b, c, d];
	}

	/*
    * Convert an array of little-endian words to a string
    */
	function binl2rstr(input) {
		var i,
			output = '';
		for (i = 0; i < input.length * 32; i += 8) {
			output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
		}
		return output;
	}

	/*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
	function rstr2binl(input) {
		var i,
			output = [];
		output[(input.length >> 2) - 1] = undefined;
		for (i = 0; i < output.length; i += 1) {
			output[i] = 0;
		}
		for (i = 0; i < input.length * 8; i += 8) {
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
		}
		return output;
	}

	/*
    * Calculate the MD5 of a raw string
    */
	function rstr_md5(s) {
		return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	}

	/*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
	function rstr_hmac_md5(key, data) {
		var i,
			bkey = rstr2binl(key),
			ipad = [],
			opad = [],
			hash;
		ipad[15] = opad[15] = undefined;                        
		if (bkey.length > 16) {
			bkey = binl_md5(bkey, key.length * 8);
		}
		for (i = 0; i < 16; i += 1) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
		return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	}

	/*
    * Convert a raw string to a hex string
    */
	function rstr2hex(input) {
		var hex_tab = '0123456789abcdef',
			output = '',
			x,
			i;
		for (i = 0; i < input.length; i += 1) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
		}
		return output;
	}

	/*
    * Encode a string as utf-8
    */
	function str2rstr_utf8(input) {
		return unescape(encodeURIComponent(input));
	}

	/*
    * Take string arguments and return either raw or hex encoded strings
    */
	function raw_md5(s) {
		return rstr_md5(str2rstr_utf8(s));
	}
	function hex_md5(s) {
		return rstr2hex(raw_md5(s));
	}
	function raw_hmac_md5(k, d) {
		return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
	}
	function hex_hmac_md5(k, d) {
		return rstr2hex(raw_hmac_md5(k, d));
	}
    
	$.md5 = function(string, key, raw) {
		if (!key) {
			if (!raw) {
				return hex_md5(string);
			} else {
				return raw_md5(string);
			}
		}
		if (!raw) {
			return hex_hmac_md5(key, string);
		} else {
			return raw_hmac_md5(key, string);
		}
	};
    
}(typeof jQuery === 'function' ? jQuery : this));

/*
 * jQuery Numeric
 * Version 1.3.1
 * Demo: http://www.texotela.co.uk/code/jquery/numeric/
 *
 */
(function($) {
/*
 * Allows only valid characters to be entered into input boxes.
 * Note: fixes value when pasting via Ctrl+V, but not when using the mouse to paste
  *      side-effect: Ctrl+A does not work, though you can still use the mouse to select (or double-click to select all)
 *
 * @name     numeric
 * @param    config      { decimal : "." , negative : true }
 * @param    callback     A function that runs if the number is not valid (fires onblur)
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @example  $(".numeric").numeric();
 * @example  $(".numeric").numeric(","); // use , as separator
 * @example  $(".numeric").numeric({ decimal : "," }); // use , as separator
 * @example  $(".numeric").numeric({ negative : false }); // do not allow negative values
 * @example  $(".numeric").numeric(null, callback); // use default values, pass on the 'callback' function
 *
 */
	$.fn.numeric = function(config, callback) {
		if (typeof config === 'boolean') {
			config = {decimal: config};
		}
		config = config || {};
		// if config.negative undefined, set to true (default is to allow negative numbers)
		if (typeof config.negative == 'undefined') {
			config.negative = true; 
		}
		// set decimal point
		var decimal = (config.decimal === false) ? '' : config.decimal || '.';
		// allow negatives
		var negative = (config.negative === true);
		// callback function
		callback = (typeof (callback) == 'function' ? callback : function() {});
		// set data and methods
		return this.data('numeric.decimal', decimal).data('numeric.negative', negative).data('numeric.callback', callback).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur);
	};

	$.fn.numeric.keypress = function(e) {
	// get decimal character and determine if negatives are allowed
		var decimal = $.data(this, 'numeric.decimal');
		var negative = $.data(this, 'numeric.negative');
		// get the key that was pressed
		var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
		// allow enter/return key (only when in an input box)
		if (key == 13 && this.nodeName.toLowerCase() == 'input') {
			return true;
		} else if (key == 13) {
			return false;
		}
		var allow = false;
		// allow Ctrl+A
		if ((e.ctrlKey && key == 97 /* firefox */) || (e.ctrlKey && key == 65) /* opera */) {
			return true; 
		}
		// allow Ctrl+X (cut)
		if ((e.ctrlKey && key == 120 /* firefox */) || (e.ctrlKey && key == 88) /* opera */) {
			return true; 
		}
		// allow Ctrl+C (copy)
		if ((e.ctrlKey && key == 99 /* firefox */) || (e.ctrlKey && key == 67) /* opera */) {
			return true; 
		}
		// allow Ctrl+Z (undo)
		if ((e.ctrlKey && key == 122 /* firefox */) || (e.ctrlKey && key == 90) /* opera */) {
			return true; 
		}
		// allow or deny Ctrl+V (paste), Shift+Ins
		if ((e.ctrlKey && key == 118 /* firefox */) || (e.ctrlKey && key == 86) /* opera */ ||
			(e.shiftKey && key == 45)) {
			return true; 
		}
		// if a number was not pressed
		if (key < 48 || key > 57) {
			var value = $(this).val();
			/* '-' only allowed at start and if negative numbers allowed */
			if (value.indexOf('-') !== 0 && negative && key == 45 && (value.length === 0 || parseInt($.fn.getSelectionStart(this), 10) === 0)) {
				return true; 
			}
			/* only one decimal separator allowed */
			if (decimal && key == decimal.charCodeAt(0) && value.indexOf(decimal) != -1) {
				allow = false;
			}
			// check for other keys that have special purposes
			if (
				key != 8 /* backspace */ &&
			key != 9 /* tab */ &&
			key != 13 /* enter */ &&
			key != 35 /* end */ &&
			key != 36 /* home */ &&
			key != 37 /* left */ &&
			key != 39 /* right */ &&
			key != 46 /* del */
			) {
				allow = false;
			} else {
			// for detecting special keys (listed above)
			// IE does not support 'charCode' and ignores them in keypress anyway
				if (typeof e.charCode != 'undefined') {
				// special keys have 'keyCode' and 'which' the same (e.g. backspace)
					if (e.keyCode == e.which && e.which !== 0) {
						allow = true;
						// . and delete share the same code, don't allow . (will be set to true later if it is the decimal point)
						if (e.which == 46) {
							allow = false; 
						}
					} else if (e.keyCode !== 0 && e.charCode === 0 && e.which === 0) {
						// or keyCode != 0 and 'charCode'/'which' = 0
						allow = true;
					}
				}
			}
			// if key pressed is the decimal and it is not already in the field
			if (decimal && key == decimal.charCodeAt(0)) {
				if (value.indexOf(decimal) == -1) {
					allow = true;
				} else {
					allow = false;
				}
			}
		} else {
			allow = true;
		}
		return allow;
	};

	$.fn.numeric.keyup = function() {
		var val = $(this).val();
		if (val && val.length > 0) {
		// get carat (cursor) position
			var carat = $.fn.getSelectionStart(this);
			var selectionEnd = $.fn.getSelectionEnd(this);
			// get decimal character and determine if negatives are allowed
			var decimal = $.data(this, 'numeric.decimal');
			var negative = $.data(this, 'numeric.negative');
		
			// prepend a 0 if necessary
			if (decimal !== '' && decimal !== null) {
			// find decimal point
				var dot = val.indexOf(decimal);
				// if dot at start, add 0 before
				if (dot === 0) {
					this.value = '0' + val;
				}
				// if dot at position 1, check if there is a - symbol before it
				if (dot == 1 && val.charAt(0) == '-') {
					this.value = '-0' + val.substring(1);
				}
				val = this.value;
			}
		
			// if pasted in, only allow the following characters
			var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '-', decimal];
			// get length of the value (to loop through)
			var length = val.length;
			// loop backwards (to prevent going out of bounds)
			for (var i = length - 1; i >= 0; i--) {
				var ch = val.charAt(i);
				if (i !== 0 && ch == '-') {
					// remove '-' if it is in the wrong place
					val = val.substring(0, i) + val.substring(i + 1);
				} else if (i === 0 && !negative && ch == '-') {
					// remove character if it is at the start, a '-' and negatives aren't allowed
					val = val.substring(1);
				}
				var validChar = false;
				// loop through validChars
				for (var j = 0; j < validChars.length; j++) {
				// if it is valid, break out the loop
					if (ch == validChars[j]) {
						validChar = true;
						break;
					}
				}
				// if not a valid character, or a space, remove
				if (!validChar || ch == ' ') {
					val = val.substring(0, i) + val.substring(i + 1);
				}
			}
			// remove extra decimal characters
			var firstDecimal = val.indexOf(decimal);
			if (firstDecimal > 0) {
				for (var k = length - 1; k > firstDecimal; k--) {
					var chch = val.charAt(k);
					// remove decimal character
					if (chch == decimal) {
						val = val.substring(0, k) + val.substring(k + 1);
					}
				}
			}
			// set the value and prevent the cursor moving to the end
			this.value = val;
			$.fn.setSelection(this, [carat, selectionEnd]);
		}
	};

	$.fn.numeric.blur = function() {
		var decimal = $.data(this, 'numeric.decimal');
		var callback = $.data(this, 'numeric.callback');
		var val = this.value;
		if (val !== '') {
			var re = new RegExp('^\\d+$|^\\d*' + decimal + '\\d+$');
			if (!re.exec(val)) {
				callback.apply(this);
			}
		}
	};

	$.fn.removeNumeric = function() {
		return this.data('numeric.decimal', null).data('numeric.negative', null).data('numeric.callback', null).unbind('keypress', $.fn.numeric.keypress).unbind('blur', $.fn.numeric.blur);
	};

	// Based on code from http://javascript.nwbox.com/cursor_position/ (Diego Perini <dperini@nwbox.com>)
	$.fn.getSelectionStart = function(o) {
		if (o.createTextRange) {
			var r = document.selection.createRange().duplicate();
			r.moveEnd('character', o.value.length);
			if (r.text === '') {
				return o.value.length; 
			}
			return o.value.lastIndexOf(r.text);
		} else {
			return o.selectionStart; 
		}
	};

	// Based on code from http://javascript.nwbox.com/cursor_position/ (Diego Perini <dperini@nwbox.com>)
	$.fn.getSelectionEnd = function(o) {
		if (o.createTextRange) {
			var r = document.selection.createRange().duplicate();
			r.moveStart('character', -o.value.length);
			return r.text.length;
		} else return o.selectionEnd;
	};

	// set the selection, o is the object (input), p is the position ([start, end] or just start)
	$.fn.setSelection = function(o, p) {
	// if p is number, start and end are the same
		if (typeof p == 'number') {
			p = [p, p]; 
		}
		// only set if p is an array of length 2
		if (p && p.constructor == Array && p.length == 2) {
			if (o.createTextRange) {
				var r = o.createTextRange();
				r.collapse(true);
				r.moveStart('character', p[0]);
				r.moveEnd('character', p[1]);
				r.select();
			} else if (o.setSelectionRange) {
				o.focus();
				o.setSelectionRange(p[0], p[1]);
			}
		}
	};

})(jQuery);

/*
 * jQuery Browser Plugin v0.0.2
 * https://github.com/gabceb/jquery-browser-plugin
 * 重写jQuery默认的$.browser方法，以支持更多的浏览器及新版浏览器
 *
 * Date: 2013-07-29T17:23:27-07:00
 */

(function(jQuery, window) {
	'use strict';
	
	var matched, browser;
	
	jQuery.uaMatch = function(ua) {
		ua = ua.toLowerCase();
		
		var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
			/(chrome)[ \/]([\w.]+)/.exec(ua) ||
			/(webkit)[ \/]([\w.]+)/.exec(ua) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
			/(msie) ([\w.]+)/.exec(ua) ||
			ua.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
			ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
			[];
		
		var platform_match = /(ipad)/.exec(ua) ||
			/(iphone)/.exec(ua) ||
			/(android)/.exec(ua) ||
			[];
		
		return {
			browser: match[1] || '',
			version: match[2] || '0',
			platform: platform_match[0] || ''
		};
	};
	
	matched = jQuery.uaMatch(window.navigator.userAgent);
	browser = {};
	
	if (matched.browser) {
		browser[matched.browser] = true;
		browser.version = matched.version;
	}
	
	if (matched.platform) {
		browser[matched.platform] = true;
	}
	
	// Chrome and Opera 15+ are Webkit, but Webkit is also Safari.
	if (browser.chrome || browser.opr) {
		browser.webkit = true;
	} else if (browser.webkit) {
		browser.safari = true;
	}
	
	// IE11 has a new token so we will assign it msie to avoid breaking changes
	if (browser.rv) {
		browser.msie = true;
	}
	
	// Opera 15+ are identified as opr
	if (browser.opr) {
		browser.opera = true;
	}
	
	jQuery.browser = browser;

})(jQuery, window);

/*
 * jquery.removecss.js
 * Remove multiple properties from an element in your DOM.
 *
 * @param {Array|Object|String} css
 */
(function($) {
	$.fn.removeCss = function(css) {
		var properties = [];
		var type = $.type(css);
		if (type === 'array') {
			properties = css;	
		} else if (type === 'object') {
			for (var rule in css) {
				properties.push(rule);
			}
		} else if (type === 'string') {
			properties = css.replace(/,$/, '').split(',');
		}
		
		return this.each(function() {
			var thisObj = $(this);
			$.map(properties, function(prop) {
				thisObj.css(prop, '');
			});
		});
	};
})(jQuery);


/**
 * jQuery livequery
 * Version: 1.1.1
 * Requires jQuery 1.3+
 * Docs: http://docs.jquery.com/Plugins/livequery
 */

(function($) {
	
	$.extend($.fn, {
		livequery: function(type, fn, fn2) {
			var self = this, q;
	
			// Handle different call patterns
			if ($.isFunction(type))
				fn2 = fn, fn = type, type = undefined;
	
			// See if Live Query already exists
			$.each($.livequery.queries, function(i, query) {
				if (self.selector == query.selector && self.context == query.context &&
					type == query.type && (!fn || fn.$lqguid == query.fn.$lqguid) && (!fn2 || fn2.$lqguid == query.fn2.$lqguid))
				// Found the query, exit the each loop
					return (q = query) && false;
			});
	
			// Create new Live Query if it wasn't found
			q = q || new $.livequery(this.selector, this.context, type, fn, fn2);
	
			// Make sure it is running
			q.stopped = false;
	
			// Run it immediately for the first time
			q.run();
	
			// Contnue the chain
			return this;
		},
	
		expire: function(type, fn, fn2) {
			var self = this;
	
			// Handle different call patterns
			if ($.isFunction(type))
				fn2 = fn, fn = type, type = undefined;
	
			// Find the Live Query based on arguments and stop it
			$.each($.livequery.queries, function(i, query) {
				if (self.selector == query.selector && self.context == query.context &&
					(!type || type == query.type) && (!fn || fn.$lqguid == query.fn.$lqguid) && (!fn2 || fn2.$lqguid == query.fn2.$lqguid) && !this.stopped)
					$.livequery.stop(query.id);
			});
	
			// Continue the chain
			return this;
		}
	});
	
	$.livequery = function(selector, context, type, fn, fn2) {
		this.selector = selector;
		this.context  = context;
		this.type     = type;
		this.fn       = fn;
		this.fn2      = fn2;
		this.elements = [];
		this.stopped  = false;
	
		// The id is the index of the Live Query in $.livequery.queries
		this.id = $.livequery.queries.push(this) - 1;
	
		// Mark the functions for matching later on
		fn.$lqguid = fn.$lqguid || $.livequery.guid++;
		if (fn2) fn2.$lqguid = fn2.$lqguid || $.livequery.guid++;
	
		// Return the Live Query
		return this;
	};
	
	$.livequery.prototype = {
		stop: function() {
			var query = this;
	
			if (this.type)
				// Unbind all bound events
				this.elements.unbind(this.type, this.fn);
			else if (this.fn2)
				// Call the second function for all matched elements
				this.elements.each(function(i, el) {
					query.fn2.apply(el);
				});
	
			// Clear out matched elements
			this.elements = [];
	
			// Stop the Live Query from running until restarted
			this.stopped = true;
		},
	
		run: function() {
			// Short-circuit if stopped
			if (this.stopped) return;
			var query = this;
	
			var oEls = this.elements,
				els  = $(this.selector, this.context),
				nEls = els.not(oEls);
	
			// Set elements to the latest set of matched elements
			this.elements = els;
	
			if (this.type) {
				// Bind events to newly matched elements
				nEls.bind(this.type, this.fn);
	
				// Unbind events to elements no longer matched
				if (oEls.length > 0)
					$.each(oEls, function(i, el) {
						if ($.inArray(el, els) < 0)
							$.event.remove(el, query.type, query.fn);
					});
			} else {
				// Call the first function for newly matched elements
				nEls.each(function() {
					query.fn.apply(this);
				});
	
				// Call the second function for elements no longer matched
				if (this.fn2 && oEls.length > 0)
					$.each(oEls, function(i, el) {
						if ($.inArray(el, els) < 0)
							query.fn2.apply(el);
					});
			}
		}
	};
	
	$.extend($.livequery, {
		guid: 0,
		queries: [],
		queue: [],
		running: false,
		timeout: null,
	
		checkQueue: function() {
			if ($.livequery.running && $.livequery.queue.length) {
				var length = $.livequery.queue.length;
				// Run each Live Query currently in the queue
				while (length--)
					$.livequery.queries[$.livequery.queue.shift()].run();
			}
		},
	
		pause: function() {
			// Don't run anymore Live Queries until restarted
			$.livequery.running = false;
		},
	
		play: function() {
			// Restart Live Queries
			$.livequery.running = true;
			// Request a run of the Live Queries
			$.livequery.run();
		},
	
		registerPlugin: function() {
			$.each(arguments, function(i, n) {
				// Short-circuit if the method doesn't exist
				if (!$.fn[n]) return;
	
				// Save a reference to the original method
				var old = $.fn[n];
	
				// Create a new method
				$.fn[n] = function() {
					// Call the original method
					var r = old.apply(this, arguments);
	
					// Request a run of the Live Queries
					$.livequery.run();
	
					// Return the original methods result
					return r;
				};
			});
		},
	
		run: function(id) {
			if (id != undefined) {
				// Put the particular Live Query in the queue if it doesn't already exist
				if ($.inArray(id, $.livequery.queue) < 0)
					$.livequery.queue.push(id);
			} else
				// Put each Live Query in the queue if it doesn't already exist
				$.each($.livequery.queries, function(id) {
					if ($.inArray(id, $.livequery.queue) < 0)
						$.livequery.queue.push(id);
				});
	
			// Clear timeout if it already exists
			if ($.livequery.timeout) clearTimeout($.livequery.timeout);
			// Create a timeout to check the queue and actually run the Live Queries
			$.livequery.timeout = setTimeout($.livequery.checkQueue, 20);
		},
	
		stop: function(id) {
			if (id != undefined)
				// Stop are particular Live Query
				$.livequery.queries[id].stop();
			else
				// Stop all Live Queries
				$.each($.livequery.queries, function(id) {
					$.livequery.queries[id].stop();
				});
		}
	});
	
	// Register core DOM manipulation methods
	$.livequery.registerPlugin('append', 'prepend', 'after', 'before', 'wrap', 'attr', 'removeAttr', 'addClass', 'removeClass', 'toggleClass', 'empty', 'remove', 'html');
	
	// Run Live Queries when the Document is ready
	$(function() {
		$.livequery.play(); 
	});

})(jQuery);

/**
 * compareObjNew(obj1, obj2, order, key, type)
 */
Fai.compareObjNew = function(obj1, obj2, order, key, keyType) {
	var valA = obj1[key];
	var valB = obj2[key];
	
	if (typeof valA === 'undefined' || typeof valB === 'undefined') {
		return;
	}
	
	// 如果有传type是number。这里特殊处理
	if (keyType === 'number') {
		return Fai.ber(valA, valB, order);
	}
	
	// 如果是IE 6\7\8，调用浏览器自带的排序，自带排序不会太卡
	if (Fai.isIE6() || Fai.isIE7() || Fai.isIE8()) {
		return Fai.compareObjLocale(obj1, obj2, order, key);
	}
	
	return Fai.compareStrings(valA, valB, order);
};

/**
 * compareObjLocale(obj1, obj2, order, key)
 * use browser locale sort
 */
Fai.compareObjLocale = function(obj1, obj2, order, key) {
	var valA = obj1[key];
	var valB = obj2[key];
	
	// change number to string
	if (typeof valA === 'number' || typeof valA === 'boolean') {
		valA = valA.toString();
	}
	if (typeof valB === 'number' || typeof valB === 'boolean') {
		valB = valB.toString();
	}
	
	if (order == 'asc') {
		return valA.localeCompare(valB);
	} else {
		return valB.localeCompare(valA);
	}
};

/**
 * ber(obj1, obj2, order)
 */
Fai.ber = function(s1, s2, order) {
	if (s1 === s2) {
		return 0;
	}
	if (order == 'asc') {
		return s1 > s2 ? 1 : -1;
	} else {
		return s1 > s2 ? -1 : 1;
	}
};

/**
 * compareStrings(s1, s2, order)
 */
Fai.compareStrings = function(s1, s2, order) {
	// change number to string
	if (typeof s1 === 'number' || typeof s1 === 'boolean') {
		s1 = s1.toString();
	}
	if (typeof s2 === 'number' || typeof s2 === 'boolean') {
		s2 = s2.toString();
	}
	
	var options = {
		str1: s1,
		str2: s2,
		len1: s1.length,
		len2: s2.length,
		pos1: 0,
		pos2: 0
	};

	var result = 0;
	while (result == 0 && options.pos1 < options.len1 && options.pos2 < options.len2) {
		var ch1 = options.str1.charAt(options.pos1);
		var ch2 = options.str2.charAt(options.pos2);

		if (Fai.isDigit(ch1)) {
			result = Fai.isDigit(ch2) ? bers(options) : -1;
		} else if (Fai.isChinese(ch1)) {
			result = Fai.isChinese(ch2) ? comparePinyin(options) : 1;
		} else if (Fai.isLetter(ch1)) {
			result = (Fai.isLetter(ch2) || Fai.isChinese(ch2)) ? compareOther(options, true) : 1;
		} else {
			result = Fai.isDigit(ch2) ? 1 : (Fai.isLetter(ch2) || Fai.isChinese(ch2)) ? -1 : compareOther(options, false);
		}

		options.pos1++;
		options.pos2++;
	}
	
	if (order == 'asc') {
		return result == 0 ? options.len1 - options.len2 : result;
	} else {
		return -(result == 0 ? options.len1 - options.len2 : result);
	}
	
	// 内部方法bers
	function bers(options) {
		var end1 = options.pos1 + 1;
		while (end1 < options.len1 && Fai.isDigit(options.str1.charAt(end1))) {
			end1++;
		}
		var fullLen1 = end1 - options.pos1;
		while (options.pos1 < end1 && options.str1.charAt(options.pos1) == '0') {
			options.pos1++;
		}
	
		var end2 = options.pos2 + 1;
		while (end2 < options.len2 && Fai.isDigit(options.str2.charAt(end2))) {
			end2++;
		}
		var fullLen2 = end2 - options.pos2;
		while (options.pos2 < end2 && options.str2.charAt(options.pos2) == '0') {
			options.pos2++;
		}
	
		var delta = (end1 - options.pos1) - (end2 - options.pos2);
		if (delta != 0) {
			return delta;
		}
	
		while (options.pos1 < end1 && options.pos2 < end2) {
			delta = options.str1.charCodeAt(options.pos1++) - options.str2.charCodeAt(options.pos2++);
			if (delta != 0) {
				return delta;
			}
		}
	
		options.pos1--;
		options.pos2--;
	
		return fullLen2 - fullLen1;
	}
	
	// 内部方法compareOther
	function compareOther(options, isLetters) {
		var ch1 = options.str1.charAt(options.pos1);
		var ch2 = options.str2.charAt(options.pos2);
	
		if (ch1 == ch2) {
			return 0;
		}
	
		if (isLetters) {
			ch1 = ch1.toUpperCase();
			ch2 = ch2.toUpperCase();
			if (ch1 != ch2) {
				ch1 = ch1.toLowerCase();
				ch2 = ch2.toLowerCase();
			}
		}
		
		return ch1.charCodeAt(0) - ch2.charCodeAt(0);
	}
	
	// 内部方法comparePinyin
	function comparePinyin(options) {
		var ch1 = options.str1.charAt(options.pos1);
		var ch2 = options.str2.charAt(options.pos2);
		
		if (ch1 == ch2) {
			return 0;
		}
		
		var py1, py2;
		if (typeof window.Pinyin != 'undefined') {
			py1 = window.Pinyin.getStringStriped(ch1, window.Pinyin.mode.LOWERCASE, true);
			py2 = window.Pinyin.getStringStriped(ch2, window.Pinyin.mode.LOWERCASE, true);
			return -Fai.compareStrings(py1, py2);
		} else {
			py1 = ch1.charCodeAt(0);
			py2 = ch2.charCodeAt(0);
			
			if (py1 == py2) {
				return 0;
			} else {
				return py1 - py2;
			}
		}
	}
	
};

Fai.punycode = function() {
	var maxInt = 2147483647,
		floor = Math.floor,
		base = 36,
		tMin = 1,
		tMax = 26,
		initialBias = 72,
		stringFromCharCode = String.fromCharCode,
		damp = 700,
		delimiter = '-',
		baseMinusTMin = base - tMin,
		skew = 38,
		initialN = 128,
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		}; // 0x80
	
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}
	
	function ucs2decode(string) {
		var output = [],
			counter = 0,
			length = string.length,
			value,
			extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}
	
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}
	
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}
	
	function encode(input) {
		var n,
			delta,
			handledCPCount,
			basicLength,
			bias,
			j,
			m,
			q,
			k,
			t,
			currentValue,
			output = [],
			/** `inputLength` will hold the number of code points in `input`. */
			inputLength,
			/** Cached calculation results */
			handledCPCountPlusOne,
			baseMinusT,
			qMinusT;
		
		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);
		
		// Cache the length
		inputLength = input.length;
		
		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;
		
		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}
		
		handledCPCount = basicLength = output.length;
		
		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.
		
		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}
		
		// Main encoding loop:
		while (handledCPCount < inputLength) {
		
			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}
			
			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,

			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				throw RangeError(errors['overflow']);
			}
			
			delta += (m - n) * handledCPCountPlusOne;
			n = m;
			
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				
				if (currentValue < n && ++delta > maxInt) {
					throw RangeError(errors['overflow']);
				}
				
				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}
			
					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}
			
			++delta;
			++n;
		
		}
		return output.join('');
	}
	function decode(input) {
		// Don't use UCS-2
		var output = [],
			inputLength = input.length,
			out,
			i = 0,
			n = initialN,
			bias = initialBias,
			basic,
			j,
			index,
			oldi,
			w,
			k,
			digit,
			t,
			/** Cached calculation results */
			baseMinusT;
	
		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.
	
		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}
	
		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				throw RangeError(errors['not-basic']);
			}
			output.push(input.charCodeAt(j));
		}
	
		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.
	
		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
	
			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					throw RangeError(errors['invalid-input']);
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					throw RangeError(errors['overflow']);
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					throw RangeError(errors['overflow']);
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				throw RangeError(errors['overflow']);
			}

			n += floor(i / out);
			i %= out;


			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);
	
		}
	
		return ucs2encode(output);
	}
	return {
		'encode': encode,
		'decode': decode
	};
}();

Fai.isFontIcon = function(iconId) {
	if (!iconId || iconId.length == 0 || iconId.length < 'FontIcon_'.length) {
		return false;
	}

	return iconId.substring(0, 'NewFontIcon_'.length) == 'NewFontIcon_' || iconId.substring(0, 'FontIcon_'.length) == 'FontIcon_';
};

/**
* 返回"非默认语言版本"后缀
*/
Fai.getLanCode = function() {
	var lcid = top.Fai.top._lcid, lanCode = '';
	lcid = lcid ? lcid : 2052;
	if (lcid == 2052) {
		lanCode = 'cn';
	}
	if (lcid == 1033) {
		lanCode = 'en';
	} else if (lcid == 1028) {
		lanCode = 'tcn';
	} else if (lcid == 1041) {
		lanCode = 'jp';
	} else if (lcid == 1042) {
		lanCode = 'kor';
	} else if (lcid == 1108) {
		lanCode = 'lo';
	} else if (lcid == 1054) {
		lanCode = 'th';
	} else if (lcid == 11274) {
		lanCode = 'es';
	} else if (lcid == 1049) {
		lanCode = 'ru';
	} else if (lcid == 1036) {
		lanCode = 'fra';
	} else if (lcid == 1040) {
		lanCode = 'it';
	} else if (lcid == 1031) {
		lanCode = 'de';
	}

	//startsWith ie不支持
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function(searchString, position) {
			position = position || 0;
			return this.indexOf(searchString, position) === position;
		};
	}

	//当前路径url不包含lanCode时，表明当前默认语言版本
	var url = window.location.pathname;
	if (!url.startsWith('/' + lanCode)) {
		lanCode = '';
	}
	return lanCode;
};

/**
*给价格数值增加千分位分隔符
*price:价格，num:保留num位小数,isIgnoreNum:boolean(true代表按原price的小数计)
**/
Fai.formatPriceEn = function(price, num, isIgnoreNum) {
	num = ((num >= 0 && num <= 20) ? num : 2);

	if (isIgnoreNum) {
		price = parseFloat((price + '').replace(/[^\d\.-]/g, '')) + '';
	} else {
		price = parseFloat((price + '').replace(/[^\d\.-]/g, '')).toFixed(num) + '';
	}

	if (num == 0 || (isIgnoreNum && price.indexOf('.') < 0)) {
		var prePriceRvs = price.split('').reverse(),
			res = '';
		for (i = 0; i < prePriceRvs.length; i++) {
			res += prePriceRvs[i] + ((i + 1) % 3 == 0 && (i + 1) != prePriceRvs.length ? ',' : '');
		}
		return res.split('').reverse().join('');
	} else {
		var prePriceRvs2 = price.split('.')[0].split('').reverse(),
			aftPriceRvs2 = price.split('.')[1];
		var res2 = '';
		for (var i = 0; i < prePriceRvs2.length; i++) {
			res2 += prePriceRvs2[i] + ((i + 1) % 3 == 0 && (i + 1) != prePriceRvs2.length ? ',' : '');
		}
		return res2.split('').reverse().join('') + '.' + aftPriceRvs2;
	}
};

//16进制颜色转rgb
Fai.hexadecimalToRgb = function(color) {  
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
	var colorNew = '#';  
	var colorChange = [];
	var i;
	color = color.toLowerCase(); 

	if (color && reg.test(color)) {  
		if (color.length === 4) {  
			for (i = 1; i < 4; i += 1) {  
				colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));     
			}  
			color = colorNew;  
		}  
		//处理六位的颜色值  
		for (i = 1; i < 7; i += 2) {  
			colorChange.push(parseInt('0x' + color.slice(i, i + 2)));    
		}  
		return colorChange.join(',');  
	} else {  
		return color;    
	}  
};  
/*
* @description: 划定某个时间范围内的用户为新用户
* @created by jser 2017-10-18
* @arguments: 
*     time:时间范围
* @return
* 	  undefined:异常情况
*     true:新用户
*     false:老用户 
*/
Fai.isNewUser = function(timeRange) {
	var err = void 0;
	if (timeRange === err) {
		return err;
	}
	
	var ct = Fai.top._acctCreateTime;//创建时间（ms）
	
	if (ct === void 0) {//异常情况，放弃统计
		return;
	}
	
	var currTime = (new Date()).getTime();//当前时间(ms)
	var timeOffset = (currTime - ct);//时间差
	
	if (ct <= 0 || timeOffset < 0) {
		return; 
	}
	
	timeOffset = toDay(timeOffset);
	
	return (timeOffset <= timeRange);
	
	function toDay(ms) {
		var dayUnit = 1000 * 60 * 60 * 24;
		return Math.ceil(ms / dayUnit) || 0;
	}	
};

Fai.setPopupCustomConfirm = function(popupId, customConfirm) {
	if (Fai.isNull(Fai.top._popupOptions)) {
		return;
	}
	if (Fai.isNull(Fai.top._popupOptions['popup' + popupId])) {
		return;
	}
	if (typeof customConfirm !== 'function') {
		return;
	}
	Fai.top._popupOptions['popup' + popupId].customConfirm = customConfirm;
};

Fai.setPopupCustomChange = function(popupId, customChange) {
	if (Fai.isNull(Fai.top._popupOptions)) {
		return;
	}
	if (Fai.isNull(Fai.top._popupOptions['popup' + popupId])) {
		return;
	}
	Fai.top._popupOptions['popup' + popupId].customChange = customChange;
};

Fai.removeAllIng = function() {
	Fai.top.$("#ing").remove();
};

Fai.isSupportWebp = function() {
	var isSupportWebp = false;

	try {
		isSupportWebp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
	} catch(err) {
		console.log(err);
	}

	Fai.isSupportWebp = function () {
		return isSupportWebp;
	}

    return Fai.isSupportWebp();
};