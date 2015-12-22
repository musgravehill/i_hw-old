var collaps_state = true;
function setOpacity(id, value)
{
   var testObj = document.getElementById(id);
 
   testObj.style.opacity = value/10;
   testObj.style.filter = 'alpha(opacity=' + value*10 + ')';
}
function EstimationChoose(chc)
{
  for (i1 = 0; i1 < 5; i1++)
  {   
    if (i1 <= chc)
    {
      setOpacity('est_star_' + i1, 10);
    }
    else
    {
      setOpacity('est_star_' + i1, 2);
    }
  }
}
function collapse_tag(Obj, _container)
{
 Obj1=document.getElementById(Obj);
 Obj2=document.getElementById(_container);
 if(collaps_state==true)
 {
 collaps_state=false; 
 count = 20;
 interval1 = setInterval(function km() {
 if (count <= 100)
 {
  Obj1.style.height=count;
  var rect = 'rect(auto, auto, '+ count +'px, auto )';   
  Obj2.style.clip = rect;
  count+=10;
 }
else 
 {
  clearInterval(interval1);
 };
 }, 10);
 }
 else if(collaps_state==false)
 {
 collaps_state=true;
 count = 100;
 interval2 = setInterval(function kr() {
 if (count >= 20)
 {
  Obj1.style.height=count;
  var rect = 'rect(auto, auto, '+ count +'px, auto )';   
  Obj2.style.clip = rect;
  count-=10;
 }
else 
 {
  clearInterval(interval2);
 };
 }, 10); 
 }
}
