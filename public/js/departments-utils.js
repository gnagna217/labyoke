
            window.onload = function() {
                $('#createDept').hide();
                $('#createLab').hide();
                $('#editLab').hide();
                var adminvalue = "";

                $('#vennSettingsDisplay').hide();
                $('#vennSettings').hide();

                var eSelect = document.getElementById('createSelect');

                $(".deps").change(function(){
                    var savedep = $(this).val();
                    
                    console.log("savedep: " + savedep);
                    $('.deps').each(function(i, obj) {
                    $(this).val($(this).find("option:eq(0)").val());
                    $(this).css('background-color', '#3378b7');
                    });
                    console.log("savedep: " + savedep);
                    console.log("heredeps: " + $(this).val());
                    $(this).val(savedep)
                    
                    $( ".setlab:visible" ).addClass("restrictcolumns");
                    if($(".setlab").is(":visible")){
                        $('#labdetail').addClass("restrictcolumns");
                    }
                    console.log("optt: " + $('option:selected', this).attr('department'));
                    if($('option:selected', this).attr('department') != undefined){
                    console.log("show labdetail");

                    var deptpos = $('option:selected', this).attr('deptpos');
                    var labpos = $('option:selected', this).attr('pos');
                    var users = JSON.parse(JSON.stringify(var_vennuser).replace(/&quot;/g, '"'));
                    var users0 = users[labpos];
                    console.log("labpos: " + labpos);
                    console.log("deptpos: " + deptpos);
                    console.log("users length: " + users.length);
                    console.log("users0length: " + users0.length);

                    $('#labmembers').html("");
                    $('#labdetail').show();

                    var usersdiv = document.getElementById("labmembers");
                    var userslength = users0.length;
                    var size = 100;
                    var wind = $("#labdetail").width();
                    if(wind != null){
                        wind = wind;
                    } else{
                        wind = window.innerWidth;
                    }
                    var winwi = Math.floor(wind/150);
                    
                    if(winwi <= userslength){
                        size = (size/winwi);
                    } else {
                        size = size/userslength;
                    }
                    size = size - 2;
                    console.log("userslength: " + userslength);
                    console.log("window width: " + winwi);
                    console.log("size: " + size);
                    for(var p in users0){
                        var userdiv = document.createElement("div");
                        var userpan = document.createElement("span");
                        var userpan2 = document.createElement("span");
                        var userspan3 = document.createElement("span");
                        var userspan4 = document.createElement("span");
                        var usera = document.createElement("a");
                        userdiv.setAttribute('class',"myteammember");
                        userdiv.setAttribute('style',"width:" + size + "%");
                        userpan.setAttribute('class',"fa fa-user-circle-o myteamcard");
                        if(users0[p].admin == 1){
                            userpan.setAttribute('style',"color:#95794d");
                        } else {
                            userpan.setAttribute('style',"color:#68b3d6");
                        }
                        userspan3.setAttribute('class',"fa fa-location-arrow");
                        userspan3.setAttribute('id',"email");

                        userspan3.setAttribute('style',"cursor:pointer;color: #3479b7;font-size:10pt");
                        usera.setAttribute('href',"mailto:" + users0[p].email);
                        usera.setAttribute('style',"cursor:pointer");
                        userspan4.innerHTML = " " + users0[p].name + " " + users0[p].surname;
                        userpan2.setAttribute('style',"text-align: center;display: block;margin: 10px;");
                        usera.appendChild(userspan3);
                        userpan2.appendChild(usera);
                        userpan2.appendChild(userspan4);
                        userdiv.appendChild(userpan);
                        userdiv.appendChild(userpan2);
                        usersdiv.appendChild(userdiv);
                        }
                        
                        $(this).css('background-color', '#3d9dcb');
                        $(window).scrollTop($('#labdetail').offset().top - 100).scrollLeft($('#labdetail').offset().left); 
                    } else {
                        console.log("hide labdetail");
                        $('#labdetail').hide();
                        $( "#labdetail" ).removeClass("restrictcolumns");
                        $( ".setlab:visible" ).removeClass("restrictcolumns");
                    }
                    
                })

                $(".setlab").change(function(){
                    console.log("here: " + $(this).val());
                    $( "#labdetail:visible" ).addClass("restrictcolumns");
                    if($("#labdetail").is(":visible")){
                        $('#setlab').addClass("restrictcolumns");
                    }
                })
                var labnameedit = document.getElementById('labnameedit');
                labnameedit.onchange = function() {
                    console.log("adminvalue: " + adminvalue);
                    if(adminvalue != undefined && adminvalue != ""){
                    $("#adminlabedit option[value='" + adminvalue + "']").remove();
                    }
                    $('#transferadmin').hide();
                    $('#transferdept').show();
                };

                var deptlabedit = document.getElementById('deptlabedit');
                deptlabedit.onchange = function() {
                    adminvalue = $('option:selected', "#labnameedit").attr('admin');
                    console.log("adminvalue: " + adminvalue);
                    $("#adminlabedit").append('<option value="' + adminvalue +'">' + adminvalue + '</option>');
                    $('#transferadmin').show();
                };
                
                console.debug("selected: " + $('#createSelect').val());
                var section = "${section}";
                if(eSelect.selectedIndex === 1 || $('#createSelect').val() == 'createDept') {
                    console.log("createDept inside");
                    $('#createDept').show();
                    $('#vennSettings').hide();
                    $('#createLab').hide();
                    $('#editLab').hide();
                    $('#createSelect').css('background-color', '#3d9dcb');
                    $(window).scrollTop($('#createDept').offset().top - 100).scrollLeft($('#createDept').offset().left);
                } else if(eSelect.selectedIndex === 2 || $('#createSelect').val() == 'createLab') {
                    console.log("createLab inside");
                    $('#createLab').show();
                    $('#createDept').hide();
                    $('#vennSettings').hide();
                    $('#editLab').hide();
                    $('#createSelect').css('background-color', '#3d9dcb');
                    $(window).scrollTop($('#createLab').offset().top - 100).scrollLeft($('#createLab').offset().left);
                } else if(eSelect.selectedIndex === 3 || $('#createSelect').val() == 'vennSettings') {
                    console.log("vennSettings inside");
                    $('#vennSettings').show();
                    $('#createDept').hide();
                    $('#createLab').hide();
                    $('#editLab').hide();
                    $('#createSelect').css('background-color', '#3d9dcb');
                    $(window).scrollTop($('#vennSettings').offset().top - 100).scrollLeft($('#vennSettings').offset().left); 
                } else if(eSelect.selectedIndex === 3 || $('#createSelect').val() == 'editLab') {
                    console.log("transfer lab inside");
                    $('#editLab').show();
                    $('#vennSettings').hide();
                    $('#createDept').hide();
                    $('#createLab').hide();
                    $('#createSelect').css('background-color', '#3d9dcb'); 
                    $(window).scrollTop($('#editLab').offset().top - 100).scrollLeft($('#editLab').offset().left); 
                } else if(section == "all" && (eSelect.selectedIndex === 0 || $('#createSelect').val() == 'createNone')) {
                    console.log("create None inside");
                    $('#createLab').hide();
                    $('#createDept').hide();
                    $('#vennSettings').hide();
                    $('#editLab').hide();
                    $('#createSelect').css('background-color', '#3379b7'); 
                }

                eSelect.onchange = function() {
                    console.log("here: " + $(this).val());
                    $( "#labdetail:visible" ).addClass("restrictcolumns");
                    

                    if(eSelect.selectedIndex === 1 || $('#createSelect').val() == 'createDept') {
                        console.log("createDept inside");
                        $('#createDept').show();
                        $('#createLab').hide();
                        $('#vennSettings').hide();
                        $('#editLab').hide();
                        $('#createSelect').css('background-color', '#3d9dcb');
                        if($("#labdetail").is(":visible")){
                            $('#createDept').addClass("restrictcolumns");
                        }
                        var wind = $(".myteammember").width();
                        if(wind != null && window.innerWidth > 440){
                        wind = wind*2;
                        //$(".myteammember").width(wind+"px");
                        }
                        $(window).scrollTop($('#createDept').offset().top - 100).scrollLeft($('#createDept').offset().left); 
                    } else if(eSelect.selectedIndex === 2 || $('#createSelect').val() == 'createLab') {
                        console.log("createLab inside");
                        $('#createLab').show();
                        $('#createDept').hide();
                        $('#vennSettings').hide();
                        $('#editLab').hide();
                        $('#createSelect').css('background-color', '#3d9dcb'); 
                        //$(".deps").css('background-color', '#3378b7'); 
                        if($("#labdetail").is(":visible")){
                            $('#createLab').addClass("restrictcolumns");
                        }
                        var wind = $(".myteammember").width();
                        if(wind != null && window.innerWidth > 440){
                        wind = wind*2;
                        //$(".myteammember").width(wind+"px");
                        }
                        $(window).scrollTop($('#createLab').offset().top - 100).scrollLeft($('#createLab').offset().left); 
                    } else if(eSelect.selectedIndex === 3 || $('#createSelect').val() == 'vennSettings') {
                        console.log("vennSettings inside");
                        $('#vennSettings').show();
                        $('#createDept').hide();
                        $('#createLab').hide();
                        $('#editLab').hide();
                        $('#createSelect').css('background-color', '#3d9dcb'); 
                        //$(".deps").css('background-color', '#3378b7'); 
                        if($("#labdetail").is(":visible")){
                            $('#vennSettings').addClass("restrictcolumns");
                        }
                        var wind = $(".myteammember").width();
                        if(wind != null && window.innerWidth > 440){
                        wind = wind*2;
                        //$(".myteammember").width(wind+"px");
                        }
                        $(window).scrollTop($('#vennSettings').offset().top - 100).scrollLeft($('#vennSettings').offset().left); 
                    } else if(eSelect.selectedIndex === 3 || $('#createSelect').val() == 'editLab') {
                        console.log("transfer lab inside");
                        $('#vennSettings').hide();
                        $('#createDept').hide();
                        $('#createLab').hide();
                        $('#editLab').show();
                        $('#createSelect').css('background-color', '#3d9dcb');
                        //$(".deps").css('background-color', '#3378b7');
                        if($("#labdetail").is(":visible")){
                            $('#editLab').addClass("restrictcolumns");
                        }
                        var wind = $(".myteammember").width();
                        if(wind != null && window.innerWidth > 440){
                        wind = wind*2;
                        //$(".myteammember").width(wind+"px");
                        }
                        $(window).scrollTop($('#editLab').offset().top - 100).scrollLeft($('#editLab').offset().left); 
                    } else if(eSelect.selectedIndex === 0 || $('#createSelect').val() == 'createNone') {
                        console.log("create None inside");
                        $('#createLab').hide();
                        $('#createDept').hide();
                        $('#vennSettings').hide();
                        $('#editLab').hide();
                        $('#createSelect').css('background-color', '#3379b7');
                        //$(".deps").css('background-color', '#3378b7');
                        $( "#labdetail:visible" ).removeClass("restrictcolumns");
                    }
                }

                var eSelectvenn = document.getElementById('deptlabvenn');
                console.debug("venn setting selected: " + $('#deptlabvenn').val());

                if(nochange == 0 && (eSelectvenn.selectedIndex === 0 || $('#deptlabvenn').val() == 'selectdeptvenn')) {
                    console.log("venn settings None inside0");
                    $('#vennSettingsDisplay').hide();
                    //$('#vennSettings').hide();
                } else if(nochange == 1) {
                    console.log("don't switch to default");
                } else {
                    console.log("venn settings display inside 0");
                    var dept = $('#deptlabvenn').val();
                    console.log("deptlabvenn dept: " + dept);
                    var test = JSON.parse(JSON.stringify(var_vennsettings).replace(/&quot;/g, '"'));
                    console.log("deptlabvenn vennsettings: " + test);
                    console.log("deptlabvenn vennsettings find index: " + test.indexOf(dept));
                    $('#vennSettingsDisplay').show();
                    $('#vennSettings').show();
                }

                eSelectvenn.onchange = function() {
                    console.log("venn changing");
                    if(eSelectvenn.selectedIndex === 0 || $('#deptlabvenn').val() == 'selectdeptvenn') {
                        console.log("venn settings None inside1");
                        $('#vennSettingsDisplay').hide();
                        //$('#vennSettings').hide();
                    } else {
                        console.log("venn settings display inside 1");
                        var dept = $('#deptlabvenn').val();
                        console.log("deptlabvenn dept: " + dept);
                        var test = JSON.parse(JSON.stringify(venn).replace(/&quot;/g, '"'));
                        console.debug(test);
                        var departments = test.departments
                        console.debug(departments);
                        console.log("deptlabvenn vennsettings find index: " + departments.indexOf(dept));
                        var index = departments.indexOf(dept);
                        console.debug("index: " + index);
                        if(index > -1){
                            var labs = test.labs[index];
                            var currentadmins = test.admins[index];
                            var labadmins = JSON.parse(JSON.stringify(labadmins).replace(/&quot;/g, '"'));
                            //var getadmins = JSON.parse('#{JSON.stringify(getadmins)}'.replace(/&quot;/g, '"'));
                            var isvenns = test.isvenn[index];
                            var isdisabled = test.isdisabled[index];
                            console.debug(labs);
                            console.debug(isvenns);
                            var vennbody = "";
                            $('#vennbody').html("");
                            for(prop in labs){
                                var check = isvenns[prop];
                                var checkdis = isdisabled[prop];
                                var currentadmin = currentadmins[prop];
                                var checkedstr = "";
                                if(check == 1){
                                    checkedstr = "checked='checked'";
                                }
                                console.log("isvenns check - " + labs[prop] + " : " + check);
                                /*
                                vennbody += "<tr class='wrapped'><td>" + labs[prop] + "</td><td>" + "<form action='/admin/setvenn' method='post'><input type='checkbox' name='addvenn' value='addvenn' class='addvenn' " + checkedstr + "/><input type='hidden' name='labnamevenn' value='" + labs[prop] + "'/><input type='hidden' name='departmentvenn' value='" + dept + "' />" + "</form></td></tr>"; 
                                */



                                var tr = document.createElement("tr");
                                tr.setAttribute('class',"wrapped");
                                var td = document.createElement("td");
                                td.innerHTML = labs[prop];
                                tr.appendChild(td);

                                td = document.createElement("td");
                                var fadmin = document.createElement("form");
                                fadmin.setAttribute('action',"/setadmin");
                                fadmin.setAttribute('method',"post");
                                var selectadmin = document.createElement("select");
                                selectadmin.setAttribute('type',"text");
                                selectadmin.setAttribute('name',"labnameadmin");
                                selectadmin.setAttribute('id',"labnameadmin");
                                selectadmin.setAttribute('class',"form-control labnameedit");

                                console.log("labadmins : " + currentadmin);
                                //console.dir(labadmins);

                                /*if(labadmins != undefined){
                                for(var pr in labadmins){
                                var labadmin = labadmins[pr].email
                                console.log("labadmin : " + labadmin);
                                var checkedstrLab = "undefined";
                                if(currentadmin != undefined && labadmin == currentadmin){
                                    checkedstrLab = "selected"
                                }
                                console.log("checkedstrLab: " + checkedstrLab);
                                var optadmin = document.createElement("option");
                                if(checkedstrLab != "undefined"){
                                    optadmin.setAttribute('selected',checkedstrLab);
                                }
                                optadmin.setAttribute('name',"addvenn");
                                optadmin.setAttribute('value',labadmin);
                                optadmin.innerHTML = labadmin;
                                selectadmin.appendChild(optadmin);
                                }
                                }*/
                                var optadmin = document.createElement("option");
                                optadmin.setAttribute('selected',"selected");
                                optadmin.setAttribute('name',"addcurrentadmin");
                                optadmin.setAttribute('value',currentadmin);
                                optadmin.setAttribute('current',currentadmin);
                                optadmin.innerHTML = currentadmin;

                                selectadmin.appendChild(optadmin);

                                if(labadmins != undefined){
                                for(var pr in labadmins){
                                var labadmin = labadmins[pr].email
                                console.log("labadmin : " + labadmin);
                                optadmin = document.createElement("option");
                                optadmin.setAttribute('name',"addpossibleadmin");
                                optadmin.setAttribute('value',labadmin);
                                optadmin.setAttribute('current',currentadmin);
                                optadmin.innerHTML = labadmin;
                                selectadmin.appendChild(optadmin);
                                }
                                }


                                selectadmin.onchange = function () {
                                console.log("clicked");
                                var addadmin = $(this);
                                var selectedadmin = addadmin.val();//options[addadmin.selectedIndex].value
                                console.log("selectedadmin: " + selectedadmin);
                                console.log("currentadmin: " + currentadmin);
                                var addAdminText = document.getElementById("addVennText");
                                if(selectedadmin != currentadmin){
                                addAdminText.innerHTML = "Do you want to assign this administrator to this lab?";
                                
                                var pop = document.getElementById("ios-light");
                                pop.style.display = "block";
                                var shade = document.getElementById("shade");
                                shade.style.display = "block";
                                }

                                actionorderVenn.onclick = function(){
                                var parenttr = addadmin.closest('tr');
                                var currentbackgroundColor = parenttr.css('backgroundColor');

                                console.log("currentbackgroundColor: " + currentbackgroundColor);
                                if(currentbackgroundColor == 'rgba(0, 0, 0, 0)'){
                                parenttr.css('background-color', 'rgba(138, 109, 59, 0.66)');
                                } else {
                                parenttr.css('background-color', '#ded5c9');
                                }
                                console.log("submit form to add admin");
                                addadmin.closest('form').submit();
                                }

                                actioncancelVenn.onclick = function(){
                                console.log("current: " + $('option:selected', addadmin).attr('current'));
                                addadmin.val($('option:selected', addadmin).attr('current'));
                                //if(checked){
                                //addvenn.prop('checked', false);
                                //} else {
                                //addvenn.prop('checked', true);
                                //}
                                iosLightExit();
                                }


                                }

                                fadmin.appendChild(selectadmin);

                                var inputhidden = document.createElement("input");
                                inputhidden.setAttribute('type',"hidden");
                                inputhidden.setAttribute('name',"labname");
                                inputhidden.setAttribute('value',labs[prop]);   
                                fadmin.appendChild(inputhidden);

                                inputhidden = document.createElement("input");
                                inputhidden.setAttribute('type',"hidden");
                                inputhidden.setAttribute('name',"dept");
                                inputhidden.setAttribute('value',dept); 
                                fadmin.appendChild(inputhidden);

                                var divarrow = document.createElement("div");
                                divarrow.setAttribute('style',"top: -25px;position: relative;float: right;margin-right: 10px;");
                                var divarrowup = document.createElement("div");
                                divarrowup.setAttribute('style',"margin-bottom: 5px;");
                                divarrowup.setAttribute("class","arrow-up");
                                var divarrowdown = document.createElement("div");
                                divarrowdown.setAttribute("class","arrow-down");
                                divarrow.appendChild(divarrowup);
                                divarrow.appendChild(divarrowdown);
                                fadmin.appendChild(divarrow);

                                td.appendChild(fadmin);
                                tr.appendChild(td);



                                var f = document.createElement("form");
                                f.setAttribute('action',"/setvenn");
                                f.setAttribute('method',"post");
                                var i = document.createElement("input");
                                i.setAttribute('type',"checkbox");
                                i.setAttribute('name',"addvenn");
                                i.setAttribute('value',"addvenn");
                                i.setAttribute('class',"addvenn");


                                if(check == 1){
                                    i.setAttribute('checked',"checked");
                                }

                                var i0 = document.createElement("div");
                                i0.setAttribute('class',"checkboxThree1");
                                var i1 = document.createElement("input");
                                i1.setAttribute('style',"position:absolute;left: -9999px;");
                                i1.setAttribute('id',"addvenn"+prop);
                                i1.setAttribute('type',"checkbox");
                                i1.setAttribute('value',"addvenn");
                                i1.setAttribute('name',"addvenn");
                                i1.setAttribute('class',"addvenn");
                                if(check == 1){
                                    i1.setAttribute('checked',"checked");
                                }
                                var i2 = document.createElement("label");
                                i2.setAttribute('class',"labelcheck1 shadow");
                                i2.setAttribute('for',"addvenn"+prop);
                                i0.appendChild(i1);
                                i0.appendChild(i2);


                                td = document.createElement("td");

                                i2.onclick = function () {
                                

                                var addvenn = $(this).prev("input");
                                console.dir(addvenn);
                                var checked = addvenn.is(':checked');
                                console.log("clicked advenn - checked is: " + checked);
                                var addVennText = document.getElementById("addVennText");
                                if(!checked){
                                addVennText.innerHTML = "Do you want to add this lab to the Venn Diagram?";
                                } else {
                                addVennText.innerHTML = "Do you want to remove this lab from the Venn Diagram?";
                                }
                                var pop = document.getElementById("ios-light");
                                pop.style.display = "block";
                                var shade = document.getElementById("shade");
                                shade.style.display = "block";

                                actionorderVenn.onclick = function(){
                                var parenttr = addvenn.closest('tr');
                                var currentbackgroundColor = parenttr.css('backgroundColor');

                                console.log("currentbackgroundColor: " + currentbackgroundColor);
                                if(currentbackgroundColor == 'rgb(255, 255, 255)'){
                                parenttr.css('background-color', 'rgba(138, 109, 59, 0.66)');
                                } else {
                                parenttr.css('background-color', 'rgb(255, 255, 255');
                                }
                                addvenn.closest('form').submit();
                                }
                                actioncancelVenn.onclick = function(){
                                console.log("cancelled addvenn click: " +  checked);
                                addvenn.prop('checked', checked);
                                /*if(checked){
                                addvenn.prop('checked', false);
                                } else {
                                addvenn.prop('checked', true);
                                }*/
                                iosLightExit();
                                }

                                }
                                f.appendChild(i0);
                                
                                var fdis = document.createElement("form");
                                fdis.setAttribute('action',"/setdisabled");
                                fdis.setAttribute('method',"post");
                                var idis = document.createElement("input"); //input element, text
                                idis.setAttribute('type',"checkbox");
                                idis.setAttribute('name',"disablelab");
                                idis.setAttribute('value',"disablelab");
                                idis.setAttribute('class',"disablelab");
                                if(checkdis == 1){
                                    idis.setAttribute('checked',"checked");
                                }

                                var j0 = document.createElement("div");
                                j0.setAttribute('class',"checkboxThree1");
                                var j1 = document.createElement("input");
                                j1.setAttribute('style',"position:absolute;left: -9999px;");
                                j1.setAttribute('id',"disablelab"+prop);
                                j1.setAttribute('type',"checkbox");
                                j1.setAttribute('value',"disablelab");
                                j1.setAttribute('name',"disablelab");
                                j1.setAttribute('class',"disablelab");
                                if(checkdis == 1){
                                    j1.setAttribute('checked',"checked");
                                }
                                var j2 = document.createElement("label");
                                j2.setAttribute('class',"labelcheck1 shadow");
                                j2.setAttribute('for',"disablelab" + prop);
                                j0.appendChild(j1);
                                j0.appendChild(j2);


                                tdis = document.createElement("td");

                                j2.onclick = function () {
                                console.log("clicked disable");
                                var disablelab = $(this).prev("input");;
                                var checkedis = disablelab.is(':checked');
                                var disablelabText = document.getElementById("disablelabText");
                                if(!checkedis){
                                disablelabText.innerHTML = "Do you want to disable this lab?";
                                } else {
                                disablelabText.innerHTML = "Do you want to re-enable this lab?";
                                }
                                var pop = document.getElementById("ios-lightdis");
                                pop.style.display = "block";
                                var shade = document.getElementById("shade");
                                shade.style.display = "block";

                                actionorderDisable.onclick = function(){
                                console.log("cancelled disablelab click: " +  checkedis);
                                var parenttr = disablelab.closest('tr');
                                var currentbackgroundColor = parenttr.css('backgroundColor');

                                console.log("currentbackgroundColor: " + currentbackgroundColor);
                                if(currentbackgroundColor == 'rgb(255, 255, 255)'){
                                parenttr.css('background-color', 'rgba(138, 109, 59, 0.66)');
                                } else {
                                parenttr.css('background-color', 'rgb(255, 255, 255');
                                }
                                disablelab.closest('form').submit();
                                }
                                actioncancelDisable.onclick = function(){
                                disablelab.prop('checked', checkedis);
                                /*if(checkedis){
                                disablelab.prop('checked', false);
                                } else {
                                disablelab.prop('checked', true);
                                }*/
                                iosLightExitDis();
                                }

                                }
                                fdis.appendChild(j0);
                                

                                i = document.createElement("input");
                                i.setAttribute('type',"hidden");
                                i.setAttribute('name',"labnamevenn");
                                i.setAttribute('value',labs[prop]); 

                                idis = document.createElement("input");
                                idis.setAttribute('type',"hidden");
                                idis.setAttribute('name',"labnamevenn");
                                idis.setAttribute('value',labs[prop]);                              
                                f.appendChild(i);
                                fdis.appendChild(idis);

                                i = document.createElement("input");
                                i.setAttribute('type',"hidden");
                                i.setAttribute('name',"departmentvenn");
                                i.setAttribute('value',dept);   

                                idis = document.createElement("input");
                                idis.setAttribute('type',"hidden");
                                idis.setAttribute('name',"departmentvenn");
                                idis.setAttribute('value',dept);                                
                                f.appendChild(i);
                                fdis.appendChild(idis);



                                td.appendChild(f);
                                tdis.appendChild(fdis);
                                tr.appendChild(td);
                                tr.appendChild(tdis);
                                document.getElementById("vennbody").appendChild(tr);

                            }
                            //$('#vennbody').html(vennbody);
                            $('#vennSettingsDisplay').show();
                            $('#vennSettings').show();
                            $('#vennSettingsNolab').hide();
                        } else {
                            console.log("no labs associated")
                            $('#vennSettingsNolab').html("No lab is associated to this department.");
                            $('#vennSettingsDisplay').hide();
                            $('#vennSettings').show();
                            $('#vennSettingsNolab').show();
                        }
                    }
                }

                    var checkedstrDept = var_checkedstrDept;
                    if(checkedstrDept == "true"){
                        console.log("section createdept");
                        //$("#createLab").val("vennsettings");
                        $('#vennSettings').hide();
                        $('#createDept').show();
                        $('#createLab').hide();
                        $('#editLab').hide();
                        $(window).scrollTop($('#createDept').offset().top - 100).scrollLeft($('#createDept').offset().left);
                        }
                    var checkedstrLab = var_checkedstrLab;
                    if(checkedstrLab == "true"){
                        console.log("section createLab");
                        //$("#createLab").val("vennsettings");
                        $('#vennSettings').hide();
                        $('#createDept').hide();
                        $('#createLab').show();
                        $('#editLab').hide();
                        $(window).scrollTop($('#createLab').offset().top - 100).scrollLeft($('#createLab').offset().left);
                        }
                    var checkedstrEditLab = var_checkedstrEditLab;
                    if(checkedstrEditLab == "true"){
                        console.log("section editLab");
                        //$("#createLab").val("vennsettings");
                        $('#vennSettings').hide();
                        $('#createDept').hide();
                        $('#createLab').hide();
                        $('#editLab').show();
                        $(window).scrollTop($('#editLab').offset().top - 100).scrollLeft($('#editLab').offset().left);
                        }
                    var checkedstrVenn = var_checkedstrVenn;
                    if(checkedstrVenn == "true"){
                        console.log("section vennSettings");
                        //$("#createLab").val("vennsettings");
                        $('#vennSettings').show();
                        $('#createDept').hide();
                        $('#createLab').hide();
                        $('#editLab').hide();
                        $(window).scrollTop($('#vennSettings').offset().top - 100).scrollLeft($('#vennSettings').offset().left);
                        }
            }
            $('.addvenn').click(function() {
            console.log("clicked");
            });

            /*$( document ).ready(function() {
            console.log("checkedstrDept: " + #{checkedstrDept});
            var checkedstrDept = "#{checkedstrDept}";
            if(checkedstrDept == "true"){
                console.log("show department");
                $("#createDept").show();
                $(window).scrollTop($('#createDept').offset().top - 100).scrollLeft($('#createDept').offset().left);
            }
                //$( ".fa-envelope:visible" ).click(function() {$( this ).removeClass( "fa-envelope" );$( this ).addClass( "fa-envelope-open" );});
            });*/