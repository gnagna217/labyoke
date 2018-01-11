var h = $(window).height() - 125;
          $(".marginbottom").css("min-height",h);

$('#messagejs1').hide();

                    $('#regbutton1').click(function() {
                        console.log("regfirstname: " + $('#regfirstname').val());
                        console.log("reglastname: " + $('#lastname').val());
                        console.log("regemail: " + $('#regemail').val());
                        console.log("regtel: " + $('#tel').val());
                        if($('#regfirstname').val() != "" && $('#lastname').val() != "" && $('#regemail').val() != "" && $('#tel').val() != "" ){
                            console.log("go on!");
                            $('#regform1').submit();
                        } else if($('#regfirstname').val() == "" || $('#regfirstname').val() == undefined){
                            console.log("stop!");
                            $('#messagejs1').html(var_register_7);
                            $('#messagejs1').show();
                            return false;
                        } else if($('#lastname').val() == "" || $('#lastname').val() == undefined){
                            console.log("stop!");
                            $('#messagejs1').html(var_register_8);
                            $('#messagejs1').show();
                            return false;
                        } else if($('#regemail').val() == "" || $('#regemail').val() == undefined){
                            console.log("stop!");
                            $('#messagejs1').html(var_register_9);
                            $('#messagejs1').show();
                            return false;
                        } else if($('#tel').val() == "" || $('#tel').val() == undefined){
                            console.log("stop!");
                            $('#messagejs1').html(var_register_10);
                            $('#messagejs1').show();
                            return false;
                        } 
                      }); 

                      