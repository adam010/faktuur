$(function () {

    productObj = function (productID,productCode,productplID) {
        this.ID = productID;
        this.Code = productCode;
        this.plID = productplID;
        this.loaddata=itemlabeldata;
        //this.Name = productData['name'];
        this.itemSelectList = function (listdata)
        {
            productOptions = []
            $.each(listdata, function (obj, item) {
                var newOption = document.createElement("option");
                newOption.text = item['productCode'];
                newOption.value = item['articleNumber'] + '_' + item['productID'] + '_' + item['plID'];

                articleSelect.appendChild(newOption);
            })

        }

        this.itemlanguages = function (languagedata) {
            defaults = languagedata['defaults'];
            languages = languagedata['selectable'];
            selectedLanguages = '';
        }
        this.itemVersionTable = function (versiondata)
        {
            $.each(versiondata, function (prdIndex, prdItem) {
                this.items.push(prdItem)
                $.each(prditem, function (itemIdx, version) {
                    versionTableRow(version, itemIdx)
                })
            })
        }
        //this. versionTable= versionTableRow;
        this.Items;
    }

    $("#msgContainer").prepend("<div id=\"bodyContainer\" ></div>")

    productCode = "05000"; //test purposes
    plID = 0;
    productID=13
    product = new productObj(ID,productCode,plID,);
    product.loaddata(productCode,plID);

    function itemlabeldata(productCode,plID) {
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
             if (data['success']) {

            //populateItemSelect(data['itemLabeldata'])
            //processVersionlist(data['versionlist']);
            //itemLanguages= new Languages(data['languages']);
            product.itemSelectList(data['itemLabeldata']);
            product.itemVersionTable(data['versionlist']);
            product.itemlanguages(data['languages']);

        } else if (data['errors'] != null) {
            var errorText = "";
            for (i = 0; i < data['errors'].length; ++i) {
                if (i > 0) {
                    errorText += "\n\n";
                }
                errorText += data['errors'][i];
            }
            showError('foutmelding', $data['errors'])
        }

    }).fail(function (data) {
        showError('foutmelding', 'An critical error occurred while communcating with the server, please try again.')

    });
}//end loadfunctie

    function versionTableRow(waarden, idx) {

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
            //console.dir(data)
            if (data.length > 0) {
                var strVar = "";
                strVar += "<tr class=\"tr"+waarden.ID+"\">";
                strVar += "          <td width=\"198\"><input  name=\"articleNumber\" type=\"text\" id=\"articleNumber\" value=\"" + waarden.articleNumber + "\"><\/td>";
                strVar += "            <td width=\"30\"><input  name=\"type\" type=\"text\" id=\"type\" value=\"" + waarden.type + "\"><\/td>";
                strVar += "            <td width=\"122\"><input ref=language_"+waarden.ID+" name=\"language\" type=\"text\" id=\"language\" value=\"" + waarden.language + "\">";
                strVar += "            <td width=\"144\"><input class=\"uploadedfile\" ref="+waarden.ID+" name=\"filename\" id=\""+waarden.filename+"_"+waarden.ID+"\" type=\"text\" value=\"" + waarden.filename + "\"><\/td>";
                strVar += "            <td width=\"41\"><select class=versionSelect name=\"" + waarden.articleNumber + "_" +waarden.filename + "\" id=\"" + waarden.articleNumber + "_" + waarden.ID + "_" + waarden.filename + "\" >";
                $.each(data, function (obj, item) {
                    strVar += "<option value='"+item['ID']+"'>"+item['date']+" v"+item['version']+"</option>";
                })
                strVar += "<\/select><\/td>";
                strVar += "<td width=\"144\"><div ref=\""+waarden.ID+"\" class=\"icon icon-notes\"><\/div><a href=\"http://mpmoil.local/upload/"+waarden.filename+"\"><div ref=\""+waarden.ID+"\" class=\"icon icon-download\"><\/div></a><div ref=\""+waarden.ID+"\" class=\"icon icon-trashcan\"><\/div><\/td>";
                strVar += "        <\/tr>";
                //console.log(strVar);
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

    // on (version)selection change
    $('#versionTabel').change('.versionSelect',function(event){

        var itemid= $(event.target).find('option:selected').val();
        //console.log(row)
        $.post("itemLabel.ajax.php", {'itemVersion': true,'itemID': itemid}, function(data){
            var item=$.parseJSON(data)
            if(data.length >0){
                $(event.target).parents('tr').find('input.uploadedfile').val(item[0]['filename'])
            }
        })

    });

    //item-version delete
    $('#versionTabel').click('.icon-trashcan',function(event){
        itemid=$(event.target).attr("ref");
        $.post("itemLabel.ajax.php", {'fileDownload': true,'itemID': itemid}, function(data){
            if(data['success']){
                showSuccess('item was download')
            }
        })
    })

    $('.fileUpload').bind('change', function () {
        var fileName = $(".fileInput", this).val();
        fileName = /[^\\]*$/.exec(fileName)[ 0 ];
        $('.fileSelected').html(fileName);
    })

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

    //save record to db
    $("#labeldata").submit(function (e) {
        e.preventDefault();
        var formElement = document.getElementById("labeldata");
        var formData = new FormData(formElement);
        console.log(formData);

        formData.append('file', $('#fldupload')[ 0 ]);
        formData.append('newLabel', 'insert');
        //formData.append( 'action', 'insert' );
        $.ajax({
            url: "itemLabel.ajax.php",
            type: "POST",
            data: formData,
            mimeTypes: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                showSuccess('Item label record is created successfully')
                $('form[name="labeldata"]')[0].reset();
            },
            error: function () {
                showError('foutmelding', $data['errors'])
            }
        });
    });
});