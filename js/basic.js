$(document).ready(function () {

	
// detect touch and no-touch 
	if (Modernizr.touch) {   
		$('html').addClass('touch');
	}

// INLINE SVG FAllBACK	
	if(!Modernizr.inlinesvg) {
		// replace DOM element with image
		$('html').addClass('no-svg');
		$('svg').replaceWith(function (){
				return '<img src="' + $(this).attr('src') + '">';
			}
		);
	}		
	
// SVG FAllBACK	
	if(!Modernizr.svg) {
		// replace svgs with pngs of same file-name
		$('html').addClass('no-svg');
		$('img[src$="svg"]').attr('src', function() {  
			return $(this).attr('src').replace('.svg', '.png');
		});
	}	
	

// ipad landscape portrait scaling bug 
	if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
		var viewportmeta = document.querySelector('meta[name="viewport"]');
		if (viewportmeta) {
			viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
			document.body.addEventListener('gesturestart', function () {
				viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
			}, false);
		}
	}
	
// prevent saving of images
	$('img, svg, .picture, .picture *, object').bind('contextmenu', function(e) {
		return false;
	});

// show image author info
	$('.timeline-item-picture .author-info').bind('click', function(e) {
		$(this).toggleClass('visible');
	});	

// scroll indicator
	$('.scroll-indicator').bind('click ', function(e){
		
		$('html, body').animate({
			scrollTop: $(window).height()
		}, 800);
	
	});
	


// HEADER BEHAVIOR
	var lastScrollTop = 0;
	$(window).scroll(function(event){
		var st = $(this).scrollTop();

		// when on top
		if(st <= 0) { 
			$('header').removeClass('asleep sticky');
			return; 
		}

		if (st >= lastScrollTop && st > 180 ){
			// downscroll code
			$('header').addClass('asleep sticky');
		} else {
		   // upscroll code
		   $('header').removeClass('asleep').addClass('sticky');;    
		}
		lastScrollTop = st;
	});
	
	
// TEASER HEIGHT
    function getTeaserHeight(ext) {
        var i = Math.ceil( $(window).height() - ( $(window).height()*0.05 ) );
        if( ext ) return i + '' + ext;
        return i;
    }
	
    $( window ).bind('load resize', function() {
		
		var teaserheight	= getTeaserHeight('px'),
			availableSpace	= $('#teaser .middle-content').outerHeight() + $('#teaser .bottom-content').outerHeight() + $('#teaser .wrapper').innerHeight() - $('#teaser .wrapper').height();
		
		if( parseInt(teaserheight) > availableSpace && $(window).width() > 767 ) {
			$('#teaser').css('height', getTeaserHeight('px') ).removeClass('flexible');
		}
		else {
			$('#teaser').css('height','auto').addClass('flexible');		 
		}
    });    

	
// Caller Contact form
	function resetOverlaySettings(){
		$('.overlay-email-contact').removeClass('check-input success');
		$('#contact-form-submit').removeProp('disabled');
		$('.overlay-bottom-bar').html('');
		$('.overlay-email-contact .wrapper .success-message span').text('Thank you for your mail');
	}
	
    $('.overlay-email-contact-caller').bind('click', function(){
		$('.overlay-email-contact').addClass('show');
        $('body').addClass('noscroll');
        $('.overlay-email-contact .call-to-close').bind('click', function(){
                $('.overlay-email-contact').removeClass('show');
                $('body').removeClass('noscroll');
				resetOverlaySettings();
                $(this).unbind();
        });
    });
	
	// FAKE BEHAVIOR ON INPUT 
	$('.overlay-email-contact .fake-input')
		.keyup(function() {
			var textInObj = $(this).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');	
			if( textInObj.length < 1 ) {
				$(this).addClass('empty');
			} else { $(this).removeClass('empty input-error'); }
				
		})
		.addClass('empty');
	
	// SUBMIT DATA TO SERVER
	$('#contact-form-submit').bind('click', function(event){
		
		event.preventDefault();
		
		$('.overlay-email-contact').addClass('check-input');
		$(this).prop('disabled', true);
		
		var data = {
			'name'		: $('#form-input-name').text(),
			'email'		: $('#form-input-email').text(),
			'message'	: $('#form-input-message').text(),
			'subject'	: $('#form-input-subject').text()
		}
		
		$.ajax({
			type: "POST",
			url: "contact.php",
			dataType: 'text',
			data: data,
			success: function(msg) 
				{
					switch (msg) {
						case 'subject-error':
							$('#form-input-subject').addClass('input-error');
							$('.overlay-email-contact').removeClass('check-input');
							$('#contact-form-submit').removeProp('disabled');
							break;

						case 'email-error':
							$('#form-input-email').addClass('input-error');
							$('.overlay-email-contact').removeClass('check-input');
							$('#contact-form-submit').removeProp('disabled');
							break;

						case 'name-error':
							$('#form-input-name').addClass('input-error');
							$('.overlay-email-contact').removeClass('check-input');
							$('#contact-form-submit').removeProp('disabled');
							break;
						case 'try-again':
							$('.overlay-bottom-bar').html('<span>Something went wrong. Please try again.</span>');
							setTimeout(function() {
								$('.overlay-email-contact').removeClass('check-input');
								$('#contact-form-submit').removeProp('disabled');
							},1000);
							break;
						case 'server-error':
							$('.overlay-bottom-bar').html('<span>There is currently problem with the server.<br>Please try again later</span>');
							setTimeout(function() {
								$('.overlay-email-contact').removeClass('check-input');
								$('#contact-form-submit').removeProp('disabled');
							},1000);
							break;
						case 'success':
							$('.overlay-email-contact .wrapper .success-message span').append(', <br>'+data.name.trim()+'.');
							setTimeout(function() {
								$('.overlay-email-contact').addClass('success');
							},1000);
					}
				},
			error: function(jqXHR, textStatus) 
				{	
					if(textStatus == 'timeout' || textStatus == 'error' || textStatus == 'error') {
						textStatus = 'Something just went wrong.<br>Please try again later.';
					}
					$('.overlay-bottom-bar').html('<span>'+ textStatus +'</span>');
					setTimeout(function() {
						$('.overlay-email-contact').removeClass('check-input');
						$('#contact-form-submit').removeProp('disabled');
				  	},1000);
					
				}
		});
	});

});