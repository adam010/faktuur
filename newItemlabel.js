$(function () {


    Languages = function(data){
         this.defaults=data['defaults'];
         this.languages= data['selectable'];
         this.selectedLanguages='';
         this.objTarget='';
      
     };
	 this.itemsdata= versionsdata;
        this.vItem
        this.itmid
    var versionList=versionsdata;
	 var findArticle=function(artNr){
		$.each(this.itemsdata, function (i, obj){            
			 if(i == articleNr) {       
				itemfound= function(itmID){
					$.each(obj,function(i,v){
					  if(v['ID']==itmID){
						 return obj[i]
					  }
					})								
				}
			  return itemfound 	
			 }
		})
		 
	 }
	 var findItem= new findArticle(articleNr)
		 versionObj=findItem(itemID)

		 
		 
		 
    Versiondata=function(versionsdata){
        
		
		
		
		///////////////////
        /*this.findItem=function(articleNr,itemid){
                            this.itmid=itemid;
                            $.each(this.itemsdata, function (i, obj){            
                                if(i == articleNr) {       
                                    vItem= obj                                   
                                     $.each(vItem, function(ob,x){ 
                                         alert(x)
                                        if(x['ID']== this.itmid){
                                            // alert(itmid)
                                            console.log(x);
                                         }
                                     })                                       
                                 }                                                
                            });    
                        }      */
        /*this.findVersion= function(id){
                $.each(item, function(obj){ 
                    if(obj['ID']== id){
                       return obj;
                    }
                })
            }*/
    }
    
    $("#msgContainer").prepend("<div id=\"bodyContainer\" ></div>")
    productCode = "05000"; //test purposes
    plID = 0;
    labelVersions(productCode, plID)
   
    function labelVersions(productCode, plID){
    $.ajax({
        type: 'POST',
        url: 'itemLabel.ajax.php',
        data: {
            'productCode': productCode,
            'plID': plID
        },
        dataType: 'json',
        encode: true
    }).done(function (data) {
        if (data[ 'success' ]) {
            $("#versionTabel").empty();    
            
            populateItemSelect(data['itemLabeldata']); 
            itemVersions= new Versiondata(data['versionlist']);
            versionDataFeed(data['versionlist']);     
           
            itemLanguages= new Languages(data['languages']);   
            
        } else if (data[ 'errors' ] != null) {
            var errorText = "";
            for (i = 0; i < data[ 'errors' ].length; ++i) {
                if (i > 0) {
                    errorText += "\n\n";
                }
                errorText += data[ 'errors' ][ i ];
            }
            showError('foutmelding', $data['errors'])
        }
    }).fail(function (data) {
        showError('foutmelding', 'An error occurred while communcating with the server, please try again.')

    });
    }  
    // on version selection change
    $('#versionTabel').change('.versionSelect',function(event){    
        var productid=$(event.target).attr("ref");
        var itemid= $(event.target).find('option:selected').val();       
         itemVersions.itmid=itemid;
          iVersion= itemVersions.findItem(productid,itemid);
          //console.log(iVersion['note']);
    
       $.post("itemLabel.ajax.php", {'itemVersion': true,'itemID': itemid}, function(data){
             var item=$.parseJSON(data)
            if(data.length >0){
               $(event.target).parents('tr').find('input.uploadedfile').val(item[0]['filename']);              
                $(event.target).parents('tr').find('textarea.fldnotes').val(item[0]['note']);                
            }
       })
   
    });	
    
    //item-version delete
    $('#versionTabel').on('click','.icon-trashcan',function(event){          
         itemid=$(event.target).attr("ref");
         confirmAction("Item will be permanently deleted ","Are you sure?");
         $("#confirm .confirm").click(function(){             
             $("#confirm .confirm").unbind();
		$("#confirm").fadeOut();
                  deleteItem(itemid )
         });
                
    })
    function deleteItem(itemId){
        $.post("itemLabel.ajax.php", {'versionDelete': true,'itemID': itemid}, function(data){            
             labelVersions(productCode, plID)
            if(data['success']){               
                
                showSuccess('Item was successfully deleted')
            }
            if(data['errors'])
              showError('foutmelding', data['errors'])
        })  
         
    }
     //update notes
     $('#versionTabel').on('click','.icon-notes',function(event){ 
        var title = $(event.target).parents('tr').find('input.uploadedfile').val()
         var originalText=$(event.target).parents('tr').find('textarea.fldnotes').val()
        var itemid=$(event.target).attr("ref");       
        dataObj = { notes: originalText, itemId:itemid}
        inputBox(dataObj ,"notes","textarea",title,"Indien er nog geen value is, dan hinttekst hier",noteClose);    
     })
     
     //close and save notes
    function noteClose( ){  
         $.post("itemLabel.ajax.php", {'itemNotes': true,'itemID': dataObj.itemId,'notes':dataObj.notes}, function(data){            
           if(data['success'])showSuccess('Notes successfully updated')            
           else showError('foutmelding', data['errors'])                
        })         
     }
     
    function newNoteClose( ){ 
         $(".newnotes #fldnotes").html(dataObj.notes)             
     }
      $('.newnotes').click(function(event){ 
          
         var title ="Item notes"; 
         var originalText=""
        //var itemid=$(event.target).attr("ref");       
        dataObj = { notes: originalText, itemId:0}
        inputBox(dataObj ,"notes","textarea",title,"Indien er nog geen value is, dan hinttekst hier",newNoteClose);    
     })
     //feed data to html
    function versionDataFeed(versiondata) {        
   
       // console.dir("versionArray : "+versiondata)
        $.each(versiondata, function (index, item) {            
            $.each(item, function (idx, version) {                        
                constructVersionTable(version, idx)
            })
        })
    }
    
    // versionTable js to HTML
    function constructVersionTable(waarden, idx) {        
        $.ajax({
            type: "POST",
            url: "itemLabel.ajax.php",
            data:  {
                  'productID': waarden.productID,
                 'article': waarden.articleNumber,
                 'labelType': waarden.type,
                 'language': waarden.language,
                 'itemOptions': 'options'
               },                  
            dataType: 'json',
            encode: true,

         }).done(function (data,idx) {                  
              if (data.length > 0) {                                                 
                   var strVar = ""; 
                      strVar += "<tr class=\"tr"+waarden.ID+"\">";
                      strVar += "          <td width=\"198\"><input  name=\"articleNumber\" type=\"text\" id=\"articleNumber\" value=\"" + waarden.articleNumber + "\"><\/td>";
                      strVar += "            <td width=\"30\"><input  name=\"type\" type=\"text\" id=\"type\" value=\"" + waarden.type + "\"><\/td>";
                      strVar += "            <td width=\"122\"><input ref=language_"+waarden.ID+" name=\"language\" type=\"text\" id=\"language\" value=\"" + waarden.language + "\">";
                      strVar += "            <td width=\"144\"><input class=\"uploadedfile\" ref="+waarden.ID+" name=\"filename\" id=\""+waarden.filename+"_"+waarden.ID+"\" type=\"text\" value=\"" + waarden.filename + "\"><\/td>";
                      strVar += "            <td width=\"41\"><select ref=\""+waarden.articleNumber+"\" class=versionSelect name=\"" + waarden.articleNumber + "_" +waarden.filename + "\" id=\"" + waarden.articleNumber + "_" + waarden.ID + "_" + waarden.filename + "\" >";
                      $.each(data, function (obj, item) {								
                         strVar += "<option value='"+item['ID']+"'>"+item['date']+" v"+item['version']+"</option>";
                      })
                      strVar += "<\/select><\/td>";
                      strVar += "<td width=\"144\"><div ref=\""+waarden.ID+"\" class=\"icon icon-notes\"><\/div>\n\ ";
                      strVar += "<div class=\"notesArea\"><textarea id=\"newnote\" class=\"fldnotes\">"+waarden.note+ "<\/textarea><\/div>";
                      strVar += "<a href=\"http://mpmoil.local/upload/"+waarden.filename+"\"><div ref=\""+waarden.ID+"\" class=\"icon icon-download\"><\/div></a><div ref=\""+waarden.ID+"\" class=\"icon icon-trashcan\"><\/div><\/td>";
                      strVar += "        <\/tr>";

                   $('#versionTabel').append(strVar);

              } else if (data[ 'errors' ] != null) {
                  var errorText = "";
                  for (i = 0; i < data[ 'errors' ].length; ++i) {
                      if (i > 0) {
                          errorText += "\n\n";
                      }
                      errorText += data[ 'errors' ][ i ];
                  }
                  showError('foutmelding', $data['errors'])
              }
      })   
    }

    //version selector
    function populateItemSelect(data) {
       var selectList= document.getElementById("articleSelect");
       var length = selectList.options.length;
       for (i = 1; i < length;) {
        selectList.options[i] = null;
        length = selectList.options.length;
}
        $.each(data, function (obj, item) {
            var newOption = document.createElement("option");
            newOption.text = item[ 'productCode' ];
            newOption.value = item[ 'articleNumber' ] + '_' + item[ 'productID' ] + '_' + item[ 'plID' ];
            articleSelect.appendChild(newOption);
        })
    }

    //labelfile upload
    $('.fileUpload').bind('change', function () {
        var fileName = $(".fileInput", this).val();
        fileName = /[^\\]*$/.exec(fileName)[ 0 ];
        $('.fileSelected').html(fileName);
    })

    //file validation
    $('#fldupload').change(function () {
        //--------/(\.|\/)(gif|jpe?g|png|txt)$/i

        if (this.files && this.files[ 0 ]) {
            var filetype = this.files[ 0 ].type;
            // only jpg, png, ai,pdf,psd,eps
            var validTypes = /(\.|\/)(jpg|png|pdf|psd|eps|ai|)$/;
            // /^file\/(jpg|png|pdf|psd|eps|ai|)$/;

            if (!validTypes.test(filetype)) {
                $('#fldupload').val(null);
                showInfo('Informatief', 'This file type is not allowed,please choose from jpg|png|pdf|psd|ai or eps');
                $('.fileUpload span').text('Select file');
            }
        }
    });

    //insert new label record
    $("#labeldata").submit(function (e) {
        var formElement = document.getElementById("labeldata");
        var formData = new FormData(formElement);           
        formData.append('file', $('#fldupload')[ 0 ]);
        formData.append('newLabel', 'insert');  
         e.preventDefault();   
        $.ajax({
            url: "itemLabel.ajax.php",
            type: "POST",
            data: formData,
            mimeTypes: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                showSuccess('Item label record is created successfully');
                labelVersions(productCode, plID)
                $('form[name="labeldata"]')[0].reset();
                   $('#fldupload').html();              
            },
            error: function () {
                showError('foutmelding', $data['errors'])
            }
        });
    });
   

});
