/* ALL THE SCRIPTS IN THIS FILE ARE MADE BY KROWNTHEMES.COM --- REDISTRIBUTION IS NOT ALLOWED! */

(function($) {

	// We start with the newsletter code (it needs to be wrapped inside a $(window).load() event function in order to get the perfect timeout after the site has completely loaded

    if ( $.themeSettings.newsletter_check == "true" ) {

		$(window).load(function(){

	    	var $newsletterForm = $('#mc-embedded-subscribe-form'),
	    		$newsletterButton = $('#newsletter-button'),
	    		$newsletterText = $('#newsletter-text'),

	    		autoShow = parseInt( $.themeSettings.newsletter_auto ),

        		touchM = "ontouchstart" in window;

	    	if ( autoShow != 0 && $.cookie('shopifyNewsletterShowed') != 'yes' && ! ( touchM && $.themeSettings.newsletter_mobile == "true" ) ) {

	    		setTimeout(function(){
	    			
	    			$newsletterButton.trigger('click');
	    			$.cookie('shopifyNewsletterShowed', 'yes', { path: '/', expire: 365 });

	    		}, autoShow*1000);

	    	}

	    	$newsletterForm.submit(function(e){

	    		$newsletterForm.fadeOut(200);

	    		var action = $newsletterForm.prop('action');

	    		if ( action.indexOf('post-json') < 0 ) {
	    			action = action.replace('post', 'post-json') + '&c=?';
	    		}

	    		$.ajax({
	    			type: $newsletterForm.prop('method'),
	    			url: action,
	    			data: $newsletterForm.serialize(),
	    			cache: false,
	    			dataType: 'jsonp',
	    			error: function(data, text){
	    				$newsletterText
	    					.html('').css('opacity', 0)
	    					.html('Server error - check your MailChimp settings!')
	    					.animate({'opacity': 1}, 200);
	    			},
	    			success: function(data, text){
	    				$newsletterText
	    					.html('').css('opacity', 0)
	    					.html(data.msg.replace("0 -", ""))
	    					.animate({'opacity': 1}, 200);
	    			}
	    		})

	    		e.preventDefault();

	    	});

			$newsletterButton.on('click', function(){
				$newsletterForm.fadeIn(0);
				$newsletterText.html($.themeWords.general_newsletter_content_html);
				$newsletterForm.find('#mce-EMAIL').val('');
			});

		});

	}

    // Continue with everything else from here

    $(document).ready(function(){

        "use strict";

/* ----------------------------------------------------
---------- !! GENERAL STUFF !! -----------------
------------------------------------------------------- */
    
    var $html = $('html'),
        $body = $('body'),
        $sidebar = $('#sidebar'),
        $logo = $('#logo'),
        $meta = $('#meta'),
        $menu = $('#menu'),
        $responsiveMenu = $meta.find('.responsive-menu'),
        $responsiveClose = $('.responsive-close'),
        $options = $('#options'),
        $footer = $('#footer'),
        $content = $('#content'),

        touchM = "ontouchstart" in window,
        iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

    if(touchM) {
        $body.removeClass('no-touch')
            .addClass('touch');
    }

    $footer.removeClass('loading');

	/* Enable fit vid & custom solution for posts videos */

	//if ( ! $html.hasClass('ie8') ) {
		$('#page-content').fitVids();
	//}

    /* -------------------------------
    -----   Menu   -----
    --------------------------------*/

	if ( $('#menu').children('.top-menu').length == 2 ) {
		$('#menu').children('.top-menu').eq(0).addClass('collections');
	}

	var $openedMenu = null;

	$('#menu').find('a').click(function(e){

		var $this = $(this).parent();

		if ( $this.hasClass('submenu') ) {

			var $menu = $this,
				$submenu = $this.children('ul');
				/*
        	if ( $openedMenu != null && $openedMenu[0] != $submenu[0] ) {
	       		$openedMenu.removeClass('opened');
        		$openedMenu.stop().slideUp({
	            	duration: 150,
	            	easing: 'easeOutQuad',
	            	progress: function(){
	            		$(window).trigger('resize');
	            	}
	            });
        		$openedMenu = null;
	       	*/

        	if ( $menu.hasClass('opened') ) {

        		$menu.removeClass('opened');
        		$submenu.stop().slideUp({
	            	duration: 150,
	            	easing: 'easeOutQuad',
	            	progress: function(){
	            		$(window).trigger('resize');
	            	},
	            	complete: function(){
	            		setTimeout(function(){
	            			$(window).trigger('resize');
	            		}, 100);
	            	}
	            });

        	} else {

        		$menu.addClass('opened');
        		$openedMenu = $submenu;
        		$submenu.stop().slideDown({
	            	duration: 200,
	            	easing: 'easeInQuad',
	            	progress: function(){
	            		$(window).trigger('resize');
	            	},
	            	complete: function(){
	                	$(this).css('overflow', 'visible');
	            		setTimeout(function(){
	            			$(window).trigger('resize');
	            		}, 100);
	            	}
	            });

        	}

        	e.preventDefault();

		}

	});

	$responsiveMenu.children('a').click(function(e){

		if ( ! $responsiveMenu.hasClass('opened') ) {
			$responsiveMenu.addClass('opened');
			killFlow('in');
			$menu.css('visibility', 'visible').stop().animate({
				'opacity': 1
			}, 200, function(){
				$responsiveClose.show();
			})
		} 

		e.preventDefault();

	});

	$responsiveClose.click(function(e){

		if ( $responsiveMenu.hasClass('opened') ) {

			$responsiveMenu.removeClass('opened');
			killFlow('out');
			$menu.stop().animate({
				'opacity': 0
			}, 200, function(){
				$(this).css('visibility', 'hidden');
			});
			$responsiveClose.hide();

		}

		e.preventDefault();

	});

	// IE8 meta icons fix

	$('.ie8 #meta .svg').click(function(){

		if ( $(this).hasClass('search') ) {
			$('#main-search').trigger('click');
		} else {
			window.location.href = $(this).parent().find('a').attr('href');
		}

	});

    /* -------------------------------
    -----   Responsiveness   -----
    --------------------------------*/

    $body.append('<div><div id="size-mobilest"></div><div id="size-mobile"></div><div id="size-tablet"></div></div>');

    var $sizeTablet = $('#size-tablet'),
    	$sizeMobile = $('#size-mobile'),
    	$sizeMobilest = $('#size-mobilest'), 
   		mobileSize = false;

    $(window).on('resize', function(){

    	if ( $sizeMobile.css('display') == 'block' && ! mobileSize ) {
    		mobileSize = true;
    		switchSize();
    	} else if ( $sizeMobile.css('display') == 'none' && mobileSize ) {
    		mobileSize = false;
    		switchSize();
    	}

    }).trigger('resize');

    function switchSize(){

    	if ( mobileSize ) {
    		$footer.css('display', 'none').appendTo($body);
    		$menu.css({'opacity': 0, 'visibility': 'hidden'});
    		setTimeout(function(){
    			$footer.css('display', 'block');
    		}, 100);
    	} else {
    		$footer.css('display', 'none').appendTo($sidebar);
    		$menu.css({'opacity': 1, 'visibility': 'visible'});
    		$responsiveMenu.removeClass('opened');
			$responsiveClose.hide();
    		setTimeout(function(){
    			$footer.css('display', 'block');
    		}, 100);
    	}
    	
    }

	// fail safe for mobile devices

	if ( window.addEventListener ) {
		window.addEventListener('orientationchange', function(){
		    setTimeout(function(){
		    	$(window).trigger('resize');
		    }, 1000);
		}, false);
	}

	// Replace CSS3 calc method for IE8

	if ( $html.hasClass('ie8') ) {

		var $cContent = $('#content'),
			$cCartFormContent = $('#cart-form').find('.content'),
			$cProductGallery = $('#product-gallery');

		$(window).on('resize', function(){

			$cContent.width($(window).width() - 290);

			if ( $sizeMobilest.css('display') == 'block' ) {
				$cCartFormContent.width('calc(100% - 100px)');
			} else {
				$cCartFormContent.width('calc(100% - 340px)');
			}

			if ( $(window).width() < 1626 ) {
				$cProductGallery.width($cContent.width() - 330);
			} else {
				$cProductGallery.width($cContent.width()*.75);
			}

		}).trigger('resize');

	}

    /* -------------------------------
    -----   Scroll & Resize   -----
    --------------------------------*/

    // Footer to bottom

    $menu.after('<div class="dummy-height"></div>');
    var $dummy = $('.dummy-height');

    $(window).on('resize.scrollFix', function(){

    	$dummy.height( Math.ceil( $(window).height() - $logo.outerHeight(true) - $meta.outerHeight(true) - $menu.outerHeight(true) - $footer.outerHeight(true) - 94 ) );

    });

    setTimeout(function(){
    	$(window).trigger('resize.scrollFix');
    }, 100);

    setTimeout(function(){
    	$(window).trigger('resize.scrollFix');
    }, 1000);

    $('#footer').children().each(function(){
    	if(!$.trim($(this).html())){
    		$(this).remove();
    	}
    }); 

    // Sticky scroll functions

    $(window).on('scroll.scrollFix resize.scrollFix', function(){

    	if ( $sizeMobile.css('display') != 'block' ) {
			scrollElement($('#sidebar'));
			scrollElement($('#content'));
    	}

		if ( $sizeMobile.css('display') == 'block' && $logo.height() + 40 <= $(window).scrollTop() ) {
			$body.addClass('meta-fixed');
		} else {
			$body.removeClass('meta-fixed');
		}

    });

    function scrollElement($element) {

    	$element.parent().height($element.outerHeight());

		var dif = $(window).height() - $element.outerHeight();

		if ( dif <= 0 ) {

	    	if ( -$(window).scrollTop() <= dif ) {
	    		$element.css({top: dif});
	    	} else {
	    		$element.css({top: Math.ceil(-$(window).scrollTop())});
	    	}

    	}

    }

    /* -------------------------------
    -----   Cart   -----
    --------------------------------*/

	if ( $.themeSettings.cart_action == 'overlay' ) {

	    var $form = $('#add-to-cart'),
	    	$submitText = $('#addToCartText'),
	    	$submitButton = $('#addToCart'),
	    	$button = $('#ajaxCartButton'),
	    	$cartCount = $('#meta .count'),
	    	$cartQty = $('#add-to-cart #quantity');

	    $form.submit(function(e){

	    	var oldText = $submitText.html();
	    	$submitText.html('<i class="fa fa-circle-o-notch fa-spin"></i>');
	    	$submitButton.css('pointer-events', 'none');

	    	$.ajax({
	            type: $form.prop('method'),
	            url: $form.prop('action'),
	            data: $form.serialize(),
	            success: function(){

	            	$button.trigger('click');

	            	setTimeout(function(){
	            		$submitText.html(oldText);
	            		$submitButton.css('pointer-events', 'all');
	            	}, 500);

			    	if ( $cartQty.length > 0 ) {
						$cartCount.text(parseInt($cartCount.text()) + parseInt($cartQty.val()));
			    	} else {
						$cartCount.text(parseInt($cartCount.text()) + 1);
			    	}

	          	}
	    	});

	    	e.preventDefault();

	    });

    }
	    
/* ----------------------------------------------------
---------- !! OVERLAYS !! -----------------
------------------------------------------------------- */

    var $overlay = $('#main-overlay'),
    	bodyOffset = 0;

	$('.overlay-button').each(function(){
		$(this).click(function(e){
			openOverlay($($(this).data('overlay')));
			if ( $(this).data('overlay') == '#search-overlay' ) {
				$('#search-overlay input[type="search"]').focus();
			}
			e.preventDefault();
		});
	});

    function openOverlay($innerOverlay){

    	killFlow('in');
    	$overlay.stop().fadeIn();

    	$innerOverlay.stop().css('visibility', 'visible')
    		.delay(200).animate({
	    		'opacity': 1,
	    		'top': 0
	    	}, 200, 'easeInQuad')
	    .addClass('opened');

    }

    $overlay.find('.close.main').click(function(e){
    	closeModal();
    	e.preventDefault();
    });

    $overlay.children('div').click(function(e){
    	closeModal();
    });

	$overlay.find('.simple-overlay-box, #newsletter-box').click(function(e) {
		e.stopImmediatePropagation();
	});

    $('#share-overlay').find('a:not(.close)').click(function(e){

    	var url = $(this).attr('href'),
    		sharePop = window.open(url, $.themeWords.products_page_share_text, 'height=400,width=700');

    	if ( window.focus ) {
    		sharePop.focus();
    	}

    	e.preventDefault();

    });

	function closeModal() {

    	killFlow('out');
		$overlay.stop().fadeOut();

    	$overlay.find('.opened').stop().animate({
    		'opacity': 0, 
    		'top': -100
    	}, 300, 'easeInQuad', function(){
    		$(this).css('visibility', 'hidden');
    	}).removeClass('opened');

	}

	function killFlow(dir){

		if ( dir == 'in' ) {

	    	$html.addClass('killflow');

	    	if ( iOS ) {
	    		bodyOffset = $(window).scrollTop();
	    		$body.addClass('killflow-ios');
	    	}

		} else {

	    	$html.removeClass('killflow');

	    	if ( iOS ) {
	    		$body.removeClass('killflow-ios');
		    	$body.css('top', 0);
		    	$('html,body').animate({'scrollTop': bodyOffset}, 0);
	    	}

		}

	}

/* ----------------------------------------------------
---------- !! HOMEPAGE !! -----------------
------------------------------------------------------- */

	if ( $body.hasClass('template-index') ) {

	    /* -------------------------------
	    -----   Slideshow  -----
	    ---------------------------------*/

	    var $slider = $('#home-slider'),
	    	$slides = $slider.find('.slide'),
	    	$sliderNav = $slider.find('.draw-buttons'),
	    	$sliderCount = $sliderNav.find('.cur'),

	    	$homeContent = $('.home-content'),

	    	firstImg = $slider.find('img')[0],
	    	frontSwiper = null;

	    if ( $slides.length == 1 ) {
	    	$slider.addClass('disabled');
	    }

	    // Create swiper object

	    frontSwiper = $slider.swiper({

	    	effect: $.themeSettings.carousel_transition == "fade" ? 'fade' : 'slide',
	    	mode: 'horizontal',
	    	loop: true,
	    	calculateHeight: false,
	    	grabCursor: true,
	    	useCSS3Transforms: true,
	    	resizeReInit: true,
	    	updateOnImagesReady: false,
	    	pagination: '.swiper-pagination',
	    	paginationClickable: true,
	    	autoplay: $.themeSettings.carousel_autoplay == "true" && $slides.length > 1 ? parseInt($.themeSettings.carousel_timer)*1000 : null,
	    	autoplayDisableOnInteraction: true,
	    	speed: 300,
	    	resistance: false,
	    	keyboardControl: true,

		    onInit: function(swiper) {

	            $slider.find('.btn-next').on('click', function(e){
	                swiper.slideNext();
	                e.preventDefault();
	            });
	            $slider.find('.btn-prev').on('click', function(e){
	                swiper.slidePrev();
	                e.preventDefault();
	            });

	            // Search for images and load "load" the first one - when it's ready, continue with the initialization

	            if(firstImg.complete || firstImg.naturalWidth > 0) {
	                initSwiperFront(swiper);
	            } else {

	            	$(firstImg).attr('src', $(firstImg).attr('src'));

	                $(firstImg).on('load', function(){
	                    initSwiperFront(swiper);
	                });

	            }

	        	// Trigger a resize after each image load

	        	$slider.find('img').on('load', function(){
	        		$(window).trigger('resize');
	        	});

		    }, 

	        // The two functions below are for the customization of the grabbing mouse cursor

	        onTouchStart: function(swiper){
	            $(swiper.container).addClass('grabbing');
	        },
	        onTouchEnd: function(swiper){
	            $(swiper.container).removeClass('grabbing');
	        },

	        // Do stuff when slides change

	        onSlideChangeStart: function(swiper){
	            $sliderCount.text(calculateSwiperIndex(swiper.activeIndex, swiper.slides.length));
		    	$(swiper.slides[swiper.activeIndex]).find('.label').css({'opacity': 0, 'top': 60});

	        },
	        onSlideChangeEnd: function(swiper){

	        	animateLabels(swiper, 0);

	    		$(window).trigger('resize');
		    	setTimeout(function(){
		    		$(window).trigger('resize');
		    	}, 200);

	        }

	    });

	    // Setup slider resizing

	    $(window).on('resize', function(){
	    	if ( $sizeMobilest.css('display') == 'block' ) {
	       		$slider.height($slider.find('.swiper-slide-active img').height() + $slider.find('.swiper-slide-active .slide-caption').outerHeight());
	       		if ( frontSwiper != undefined )
	    		frontSwiper.onResize();
	    	} else if ( $sizeMobile.css('display') == 'block' ) {
	       		$slider.height($slider.find('.swiper-slide-active img').height());
	       		if ( frontSwiper != undefined )
	    		frontSwiper.onResize();
	    	} else {
	    		$slider.height($(window).height());
	    	}
	    });

	}

	// Init swiper - fade everything in

    function initSwiperFront(swiper) {

    	var dl = 100;
    	if ( $body.hasClass('template-index') ) {
    		var dl = 1000;
    	}

        $(swiper.slides).find('.slide-img').delay(dl).animate({'opacity': 1}, 300);

    	$(window).trigger('resize');
	    swiper.onResize();

	    setTimeout(function(){
	    	$(window).trigger('resize');
		    swiper.onResize();
    		$('#home-slider').addClass('loaded');
	    }, 1000);

		if ( $homeContent != null ) {
			setTimeout(function(){

				$homeContent.show();

				if ( $('.blog-grid').length > 0 ) {
					$('.blog-grid').imagesLoaded(function(){
						$('.blog-grid').isotope({
							selector: '.post'
						});
					});
				}

				$(window).trigger('resize');

			}, 500);
		}

		if ( $slides.length > 1 ) {
			$sliderNav.find('.tot').text($slides.length);
			$sliderNav.fadeIn(200);
		}

		animateLabels(swiper, 1000);

    }

    // Animate labels

	function animateLabels(swiper, delay) {

		setTimeout(function(){

			var i = 0;
			$(swiper.slides[swiper.activeIndex]).find('.label').each(function(){
				$(this).stop().delay(i++*120+300).animate({
					'opacity': 1,
					'top': 0
				}, 250).css('visibility', 'visible');
			});
			
		}, delay);
		
	}

/* ----------------------------------------------------
---------- !! GRID !! -----------------
------------------------------------------------------- */

	if ( $('.isotope-products').length > 0 ) {

		$('.isotope-products').each(function(){

			/* -------------------------------
		    -----   Init  -----
		    ---------------------------------*/

		    var $gridHolder = $(this),
		    	$gridItems = $(this).find('.grid-item'),
		    	maxImgWidth = $body.hasClass('template-index') && $(this).hasClass('collections-list') ? 640 : ($.themeSettings.collections_size == "large" ? 640 : 480);

		    $gridHolder.imagesLoaded(function(){

			    $gridHolder.isotope({
			    	selector: '.grid-item',
			    	resizable: false,
			    	resizesContainer: true
			    });

		    	setTimeout(function(){

		    		$gridHolder.addClass('loaded');

			    	$gridHolder.find('img').each(function(){

						$(this).animate({'opacity': 1}, 200);
						$(this).parent().find('.add').css('opacity', 1);

						$(this).parent().data('ratio', $(this).naturalHeight() / $(this).naturalWidth());

			    	});

		    	}, 500);

				$(window).trigger('resize');

		    });

		    /* -------------------------------
		    -----   Resize  -----
		    ---------------------------------*/

		    $(window).on('resize', function(){

		        // Gets the window size

		        var sW = $content.width()+3, 
		            sH = $(window).height();

		        switch ( $.themeSettings.collections_border ) {
		        	case "true":
		        		sW -= 9;
		        		break;
		        	case "true tiny":
			    		sW -= 2;
			    		break;
			    	case "true large":
			    		sW -= 12;
			    		break;
		        }

		    	$gridHolder.width(sW);

		        // Calculates the new size of each thumbs

		        $gridItems.each(function(){

		       		var iW = Math.floor(sW/Math.ceil(sW/maxImgWidth));
		       		/* if ( $(this).data('ratio') != undefined ) {
		       			$(this).height(Math.floor(iW*$(this).data('ratio')));
		       		} */

		        	$(this).width(iW);

		        });

		        $gridHolder.isotope();

		    }).trigger('resize');

		});

	}

/* ----------------------------------------------------
---------- !! PRODUCT !! -----------------
------------------------------------------------------- */

	if ( $body.hasClass('template-product' ) ) {

	    /* -------------------------------
	    -----   Truncated description   -----
	    ---------------------------------*/

	    if ( $.themeSettings.truncated_description == "true" ) {

			$('div[itemprop="description"]').append('<a href="#" id="more">' + $.themeWords.products_page_more_description_label + '</a>');

			var $descriptionBox = $('div[itemprop="description"] > div'),
				$more = $('#more'),
				opened = false;

			$descriptionBox.css('height', 'auto');
			if ( $descriptionBox.height() <= $.themeSettings.truncated_description_lines ) {
				$('#more').remove();
			} else {
				$descriptionBox.css('height', $.themeSettings.truncated_description_lines);
			}

			$('#more').click(function(e){

				if ( ! opened ) {

					opened = true;
					$more.text($.themeWords.products_page_less_description_label);

					$descriptionBox.css('height', 'auto');
					var dH = $descriptionBox.height();
					$descriptionBox.css('height', $.themeSettings.truncated_description_lines);

					$descriptionBox.stop().animate({
						height: dH
					}, {
						duration: 250,
						easing: 'easeInSine',
						progress: function(){
							$(window).trigger('resize');
						},
						complete: function(){
							$(this).css('height', 'auto');
							setTimeout(function(){
								$(window).trigger('resize');
							}, 100);
						}
					});

				} else {

					opened = false;
					$more.text($.themeWords.products_page_more_description_label);

					$descriptionBox.stop().animate({
						height: $.themeSettings.truncated_description_lines
					}, {
						duration: 200,
						easing: 'easeInSine',
						progress: function(){
							$(window).trigger('resize');
						}, 
						complete: function(){
							setTimeout(function(){
								$(window).trigger('resize');
							}, 100);
						}
					});

				}
					
				e.preventDefault();

			});

		}

	    /* -------------------------------
	    -----   Gallery   -----
	    --------------------------------*/

	    var $productContent = $('#product-content');

	    // Init swiper - part 1

	    var $productGallery = $('#product-gallery'),
	    	$productSlides = $productGallery.find('.swiper-slide'),
	    	$productSlider = $productGallery.find('.swiper-container'),
		    firstImg = $productGallery.find('img')[0];

		// Create swiper object

	    $.swiper = $productSlider.swiper({

	    	effect: $.themeSettings.gallery_transition == "fade" ? 'fade' : 'slide',
	    	mode: 'horizontal',
	    	loop: true,
	    	calculateHeight: false,
	    	grabCursor: true,
	    	useCSS3Transforms: true,
	    	resizeReInit: true,
	    	updateOnImagesReady: false,
	    	pagination: '.swiper-pagination',
	    	autoplay: $.themeSettings.gallery_autoplay == "true" && $productSlides.length > 1 ? parseInt($.themeSettings.gallery_timer)*1000 : null,
	    	autoplayDisableOnInteraction: true,
	    	speed: 300,
	    	resistance: false,
	    	keyboardControl: true,

		    onInit: function(swiper) {

		        // On the first init append the custom navigation and bind the proper events

		         if(swiper.slides.length-2 > 1) {
	                $productGallery.append('<div class="draw-buttons gal swiper-nav three"><div class="holder"><span class="swiper-no"><span class="cur">1</span><span class="tot">' + (swiper.slides.length-2) + '</span></span><span class="btn-prev">' + $.themeAssets.arrowLeft + '<a href="#" class="swiper-prev"></a></span><span class="btn-next">' + $.themeAssets.arrowRight + '<a href="#" class="swiper-next"></a></span></div></div>');
	            } else { 
	                $productGallery.append('<div class="draw-buttons gal swiper-nav three" style="pointer-events: none"><div class="holder"><span class="swiper-no"><span class="cur">1</span><span class="tot">' + (swiper.slides.length-2) + '</span></span></div></div>');
	                $(swiper.container).css('pointer-events', 'none');
	            }

	            $productGallery.find('.swiper-next').on('click', function(e){
	                swiper.slideNext();
	                e.preventDefault();
	            });
	            $productGallery.find('.swiper-prev').on('click', function(e){
	                swiper.slidePrev();
	                e.preventDefault();
	            });

	            // Search for images and load "load" the first one - when it's ready, continue with the initialization

	            if(firstImg.complete || firstImg.naturalWidth > 0) {
	                initSwiperCustom(swiper);
	            } else {

	            	$(firstImg).attr('src', $(firstImg).attr('src'));

	                $(firstImg).on('load', function(){
	                    initSwiperCustom(swiper);
	                });

	            }

	            // Limit scale of images if set by user

	        	if ( $.themeSettings.gallery_max_size == "false" ) {

	            	$productSlider.find('img').each(function(){

	            		if ( $(this)[0].complete || $(this)[0].naturalWidth > 0 ) {
			        		$(this).css('max-width', $(this).naturalWidth());
			        		$(this).css('max-height', $(this).naturalHeight());
	            		} else {
	            			$(this).on('load', function(){
				        		$(this).css('max-width', $(this).naturalWidth());
				        		$(this).css('max-height', $(this).naturalHeight());
	            			});
	            		}

	            	});

	        	}

	        	// Trigger a resize after each image load

	        	$productSlider.find('img').on('load', function(){
	        		$(window).trigger('resize');
	        	});

		    }, 

	        // The two functions below are for the customization of the grabbing mouse cursor

	        onTouchStart: function(swiper){
	            $(swiper.container).addClass('grabbing');
	        },
	        onTouchEnd: function(swiper){
	            $(swiper.container).removeClass('grabbing');
	        },

	        // Refresh the pagination in the custom navigation

	        onSlideChangeStart: function(swiper){
	            $productGallery.find('.cur').text(calculateSwiperIndex(swiper.activeIndex, swiper.slides.length));

	        }

	    });

	}

	// Init swiper - part 2

    function initSwiperCustom(swiper) {

	    // Attach proper resize event based on user settings

		if ( $.themeSettings.gallery_resizing == 'fit-both' ) {

            $(window).on('resize.removeLater', resizeProjectFitBoth);
            resizeProjectFitBoth();

		} else {

            $(window).on('resize.removeLater', resizeProjectFill);
            resizeProjectFill();

		}

        // Fade in images

        $(swiper.slides).find('img').delay(500).animate({'opacity': 1}, 500);

	    // Animate the product page based on it's type

    	$(window).trigger('resize');
	    swiper.onResize();
	    //?!
	    setTimeout(function(){

	    	$(window).trigger('resize');
		    swiper.onResize();

    		$('#product-page').removeClass('loading');
    		$('#product-gallery').addClass('loaded');
	    }, 1000);

	    // Swipe to product variant if case

	    if ( $.swiperVariantAlready != undefined ) {
	    	setTimeout(function(){
	    		swiper.slideTo($.swiperVariantAlready);
	    	}, 100)
	    }

    }

    // ---- Resizing functions

    function resizeProjectMobile(){

    	$productSlider.find('img').each(function(){

    		var $img = $(this);

            $img.css({
                'left': Math.round(($productGallery.width()-$img.width())/2)
            });

        });

   		setTimeout(function(){
   			$productSlider.height($productSlider.find('.swiper-slide-active img').height());
   		}, 200);

    }

    function resizeProjectFitBoth() {

    	if ( $sizeTablet.css('display') != 'block' ) {

	    	$productSlider.find('img').each(function(){

	    		var $img = $(this);

	            var maxHeight = $(window).height(),
	                maxWidth = $productGallery.width(),
	                oldHeight = $img.naturalHeight(),
	                oldWidth = $img.naturalWidth(),
	                ratio = Math.max(oldWidth / oldHeight, oldHeight / oldWidth),
	                newHeight = 0,
	                newWidth = 0;

			    // Complex calculations to get the perfect size

	            if(oldWidth > oldHeight){

	                if(maxWidth / ratio > maxHeight){
	                    newHeight = maxHeight;
	                    newWidth = maxHeight * ratio;
	                } else {
	                    newWidth = maxWidth;
	                    newHeight = maxWidth / ratio;
	                }

	            } else {

	                if(maxHeight / ratio > maxWidth){
	                    newWidth = maxWidth;
	                    newHeight = maxWidth * ratio;
	                } else {
	                    newHeight = maxHeight;
	                    newWidth = maxHeight / ratio;
	                }

	            }

	            // Apply the correct size and reposition

	            $img.css({
	                'width': Math.ceil(newWidth),
	                'height': Math.ceil(newHeight)
	            });
	            $img.css({
	                'top': Math.round(($(window).height()-$img.height())/2),
	                'left': Math.round(($productGallery.width()-$img.width())/2)
	            });

	            $productSlider.height($(window).height());

	    	});

		} else {
			resizeProjectMobile();
		}
		
		repositionContent();

    }

    function resizeProjectFill(){

    	if ( $sizeTablet.css('display') != 'block' ) {

	    	$productSlider.find('img').each(function(){

	    		var $img = $(this);

	    		var maxHeight = $(window).height(),
		            maxWidth = $productSlider.width(),
		            oldHeight = $img.naturalHeight(),
		            oldWidth = $img.naturalWidth(),
		            ratio = Math.max(oldWidth / oldHeight, oldHeight / oldWidth),
		            newHeight = 0,
		            newWidth = 0;

		        // Complex calculations to get the perfect size

		        if(oldWidth > oldHeight){

		            if(maxWidth / ratio < maxHeight){
		                newHeight = maxHeight;
		                newWidth = maxHeight * ratio;
		            } else {
		                newWidth = maxWidth;
		                newHeight = maxWidth / ratio;
		            }

		        } else {

		            if(maxHeight / ratio < maxWidth){
		                newWidth = maxWidth;
		                newHeight = maxWidth * ratio;
		            } else {
		                newHeight = maxHeight;
		                newWidth = maxHeight / ratio;
		            }

		        }

		        // Apply the correct size and reposition

		        $img.css({
		            'width': Math.ceil(newWidth),
		            'height': Math.ceil(newHeight)
		        });

		        if ( $img.css('maxWidth') != 'none' && ( newWidth > parseInt($img.css('maxWidth')) || newHeight > parseInt($img.css('maxHeight')) ) ) {

		            $img.css({
		                'top': Math.round((maxHeight-$img.height())/2),
		                'left': Math.round((maxWidth-$img.width())/2)
		            });

		        } else {

		        	$img.css({
			            'top': Math.round((maxHeight - newHeight)/2),
			            'left': Math.round((maxWidth - newWidth)/2)
			        });

		        }

	            $productSlider.height($(window).height());

	    	});

		} else {
			resizeProjectMobile();
		}
		
		repositionContent();

    }

    function repositionContent(){
    	if ( $sizeTablet.css('display') == 'block' ) {
    		$productContent.css('marginTop', $productGallery.height());
    	} else {
    		$productContent.css('marginTop', 0);
    	}
    }

    // ----- Other functions


	function calculateSwiperIndex(index, length) {
        if ( index == 0 ) {
        	index = length-2;
        } else if ( index == length-1 ) {
        	index = 1;
        }
        return index;
	}

/* ----------------------------------------------------
-------------------- !! BLOG !! --------------------
------------------------------------------------------- */

	if ( $body.hasClass('template-blog') ) {

		$('.blog-grid').imagesLoaded(function(){

			$('.template-blog .blog-grid').isotope({
				selector: '.post'
			});

		});

	} else if ( $body.hasClass('template-article' ) ) {

		jQuery.timeago.settings.strings = {
			prefixAgo: null,
			prefixFromNow: null,
			suffixAgo: $.themeWords.suffixAgo,
			suffixFromNow: $.themeWords.suffixFromNow,
			seconds: $.themeWords.seconds,
			minute: $.themeWords.minute,
			minutes: $.themeWords.minutes,
			hour: $.themeWords.hour,
			hours: $.themeWords.hours,
			day: $.themeWords.day,
			days: $.themeWords.days,
			month: $.themeWords.month,
			months: $.themeWords.months,
			year: $.themeWords.year,
			years: $.themeWords.years,
			wordSeparator: " ",
			numbers: []
		};

		$('.timeago').timeago();

	}

	// Homepage blog when no slider

	if ( $body.hasClass('template-index') && $('#home-slider').length == 0 && $('.blog-grid').length > 0 ) {
		$('.blog-grid').imagesLoaded(function(){
			$('.blog-grid').isotope({
				selector: '.post'
			});
		});
	}

/* ----------------------------------------------------
---------- !! DEFAULT SHORTCODES !! -----------------
------------------------------------------------------- */

    /* -------------------------------
    -----   Style all selects   -----
    ---------------------------------*/

	$('#options select').each(function(){
		
		$(this).styledSelect({
	        coverClass: 'simple-select-cover',
	        innerClass: 'simple-select-inner'
	    }).addClass('styled');
	    
	    $(this).parent().append($.themeAssets.arrowDown);
	    
	});

	$('select:not(.styled)').each(function(){

		$(this).styledSelect({
		    coverClass: 'regular-select-cover',
		    innerClass: 'regular-select-inner'
		});
	    	
	    $(this).parent().append($.themeAssets.arrowDown);

	});

    /* -------------------------------
    -----   Tabs   -----
    --------------------------------*/

    $('.krown-tabs').each(function(){

        var $titles = $(this).children('.titles').children('h5'),
        $contents = $(this).children('.contents').children('div'),
        $openedT = $titles.eq(0),
        $openedC = $contents.eq(0);

        $openedT.addClass('opened');
        $openedC.stop().slideDown(0);

        $titles.find('a').prop('href', '#').off('click');;

        $titles.click(function(e){

            $openedT.removeClass('opened');
            $openedT = $(this);
            $openedT.addClass('opened');

            $openedC.stop().slideUp(200);
            $openedC = $contents.eq($(this).index());
            $openedC.stop().delay(200).slideDown(200);

            e.preventDefault();

        });

    });

/* ----------------------------------------------------
---------- !! THE END !! -----------------
------------------------------------------------------- */

    });

})(jQuery);