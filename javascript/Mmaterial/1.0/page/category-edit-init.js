
/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,O,Switchable,XTemplate,beautifyForm) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return editControl = {
         		panel : null,
                msg : null,
         		paginator : null,
				flag : 0,
				editFlag : false,
				postItems : [],
				promotionItemPaginator: null,
				selectItem : eval('('+ itemsJson +')'),   
				listParams : eval('('+ listParamsJson +')'),
                init : function(){
					editControl.Form = new beautifyForm();
					iconTabs = new Switchable.Tabs('#J_main',{
						 navCls:'ks-switchable-nav',
						 contentCls:'main-content',
						 activeTriggerCls:'current',
						 triggerType: 'click'
					}).on('switch',function(ev){
						var index = ev.currentIndex;
						switch(index) {
							case 0:
								DOM.show('#J_Preview_Box');
								Event.remove('#J_SaveBtn');
								DOM.html('#J_SaveBtn','下一步');
								Event.on('#J_SaveBtn','click',function(){editControl.preview();iconTabs.switchTo(1);});
							break;
							case 1:
								Event.remove('#J_SaveBtn');
								DOM.html('#J_SaveBtn','保存');
								Event.on('#J_SaveBtn','click',function(){editControl.save();});
							break;
						}
					})
					editControl.initListParam();
					
			   		
					Event.on(DOM.query('.J_list_width'),'click',editControl.changeListOption);
					Event.on('#J_ListBoxToggle','click',editControl.toggle);
					
					DOM.replaceClass('#J_SaveBtn', 'button-disabled','button-green');
					Event.remove('#J_RangeBorder_1');
					Event.on('#J_RangeBorder_1','click',function(ev){
						DOM.val('#J_Is_Border','1')
						
					});
					Event.remove('#J_RangeBorder_0');
					Event.on('#J_RangeBorder_0','click',function(ev){
						DOM.val('#J_Is_Border','0')
						
					});
					Event.remove('#J_RangeColor_1');
					Event.on('#J_RangeColor_1','click',function(ev){
						DOM.val('#J_Is_Color','1')
						
					});
					Event.remove('#J_RangeColor_0');
					Event.on('#J_RangeColor_0','click',function(ev){
						DOM.val('#J_Is_Color','0')
						
					});
					
					
					Event.on('#J_SaveBtn','click',function(){editControl.preview();iconTabs.switchTo(1);});
					Event.on('#J_PreviewBtn','click',function(){editControl.preview();});
					
					if (editControl.selectItem.length > 0) {
						editControl.renderSelectItems();
						editControl.editFlag = edit;
						editControl.preview();
					}
					
					//打开分类
					Event.delegate(document,'click','.J_OpenList',function(ev){
					   var flag = DOM.attr(ev.currentTarget,'data');
					   DOM.toggleClass('#J_List'+flag,'current');
					});
					DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
					//增加大分类
					Event.on('#J_AddGroup','click',function(){
						editControl.addItem();
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
					});
					//删除大分类
					Event.delegate(document,'click','.J_TopMoveDele',function(ev){
					   var flag = DOM.attr(ev.currentTarget,'data');
						editControl.tempSave();
						editControl.selectItem.splice(flag,1);
						editControl.renderSelectItems();
						editControl.preview();
						if(editControl.selectItem.length<=0){
							DOM.hide('#J_Preview_Box');
						}
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
					});
					
					//增加小分类
					Event.delegate(document,'click','.J_AddChildGroup',function(ev){
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
						var flag = DOM.attr(ev.currentTarget,'data');
						var child= {"name":"长袖衬衫","url":"http://","isHight":"0"}
						
						if(typeId == 9){
							var child= {"name":"","url":"http://","isHight":"0"}
						}else{
							var child= {"name":"旺旺名称","url":"旺旺昵称","isHight":"0"}
						}
						editControl.tempSave();
						editControl.selectItem[flag].children.push(child);
						editControl.renderSelectItems();
						editControl.preview();
						DOM.query('#J_ChildUl'+flag+' .childName')[editControl.selectItem[flag].children.length-1].focus(); 
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
						
					})
					//删除小分类
					Event.delegate(document,'click','.J_BotMoveDele',function(ev){
					   var flag = DOM.attr(ev.currentTarget,'data');
					   var p = DOM.attr(ev.currentTarget,'pid');
						editControl.tempSave();
						editControl.selectItem[flag].children.splice(p,1);
						editControl.renderSelectItems();
						editControl.preview();
						if(editControl.selectItem.length<=0){
							DOM.hide('#J_Preview_Box');
						}
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
					});
					 //大分类向上移动
					Event.delegate(document,'click','.J_TopMoveUp',function(ev){
					   var flag = Number(DOM.attr(ev.currentTarget,'data'));
					   if(flag-1 < 0){
							return ;   	
					   }
					   editControl.tempSave();
					   var tem = editControl.selectItem[flag];
					    editControl.selectItem[flag] = editControl.selectItem[flag-1]
						editControl.selectItem[flag-1] = tem;
						
						editControl.renderSelectItems();
						editControl.preview();
						if(editControl.selectItem.length<=0){
							DOM.hide('#J_Preview_Box');
						}
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
					});
					 //大分类向下移动
					Event.delegate(document,'click','.J_TopMoveDown',function(ev){
					   var flag = Number(DOM.attr(ev.currentTarget,'data'));
					   var len = editControl.selectItem.length;
					   if(flag+1 >= len){
							return ;   	
					   }
					   editControl.tempSave();
					   var tem = editControl.selectItem[flag];
					    editControl.selectItem[flag] = editControl.selectItem[flag+1]
						editControl.selectItem[flag+1] = tem;
						
						editControl.renderSelectItems();
						editControl.preview();
						if(editControl.selectItem.length<=0){
							DOM.hide('#J_Preview_Box');
						}
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
					});
					 //小分类向上移动
					Event.delegate(document,'click','.J_BotMoveUp',function(ev){
					   var flag = Number(DOM.attr(ev.currentTarget,'data'));
					   var p = Number(DOM.attr(ev.currentTarget,'pid'));
					   if(p-1 < 0){
							return ;   	
					   }
					   editControl.tempSave();
					   var tem = editControl.selectItem[flag].children[p];
					    editControl.selectItem[flag].children[p] = editControl.selectItem[flag].children[p-1]
						editControl.selectItem[flag].children[p-1] = tem;
						
						editControl.renderSelectItems();
						editControl.preview();
						if(editControl.selectItem.length<=0){
							DOM.hide('#J_Preview_Box');
						}
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
					});
					 //小分类向下移动
					Event.delegate(document,'click','.J_BotMoveDown',function(ev){
					    var flag = Number(DOM.attr(ev.currentTarget,'data'));
					    var p = Number(DOM.attr(ev.currentTarget,'pid'));
					   var len = editControl.selectItem[flag].children.length;
					   if(p+1 >= len){
							return ;   	
					   }
					   editControl.tempSave();
					   var tem = editControl.selectItem[flag].children[p];
					    editControl.selectItem[flag].children[p] = editControl.selectItem[flag].children[p+1]
						editControl.selectItem[flag].children[p+1] = tem;
						
						editControl.renderSelectItems();
						editControl.preview();
						if(editControl.selectItem.length<=0){
							DOM.hide('#J_Preview_Box');
						}
						DOM.hide(DOM.query('#J_List0 .J_TopMoveDele'));
					});
                },
                
                initListParam: function(){
					var str = '',
						frameHtml = '',
						colorHtml = '',
						moreLinkHtml = '',
						isBorderHtml = '',
						discolorHtml = '',
						qualityPicsHtml = '',
						keywordsHtml = '',
						tishiMessHtml = '',
						listParamsHtm1 = '',
						listParamsHtm2 = '',
						listParamsHtm3 = '',
						listParamsHtm4 = '',
						listParamsHtm5 = '',
						listParamsHtm6 = '',
						listParamsHtm7 = '',
						listParamsHtm8 = '';
					
					S.each(editControl.listParams, function(item){
						if (item['field_code'] == 'color') {
							colorHtml += '<li class="J_ListParams">' +
							'<input type="hidden" id ="J_color"  value="' +
							item['value'] +
							'"  class="J_Param_Value">' +
							'<input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>' +
							'<div class="ui-side-list">列表颜色选择：</div>' +
							'<div class="ui-content-list ui-content-color">';
							if (paramOptons['color']) {
								S.each(paramOptons['color'], function(col, index){
									clos = col.split("_");
									colorHtml += '<span class="list-template-color J_SelectColor ';
									if (item['value'] == col) {
										colorHtml += 'a-current';
									}
									colorHtml += '" data="' + col + '" >';
									colorHtml += '<b style="background-color: #' + clos[0] + '"></b>';
									colorHtml += '</span>';
								})
							}
							colorHtml += '</div></li>';
						}
						if (item['field_code'] == 'items_per_line') {
							frameHtml += '<li class="J_ListParams">';
							frameHtml += '<div class="ui-side-list">';
							frameHtml += '模板宽度';
							var items_per_line_default = item['value']
							
							//alert(limit);
							frameHtml += '：</div>' +
							'<div class="ui-content-list menu-item" style="width:auto;"><input type="hidden" id ="J_items_per_line_default"  value="' +
							items_per_line_default +
							'">' +
							'<input type="hidden" id ="J_items_per_line"  value="' +
							items_per_line_default +
							'"  class="J_Param_Value">' +
							'<input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
								p = 0;
								for (var k in formats) {
									//列表宽度
									if (item['value'].split("_")[0] == k) {
										frameHtml += '<input type="hidden" id="J_frame_width" value ="' + k + '"/>';
									}
									frameHtml += '<a href="#2"';
									if (item['value'].split("_")[0] == k) {
										frameHtml += 'class="on-center J_width"';
									}
									else {
										frameHtml += 'class="off-center J_width"';
									}
									frameHtml += '><span  class="w-100 J_list_width" id="' + k + '">' + k + '像素</span></a>';
								}
								frameHtml += '</div></li>';
						}
						if (item['field_code'] == 'more_link') {
							moreLinkHtml += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">更多：</div>' +
							'<div class="ui-content-list">' +
							'<input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							moreLinkHtml += '<input type="text" id="J_moreLink"  class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							moreLinkHtml += '</div></li>';
						}
						if (item['field_code'] == 'keywords') {
							keywordsHtml += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">关键词：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							keywordsHtml += '<input type="text" id="J_keywords"  class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							keywordsHtml += '</div></li>';
						}
						if (item['field_code'] == 'list_param1') {
							var show_title = '';
							listParamsHtm1 += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">' +
							item['field_name'] +
							'：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							listParamsHtm1 += '<input type="text" id="J_list_param1" ' + show_title + ' class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							listParamsHtm1 += '</div></li>';
						}
						if (item['field_code'] == 'list_param2') {
							var show_title = '';
							listParamsHtm2 += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">' +
							item['field_name'] +
							'：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							listParamsHtm2 += '<input type="text" id="J_list_param2" ' + show_title + ' class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							listParamsHtm2 += '</div></li>';
						}
						if (item['field_code'] == 'list_param3') {
							var show_title = '';
							listParamsHtm3 += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">' +
							item['field_name'] +
							'：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							listParamsHtm3 += '<input type="text" id="J_list_param3"  ' + show_title + ' class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							listParamsHtm3 += '</div></li>';
						}
						if (item['field_code'] == 'list_param4') {
							var show_title = 'title="' + item['field_name'] + '"';
							listParamsHtm4 += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">' +
							item['field_name'] +
							'：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							listParamsHtm4 += '<input type="text" id="J_list_param4"  ' + show_title + ' class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							listParamsHtm4 += '</div></li>';
						}
						if (item['field_code'] == 'list_param5') {
							var show_title = 'title="' + item['field_name'] + '"';
							listParamsHtm5 += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">' +
							item['field_name'] +
							'：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							listParamsHtm5 += '<input type="text" id="J_list_param5"  ' + show_title + ' class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							listParamsHtm5 += '</div></li>';
						}
						if (item['field_code'] == 'list_param6') {
							var show_title = 'title="' + item['field_name'] + '"';
							listParamsHtm6 += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">' +
							item['field_name'] +
							'：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							listParamsHtm6 += '<input type="text" id="J_list_param6"  ' + show_title + ' class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							listParamsHtm6 += '</div></li>';
						}
						if (item['field_code'] == 'list_param7') {
							var show_title = 'title="' + item['field_name'] + '"';
							listParamsHtm7 += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">' +
							item['field_name'] +
							'：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							listParamsHtm7 += '<input type="text" id="J_list_param7"  ' + show_title + ' class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							listParamsHtm7 += '</div></li>';
						}
						if (item['field_code'] == 'list_param8') {
							var show_title = 'title="' + item['field_name'] + '"';
							listParamsHtm8 += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">' +
							item['field_name'] +
							'：</div>' +
							'<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							listParamsHtm8 += '<input type="text" id="J_list_param8"  ' + show_title + ' class="input-text-3 J_Param_Value" value="' + item['value'] + '">';
							listParamsHtm8 += '</div></li>';
						}
						if (item['field_code'] == 'has_border') {
							isBorderHtml += '<li class="title-params J_ListParams">' +
							'<div class="ui-side-list">是否使用边框线：</div>' +
							'<div class="ui-content-list">' +
							'<input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							isBorderHtml +='<input type="hidden" class="J_Param_Value" id="J_Is_Border" value="1">';
							isBorderHtml +='<div id="J_ListBorder"><label id="J_RangeBorder_1" for="J_Is_Border_1" class="beautify_radio"><input type="radio" name="is_border" id="J_Is_Border_1" checked="checked" class="w-30" data="border" value="1">是</label><label id="J_RangeBorder_0" for="J_Is_Border_0" class="beautify_radio"><input type="radio" name="is_border" id="J_Is_Border_0" data="border" class="w-30" value="0">否</label></div>';
							isBorderHtml += '</div></li>';
						} 
						if (item['field_code'] == 'discolor') {
							discolorHtml += '<li class="title-params J_ListParams" >' +
							'<div class="ui-side-list">是否隔行换色：</div>' +
							'<div class="ui-content-list">' +
							'<input type="hidden" class="J_Param_ParamId" value="' +
							item.param_id +
							'"/><input type="hidden" class="J_Param_FieldCode" value="' +
							item.field_code +
							'"/>';
							discolorHtml +='<input type="hidden" class="J_Param_Value" id="J_Is_Color" value="1">';
							discolorHtml +='<div id="J_ListColor"><label id="J_RangeColor_1" for="J_Is_Color_1" class="beautify_radio"><input type="radio" name="is_color" id="J_Is_Color_1" checked="checked" class="w-30" data="color" value="1">是</label><label id="J_RangeColor_0" for="J_Is_Color_0" class="beautify_radio"><input type="radio" name="is_color" id="J_Is_Color_0"  data="color" class="w-30 J_RangeType" value="0">否</label>';
							discolorHtml += '</div></li>';
						}
					})
					listParamsConfirmHtm = '';
					ListStr = colorHtml + frameHtml + isBorderHtml+discolorHtml+moreLinkHtml + qualityPicsHtml + keywordsHtml + tishiMessHtml + listParamsHtm1 + listParamsHtm2 + listParamsHtm3 + listParamsHtm4 + listParamsHtm5 +listParamsHtm6 + listParamsHtm7+ listParamsHtm8 +listParamsConfirmHtm;
					DOM.html('#J_listParams', ListStr);
					
					
					//颜色选择
					if(DOM.query('.J_SelectColor').length>0){
						Event.on(DOM.query('.J_SelectColor'),'click',function(ev){
							var color = DOM.attr(ev.currentTarget,'data');
								DOM.removeClass(DOM.query('.list-template-color'),'a-current');
								DOM.toggleClass(this,'a-current');
								DOM.val('#J_color',color);
								editControl.preview();
						})
					}
					
				},
				//模板 宽度 选择
				changeListOption : function(){
					var w =this.id;
					DOM.replaceClass(DOM.query('.J_width'),'on-center off-center','off-center');
					DOM.replaceClass(DOM.parent(this),'on-center off-center','on-center');
					DOM.val('#J_frame_width',w);//模板宽度
					S.each(paramOptons.items_per_line,function(item){
						if(item.split("_")[0] == w){
							DOM.val('#J_items_per_line',item);
						}
					})
					editControl.preview();
				},
                toggle : function(el) {
					var listBox = S.one('#J_ListBox');
					if (listBox.css("display")==="none") {
						listBox.slideDown(0.8,function(){
							DOM.html('#J_ListBoxToggle','隐藏模版预览')
						});
					} else {
						listBox.slideUp(0.8,function(){
							DOM.html('#J_ListBoxToggle','显示模版预览')
						});
						
					}
				},
				preview : function() {
					Event.on('.preview-hover','mouseenter mouseleave',function(ev){
						var flag = DOM.attr(ev.currentTarget,'data');
						var index = DOM.attr(ev.currentTarget,'pid');
						if(ev.type == 'mouseenter'){
				   			DOM.show('.edit-preview-desc-'+flag+'-'+index);
				   			Event.on('.J_radio-'+flag+'-'+index,'click',function(ev){
				   				var id = DOM.attr(ev.currentTarget,'data');
				   				var nick = DOM.val('#radio-'+flag+'-'+index+'-'+id); 
				   				var nick_id = DOM.attr(ev.currentTarget,'data-id');
				   				DOM.val('#childName-'+flag+'-'+index,nick);
				   				DOM.val('#childUrl-'+flag+'-'+index,nick_id);
							})
				   		}else{
				   			DOM.hide('.edit-preview-desc-'+flag+'-'+index);
				   		}
			   		})  
					
					editControl.itemProcess();
					var items = editControl.postItems;
					items.reverse();
					var len = items.length;
					if(len<=0){
						DOM.hide('#J_ContentDetail');
						DOM.hide('#J_ToggleC');
						DOM.replaceClass('#J_PreviewBtn', 'button-gray','button-disabled');
						return false;
					}else{
						DOM.show('#J_ContentDetail');
					}
					
					var itemsJson = KISSY.JSON.stringify(items);
					
					var postListParams = new Array();
					S.each(DOM.query('.J_ListParams'),function(item, i){
						var listPar = {};
						listPar.param_id = DOM.val(DOM.get('.J_Param_ParamId', item));
						listPar.field_code = DOM.val(DOM.get('.J_Param_FieldCode', item));
						listPar.value = H.util.strProcess(DOM.val(DOM.get('.J_Param_Value', item)));
						if(listPar.value.indexOf('undefined')>=0){
							listPar.value = DOM.val('#J_items_per_line_default');
						}
						postListParams.push(listPar);
					})
					var listParamsJson = KISSY.JSON.stringify(postListParams);
					var submitHandle = function(o) {
						DOM.html(DOM.get('#J_ContentDetail'),o.payload);
						DOM.show('#J_ToggleC');
						var listBox = S.one('#J_Preview_Box');
						if (listBox.css("display")==="none") {
							listBox.slideDown();
						}
						
		    	    };
		    	    var errorHandle = function(o) {
							new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
		        	};
		        	itemsJson = itemsJson.replace(/%25/g, '%!').replace(/&/g, '%26');
		        	listParamsJson = listParamsJson.replace(/%25/g, '%!');
		     	    var data = "items="+itemsJson+"&listParams="+listParamsJson+"&proto_id="+protoId+"&form_key="+FORM_KEY;
		     	    new H.widget.asyncRequest().setURI(previewUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				},
			
				addItem : function() {
					editControl.tempSave();
					if(typeId == 9){
						var item = {"parent":"","parentUrl":"http://","children":[{"name":"长袖","url":"http://","isHight":"0"}]};
					}else{
						var item = {"parent":"客服分组名称","parentUrl":"http://","children":[{"name":"","url":"","isHight":"0"}]};
					}
					editControl.selectItem.push(item);
					editControl.renderSelectItems();
					editControl.preview();
					var len = editControl.selectItem.length-1;
					DOM.get('#J_List'+len+' .parentName').focus(); 
				},
				save : function() {
					editControl.itemProcess();
					var items = editControl.postItems;
					var len = items.length;
					if (len==0) {
							new H.widget.msgBox({
								    title:"错误提示",
								    content:"您还没有添加分类哦",
								    type:"error"
								});
						return;
					}
					
					editControl.msg = new H.widget.msgBox({
									    title:"",
										dialogType : 'loading',
									    content:'系统保存中，请稍候'	
									});
					var itemsJson = KISSY.JSON.stringify(items);
					var postListParams = new Array();
					S.each(S.all('.J_ListParams'),function(item, i){
						var listPar = {};
						listPar.param_id = DOM.val(DOM.get('.J_Param_ParamId', item));
						listPar.field_code = DOM.val(DOM.get('.J_Param_FieldCode', item));
						listPar.value = H.util.strProcess(DOM.val(DOM.get('.J_Param_Value', item)));
						if(listPar.value.indexOf('undefined')>=0){
							listPar.value = DOM.val('#J_items_per_line_default');
						}
						postListParams.push(listPar);
					})
					var listParamsJson = KISSY.JSON.stringify(postListParams);		
					var submitHandle = function(o) {
							DOM.html(DOM.get('#J_ContentDetail'),o.payload.body);
							editControl.msg.hide();
							listId = o.payload.list_id;
							var url = createUrl+"&listId="+listId;
							
							if (isVersionPer('material',false)) {
								new H.widget.msgBox({
									    title: "保存成功",
									    content: '保存成功，你可以去查看列表或者升级到尊享版去投放',
									    type: "confirm",
									    buttons: [{ value: "升级" }, { value: "查看列表" }],
									    success: function (result) {
									        if (result == "升级") {
												 isVersionPer('material'); 	
									        }else{
												window.location.href = listUrl;
											}
									    }
									});
							}else {
								if (editControl.editFlag == true) {
									var str = '重新投放';
								}else {
									var str = '去投放 ';
								}
								new H.widget.msgBox({
									    title: "保存成功",
									    content: '保存成功，你可以去查看列表,投放列表',
									    type: "confirm",
									    buttons: [{ value: str }, { value: "查看列表" }, { value: "返回编辑" }],
									    success: function(result){
											if (result == str) {
												window.location.href = url
											}
											else 
												if (result == "查看列表") {
													window.location.href = listUrl;
												}
										}
									});
							}	  
		    	    };
		    	    var errorHandle = function(o) {
		    	    	editControl.msg.hide();
						new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
		        	};
		        	var data = '';
		            data = "meal_id=0&";
		         	itemsJson = itemsJson.replace(/%25/g, '%!').replace(/&/g, '%26');
		        	listParamsJson = listParamsJson.replace(/%25/g, '%!'); 
		     	    data += "items="+itemsJson+"&listParams="+listParamsJson+"&list_id="+listId+"&proto_id="+protoId+"&form_key="+FORM_KEY;
		    	    new H.widget.asyncRequest().setURI(saveUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				},
				//列表渲染
				renderSelectItems : function(){
						var items = editControl.selectItem;
						var len = items.length;
						var templet = DOM.html(DOM.get('#J_Templet'));
						var data = {
				            data: items
				        };
				        var els = new XTemplate(templet).render(data);
						DOM.html(DOM.get('#J_SelectItemBox'), els ); 
						editControl.Form.renderAll('#J_SelectItemBox');
						editControl.Form.renderAllRadio('#J_ListBorder');
						editControl.Form.renderAllRadio('#J_ListColor');
						
				},
				tempSave: function(){
					editControl.selectItem = [];
					var len = DOM.children('#J_SelectItemBox').length;
				    for(var i = 0;i<len;i++){
						 var item ={};
						 item.parent = DOM.val('#J_List'+i+' .parentName');
						 item.parentUrl = DOM.val('#J_List' + i + ' .parentUrl');
						 item.isCurrent = DOM.hasClass('#J_List'+i,'current') ? 1 :0;
						 var childName = DOM.query('#J_List'+i+' .childName');
						 var childUrl = DOM.query('#J_List'+i+' .childUrl');
						 var childIsHight = DOM.query('#J_List'+i+' .isHight');
						 var mlen = childName.length;
						 item.children =[]; 
						 for(var m = 0;m< mlen ; m++){
						 	  var listPar ={};
							 listPar.name = DOM.val(childName[m]);
							 if(typeId ==9){
							 	listPar.url = DOM.val(childUrl[m]);
							 }else{
							 	listPar.url = DOM.val(childUrl[m]).replace(/：/g, ':');;
							 }
							 listPar.isHight = DOM.prop(childIsHight[m],"checked") ? 1 : 0;
							 item.children.push(listPar);
						 }
						 editControl.selectItem.push(item);
						 
					}
				},
				itemProcess : function(){
					editControl.postItems = [];
					var len = DOM.children('#J_SelectItemBox').length;
				    for(var i = 0;i<len;i++){
						 var item ={};
						 item.parent = H.util.strProcess(DOM.val('#J_List'+i+' .parentName'));
						 item.parentUrl = H.util.strProcess(DOM.val('#J_List' + i + ' .parentUrl'));
						 item.isCurrent = DOM.hasClass('#J_List'+i,'current') ? 1 :0;
						 var childName = DOM.query('#J_List'+i+' .childName');
						 var childUrl = DOM.query('#J_List'+i+' .childUrl');
						 var childIsHight = DOM.query('#J_List'+i+' .isHight');
						 var mlen = childName.length;
						 item.children =[]; 
						 for(var m = 0;m< mlen ; m++){
						 	  var listPar ={};
				 			 listPar.name = H.util.strProcess(DOM.val(childName[m]));
							 if(typeId ==9){
							 	listPar.url = H.util.strProcess(DOM.val(childUrl[m]));
							 }else{
							 	listPar.url = H.util.strProcess(DOM.val(childUrl[m])).replace(/：/g, ':');;
							 }
							 listPar.isHight = DOM.prop(childIsHight[m],"checked") ? 1 : 0;
							 item.children.push(listPar);
						 }
						 editControl.postItems.push(item);
					}
				   
				}
                
	}
}, {
    requires: ['overlay','switchable','xtemplate','utils/beautifyForm/index']
});