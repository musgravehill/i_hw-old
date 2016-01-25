lsCmtTreeClass.prototype.edit = {}

lsCmtTreeClass.prototype.startEdit = function(button, cmtId) {

  if(this.edit.text) {
    this.cancelEdit();
  }

  this.edit.text = $(button).getParent('div.comment').getElement('div.text');
  this.edit.text_source = $('cmt_src_'+cmtId);
  this.edit.oldHtml = this.edit.text.get('html');
  this.edit.buttons = $(button).getParent('div').getElements('a.cmtedit-button');
  this.edit.buttons[0].hide();
  this.edit.buttons[1].show();
  this.edit.buttons[2].show();

  var area = $$('#cmtedit_form textarea')[0];
//  area.setStyle('height',this.edit.text.getStyle('height'));
  
  var newHtml = $('cmtedit_form').get('html');
  
  this.edit.text.set('html',newHtml);
  
  this.edit.text.getElement('textarea').value = this.edit.text_source ? this.edit.text_source.value : this.edit.text.get('html');
  
  var newId = area.id + ((new Date()).getTime().toString().substring(10) * Math.round(Math.random()*1000));
  this.edit.text.getElement('textarea').id = newId;
  
  /* Устанавливаем куда будет вставлятся текст после загрузки картинки */
  sToLoadOverride = newId;
  
  tinyMCE && tinyMCE.execCommand('mceAddControl',true,newId);

}

lsCmtTreeClass.prototype.endEdit = function(button, cmtId) {
  var text = tinyMCE ? tinyMCE.activeEditor.getContent() : this.edit.text.getElement('textarea').value;
  var t = this;
  new Request.JSON({
    url: DIR_WEB_ROOT+'/ajax/comment/edit',
    noCache: true,
    data: {idComment:cmtId,comment_text:text,security_ls_key:LIVESTREET_SECURITY_KEY},
    onSuccess: function(result){
      if(!result) {
        msgErrorBox.alert('Error','Please try again later');  
        return t.cancelEdit();
      } else if(result && result.bState) {
        t.edit.text.set('html', result.newText);
        if(t.edit.text_source) {
          t.edit.text_source.value = result.newTextSource;
        }
        if(result.editInfo) {
          var edit_info = t.edit.text.getNext('div.text-more');
          if(!edit_info) {
            edit_info = new Element('div');
            edit_info.addClass('text-more');
            edit_info.addClass('edit-info');
            edit_info.inject(t.edit.text,'after');
          }
          edit_info.set('html',result.editInfo);
        }
        t.edit.buttons[0].show();
        t.edit.buttons[1].hide();
        t.edit.buttons[2].hide();
      } else if(result.bStateError) {
        msgErrorBox.alert(result.sMsgTitle,result.sMsg);
        return t.cancelEdit();
      }
    },
    onFailure: function(){
      msgErrorBox.alert('Error','Please try again later');
      return t.cancelEdit();
    }  
  }).send();
}

lsCmtTreeClass.prototype.cancelEdit = function() {
  if(this.edit.text && this.edit.buttons) {
    this.edit.text.set('html', this.edit.oldHtml);
    this.edit.buttons[0].show();
    this.edit.buttons[1].hide();
    this.edit.buttons[2].hide();
  }
}

if(tinyMCE) {
  lsCmtTreeClass.prototype._addComment = lsCmtTreeClass.prototype.addComment;
  
  lsCmtTreeClass.prototype.addComment = function(formObj,targetId,targetType) {
    $(formObj).getElement('textarea').value = tinyMCE.activeEditor.getContent();
    return this._addComment(formObj,targetId,targetType);
  };  
  
  lsCmtTreeClass.prototype.toggleCommentForm = function(idComment,idPerson) {
	  
	/*  Если мы добавляем комментарий, то используем форму по умолчанию, чтобы вставить результат картинки */
	sToLoadOverride = null; 
	
	  
    if (!$('reply_'+this.iCurrentShowFormComment) || !$('reply_'+idComment)) {
      return;
    } 
    divCurrentForm=$('reply_'+this.iCurrentShowFormComment);
    divNextForm=$('reply_'+idComment);
        
    var slideCurrentForm = new Fx.Slide(divCurrentForm);
    var slideNextForm = new Fx.Slide(divNextForm);
    
    tinyMCE.execCommand('mceRemoveControl',true,'form_comment_text');
    
    $('comment_preview_'+this.iCurrentShowFormComment).set('html','').setStyle('display','none');
    if (this.iCurrentShowFormComment==idComment) {
      tinyMCE.execCommand('mceAddControl',true,'form_comment_text');
      slideCurrentForm.toggle();      
      slideCurrentForm.addEvent('complete', function() {
        tinyMCE.activeEditor.focus();
      });
      
      return;
    }
    
    slideCurrentForm.slideOut();
    divNextForm.set('html',divCurrentForm.get('html'));
    divCurrentForm.set('html','');    
    divNextForm.setStyle('display','block');
    slideNextForm.hide();
    tinyMCE.execCommand('mceAddControl',true,'form_comment_text');
      
    slideNextForm.slideIn();
    
    $('form_comment_text').setProperty('value','');
    $('form_comment_reply').setProperty('value',idComment);
    this.iCurrentShowFormComment=idComment;
    slideNextForm.addEvent('complete', function() {
      tinyMCE.activeEditor.focus();
    });
  }
}
