var wpAjaxUrl = 'http://127.0.0.1/newswave/wp-admin/admin-ajax.php';var flBuilderUrl = 'http://127.0.0.1/newswave/wp-content/plugins/beaver-builder-lite-version/';var FLBuilderLayoutConfig = {
	anchorLinkAnimations : {
		duration 	: 1000,
		easing		: 'swing',
		offset 		: 100
	},
	paths : {
		pluginUrl : 'http://127.0.0.1/newswave/wp-content/plugins/beaver-builder-lite-version/',
		wpAjaxUrl : 'http://127.0.0.1/newswave/wp-admin/admin-ajax.php'
	},
	breakpoints : {
		small  : 768,
		medium : 992,
		large : 1200	},
	waypoint: {
		offset: 80
	}
};
(function($){

	if(typeof FLBuilderLayout != 'undefined') {
		return;
	}

	/**
	 * Helper class with generic logic for a builder layout.
	 *
	 * @class FLBuilderLayout
	 * @since 1.0
	 */
	FLBuilderLayout = {

		/**
		 * Initializes a builder layout.
		 *
		 * @since 1.0
		 * @method init
		 */
		init: function()
		{
			// Destroy existing layout events.
			FLBuilderLayout._destroy();

			// Init CSS classes.
			FLBuilderLayout._initClasses();

			// Init backgrounds.
			FLBuilderLayout._initBackgrounds();

			// Init row shape layer height.
			FLBuilderLayout._initRowShapeLayerHeight();

			// Only init if the builder isn't active.
			if ( 0 === $('.fl-builder-edit').length ) {

				// Init module animations.
				FLBuilderLayout._initModuleAnimations();

				// Init anchor links.
				FLBuilderLayout._initAnchorLinks();

				// Init the browser hash.
				FLBuilderLayout._initHash();

				// Init forms.
				FLBuilderLayout._initForms();

				FLBuilderLayout._reorderMenu();
			}
		},

		/**
		 * Public method for refreshing Wookmark or MosaicFlow galleries
		 * within an element.
		 *
		 * @since 1.7.4
		 * @method refreshGalleries
		 */
		refreshGalleries: function( element )
		{
			var $element  = 'undefined' == typeof element ? $( 'body' ) : $( element ),
				mfContent = $element.find( '.fl-mosaicflow-content' ),
				wmContent = $element.find( '.fl-gallery' ),
				mfObject  = null;

			if ( mfContent ) {

				mfObject = mfContent.data( 'mosaicflow' );

				if ( mfObject ) {
					mfObject.columns = $( [] );
					mfObject.columnsHeights = [];
					mfContent.data( 'mosaicflow', mfObject );
					mfContent.mosaicflow( 'refill' );
				}
			}
			if ( wmContent ) {
				wmContent.trigger( 'refreshWookmark' );
			}
		},

		/**
		 * Public method for refreshing Masonry within an element
		 *
		 * @since 1.8.1
		 * @method refreshGridLayout
		 */
		refreshGridLayout: function( element )
		{
			var $element 		= 'undefined' == typeof element ? $( 'body' ) : $( element ),
				msnryContent	= $element.find('.masonry');

			if ( msnryContent.length )	{
				msnryContent.masonry('layout');
			}
		},

		/**
		 * Public method for reloading BxSlider within an element
		 *
		 * @since 1.8.1
		 * @method reloadSlider
		 */
		reloadSlider: function( content )
		{
			var $content = 'undefined' == typeof content ? $('body') : $(content);

			// reload sliders.
			if ($content.find('.bx-viewport > div').length > 0) {
				$.each($content.find('.bx-viewport > div'), function (key, slider) {
					setTimeout(function () {
						$(slider).data('bxSlider').reloadSlider();
					}, 100);
				});
			}
		},

		/**
		 * Public method for resizing WP audio player
		 *
		 * @since 1.8.2
		 * @method resizeAudio
		 */
		resizeAudio: function( element )
		{
			var $element 	 	= 'undefined' == typeof element ? $( 'body' ) : $( element ),
				audioPlayers 	= $element.find('.wp-audio-shortcode.mejs-audio'),
				player 		 	= null,
				mejsPlayer 	 	= null,
				rail 			= null,
				railWidth 		= 400;

			if ( audioPlayers.length && typeof mejs !== 'undefined' ) {
            	audioPlayers.each(function(){
	            	player 		= $(this);
	            	mejsPlayer 	= mejs.players[player.attr('id')];
	            	rail 		= player.find('.mejs-controls .mejs-time-rail');
	            	var innerMejs = player.find('.mejs-inner'),
	            		total 	  = player.find('.mejs-controls .mejs-time-total');

	            	if ( typeof mejsPlayer !== 'undefined' ) {
	            		railWidth = Math.ceil(player.width() * 0.8);

	            		if ( innerMejs.length ) {

		            		rail.css('width', railWidth +'px!important');
		            		//total.width(rail.width() - 10);

		            		mejsPlayer.options.autosizeProgress = true;

		            		// webkit has trouble doing this without a delay
							setTimeout(function () {
								mejsPlayer.setControlsSize();
							}, 50);

			            	player.find('.mejs-inner').css({
			            		visibility: 'visible',
			            		height: 'inherit'
			            	});
		            	}
		           	}
	            });
	        }
		},

		/**
		 * Public method for preloading WP audio player when it's inside the hidden element
		 *
		 * @since 1.8.2
		 * @method preloadAudio
		 */
		preloadAudio: function(element)
		{
			var $element 	 = 'undefined' == typeof element ? $( 'body' ) : $( element ),
				contentWrap  = $element.closest('.fl-accordion-item'),
				audioPlayers = $element.find('.wp-audio-shortcode.mejs-audio');

			if ( ! contentWrap.hasClass('fl-accordion-item-active') && audioPlayers.find('.mejs-inner').length ) {
				audioPlayers.find('.mejs-inner').css({
					visibility : 'hidden',
					height: 0
				});
			}
		},

		/**
		 * Public method for resizing slideshow momdule within the tab
		 *
		 * @since 1.10.5
		 * @method resizeSlideshow
		 */
		resizeSlideshow: function(){
			if(typeof YUI !== 'undefined') {
				YUI().use('node-event-simulate', function(Y) {
					Y.one(window).simulate("resize");
				});
			}
		},

		/**
		 * Public method for reloading an embedded Google Map within the tabs or hidden element.
		 *
		 * @since 2.2
		 * @method reloadGoogleMap
		 */
		reloadGoogleMap: function(element){
			var $element  = 'undefined' == typeof element ? $( 'body' ) : $( element ),
			    googleMap = $element.find( 'iframe[src*="google.com/maps"]' );

			if ( googleMap.length ) {
			    googleMap.attr( 'src', function(i, val) {
			        return val;
			    });
			}
		},

		/**
		 * Unbinds builder layout events.
		 *
		 * @since 1.0
		 * @access private
		 * @method _destroy
		 */
		_destroy: function()
		{
			var win = $(window);

			win.off('scroll.fl-bg-parallax');
			win.off('resize.fl-bg-video');
		},

		/**
		 * Checks to see if the current device has touch enabled.
		 *
		 * @since 1.0
		 * @access private
		 * @method _isTouch
		 * @return {Boolean}
		 */
		_isTouch: function()
		{
			if(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
				return true;
			}

			return false;
		},

		/**
		 * Checks to see if the current device is mobile.
		 *
		 * @since 1.7
		 * @access private
		 * @method _isMobile
		 * @return {Boolean}
		 */
		_isMobile: function()
		{
			return /Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi|webOS/i.test( navigator.userAgent );
		},

		/**
		 * Initializes builder body classes.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initClasses
		 */
		_initClasses: function()
		{
			var body = $( 'body' ),
				ua   = navigator.userAgent;

			// Add the builder body class.
			if ( ! body.hasClass( 'archive' ) && $( '.fl-builder-content-primary' ).length > 0 ) {
				body.addClass('fl-builder');
			}

			// Add the builder touch body class.
			if(FLBuilderLayout._isTouch()) {
				body.addClass('fl-builder-touch');
			}

			// Add the builder mobile body class.
			if(FLBuilderLayout._isMobile()) {
				body.addClass('fl-builder-mobile');
			}

			if ( $(window).width() < FLBuilderLayoutConfig.breakpoints.small ) {
				body.addClass( 'fl-builder-breakpoint-small' );
			}

			if ( $(window).width() > FLBuilderLayoutConfig.breakpoints.small && $(window).width() < FLBuilderLayoutConfig.breakpoints.medium ) {
				body.addClass( 'fl-builder-breakpoint-medium' );
			}

			if ( $(window).width() > FLBuilderLayoutConfig.breakpoints.medium && $(window).width() < FLBuilderLayoutConfig.breakpoints.large ) {
				body.addClass( 'fl-builder-breakpoint-large' );
			}

			if ( $(window).width() > FLBuilderLayoutConfig.breakpoints.large ) {
				body.addClass( 'fl-builder-breakpoint-default' );
			}

			// IE11 body class.
			if ( ua.indexOf( 'Trident/7.0' ) > -1 && ua.indexOf( 'rv:11.0' ) > -1 ) {
				body.addClass( 'fl-builder-ie-11' );
			}
		},

		/**
		 * Initializes builder node backgrounds that require
		 * additional JavaScript logic such as parallax.
		 *
		 * @since 1.1.4
		 * @access private
		 * @method _initBackgrounds
		 */
		_initBackgrounds: function()
		{
			var win = $(window);

			// Init parallax backgrounds.
			if($('.fl-row-bg-parallax').length > 0 && !FLBuilderLayout._isMobile()) {
				FLBuilderLayout._scrollParallaxBackgrounds();
				FLBuilderLayout._initParallaxBackgrounds();
				win.on('resize.fl-bg-parallax', FLBuilderLayout._initParallaxBackgrounds);
				win.on('scroll.fl-bg-parallax', FLBuilderLayout._scrollParallaxBackgrounds);
			}

			// Init video backgrounds.
			if($('.fl-bg-video').length > 0) {
				FLBuilderLayout._initBgVideos();
				FLBuilderLayout._resizeBgVideos();

				// Ensure FLBuilderLayout._resizeBgVideos() is only called once on window resize.
				var resizeBGTimer = null;
				win.on('resize.fl-bg-video', function(e){
					clearTimeout( resizeBGTimer );
					resizeBGTimer = setTimeout(function() {
						FLBuilderLayout._resizeBgVideos(e);
					}, 100 );
				});
			}
		},

		/**
		 * Initializes all parallax backgrounds in a layout.
		 *
		 * @since 1.1.4
		 * @access private
		 * @method _initParallaxBackgrounds
		 */
		_initParallaxBackgrounds: function()
		{
			$('.fl-row-bg-parallax').each(FLBuilderLayout._initParallaxBackground);
		},

		/**
		 * Initializes a single parallax background.
		 *
		 * @since 1.1.4
		 * @access private
		 * @method _initParallaxBackgrounds
		 */
		_initParallaxBackground: function()
		{
			var row     = $(this),
				content = row.find('> .fl-row-content-wrap'),
				winWidth = $(window).width(),
				screenSize = '',
				imageSrc = {
					default: '',
					medium: '',
					responsive: '',
				};

			imageSrc.default = row.data('parallax-image') || '';
			imageSrc.medium = row.data('parallax-image-medium') || imageSrc.default;
			imageSrc.responsive = row.data('parallax-image-responsive') || imageSrc.medium;

			if (winWidth > FLBuilderLayoutConfig.breakpoints.medium) {
				screenSize = 'default';
			} else if (winWidth > FLBuilderLayoutConfig.breakpoints.small && winWidth <= FLBuilderLayoutConfig.breakpoints.medium ) {
				screenSize = 'medium';
			} else if (winWidth <= FLBuilderLayoutConfig.breakpoints.small) {
				screenSize = 'responsive';
			}

			content.css('background-image', 'url(' + imageSrc[screenSize] + ')');
			row.data('current-image-loaded', screenSize );

		},

		/**
		 * Fires when the window is scrolled to adjust
		 * parallax backgrounds.
		 *
		 * @since 1.1.4
		 * @access private
		 * @method _scrollParallaxBackgrounds
		 */
		_scrollParallaxBackgrounds: function()
		{
			$('.fl-row-bg-parallax').each(FLBuilderLayout._scrollParallaxBackground);
		},

		/**
		 * Fires when the window is scrolled to adjust
		 * a single parallax background.
		 *
		 * @since 1.1.4
		 * @access private
		 * @method _scrollParallaxBackground
		 */
		_scrollParallaxBackground: function()
		{
			var win     	  = $(window),
				row     	  = $(this),
				content 	  = row.find('> .fl-row-content-wrap'),
				speed   	  = row.data('parallax-speed'),
				offset  	  = content.offset(),
				yPos		  = -((win.scrollTop() - offset.top) / speed),
				initialOffset = ( row.data('parallax-offset') != null ) ? row.data('parallax-offset') : 0,
				totalOffset   = yPos - initialOffset;

			content.css('background-position', 'center ' + totalOffset + 'px');
		},

		/**
		 * Initializes all video backgrounds.
		 *
		 * @since 1.6.3.3
		 * @access private
		 * @method _initBgVideos
		 */
		_initBgVideos: function()
		{
			$('.fl-bg-video').each(FLBuilderLayout._initBgVideo);
		},

		/**
		 * Initializes a video background.
		 *
		 * @since 1.6.3.3
		 * @access private
		 * @method _initBgVideo
		 */
		_initBgVideo: function()
		{
			var wrap   = $( this ),
				width       = wrap.data( 'width' ),
				height      = wrap.data( 'height' ),
				mp4         = wrap.data( 'mp4' ),
				youtube     = wrap.data( 'youtube'),
				vimeo       = wrap.data( 'vimeo'),
				mp4Type     = wrap.data( 'mp4-type' ),
				webm        = wrap.data( 'webm' ),
				webmType    = wrap.data( 'webm-type' ),
				fallback    = wrap.data( 'fallback' ),
				loaded      = wrap.data( 'loaded' ),
				videoMobile = wrap.data( 'video-mobile' ),
				fallbackTag = '',
				videoTag    = null,
				mp4Tag      = null,
				webmTag     = null;

			// Return if the video has been loaded for this row.
			if ( loaded ) {
				return;
			}

			videoTag  = $( '<video autoplay loop muted playsinline></video>' );

			/**
			 * Add poster image (fallback image)
			 */
			if( 'undefined' != typeof fallback && '' != fallback ) {
				videoTag.attr( 'poster', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' )
				videoTag.css({
					backgroundImage: 'url("' + fallback + '")',
					backgroundColor: 'transparent',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center center',
				})
			}

			// MP4 Source Tag
			if ( 'undefined' != typeof mp4 && '' != mp4 ) {

				mp4Tag = $( '<source />' );
				mp4Tag.attr( 'src', mp4 );
				mp4Tag.attr( 'type', mp4Type );

				videoTag.append( mp4Tag );
			}
			// WebM Source Tag
			if ( 'undefined' != typeof webm && '' != webm ) {

				webmTag = $( '<source />' );
				webmTag.attr( 'src', webm );
				webmTag.attr( 'type', webmType );

				videoTag.append( webmTag );
			}

			// This is either desktop, or mobile is enabled.
			if ( ! FLBuilderLayout._isMobile() || ( FLBuilderLayout._isMobile() && "yes" == videoMobile ) ) {
				if ( 'undefined' != typeof youtube ) {
					FLBuilderLayout._initYoutubeBgVideo.apply( this );
				}
				else if ( 'undefined' != typeof vimeo ) {
					FLBuilderLayout._initVimeoBgVideo.apply( this );
				}
				else {
					wrap.append( videoTag );
				}
			}
			else {
				// if we are here, it means we are on mobile and NO is set so remove video src and use fallback
				videoTag.attr('src', '')
				wrap.append( videoTag );
			}

			// Mark this video as loaded.
			wrap.data('loaded', true);
		},

		/**
		 * Initializes Youtube video background
		 *
		 * @since 1.9
		 * @access private
		 * @method _initYoutubeBgVideo
		 */
		_initYoutubeBgVideo: function()
		{
			var playerWrap  = $(this),
				videoId     = playerWrap.data('video-id'),
				videoPlayer = playerWrap.find('.fl-bg-video-player'),
				enableAudio = playerWrap.data('enable-audio'),
				audioButton = playerWrap.find('.fl-bg-video-audio'),
				startTime   = 'undefined' !== typeof playerWrap.data('start') ? playerWrap.data('start') : 0,
				startTime   = 'undefined' !== typeof playerWrap.data('t') && startTime === 0 ? playerWrap.data('t') : startTime,
				endTime     = 'undefined' !== typeof playerWrap.data('end') ? playerWrap.data('end') : 0,
				loop        = 'undefined' !== typeof playerWrap.data('loop') ? playerWrap.data('loop') : 1,
				stateCount  = 0,
				player,fallback_showing;

			if ( videoId ) {
				fallback = playerWrap.data('fallback') || false
				if( fallback ) {
					playerWrap.find('iframe').remove()
					fallbackTag = $( '<div></div>' );
					fallbackTag.addClass( 'fl-bg-video-fallback' );
					fallbackTag.css( 'background-image', 'url(' + playerWrap.data('fallback') + ')' );
					fallbackTag.css( 'background-size', 'cover' );
					fallbackTag.css( 'transition', 'background-image 1s')
					playerWrap.append( fallbackTag );
					fallback_showing = true;
				}
				FLBuilderLayout._onYoutubeApiReady( function( YT ) {
					setTimeout( function() {

						player = new YT.Player( videoPlayer[0], {
							videoId: videoId,
							events: {
								onReady: function(event) {
									if ( "no" === enableAudio || FLBuilderLayout._isMobile() ) {
										event.target.mute();
									}
									else if ( "yes" === enableAudio && event.target.isMuted ) {
										event.target.unMute();
									}

									// Store an instance to a parent
									playerWrap.data('YTPlayer', player);
									FLBuilderLayout._resizeYoutubeBgVideo.apply(playerWrap);

									// Queue the video.
									event.target.playVideo();

									if ( audioButton.length > 0 && ! FLBuilderLayout._isMobile() ) {
										audioButton.on( 'click', {button: audioButton, player: player}, FLBuilderLayout._toggleBgVideoAudio );
									}
								},
								onStateChange: function( event ) {

									if ( event.data === 1 ) {
										if ( fallback_showing ) {
											$( '.fl-bg-video-fallback' ).css( 'background-image', 'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)' )
										}
									}
									// Manual check if video is not playable in some browsers.
									// StateChange order: [-1, 3, -1]
									if ( stateCount < 4 ) {
										stateCount++;
									}

									// Comply with the audio policy in some browsers like Chrome and Safari.
									if ( stateCount > 1 && (-1 === event.data || 2 === event.data) && "yes" === enableAudio ) {
										player.mute();
										player.playVideo();
										audioButton.show();
									}

									if ( event.data === YT.PlayerState.ENDED && 1 === loop ) {
										if ( startTime > 0 ) {
											player.seekTo( startTime );
										}
										else {
											player.playVideo();
										}
									}
								},
								onError: function(event) {
									console.info('YT Error: ' + event.data)
									FLBuilderLayout._onErrorYoutubeVimeo(playerWrap)
								}
							},
							playerVars: {
								playsinline: FLBuilderLayout._isMobile() ? 1 : 0,
								controls: 0,
								showinfo: 0,
								rel : 0,
								start: startTime,
								end: endTime,
							}
						} );
					}, 1 );
				} );
			}
		},

		/**
		 * On youtube or vimeo error show the fallback image if available.
		 * @since 2.0.7
		 */
		_onErrorYoutubeVimeo: function(playerWrap) {

			fallback = playerWrap.data('fallback') || false
			if( ! fallback ) {
				return false;
			}
			playerWrap.find('iframe').remove()
			fallbackTag = $( '<div></div>' );
			fallbackTag.addClass( 'fl-bg-video-fallback' );
			fallbackTag.css( 'background-image', 'url(' + playerWrap.data('fallback') + ')' );
			playerWrap.append( fallbackTag );
		},

		/**
		 * Check if Youtube API has been downloaded
		 *
		 * @since 1.9
		 * @access private
		 * @method _onYoutubeApiReady
		 * @param  {Function} callback Method to call when YT API has been loaded
		 */
		_onYoutubeApiReady: function( callback ) {
			if ( window.YT && YT.loaded ) {
				callback( YT );
			} else {
				// If not ready check again by timeout..
				setTimeout( function() {
					FLBuilderLayout._onYoutubeApiReady( callback );
				}, 350 );
			}
		},

		/**
		 * Initializes Vimeo video background
		 *
		 * @since 1.9
		 * @access private
		 * @method _initVimeoBgVideo
		 */
		_initVimeoBgVideo: function()
		{
			var playerWrap	= $(this),
				videoId 	= playerWrap.data('video-id'),
				videoPlayer = playerWrap.find('.fl-bg-video-player'),
				enableAudio = playerWrap.data('enable-audio'),
				audioButton = playerWrap.find('.fl-bg-video-audio'),
				player,
				width = playerWrap.outerWidth(),
				ua    = navigator.userAgent;

			if ( typeof Vimeo !== 'undefined' && videoId )	{
				player = new Vimeo.Player(videoPlayer[0], {
					id         : videoId,
					loop       : true,
					title      : false,
					portrait   : false,
					background : true,
					autopause  : false,
					muted      : true
				});

				playerWrap.data('VMPlayer', player);
				if ( "no" === enableAudio ) {
					player.setVolume(0);
				}
				else if ("yes" === enableAudio ) {
					// Chrome, Safari, Firefox have audio policy restrictions for autoplay videos.
					if ( ua.indexOf("Safari") > -1 || ua.indexOf("Chrome") > -1 || ua.indexOf("Firefox") > -1 ) {
						player.setVolume(0);
						audioButton.show();
					}
					else {
						player.setVolume(1);
					}
				}

				player.play().catch(function(error) {
					FLBuilderLayout._onErrorYoutubeVimeo(playerWrap)
				});

				if ( audioButton.length > 0 ) {
					audioButton.on( 'click', {button: audioButton, player: player}, FLBuilderLayout._toggleBgVideoAudio );
				}
			}
		},

		/**
		 * Mute / unmute audio on row's video background.
		 * It works for both Youtube and Vimeo.
		 *
		 * @since 2.1.3
		 * @access private
		 * @method _toggleBgVideoAudio
		 * @param {Object} e Method arguments
		 */
		_toggleBgVideoAudio: function( e ) {
			var player  = e.data.player,
			    control = e.data.button.find('.fl-audio-control');

			if ( control.hasClass( 'fa-volume-off' ) ) {
				// Unmute
				control
					.removeClass( 'fa-volume-off' )
					.addClass( 'fa-volume-up' );
				e.data.button.find( '.fa-times' ).hide();

				if ( 'function' === typeof player.unMute ) {
					player.unMute();
				}
				else {
					player.setVolume( 1 );
				}
			}
			else {
				// Mute
				control
					.removeClass( 'fa-volume-up' )
					.addClass( 'fa-volume-off' );
				e.data.button.find( '.fa-times' ).show();

				if ( 'function' === typeof player.unMute ) {
					player.mute();
				}
				else {
					player.setVolume( 0 );
				}
			}
		},

		/**
		 * Fires when there is an error loading a video
		 * background source and shows the fallback.
		 *
		 * @since 1.6.3.3
		 * @access private
		 * @method _videoBgSourceError
		 * @param {Object} e An event object
		 * @deprecated 2.0.3
		 */
		_videoBgSourceError: function( e )
		{
			var source 		= $( e.target ),
				wrap   		= source.closest( '.fl-bg-video' ),
				vid		    = wrap.find( 'video' ),
				fallback  	= wrap.data( 'fallback' ),
				fallbackTag = '';
			source.remove();

			if ( vid.find( 'source' ).length ) {
				// Don't show the fallback if we still have other sources to check.
				return;
			} else if ( '' !== fallback ) {
				fallbackTag = $( '<div></div>' );
				fallbackTag.addClass( 'fl-bg-video-fallback' );
				fallbackTag.css( 'background-image', 'url(' + fallback + ')' );
				wrap.append( fallbackTag );
				vid.remove();
			}
		},

		/**
		 * Fires when the window is resized to resize
		 * all video backgrounds.
		 *
		 * @since 1.1.4
		 * @access private
		 * @method _resizeBgVideos
		 */
		_resizeBgVideos: function()
		{
			$('.fl-bg-video').each( function() {

				FLBuilderLayout._resizeBgVideo.apply( this );

				if ( $( this ).parent().find( 'img' ).length > 0 ) {
					$( this ).parent().imagesLoaded( $.proxy( FLBuilderLayout._resizeBgVideo, this ) );
				}
			} );
		},

		/**
		 * Fires when the window is resized to resize
		 * a single video background.
		 *
		 * @since 1.1.4
		 * @access private
		 * @method _resizeBgVideo
		 */
		_resizeBgVideo: function()
		{
			if ( 0 === $( this ).find( 'video' ).length && 0 === $( this ).find( 'iframe' ).length ) {
				return;
			}

			var wrap        = $(this),
				wrapHeight  = wrap.outerHeight(),
				wrapWidth   = wrap.outerWidth(),
				vid         = wrap.find('video'),
				vidHeight   = wrap.data('height'),
				vidWidth    = wrap.data('width'),
				newWidth    = wrapWidth,
				newHeight   = Math.round(vidHeight * wrapWidth/vidWidth),
				newLeft     = 0,
				newTop      = 0,
				iframe 		= wrap.find('iframe'),
				isRowFullHeight = $(this).closest('.fl-row-bg-video').hasClass('fl-row-full-height'),
				vidCSS          = {
					top:       '50%',
					left:      '50%',
					transform: 'translate(-50%,-50%)',
				};

			if ( vid.length ) {
				if(vidHeight === '' || typeof vidHeight === 'undefined' || vidWidth === '' || typeof vidWidth === 'undefined') {
					vid.css({
						'left'      : '0px',
						'top'       : '0px',
						'width'     : newWidth + 'px'
					});

					// Try to set the actual video dimension on 'loadedmetadata' when using URL as video source
					vid.on('loadedmetadata', FLBuilderLayout._resizeOnLoadedMeta);
					
					return;
				}

				if ( ! isRowFullHeight ) {
					if ( newHeight < wrapHeight ) {
						newHeight = wrapHeight;
						newLeft   = -((newWidth - wrapWidth) / 2);
						newWidth  = vidHeight ? Math.round(vidWidth * wrapHeight/vidHeight) : newWidth;
					}
					else {
						newTop = -((newHeight - wrapHeight)/2);
					}
					vidCSS = {
						left   : newLeft + 'px',
						top    : newTop + 'px',
						height : newHeight + 'px',
						width  : newWidth + 'px',
					}
				}

				vid.css( vidCSS );

			}
			else if ( iframe.length ) {

				// Resize Youtube video player within iframe tag
				if ( typeof wrap.data('youtube') !== 'undefined' ) {
					FLBuilderLayout._resizeYoutubeBgVideo.apply(this);
				}
			}
		},

		/**
		 * Fires when video meta has been loaded.
		 * This will be Triggered when width/height attributes were not specified during video background resizing.
		 *
		 * @since 1.8.5
		 * @access private
		 * @method _resizeOnLoadedMeta
		 */
		_resizeOnLoadedMeta: function(){
			var video 		= $(this),
				wrapHeight 	= video.parent().outerHeight(),
				wrapWidth 	= video.parent().outerWidth(),
				vidWidth 	= video[0].videoWidth,
				vidHeight 	= video[0].videoHeight,
				newHeight   = Math.round(vidHeight * wrapWidth/vidWidth),
				newWidth    = wrapWidth,
				newLeft     = 0,
				newTop 		= 0;

			if(newHeight < wrapHeight) {
				newHeight   = wrapHeight;
				newWidth    = Math.round(vidWidth * wrapHeight/vidHeight);
				newLeft     = -((newWidth - wrapWidth)/2);
			}
			else {
				newTop      = -((newHeight - wrapHeight)/2);
			}

			video.parent().data('width', vidWidth);
			video.parent().data('height', vidHeight);

			video.css({
				'left'      : newLeft + 'px',
				'top'       : newTop + 'px',
				'width'     : newWidth + 'px',
				'height' 	: newHeight + 'px'
			});
		},

		/**
		 * Fires when the window is resized to resize
		 * a single Youtube video background.
		 *
		 * @since 1.9
		 * @access private
		 * @method _resizeYoutubeBgVideo
		 */
		_resizeYoutubeBgVideo: function()
		{
			var wrap				= $(this),
				wrapWidth 			= wrap.outerWidth(),
				wrapHeight 			= wrap.outerHeight(),
				player 				= wrap.data('YTPlayer'),
				video 				= player ? player.getIframe() : null,
				aspectRatioSetting 	= '16:9', // Medium
				aspectRatioArray 	= aspectRatioSetting.split( ':' ),
				aspectRatio 		= aspectRatioArray[0] / aspectRatioArray[1],
				ratioWidth 			= wrapWidth / aspectRatio,
				ratioHeight 		= wrapHeight * aspectRatio,
				isWidthFixed 		= wrapWidth / wrapHeight > aspectRatio,
				width 				= isWidthFixed ? wrapWidth : ratioHeight,
				height 				= isWidthFixed ? ratioWidth : wrapHeight;

			if ( video ) {
				$(video).width( width ).height( height );
			}
		},

		/**
		 * Initializes module animations.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _initModuleAnimations
		 */
		_initModuleAnimations: function()
		{
			if(typeof jQuery.fn.waypoint !== 'undefined') {
				$('.fl-animation').each( function() {
					var node = $( this ),
						nodeTop = node.offset().top,
						winHeight = $( window ).height(),
						bodyHeight = $( 'body' ).height(),
						waypoint = FLBuilderLayoutConfig.waypoint,
						offset = '80%';

					if ( typeof waypoint.offset !== undefined ) {
						offset = FLBuilderLayoutConfig.waypoint.offset + '%';
					}

					if ( bodyHeight - nodeTop < winHeight * 0.2 ) {
						offset = '100%';
					}

					node.waypoint({
						offset: offset,
						handler: FLBuilderLayout._doModuleAnimation
					});
				} );
			}
		},

		/**
		 * Runs a module animation.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _doModuleAnimation
		 */
		_doModuleAnimation: function()
		{
			var module = 'undefined' == typeof this.element ? $(this) : $(this.element),
				delay = parseFloat(module.data('animation-delay')),
				duration = parseFloat(module.data('animation-duration'));

			if ( ! isNaN( duration ) ) {
				module.css( 'animation-duration', duration + 's' );
			}

			if(!isNaN(delay) && delay > 0) {
				setTimeout(function(){
					module.addClass('fl-animated');
				}, delay * 1000);
			} else {
				setTimeout(function(){
					module.addClass('fl-animated');
				}, 1);
			}
		},

		/**
		 * Opens a tab or accordion item if the browser hash is set
		 * to the ID of one on the page.
		 *
		 * @since 1.6.0
		 * @access private
		 * @method _initHash
		 */
		_initHash: function()
		{
			var hash 			= window.location.hash.replace( '#', '' ).split( '/' ).shift(),
				element 		= null,
				tabs			= null,
				responsiveLabel	= null,
				tabIndex		= null,
				label			= null;

			if ( '' !== hash ) {

				try {

					element = $( '#' + hash );

					if ( element.length > 0 ) {

						if ( element.hasClass( 'fl-accordion-item' ) ) {
							setTimeout( function() {
								element.find( '.fl-accordion-button' ).trigger( 'click' );
							}, 100 );
						}
						if ( element.hasClass( 'fl-tabs-panel' ) ) {
							setTimeout( function() {
								tabs 			= element.closest( '.fl-tabs' );
								responsiveLabel = element.find( '.fl-tabs-panel-label' );
								tabIndex 		= responsiveLabel.data( 'index' );
								label 			= tabs.find( '.fl-tabs-labels .fl-tabs-label[data-index=' + tabIndex + ']' );
								
								label[0].click();
								FLBuilderLayout._scrollToElement(element);
							}, 100 );
						}
					}
				}
				catch( e ) {}
			}
		},

		/**
		 * Initializes all anchor links on the page for smooth scrolling.
		 *
		 * @since 1.4.9
		 * @access private
		 * @method _initAnchorLinks
		 */
		_initAnchorLinks: function()
		{
			$( 'a' ).each( FLBuilderLayout._initAnchorLink );
		},

		/**
		 * Initializes a single anchor link for smooth scrolling.
		 *
		 * @since 1.4.9
		 * @access private
		 * @method _initAnchorLink
		 */
		_initAnchorLink: function()
		{
			var link    = $( this ),
				href    = link.attr( 'href' ),
				loc     = window.location,
				id      = null,
				element = null,
				flNode  = false;

			if ( 'undefined' != typeof href && href.indexOf( '#' ) > -1 && link.closest('svg').length < 1 ) {

				if ( loc.pathname.replace( /^\//, '' ) == this.pathname.replace( /^\//, '' ) && loc.hostname == this.hostname ) {

					try {

						id      = href.split( '#' ).pop();
						// If there is no ID then we have nowhere to look
						// Fixes a quirk in jQuery and FireFox
						if( ! id ) {
							return;
						}
						element = $( '#' + id );

						if ( element.length > 0 ) {
							flNode = element.hasClass( 'fl-row' ) || element.hasClass( 'fl-col' ) || element.hasClass( 'fl-module' );
							if ( !element.hasClass( 'fl-no-scroll' ) && ( link.hasClass( 'fl-scroll-link' ) || flNode ) ) {
								$( link ).on( 'click', FLBuilderLayout._scrollToElementOnLinkClick );
							}
							if ( element.hasClass( 'fl-accordion-item' ) ) {
								$( link ).on( 'click', FLBuilderLayout._scrollToAccordionOnLinkClick );
							}
							if ( element.hasClass( 'fl-tabs-panel' ) ) {
								$( link ).on( 'click', FLBuilderLayout._scrollToTabOnLinkClick );
							}
						}
					}
					catch( e ) {}
				}
			}
		},

		/**
		 * Scrolls to an element when an anchor link is clicked.
		 *
		 * @since 1.4.9
		 * @access private
		 * @method _scrollToElementOnLinkClick
		 * @param {Object} e An event object.
		 * @param {Function} callback A function to call when the scroll is complete.
		 */
		_scrollToElementOnLinkClick: function( e, callback )
		{
			var element = $( '#' + $( this ).attr( 'href' ).split( '#' ).pop() );

			FLBuilderLayout._scrollToElement( element, callback );

			e.preventDefault();
		},

		/**
		 * Scrolls to an element.
		 *
		 * @since 1.6.4.5
		 * @access private
		 * @method _scrollToElement
		 * @param {Object} element The element to scroll to.
		 * @param {Function} callback A function to call when the scroll is complete.
		 */
		_scrollToElement: function( element, callback )
		{
			var config  = FLBuilderLayoutConfig.anchorLinkAnimations,
				dest    = 0,
				win     = $( window ),
				doc     = $( document );

			if ( element.length > 0 ) {

				if ( 'fixed' === element.css('position') || 'fixed' === element.parent().css('position') ) {
					dest = element.position().top;
				}
				else if ( element.offset().top > doc.height() - win.height() ) {
					dest = doc.height() - win.height();
				}
				else {
					dest = element.offset().top - config.offset;
				}

				$( 'html, body' ).animate( { scrollTop: dest }, config.duration, config.easing, function() {

					if ( 'undefined' != typeof callback ) {
						callback();
					}

					if ( undefined != element.attr( 'id' ) ) {

						if ( history.pushState ) {
							history.pushState( null, null, '#' + element.attr( 'id' ) );
						}
						else {
							window.location.hash = element.attr( 'id' );
						}
					}
				} );
			}
		},

		/**
		 * Scrolls to an accordion item when a link is clicked.
		 *
		 * @since 1.5.9
		 * @access private
		 * @method _scrollToAccordionOnLinkClick
		 * @param {Object} e An event object.
		 */
		_scrollToAccordionOnLinkClick: function( e )
		{
			var element = $( '#' + $( this ).attr( 'href' ).split( '#' ).pop() );

			if ( element.length > 0 ) {

				var callback = function() {
					if ( element ) {
						element.find( '.fl-accordion-button' ).trigger( 'click' );
						element = false;
					}
				};

				FLBuilderLayout._scrollToElementOnLinkClick.call( this, e, callback );
			}
		},

		/**
		 * Scrolls to a tab panel when a link is clicked.
		 *
		 * @since 1.5.9
		 * @access private
		 * @method _scrollToTabOnLinkClick
		 * @param {Object} e An event object.
		 */
		_scrollToTabOnLinkClick: function( e )
		{
			var element 		= $( '#' + $( this ).attr( 'href' ).split( '#' ).pop() ),
				tabs			= null,
				label   		= null,
				responsiveLabel = null;

			if ( element.length > 0 ) {

				tabs 			= element.closest( '.fl-tabs' );
				responsiveLabel = element.find( '.fl-tabs-panel-label' );
				tabIndex 		= responsiveLabel.data( 'index' );
				label 			= tabs.find( '.fl-tabs-labels .fl-tabs-label[data-index=' + tabIndex + ']' );

				if ( responsiveLabel.is( ':visible' ) ) {
					
					var callback = function() {
						if ( element ) {
							responsiveLabel.trigger( $.Event( 'click', { which: 1 } ) );
						}
					};

					FLBuilderLayout._scrollToElementOnLinkClick.call( this, e, callback );
				}
				else {
					label[0].click();
					FLBuilderLayout._scrollToElement( element );
				}

				e.preventDefault();
			}
		},

		/**
		 * Initializes all builder forms on a page.
		 *
		 * @since 1.5.4
		 * @access private
		 * @method _initForms
		 */
		_initForms: function()
		{
			if ( ! FLBuilderLayout._hasPlaceholderSupport ) {
				$( '.fl-form-field input' ).each( FLBuilderLayout._initFormFieldPlaceholderFallback );
			}

			$( '.fl-form-field input' ).on( 'focus', FLBuilderLayout._clearFormFieldError );
		},

		/**
		 * Checks to see if the current device has HTML5
		 * placeholder support.
		 *
		 * @since 1.5.4
		 * @access private
		 * @method _hasPlaceholderSupport
		 * @return {Boolean}
		 */
		_hasPlaceholderSupport: function()
		{
			var input = document.createElement( 'input' );

			return 'undefined' != input.placeholder;
		},

		/**
		 * Initializes the fallback for when placeholders aren't supported.
		 *
		 * @since 1.5.4
		 * @access private
		 * @method _initFormFieldPlaceholderFallback
		 */
		_initFormFieldPlaceholderFallback: function()
		{
			var field       = $( this ),
				val         = field.val(),
				placeholder = field.attr( 'placeholder' );

			if ( 'undefined' != placeholder && '' === val ) {
				field.val( placeholder );
				field.on( 'focus', FLBuilderLayout._hideFormFieldPlaceholderFallback );
				field.on( 'blur', FLBuilderLayout._showFormFieldPlaceholderFallback );
			}
		},

		/**
		 * Hides a fallback placeholder on focus.
		 *
		 * @since 1.5.4
		 * @access private
		 * @method _hideFormFieldPlaceholderFallback
		 */
		_hideFormFieldPlaceholderFallback: function()
		{
			var field       = $( this ),
				val         = field.val(),
				placeholder = field.attr( 'placeholder' );

			if ( val == placeholder ) {
				field.val( '' );
			}
		},

		/**
		 * Shows a fallback placeholder on blur.
		 *
		 * @since 1.5.4
		 * @access private
		 * @method _showFormFieldPlaceholderFallback
		 */
		_showFormFieldPlaceholderFallback: function()
		{
			var field       = $( this ),
				val         = field.val(),
				placeholder = field.attr( 'placeholder' );

			if ( '' === val ) {
				field.val( placeholder );
			}
		},

		/**
		 * Clears a form field error message.
		 *
		 * @since 1.5.4
		 * @access private
		 * @method _clearFormFieldError
		 */
		_clearFormFieldError: function()
		{
			var field = $( this );

			field.removeClass( 'fl-form-error' );
			field.siblings( '.fl-form-error-message' ).hide();
		},

		/**
		 * Init Row Shape Layer's height.
		 *
		 * @since 2.5.3
		 * @access private
		 * @method _initRowShapeLayerHeight
		 */
		_initRowShapeLayerHeight: function () {
			FLBuilderLayout._adjustRowShapeLayerHeight();
			$( window ).on( 'resize', FLBuilderLayout._adjustRowShapeLayerHeight );
		},

		/**
		 * Adjust Row Shape Layer's height to fix to remove the fine line that appears on certain screen sizes.
		 *
		 * @since 2.5.3
		 * @access private
		 * @method _adjustRowShapeLayerHeight
		 */
		_adjustRowShapeLayerHeight: function() {
			var rowShapeLayers = $('.fl-builder-shape-layer');

			$( rowShapeLayers ).each(function (index) {
				var rowShapeLayer = $(this),
					shape = $(rowShapeLayer).find('svg'),
					height = shape.height(),
					excludeShapes = '.fl-builder-shape-circle, .fl-builder-shape-dot-cluster, .fl-builder-shape-topography, .fl-builder-shape-rect';

				if ( ! rowShapeLayer.is( excludeShapes ) ) {
					$(shape).css('height', Math.ceil( height ) );
				}
			});
		},
		_string_to_slug: function( str ) {
			str = str.replace(/^\s+|\s+$/g, ''); // trim
			if ( 'undefined' == typeof window._fl_string_to_slug_regex ) {
				regex = new RegExp('[^a-zA-Z0-9\'":() !.,-_|]', 'g');
			} else {
				regex = new RegExp('[^' + window._fl_string_to_slug_regex + '\'":\(\) !.,-_|\\\p{Letter}]', 'ug');
			}
			str = str.replace(regex, '') // remove invalid chars
				.replace(/\s+/g, ' '); // collapse whitespace and replace by a space
			return str;
		},
		_reorderMenu: function() {
			if ( $('#wp-admin-bar-fl-builder-frontend-edit-link-default li').length > 1 ) {
					$( '#wp-admin-bar-fl-builder-frontend-duplicate-link' )
					.appendTo('#wp-admin-bar-fl-builder-frontend-edit-link-default')
					.css( 'padding-top', '5px' )
					.css( 'border-top', '2px solid #1D2125' )
					.css( 'margin-top', '5px' )
				}
		}
	};

	/* Initializes the builder layout. */
	$(function(){
		FLBuilderLayout.init();
	});

})(jQuery);

/* Start Global JS */

/* End Global JS */


jQuery(function($) {
	var owl = $(".owl-carousel_5efb486ca3797");
			owl.owlCarousel({
				rtl: parseInt(""),
				margin: 0,
				nav: 1,
				loop: false,
				responsive: {
					0: {
					items: 1
					},
					600: {
					items: 1
					},
					1000: {
					items: 1
					}
				}
	});
	});jQuery(function($) {
	
	const module = 'grid_2';
	let categories = "";
	let page = 1 ;

	load_posts();

	$("#5f245d62f34a2 ul.sub_categories_list li a").on("click",function() {
		categories = $(this).attr("data-catslug");
		page= 1 ;
		load_posts();
	});
	
	$("#5f245d62f34a2").on("click", "ul.pagination-list li a",function() {
		page = $(this).attr("data-page");
		load_posts();
	});

	function load_posts() {
		$.ajax({
			type: 'POST',
			url: my_ajax_object.ajax_url +'/wp-admin/admin-ajax.php',
			dataType: "html", // add data type
			data:{ 
					action : 'get_ajax_posts' ,
					postsPerPage : 4,
					categories: categories,
					display_author: 1,
					settings: JSON.stringify({"title":"Culture","display_title":"1","categories":"","postPerPage":"4","sticky":0,"display_views":1,"display_author":1,"display_date":1,"display_comments_count":1,"display_popular":0,"display_category_above_titles":1,"order":"Asc","buttons_color":"333333","enable_shadow":"0","shadow_color":"333333","hover_shadow_color":"333333","hover_text_color":"000000","enable_shadow_onhover":"1","responsive_display":"desktop,large,medium,mobile","visibility_display":"","visibility_user_capability":"","animation":{"style":"fade-in","delay":"0","duration":"1"},"container_element":"div","id":"","class":"","node_label":"","export":"","import":"","bb_css_code":"","bb_js_code":"","margin_top":"20","margin_unit":"px","margin_top_large":"","margin_large_unit":"px","margin_top_medium":"","margin_medium_unit":"px","margin_top_responsive":"","margin_responsive_unit":"px","margin_right":"0","margin_right_large":"","margin_right_medium":"","margin_right_responsive":"","margin_bottom":"20","margin_bottom_large":"","margin_bottom_medium":"","margin_bottom_responsive":"","margin_left":"0","margin_left_large":"","margin_left_medium":"","margin_left_responsive":"","type":"grid_2","categorie_id":["47"],"responsive_display_filtered":true}),
					page: page,
					module: module
				},
			beforeSend: function() {
				$("#5f245d62f34a2 #overlay").fadeIn(300);
				$("#5f245d62f34a2").animate({opacity: 0.5}, 500);
			},
			success: function( response ) {

				parser = new DOMParser();
				doc = parser.parseFromString(response, "text/html");
				const principal_article = doc.getElementsByClassName('c0')[0];
				const secondary_articles = Object.values(doc.getElementsByClassName('c1'));
				let pagination = doc.getElementsByClassName('pagination-list')[0];

				$( '#5f245d62f34a2 div.section-content div.big-article-wrapper' ).html( principal_article );
				$( '#5f245d62f34a2 div.section-content div.posts-pagination' ).html( pagination==null?"":pagination ); 
				$( '#5f245d62f34a2 div.section-content div.secondary-article-wrapper' ).html('');

				secondary_articles.forEach(function(elem) {
					$( '#5f245d62f34a2 div.section-content div.secondary-article-wrapper' ).append( elem );
				});

				$("#5f245d62f34a2 .secondary-article-title a,#5f245d62f34a2 .big-article-title a").each(function(){
					var len = $(this).text().length;
					if(len > 60){
						$(this).text($(this).text().substr(0,60)+'...  '); 
					}
				});

				$("#5f245d62f34a2 #overlay").fadeOut(300);
				$("#5f245d62f34a2").animate({opacity: 1}, 500);            

			}
		});
	}

});
jQuery(function($) {
	
	const module = 'grid_2';
	let categories = "";
	let page = 1 ;

	load_posts();

	$("#5f34e5aae325b ul.sub_categories_list li a").on("click",function() {
		categories = $(this).attr("data-catslug");
		page= 1 ;
		load_posts();
	});
	
	$("#5f34e5aae325b").on("click", "ul.pagination-list li a",function() {
		page = $(this).attr("data-page");
		load_posts();
	});

	function load_posts() {
		$.ajax({
			type: 'POST',
			url: my_ajax_object.ajax_url +'/wp-admin/admin-ajax.php',
			dataType: "html", // add data type
			data:{ 
					action : 'get_ajax_posts' ,
					postsPerPage : 4,
					categories: categories,
					display_author: 1,
					settings: JSON.stringify({"title":"Sport","display_title":"1","categories":"","postPerPage":"4","sticky":0,"display_views":1,"display_author":1,"display_date":1,"display_comments_count":1,"display_popular":0,"display_category_above_titles":1,"order":"Desc","buttons_color":"333333","enable_shadow":"0","shadow_color":"333333","hover_shadow_color":"333333","hover_text_color":"000000","enable_shadow_onhover":"1","responsive_display":"desktop,large,medium,mobile","visibility_display":"","visibility_user_capability":"","animation":{"style":"","delay":"0","duration":"1"},"container_element":"div","id":"","class":"","node_label":"","export":"","import":"","bb_css_code":"","bb_js_code":"","margin_top":"20","margin_unit":"px","margin_top_large":"","margin_large_unit":"px","margin_top_medium":"","margin_medium_unit":"px","margin_top_responsive":"","margin_responsive_unit":"px","margin_right":"0","margin_right_large":"","margin_right_medium":"","margin_right_responsive":"","margin_bottom":"20","margin_bottom_large":"","margin_bottom_medium":"","margin_bottom_responsive":"","margin_left":"0","margin_left_large":"","margin_left_medium":"","margin_left_responsive":"","type":"grid_2","categorie_id":["4"],"responsive_display_filtered":true}),
					page: page,
					module: module
				},
			beforeSend: function() {
				$("#5f34e5aae325b #overlay").fadeIn(300);
				$("#5f34e5aae325b").animate({opacity: 0.5}, 500);
			},
			success: function( response ) {

				parser = new DOMParser();
				doc = parser.parseFromString(response, "text/html");
				const principal_article = doc.getElementsByClassName('c0')[0];
				const secondary_articles = Object.values(doc.getElementsByClassName('c1'));
				let pagination = doc.getElementsByClassName('pagination-list')[0];

				$( '#5f34e5aae325b div.section-content div.big-article-wrapper' ).html( principal_article );
				$( '#5f34e5aae325b div.section-content div.posts-pagination' ).html( pagination==null?"":pagination ); 
				$( '#5f34e5aae325b div.section-content div.secondary-article-wrapper' ).html('');

				secondary_articles.forEach(function(elem) {
					$( '#5f34e5aae325b div.section-content div.secondary-article-wrapper' ).append( elem );
				});

				$("#5f34e5aae325b .secondary-article-title a,#5f34e5aae325b .big-article-title a").each(function(){
					var len = $(this).text().length;
					if(len > 60){
						$(this).text($(this).text().substr(0,60)+'...  '); 
					}
				});

				$("#5f34e5aae325b #overlay").fadeOut(300);
				$("#5f34e5aae325b").animate({opacity: 1}, 500);            

			}
		});
	}

});
jQuery(function($) {
	
	const module = 'grid_2';
	let categories = "";
	let page = 1 ;

	load_posts();

	$("#5f2586802c3b4 ul.sub_categories_list li a").on("click",function() {
		categories = $(this).attr("data-catslug");
		page= 1 ;
		load_posts();
	});
	
	$("#5f2586802c3b4").on("click", "ul.pagination-list li a",function() {
		page = $(this).attr("data-page");
		load_posts();
	});

	function load_posts() {
		$.ajax({
			type: 'POST',
			url: my_ajax_object.ajax_url +'/wp-admin/admin-ajax.php',
			dataType: "html", // add data type
			data:{ 
					action : 'get_ajax_posts' ,
					postsPerPage : 4,
					categories: categories,
					display_author: 1,
					settings: JSON.stringify({"title":"Art","display_title":"1","categories":"","postPerPage":"4","sticky":0,"display_views":1,"display_author":1,"display_date":1,"display_comments_count":1,"display_popular":0,"display_category_above_titles":1,"order":"Desc","buttons_color":"333333","enable_shadow":"0","shadow_color":"333333","hover_shadow_color":"333333","hover_text_color":"000000","enable_shadow_onhover":"1","responsive_display":"desktop,large,medium,mobile","visibility_display":"","visibility_user_capability":"","animation":{"style":"","delay":"0","duration":"1"},"container_element":"div","id":"","class":"","node_label":"","export":"","import":"","bb_css_code":"","bb_js_code":"","margin_top":"20","margin_unit":"px","margin_top_large":"","margin_large_unit":"px","margin_top_medium":"","margin_medium_unit":"px","margin_top_responsive":"","margin_responsive_unit":"px","margin_right":"0","margin_right_large":"","margin_right_medium":"","margin_right_responsive":"","margin_bottom":"0","margin_bottom_large":"","margin_bottom_medium":"","margin_bottom_responsive":"","margin_left":"0","margin_left_large":"","margin_left_medium":"","margin_left_responsive":"","type":"grid_2","categorie_id":["5"],"responsive_display_filtered":true}),
					page: page,
					module: module
				},
			beforeSend: function() {
				$("#5f2586802c3b4 #overlay").fadeIn(300);
				$("#5f2586802c3b4").animate({opacity: 0.5}, 500);
			},
			success: function( response ) {

				parser = new DOMParser();
				doc = parser.parseFromString(response, "text/html");
				const principal_article = doc.getElementsByClassName('c0')[0];
				const secondary_articles = Object.values(doc.getElementsByClassName('c1'));
				let pagination = doc.getElementsByClassName('pagination-list')[0];

				$( '#5f2586802c3b4 div.section-content div.big-article-wrapper' ).html( principal_article );
				$( '#5f2586802c3b4 div.section-content div.posts-pagination' ).html( pagination==null?"":pagination ); 
				$( '#5f2586802c3b4 div.section-content div.secondary-article-wrapper' ).html('');

				secondary_articles.forEach(function(elem) {
					$( '#5f2586802c3b4 div.section-content div.secondary-article-wrapper' ).append( elem );
				});

				$("#5f2586802c3b4 .secondary-article-title a,#5f2586802c3b4 .big-article-title a").each(function(){
					var len = $(this).text().length;
					if(len > 60){
						$(this).text($(this).text().substr(0,60)+'...  '); 
					}
				});

				$("#5f2586802c3b4 #overlay").fadeOut(300);
				$("#5f2586802c3b4").animate({opacity: 1}, 500);            

			}
		});
	}

});


jQuery(function($) {
	
	const module = 'grid_4';
	let catID = "";
	let page = 1 ;

	load_posts();

	$("#5f11daaf857ed ul.sub_categories_list li a").on("click",function() {
		catID = $(this).attr("data-catid");
		page= 1 ;
		load_posts();
	});
	
	$("#5f11daaf857ed").on("click", "ul.pagination-list li a",function() {
		page = $(this).attr("data-page");
		load_posts();
	});

	function load_posts() {
		$.ajax({
			type: 'POST',
			url: my_ajax_object.ajax_url +'/wp-admin/admin-ajax.php',
			dataType: "html", // add data type
			data:{ 
					action : 'get_ajax_posts' ,
					postsPerPage : 3,
					categorie_id: catID,
					display_author: 1,
					settings: JSON.stringify({"title":"Economy","display_title":"1","categorie_id":"","showResume":"0","postPerPage":"3","colsNumber":"3","sticky":0,"display_views":1,"display_author":1,"display_date":1,"display_comments_count":1,"sticky-widget":0,"display_popular":0,"display_category_above_titles":1,"colsNumberLG":4,"colsNumberMD":2,"colsNumberSM":2,"order":"Desc","buttons_color":"333333","enable_shadow":"0","shadow_color":"333333","hover_shadow_color":"333333","hover_text_color":"000000","enable_shadow_onhover":"1","responsive_display":"desktop,large,medium,mobile","visibility_display":"","visibility_user_capability":"","animation":{"style":"fade-in","delay":"0","duration":"1"},"container_element":"div","id":"","class":"","node_label":"","export":"","import":"","bb_css_code":"","bb_js_code":"","margin_top":"","margin_unit":"px","margin_top_large":"","margin_large_unit":"px","margin_top_medium":"","margin_medium_unit":"px","margin_top_responsive":"","margin_responsive_unit":"px","margin_right":"0","margin_right_large":"","margin_right_medium":"","margin_right_responsive":"","margin_bottom":"","margin_bottom_large":"","margin_bottom_medium":"","margin_bottom_responsive":"","margin_left":"0","margin_left_large":"","margin_left_medium":"","margin_left_responsive":"","type":"grid_4","responsive_display_filtered":true}),
					page: page,
					module: module
				},
			beforeSend: function() {
				$("#5f11daaf857ed #overlay").fadeIn(300);
				$("#5f11daaf857ed").animate({opacity: 0.5}, 500);
			},
			success: function( response ) {

				parser = new DOMParser();
				doc = parser.parseFromString(response, "text/html");
				const secondary_articles = Object.values(doc.getElementsByClassName('c1'));
				let pagination = doc.getElementsByClassName('pagination-list')[0];
				
				
				$( '#5f11daaf857ed div.section-content' ).html('');
				$( '#5f11daaf857ed div.posts-pagination' ).html( pagination==null?"":pagination ); 

				secondary_articles.forEach(function(elem) {
					$( '#5f11daaf857ed div.section-content' ).append( elem );
				});

				$("#5f11daaf857ed .secondary-article-title a,#5f11daaf857ed .big-article-title a").each(function(){
					var len = $(this).text().length;
					if(len > 45){
						$(this).text($(this).text().substr(0,45)+'...  '); 
					}
				});

				$("#5f11daaf857ed #overlay").fadeOut(300);
				$("#5f11daaf857ed").animate({opacity: 1}, 500);            

			}
		});
	}

});

jQuery(function($) {
	var owl = $(".owl-carousel_5f20559fe0f0e");
			owl.owlCarousel({
				rtl: false,
				margin: 0,
				nav: true,
				loop: false,
				responsive: {
				0: {
					items: 1				},
				600: {
					items: 2				},
				1000: {
					items: 3				}
			}
	});
});
jQuery(function($) {
	
	const module = 'grid_2';
	let categories = "";
	let page = 1 ;

	load_posts();

	$("#5f2047b1c2089 ul.sub_categories_list li a").on("click",function() {
		categories = $(this).attr("data-catslug");
		page= 1 ;
		load_posts();
	});
	
	$("#5f2047b1c2089").on("click", "ul.pagination-list li a",function() {
		page = $(this).attr("data-page");
		load_posts();
	});

	function load_posts() {
		$.ajax({
			type: 'POST',
			url: my_ajax_object.ajax_url +'/wp-admin/admin-ajax.php',
			dataType: "html", // add data type
			data:{ 
					action : 'get_ajax_posts' ,
					postsPerPage : 4,
					categories: categories,
					display_author: 1,
					settings: JSON.stringify({"title":"Culture","display_title":"1","categories":"","postPerPage":"4","sticky":0,"display_views":1,"display_author":1,"display_date":1,"display_comments_count":1,"display_popular":0,"display_category_above_titles":1,"order":"Desc","buttons_color":"333333","enable_shadow":"0","shadow_color":"333333","hover_shadow_color":"333333","hover_text_color":"000000","enable_shadow_onhover":"1","responsive_display":"desktop,large,medium,mobile","visibility_display":"","visibility_user_capability":"","animation":{"style":"fade-in","delay":"0","duration":"1"},"container_element":"div","id":"","class":"","node_label":"","export":"","import":"","bb_css_code":"","bb_js_code":"","margin_top":"20","margin_unit":"px","margin_top_large":"","margin_large_unit":"px","margin_top_medium":"","margin_medium_unit":"px","margin_top_responsive":"","margin_responsive_unit":"px","margin_right":"0","margin_right_large":"","margin_right_medium":"","margin_right_responsive":"","margin_bottom":"20","margin_bottom_large":"","margin_bottom_medium":"","margin_bottom_responsive":"","margin_left":"0","margin_left_large":"","margin_left_medium":"","margin_left_responsive":"","type":"grid_2","categorie_id":"","responsive_display_filtered":true}),
					page: page,
					module: module
				},
			beforeSend: function() {
				$("#5f2047b1c2089 #overlay").fadeIn(300);
				$("#5f2047b1c2089").animate({opacity: 0.5}, 500);
			},
			success: function( response ) {

				parser = new DOMParser();
				doc = parser.parseFromString(response, "text/html");
				const principal_article = doc.getElementsByClassName('c0')[0];
				const secondary_articles = Object.values(doc.getElementsByClassName('c1'));
				let pagination = doc.getElementsByClassName('pagination-list')[0];

				$( '#5f2047b1c2089 div.section-content div.big-article-wrapper' ).html( principal_article );
				$( '#5f2047b1c2089 div.section-content div.posts-pagination' ).html( pagination==null?"":pagination ); 
				$( '#5f2047b1c2089 div.section-content div.secondary-article-wrapper' ).html('');

				secondary_articles.forEach(function(elem) {
					$( '#5f2047b1c2089 div.section-content div.secondary-article-wrapper' ).append( elem );
				});

				$("#5f2047b1c2089 .secondary-article-title a,#5f2047b1c2089 .big-article-title a").each(function(){
					var len = $(this).text().length;
					if(len > 60){
						$(this).text($(this).text().substr(0,60)+'...  '); 
					}
				});

				$("#5f2047b1c2089 #overlay").fadeOut(300);
				$("#5f2047b1c2089").animate({opacity: 1}, 500);            

			}
		});
	}

});

(function($) {
	$.fn.SocialCounter = function(options) {
	var settings = $.extend({
		// These are the defaults.
		twitter_user:"",
		facebook_user:"",
		facebook_token:"",
		instagram_user:"",
		instagram_token:"",
		google_plus_id:"",
		google_plus_key:"",
		linkedin_oauth:"",
		youtube_user:"",
		youtube_key:"",
		vine_user:"",
		pinterest_user:"",
		dribbble_user:"",
		dribbble_token:"",
		soundcloud_user_id:"",
		soundcloud_client_id:"",
		vimeo_user:"",
		vimeo_token:"",
		github_user:"",
		behance_user:"",
		behance_client_id:"",
		vk_id:"",
		foursquare_user:"",
		foursquare_token:"",
		tumblr_username:"",
		twitch_username:"",
		twitch_client_id:"",
		spotify_artist_id:"",
		spotify_user_id:""
	}, options);

	function pinterest(){
		//Pinterst API V3
		$.ajax({
		url: 'https://api.pinterest.com/v3/pidgets/users/'+settings.pinterest_user+'/pins',
		dataType: 'jsonp',
		type: 'GET',
		success: function(data) {   
			if(data.data !== null){
			var followers = parseInt(data.data.user.follower_count);
			var k = kFormatter(followers);
			$('#wrapper .item.pinterest .count').append(k); 
			$('#wrapper .item.pinterest').attr('href','https://pinterest.com/'+settings.pinterest_user);
			getTotal(followers);
			} 
		} 
		}); 
	}
	function dribbble(){
		//Dribble API
		$.ajax({
		url: 'https://api.dribbble.com/v1/users/'+settings.dribbble_user,
		dataType: 'json',
		type: 'GET',
		data:{
			access_token: settings.dribbble_token
		},
		success: function(data) {   
			var followers = parseInt(data.followers_count);
			var k = kFormatter(followers);
			$('#wrapper .item.dribbble .count').append(k); 
			$('#wrapper .item.dribbble').attr('href','https://dribbble.com/'+settings.dribbble_user);
			getTotal(followers); 
		} 
		}); 
	}
	function facebook(){
		$.ajax({
		url: 'https://graph.facebook.com/v2.8/'+settings.facebook_user,
		dataType: 'json',
		type: 'GET',
		data: {
			access_token:settings.facebook_token,
			fields:'fan_count'
		},
		success: function(data) {   
			var followers = parseInt(data.fan_count);
			var k = kFormatter(followers);
			$('#wrapper .item.facebook .count').append(k); 
			$('#wrapper .item.facebook').attr('href','https://facebook.com/'+settings.facebook_user);
			getTotal(followers); 
		} 
		}); 
	}
	function instagram(){
		$.ajax({
		url: 'https://api.instagram.com/v1/users/self/',
		dataType: 'jsonp',
		type: 'GET',
		data: {
			access_token: settings.instagram_token
		},
		success: function(data) {
			if(typeof data.data != "undefined"){
			var followers = parseInt(data.data.counts.followed_by);
			var k = kFormatter(followers);
			$('#wrapper .item.instagram .count').append(k);
			$('#wrapper .item.instagram').attr('href','https://instagram.com/'+settings.instagram_user);
			getTotal(followers); 
			}
		}
		});
	}
	function google(){
		//Google+ API
		$.ajax({
		url: 'https://www.googleapis.com/plus/v1/people/' + settings.google_plus_id,
		type: "GET",
		dataType: "json",
		data:{
			key:settings.google_plus_key
		},
		success: function (data) {
			var followers = parseInt(data.circledByCount);
			var k = kFormatter(followers);
			$("#wrapper .item.google .count").append(k);
			$('#wrapper .item.google').attr('href','https://plus.google.com/'+settings.google_plus_id);
			getTotal(followers); 
		}
		});
	}
	function youtube(){
		$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/channels',
		dataType: 'jsonp',
		type: 'GET',
		data:{
			part:'statistics',
			forUsername:settings.youtube_user,
			key: settings.youtube_key
		},
		success: function(data) {   
			if(typeof data.items != "undefined"){
			var subscribers = parseInt(data.items[0].statistics.subscriberCount);
			var k = kFormatter(subscribers);
			$('#wrapper .item.youtube .count').append(k); 
			$('#wrapper .item.youtube').attr('href','https://youtube.com/'+settings.youtube_user);
			getTotal(subscribers);
			} 
		} 
		}); 
	}
	function soundcloud(){
		//SoundCloud API
		$.ajax({
		url: 'http://api.soundcloud.com/users/'+settings.soundcloud_user_id,
		dataType: 'json',
		type: 'GET',
		data:{
			client_id: settings.soundcloud_client_id
		},
		success: function(data) {   
			var followers = parseInt(data.followers_count);
			var k = kFormatter(followers);
			$('#wrapper .item.soundcloud .count').append(k); 
			$('#wrapper .item.soundcloud').attr('href',data.permalink_url);
			getTotal(followers); 
		} 
		}); 
	}
	function vimeo(){
		//Vimeo V3 API
		$.ajax({
		url: 'https://api.vimeo.com/users/'+settings.vimeo_user+'/followers',
		dataType: 'json',
		type: 'GET',
		data:{
			access_token: settings.vimeo_token
		},
		success: function(data) {   
			var followers = parseInt(data.total);
			$('#wrapper .item.vimeo .count').append(followers).digits(); 
			$('#wrapper .item.vimeo').attr('href','https://vimeo.com/'+settings.vimeo_user);
			getTotal(followers); 
		} 
		}); 
	}
	function twitter(){
		$.ajax({
		url: '../SocialCounters/twitter/index.php',
		dataType: 'json',
		type: 'GET',
		data:{
			user:settings.twitter_user
		},
		success: function(data) {   
			var followers = parseInt(data.followers);
			$('#wrapper .item.twitter .count').append(followers).digits(); 
			$('#wrapper .item.twitter').attr('href','https://twitter.com/'+settings.twitter_user);
			getTotal(followers); 
		} 
		}); 
	}
	function github(){
		//Github
		$.ajax({
		url: 'https://api.github.com/users/'+settings.github_user,
		dataType: 'json',
		type: 'GET',
		success: function(data) {   
			var followers = parseInt(data.followers);
			var k = kFormatter(followers);
			$('#wrapper .item.github .count').append(k); 
			$('#wrapper .item.github').attr('href','https://github.com/'+settings.github_user);
			getTotal(followers); 
		} 
		}); 
	}
	function behance(){
		//Behance
		$.ajax({
		url: 'https://api.behance.net/v2/users/'+settings.behance_user,
		dataType: 'jsonp',
		type: 'GET',
		data:{
			client_id: settings.behance_client_id
		},
		success: function(data) {   
			var followers = parseInt(data.user.stats.followers);
			var k = kFormatter(followers);
			$('#wrapper .item.behance .count').append(k); 
			$('#wrapper .item.behance').attr('href','https://behance.net/'+settings.behance_user);
			getTotal(followers); 
		} 
		}); 
	}
	function vine(){
		$.ajax({
		url: '../SocialCounters/vine/vine.php',
		dataType: 'json',
		type: 'GET',
		data:{
			user: settings.vine_user
		},
		success: function(data) {
			var followers = parseInt(data.followers);
			var k = kFormatter(followers);
			$('#wrapper .item.vine .count').append(k); 
			$('#wrapper .item.vine').attr('href','https://vine.co/u/'+settings.vine_user);
			getTotal(followers); 
		} 
		});
	}
	function vk(){
		//VK API
		$.ajax({
		url: 'https://api.vk.com/method/users.getFollowers',
		dataType: 'jsonp',
		type: 'GET',
		data:{
			user_id: settings.vk_id
		},
		success: function(data) {
			var followers = parseInt(data.response.count);
			var k = kFormatter(followers);
			$('#wrapper .item.vk .count').append(k); 
			$('#wrapper .item.vk').attr('href','https://vk.com/id'+settings.vk_id);
			getTotal(followers); 
		} 
		});
	}
	function foursquare(){
		//Foursquare API - GET ID
		$.ajax({
		url: 'https://api.foursquare.com/v2/users/search',
		dataType: 'jsonp',
		type: 'GET',
		data:{
			twitter: settings.foursquare_user,
			oauth_token: settings.foursquare_token,
			v:'20131017',
		},
		success: function(data) {
			//Get user ID
			if(typeof data.response.results != "undefined"){
			var id = data.response.results[0].id;
			//Foursquare API - GET FRIENDS COUNT
			$.ajax({
				url: 'https://api.foursquare.com/v2/users/'+id,
				dataType: 'jsonp',
				type: 'GET',
				data:{
				oauth_token: settings.foursquare_token,
				v:'20131017'
				},
				success: function(data) {    
				if(typeof data.response != "undefined"){
					var followers = parseInt(data.response.user.friends.count);
					var k = kFormatter(followers);
					$('#wrapper .item.foursquare .count').append(k); 
					$('#wrapper .item.foursquare').attr('href','https://foursquare.com/'+settings.foursquare_user);
					getTotal(followers); 
				}
				} 
			});
			} 
		}
		});
	}
	function linkedin(){
		$.ajax({
		url: 'https://api.linkedin.com/v1/people/~:(num-connections,public-profile-url)',
		dataType:'jsonp',
		type:'GET',
		data:{
			oauth2_access_token:settings.linkedin_oauth,
			format:'jsonp'
		},
		success: function(data){
			var connections = parseInt(data.numConnections);
			var k = kFormatter(connections);
			$('#wrapper .item.linkedin .count').append(k); 
			$('#wrapper .item.linkedin').attr('href',data.publicProfileUrl);
			getTotal(connections); 
		}
		});
	}
	function tumblr(){
		$.ajax({
		url: '../SocialCounters/tumblr/callback.php',
		dataType: 'json',
		type: 'GET',
		data:{
			user: settings.tumblr_username
		},
		success: function(data) {
			var followers = parseInt(data.followers);
			var k = kFormatter(followers);
			$('#wrapper .item.tumblr .count').append(k); 
			$('#wrapper .item.tumblr').attr('href','https://'+settings.tumblr_username+'.tumblr.com');
			getTotal(followers); 
		} 
		});
	}
	function twitch(){
		$.ajax({
		url: 'https://api.twitch.tv/kraken/channels/'+settings.twitch_username,
		dataType: 'json',
		type: 'GET',
		data:{
			client_id: settings.twitch_client_id
		},
		success: function(data) {
			var followers = parseInt(data.followers);
			var k = kFormatter(followers);
			$('#wrapper .item.twitch .count').append(k); 
			$('#wrapper .item.twitch').attr('href','https://www.twitch.tv/'+settings.twitch_username+'/profile');
			getTotal(followers); 
		} 
		});
	}
	function spotifyArtist(){
		$.ajax({
			url:'https://api.spotify.com/v1/artists/'+settings.spotify_artist_id,
			dataType:'json',
			type:'GET',
			success: function(data){
				var followers = parseInt(data.followers.total);
				var k = mFormatter(followers);
				$('#wrapper .item.spotify_artist .count').append(k); 
				$('#wrapper .item.spotify_artist').attr('href','https://open.spotify.com/artist/'+settings.spotify_artist_id);
				getTotal(followers);    
			}
		});
	}
	function spotifyUser(){
		$.ajax({
			url:'https://api.spotify.com/v1/users/'+settings.spotify_user_id,
			dataType:'json',
			type:'GET',
			success: function(data){
				var followers = parseInt(data.followers.total);
				var k = mFormatter(followers);
				$('#wrapper .item.spotify_user .count').append(k); 
				$('#wrapper .item.spotify_user').attr('href','https://open.spotify.com/users/'+settings.spotify_user_id);
				getTotal(followers);    
			}
		});
	}
	//Function to add commas to the thousandths
	$.fn.digits = function(){ 
		return this.each(function(){ 
		$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
		})
	}
	//Function to add K to thousands
	function kFormatter(num) {
		return num > 999 ? (num/1000).toFixed(1) + 'k' : num;
	}
	//Function to add K to thousands
	function mFormatter(num) {
		return num > 999999 ? (num/1000000).toFixed(1) + 'm' : num;
	}
	//Total Counter
	var total = 0;
	//Get an integer paramenter from each ajax call
	function getTotal(data) {
		total = total + data;
		$("#total").html(total).digits();
		$("#total_k").html(kFormatter(total));
	}

	function linkClick(){
		$('#wrapper .item').attr('target','_blank');
	}
	linkClick();

	//Call Functions
	if(settings.twitter_user!=''){ 
		twitter(); 
	} if(settings.facebook_user!='' && settings.facebook_token!=''){ 
		facebook(); 
	} if(settings.instagram_user!='' && settings.instagram_token!=''){ 
		instagram();
	} if(settings.google_plus_id!='' && settings.google_plus_key!=''){ 
		google();
	} if(settings.linkedin_oauth!=''){ 
		linkedin(); 
	} if(settings.youtube_user!='' && settings.youtube_key!=''){ 
		youtube(); 
	} if(settings.vine_user!=''){ 
		vine(); 
	} if(settings.pinterest_user!=''){ 
		pinterest(); 
	} if(settings.dribbble_user!='' && settings.dribbble_token!=''){ 
		dribbble();
	} if(settings.soundcloud_user_id!='' && settings.soundcloud_client_id!=''){ 
		soundcloud(); 
	} if(settings.vimeo_user!='' && settings.vimeo_token!=''){ 
		vimeo();
	} if(settings.github_user!=''){ 
		github();
	} if(settings.behance_user!='' && settings.behance_client_id!=''){ 
		behance(); 
	} if(settings.vk_id!=''){ 
		vk(); 
	} if(settings.foursquare_user!='' && settings.foursquare_token!=''){ 
		foursquare(); 
	} if(settings.tumblr_username!=''){ 
		tumblr(); 
	} if(settings.twitch_username!='' && settings.twitch_client_id!=''){ 
		twitch(); 
	} if(settings.spotify_artist_id!=''){ 
		spotifyArtist(); 
	}if(settings.spotify_user_id!=''){ 
		spotifyUser(); 
	}
	};
	$('#wrapper').SocialCounter({
		//Get Usernames
		twitter_user:"",
		facebook_user:"",
		facebook_token:"",
		instagram_user:"",
		instagram_token:"",
		google_plus_id:"",
		google_plus_key:"",
		linkedin_oauth:"",
		youtube_user:"",
		youtube_key:"",
		vine_user:"",
		pinterest_user:"",
		dribbble_user:"",
		dribbble_token:"",
		soundcloud_user_id:"",
		soundcloud_client_id:"",
		vimeo_user:"",
		vimeo_token:"",
		github_user:"",
		behance_user:"",
		behance_client_id:"",
		vk_id:"",
		foursquare_user:"",
		foursquare_token:"",
		tumblr_username:"",
		twitch_username:"",
		twitch_client_id:"",
		spotify_artist_id:"",
		spotify_user_id:""
		});
}(jQuery));

jQuery(function($) {
	
		$(function() {
		$( '.fl-node-5f22c3ac6bcda .fl-photo-img' )
			.on( 'mouseenter', function( e ) {
				$( this ).data( 'title', $( this ).attr( 'title' ) ).removeAttr( 'title' );
			} )
			.on( 'mouseleave', function( e ){
				$( this ).attr( 'title', $( this ).data( 'title' ) ).data( 'title', null );
			} );
	});
		window._fl_string_to_slug_regex = 'a-zA-Z0-9';
});

jQuery(function($) {
	var owl = $(".owl-carousel_5f133b38364fd");
			owl.owlCarousel({
				rtl: false,
				margin: 0,
				nav: true,
				loop: false,
				responsive: {
				0: {
					items: 1				},
				600: {
					items: 1				},
				1000: {
					items: 1				}
			}
	});
});
jQuery(function($) {
	
	const module = 'grid_4';
	let catID = "";
	let page = 1 ;

	load_posts();

	$("#5f234c2070311 ul.sub_categories_list li a").on("click",function() {
		catID = $(this).attr("data-catid");
		page= 1 ;
		load_posts();
	});
	
	$("#5f234c2070311").on("click", "ul.pagination-list li a",function() {
		page = $(this).attr("data-page");
		load_posts();
	});

	function load_posts() {
		$.ajax({
			type: 'POST',
			url: my_ajax_object.ajax_url +'/wp-admin/admin-ajax.php',
			dataType: "html", // add data type
			data:{ 
					action : 'get_ajax_posts' ,
					postsPerPage : 3,
					categorie_id: catID,
					display_author: 1,
					settings: JSON.stringify({"title":"Economy","display_title":"1","categorie_id":"","showResume":"1","postPerPage":"3","colsNumber":"3","sticky":0,"display_views":1,"display_author":1,"display_date":1,"display_comments_count":1,"sticky-widget":0,"display_popular":0,"display_category_above_titles":1,"colsNumberLG":4,"colsNumberMD":2,"colsNumberSM":2,"order":"Desc","buttons_color":"333333","enable_shadow":"0","shadow_color":"333333","hover_shadow_color":"333333","hover_text_color":"000000","enable_shadow_onhover":"1","responsive_display":"desktop,large,medium,mobile","visibility_display":"","visibility_user_capability":"","animation":{"style":"fade-in","delay":"0","duration":"1"},"container_element":"div","id":"","class":"","node_label":"","export":"","import":"","bb_css_code":"","bb_js_code":"","margin_top":"","margin_unit":"px","margin_top_large":"","margin_large_unit":"px","margin_top_medium":"","margin_medium_unit":"px","margin_top_responsive":"","margin_responsive_unit":"px","margin_right":"0","margin_right_large":"","margin_right_medium":"","margin_right_responsive":"","margin_bottom":"","margin_bottom_large":"","margin_bottom_medium":"","margin_bottom_responsive":"","margin_left":"0","margin_left_large":"","margin_left_medium":"","margin_left_responsive":"","type":"grid_4","responsive_display_filtered":true}),
					page: page,
					module: module
				},
			beforeSend: function() {
				$("#5f234c2070311 #overlay").fadeIn(300);
				$("#5f234c2070311").animate({opacity: 0.5}, 500);
			},
			success: function( response ) {

				parser = new DOMParser();
				doc = parser.parseFromString(response, "text/html");
				const secondary_articles = Object.values(doc.getElementsByClassName('c1'));
				let pagination = doc.getElementsByClassName('pagination-list')[0];
				
				
				$( '#5f234c2070311 div.section-content' ).html('');
				$( '#5f234c2070311 div.posts-pagination' ).html( pagination==null?"":pagination ); 

				secondary_articles.forEach(function(elem) {
					$( '#5f234c2070311 div.section-content' ).append( elem );
				});

				$("#5f234c2070311 .secondary-article-title a,#5f234c2070311 .big-article-title a").each(function(){
					var len = $(this).text().length;
					if(len > 45){
						$(this).text($(this).text().substr(0,45)+'...  '); 
					}
				});

				$("#5f234c2070311 #overlay").fadeOut(300);
				$("#5f234c2070311").animate({opacity: 1}, 500);            

			}
		});
	}

});

jQuery(function($) {
	var owl = $(".owl-carousel_5eff4cc901139");
			owl.owlCarousel({
				rtl: false,
				margin: 0,
				autoplay:true,
				autoplayTimeout:2000,
				autoplayHoverPause:true,
				nav: true,
				responsive: {
					0: {
					items: 1					},
					600: {
					items: 2					},
					1000: {
					items: 4					}
				}
	});
	});
jQuery(function($) {
	var owl = $(".owl-carousel_5f1ff3d6b6086");
			owl.owlCarousel({
				rtl: false,
				margin: 0,
				nav: true,
				loop: false,
				responsive: {
					0: {
					items: 1					},
					600: {
					items: 2					},
					1000: {
					items: 4					}
				}
	});
});

/* Start Global Node Custom JS */

/* End Global Node Custom JS */


/* Start Layout Custom JS */

/* End Layout Custom JS */

