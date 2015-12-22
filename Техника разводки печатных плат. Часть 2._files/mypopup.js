/*
function gup(nume){ var w,h;
  if     (nume == '10'){ w=600; h=450; }   
	else{ w=600; h=600; }

function gup(nume) {var w,h;
var w=500;
var h=500;
	var WName = 'piknik';
	var ipath = '/photo/preview/15/';
	var URL = ipath+'catalog_cover1w.jpg';	
  openIMG(URL,WName,w,h);
  return '#';
}

function openWIN(URL,WName,w,h)
{
	sw = screen.width-100;
	sh = screen.availHeight-100;
	mtw = (screen.width-w)/2;
	mth = (screen.availHeight-h)/2;
	window.open(URL, WName, "width="+w+",height="+h+",top="+mth+",left="+mtw+",status=no,toolbar=no,scrollbars=no,resizable=no,menubar=no");
}


var myWinR;
function openIMG(URL,WName,w,h)
{
	if (myWinR != null && !myWinR.closed) myWinR.close();  
	sw = screen.width-100;
	sh = screen.availHeight-100;
	if (w > sw || h > sh)
	{
		if (w > sw) {w1 = sw;} else {w1 = w+17;}
		if (h > sh) {h1 = sh;} else {h1 = h+17;}
		mtw1 = (screen.width-w1)/2;
		mth1 = (screen.availHeight-h1)/2;
		myWinR = window.open('', WName, "width="+w1+",height="+h1+",top="+mth1+",left="+mtw1+",status=no,toolbar=no,scrollbars=yes,resizable=no,menubar=no");
		myWinR.focus();
	}
	else
	{
		mtw = (screen.width-w)/2;
		mth = (screen.availHeight-h)/2;
    	myWinR = window.open('', WName, "width="+w+",height="+h+",top="+mth+",left="+mtw+",status=no,toolbar=no,scrollbars=no,resizable=no,menubar=no");
		myWinR.focus();
	}
	myWinR.document.writeln('<html><head><title>FORESTER TM - На пикник!</title></head><body style="margin: 0px 0px 0px 0px"><a href="javascript:window.close();"><img src='+URL+' border=0 width='+w+' height='+h+' alt="Закрыть"></a></body></html>');
} 
<%= url_for :action =>'view_gallery', :controller =>'pages', :id => @photo.id %>
*/
function gup(url) {	
	var w=500;
	var h=500;
	var WName='bigphoto';
	var mtw = (screen.width-w)/2;
	var	mth = (screen.availHeight-h)/2;
	//var ipath = '';
	//var URL = ipath+'cover.jpg';
window.open (url, WName, "width=500 height=500 top="+mth+",left="+mtw+",status=no,toolbar=no,scrollbars=no,resizable=no,menubar=no");
 }