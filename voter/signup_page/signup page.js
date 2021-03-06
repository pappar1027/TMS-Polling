/**
 * Created by zouyun on 1/18/17.
 */

//jQuery time
var baseUrl = 'https://tms-polling.herokuapp.com/api/voter';
// var baseUrl = 'http://localhost:8080/api/voter';
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
$(document).ready(function() {
    $.ajax({
      url: baseUrl + '/companies',
      method: 'GET'
    }).done(function(res) {
      $('#companies').html(res.map(function(c) { return '<option value=' + c.id + '>' + c.name + '</option>' }).join(''));
    });
  
    $("#nextButton").click(function () {
        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //activate next step on progressbar using the index of next_fs
        
        $.ajax({
          url: baseUrl + '/register',
          method: 'POST',
          data: {
            name: $('input[name="name"]').val(),
            nric: $('input[name="NRIC"]').val(),
            country_code: 65,
            phone: parseInt($('input[name="phone"]').val()),
            email: $('input[name="email"]').val(),
            company: $('#companies').val(),
            shares: $('input[name="shares"]').val()
          }
        }).done(function() {
          $.ajax({
            url: baseUrl + '/getcode',
            method: 'POST',
            data: {
              countryCode: 65,
              phone: parseInt($('input[name="phone"]').val())
            }
          }).done(function() {
             $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            //show the next fieldset
            next_fs.show();
            //hide the current fieldset with style
            current_fs.animate({opacity: 0}, {
                step: function (now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale current_fs down to 80%
                    scale = 1 - (1 - now) * 0.2;
                    //2. bring next_fs from the right(50%)
                    left = (now * 50) + "%";
                    //3. increase opacity of next_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fs.css({
                        'transform': 'scale(' + scale + ')',
                        'position': 'absolute'
                    });
                    next_fs.css({'left': left, 'opacity': opacity});
                },
                duration: 800,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
          })
        });
    });
    
    $("#submitButton").click(function () {
        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();
        
        $.ajax({
          url: baseUrl + '/verfiy-reg',
          method: 'POST',
          data: {
            countryCode: 65,
            phone: parseInt($('input[name="phone"]').val()),
            verifyCode: parseInt($('input[name="OTP"]').val())
          }
        }).done(function() {
           $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
          //show the next fieldset
          next_fs.show();
          //hide the current fieldset with style
          current_fs.animate({opacity: 0}, {
              step: function (now, mx) {
                  //as the opacity of current_fs reduces to 0 - stored in "now"
                  //1. scale current_fs down to 80%
                  scale = 1 - (1 - now) * 0.2;
                  //2. bring next_fs from the right(50%)
                  left = (now * 50) + "%";
                  //3. increase opacity of next_fs to 1 as it moves in
                  opacity = 1 - now;
                  current_fs.css({
                      'transform': 'scale(' + scale + ')',
                      'position': 'absolute'
                  });
                  next_fs.css({'left': left, 'opacity': opacity});
              },
              duration: 800,
              complete: function () {
                  current_fs.hide();
                  animating = false;
              },
              //this comes from the custom easing plugin
              easing: 'easeInOutBack'
          });
        });
    });

    $(".previous").click(function () {
        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function (now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1 - now) * 50) + "%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({'left': left});
                previous_fs.css({'transform': 'scale(' + scale + ')', 'opacity': opacity});
            },
            duration: 800,
            complete: function () {
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    $(".submit").click(function () {
        return false;
    });

    $('.check').css('stroke-dashoffset', 0);

    // $('#phoneNumber').mask('9999 9999');

    $('#otpNumber').mask('9999');

    $('#phoneButton').click(function(e) {
        $('#submitButton').prop('disabled',false).toggleClass('disabled-button action-button',500,'easeOutBounce');
    });

    $('#nricInput').mask('S0000000S');

    // $('#shareInput').mask('999');

    $('.signInput').keyup(function() {
        var filled = true;
        $('.signInput').each(function() {
            if ($(this).val().length == 0) {
                filled = false;
            } 
        });

        if (!filled) {
            $('#nextButton').prop('disabled',true).removeClass('action-button').addClass('disabled-button',500);
        } else {
            $('#nextButton').prop('disabled',false).removeClass('disabled-button').addClass('action-button',500);
        }
    })

});