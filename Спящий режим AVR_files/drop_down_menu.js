function dropDownMenu() {
   
$("#noscriptmenu > div").css("display", "none");

var m = new Array();

$("#noscriptmenu > div").each(function(i){
 i++;
 m[i] = new Array(); 
 $("#lm"+i+" > a").each(function(ii){
  m[i][ii] = new Array(this.href, $(this).html()); 
 });
});

$("#bread_crumbs > a, #bread_crumbs > span").each(function(i){
 if (i && m[i] && m[i].length > 1) { 
  var d = '<div class="dropDownMenu" id="ddm'+i+'">';
  for (ii = 0, l = m[i].length; ii < l; ii++) {
   if (m[i][ii][0] !== this.href) { 
    d += '<div><img src="'+themeRoot+'/img/dlm.png" alt="&gt;" /> <a href="'+m[i][ii][0]+'">'+m[i][ii][1]+'</a></div> ';  
   } 
  }  
  d += '</div>';
  $(d).insertAfter("#header");
 }
 
 var e = "#ddm"+i; 
  
 $(e).css("top", $(this).offset().top+15+"px"); 
 $(e).css("left", $(this).offset().left-31+"px");
 
 $(this).mouseover(function(){ddmShow(e, this);}); 
 $(this).mouseout(function(){ddmHide(e);}); 
 $(e).mouseover(function(){ddmShow(e);}); 
 $(e).mouseout(function(){ddmHide(e);}); 
  
});

}  

function ddmShow(e, a) {
 $(e).show();                             
 $(e).css("left", $(a).offset().left-31+"px");
 $(e).css("top", $(a).offset().top+15+"px"); 
 if (a && $(e).width() < $(a).width()+25) {$(e).width($(a).width()+25+"px");}  
}

function ddmHide(e) {$(e).hide();} 
