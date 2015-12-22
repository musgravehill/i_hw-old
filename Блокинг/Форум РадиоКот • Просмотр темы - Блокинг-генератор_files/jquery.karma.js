/**
*
* @package karmamod
* @version $Id$
* @copyright (c) 2007-2012 David Lawson, m157y, A_Jelly_Doughnut
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
*
*/
jQuery(function() {
	// Prepare variables
	var
		// AJAX object handler
		ajaxHandler	= null,

		// UI actions controller
		ui			= {},
		callbacks	= {};

	/**
	* UI actions controller
	*/
	ui =
	{
		/**
		* Layers handler for AJAX
		*/
		$ajaxHandler:	null,

		/**
		* Semi-transparent overlay layer for AJAX
		*/
		$ajaxOverlay:	null,

		/**
		* Loading image layer for AJAX
		*/
		$ajaxLoading:	null,

		/**
		* Content handler for AJAX
		*/
		$ajaxContent:	null,

		/**
		* Initialize UI additions
		*/
		initialize: function()
		{
			// Create additional UI elements
			this.$ajaxHandler	= $('<div id="karma-ajax-handler"></div>').appendTo('body');
			this.$ajaxOverlay	= $('<div id="karma-ajax-overlay"></div>').appendTo('#karma-ajax-handler');
			this.$ajaxLoading	= $('<div id="karma-ajax-loading"></div>').appendTo('#karma-ajax-handler');
			this.$ajaxContent	= $('<div id="karma-ajax-content"></div>').appendTo('#karma-ajax-handler');

			// Extend semi-transparent overlay
			// We don't set opacity at CSS because we still need lot of prefixes and filters to work in all browsers
			this.$ajaxOverlay
				.css('opacity', .7)
				.on
				(
					'click',
					function(event)
					{
						// Hide semi-transparent overlay
						ui.overlayHide();

						// Prevent default action
						return false;
					} // function() {}
				); // this.$ajaxOverlay.on()

			// Catch key press and parse it if need
			$(document).on
			(
				'keyup',
				function(event)
				{
					// Don't do anything if semi-transparent overlay is hidden
					// if (ui.$ajaxOverlay.is(':hidden') === true)
					if (ui.$ajaxHandler.is(':hidden') === true)
					{
						return;
					}

					// Close AJAX window on "Esc" press
					if (event.keyCode == 27)
					{
						ui.overlayHide();
					}
					// Submit karma form on ctrl+enter
					else if (event.keyCode == 10 || (event.ctrlKey && event.keyCode == 13))
					{
						// Submit/Confirm form
						$('form input[name="post"], form input[name="confirm"]', ui.$ajaxContent).trigger('click');
					}
				} // function() {}
			); // $(document).on()

			// Resize reposition loading image and content window on window resize
			$(window).on
			(
				'resize',
				function()
				{
					// Don't do anything if semi-transparent overlay is hidden
					if (ui.$ajaxOverlay.is(':hidden') === true)
					{
						return;
					}

					ui.$ajaxLoading.center();
					ui.$ajaxContent.center();
				} // function() {}
			); // $(window).on() {}

			// Extend karma buttons
			this.extendButtons();
		}, // initialize: function()

		/**
		* Show semi-transparent overlay
		*/
		overlayShow: function()
		{
			// Don't do anything if overlay already shown
			if (ui.$ajaxHandler.is(':hidden') === false)
			{
				return;
			}

			// Show semi-transparent overlay
			ui.$ajaxHandler.fadeIn('slow');

			// Disable page scrolling
			$('body').css('overflow', 'hidden');
		}, // overlayShow: function() {}

		/**
		* Hide semi-transparent overlay
		*/
		overlayHide: function()
		{
			// Abort AJAX request if need
			if (ajaxHandler !== null && typeof(ajaxHandler.abort) === 'function')
			{
				ajaxHandler.abort();
			}
			ajaxHandler = null;

			// Hide content layer
			ui.contentHide();

			// Hide loading image
			ui.loadingHide();

			// Hide semi-transparent overlay
			ui.$ajaxHandler.fadeOut('fast');

			// Enable page scrolling
			$('body').css('overflow', 'auto');

		}, // overlayHide: function() {}

		/**
		* Show loading layer
		*/
		loadingShow: function()
		{
			// Reposition and show loading image
			ui.$ajaxLoading
				.center()
				.fadeIn('slow');
		}, // loadingShow: function() {}

		/**
		* Hide loading layer
		*/
		loadingHide: function()
		{
			// Hide loading image
			ui.$ajaxLoading.fadeOut('fast');
		}, // loadingHide: function() {}

		/**
		* Show content layer
		*/
		contentShow: function()
		{
			// Hide loading image
			ui.$ajaxLoading.fadeOut('fast');

			// Reposition and show content layer
			ui.$ajaxContent
				.center()
				.fadeIn('slow');
		}, // contentShow: function() {}

		/**
		* Hide content layer
		*/
		contentHide: function()
		{
			// Hide content layer
			ui.$ajaxContent.fadeOut('fast');
		}, // contentHide: function() {}

		/**
		* Setup content
		*/
		contentSet: function(content)
		{
			// Clean previous content
			ui.contentClean();

			// Setup new content
			ui.$ajaxContent.html(content);

			// Extend karma buttons at new content
			ui.extendButtons(ui.$ajaxContent);
		}, // contentSet: function() {}

		/**
		* Cleanup content
		*/
		contentClean: function()
		{
			ui.$ajaxContent.html('');
		}, // contentClean: function() {}

		/**
		* Extend karma buttons
		*/
		extendButtons: function($parent)
		{
			// Set default value
			$parent = $parent || null;

			$('.Karma-Button-Increase, .Karma-Button-Decrease, .Karma-Button-Edit, .Karma-Button-Delete, .Karma-ViewList', $parent).on('click', callbacks.karmaButtonsClick);

			// Extend semi-transparent overlay
			// We don't set opacity at CSS because we still need lot of prefixes and filters to work in all browsers
			$('.Karma-Close-Button', $parent)
				.on
				(
					'click',
					function(event)
					{
						// Hide semi-transparent overlay
						ui.overlayHide();

						// Prevent default action
						return false;
					} // function() {}
				); // this.$ajaxOverlay.on()
		}
	}; // ui = {}

	// Callbacks controller
	callbacks =
	{
		/**
		* Click on karma increase and decrease buttons
		*/
		karmaButtonsClick: function(event)
		{
			var
				$this		= $(this),
				buttonUrl	= ($this.prop('tagName') === 'A') ? $this.attr('href') : (($this.prop('tagName') === 'IMG') ? $this.attr('src') : $this.find('a').attr('href'));

			// Don't extend buttons with inline onclick event
			if ($this.attr('onclick') !== undefined && $this.attr('onclick') !== '')
			{
				return false;
			}

			// Replace original jumpto() function with our own
			if ($this.data('onclick') !== undefined)
			{
				// jumpto() replacement
				var
					page	= prompt(karmaJumpPage, karmaOnPage),
					url		= '';

				if (page !== null && !isNaN(page) && page == Math.floor(page) && page > 0)
				{
					if (karmaBaseUrl.indexOf('?') == -1)
					{
						url = karmaBaseUrl + '?start=' + ((page - 1) * karmaPerPage);
					}
					else
					{
						url = karmaBaseUrl.replace(/&amp;/g, '&') + '&start=' + ((page - 1) * karmaPerPage);
					}

					// Store url as href attribute, it'll prevent lot of additional code
					$this.attr('href', url);
					$this.attr('onclick', '');
				}
			}

			// Show semi-transparent overlay and loading image
			ui.overlayShow();
			ui.loadingShow();

			// Load form via AJAX
			ajaxHandler = $.ajax({
				url:		buttonUrl + '&ajax=true',
				dataType:	'html',
				type:		'GET',
				success:	function(responseText, textStatus, xhr)
				{
					if ($this.hasClass('Karma-Button-Decrease') === true || $this.hasClass('Karma-Button-Increase') === true)
					{
						// Update karma value and buttons

						// Convert JSON to object
						responseText = $.parseJSON(responseText);

						// Prepare variables
						var
							$karmaValue		= (responseText.user_id == 1) ? $('.Karma-Data-Post-Value[data-post="' + responseText.post_id + '"]') : $('.Karma-Data-User-Value[data-user="' + responseText.user_id + '"]'),
							$karmaRank		= $('.Karma-Data-User-Rank[data-user="' + responseText.user_id + '"]'),
							$karmaRankImage	= $('.Karma-Data-User-RankImage[data-user="' + responseText.user_id + '"]'),
							$karmaButtons	= $('.Karma-Buttons[data-post="' + responseText.post_id + '"], .Karma-Buttons[data-user="' + responseText.user_id + '"]').find('.Karma-Button-Increase, .Karma-Button-Decrease');

						// Update user's/post's karma value
						$karmaValue
							.fadeOut(
								'slow',
								function()
								{
									$(this)
										.html(responseText.karma_value)
										.fadeIn('slow');
								}
							);

						// Update user's karma rank if need
						if (responseText.user_id == 1)
						{
							// Update user karma rank title if need
							if ($karmaRank.html() != responseText.rank_title)
							{
								$karmaRank.fadeOut(
									'slow',
									function()
									{
										$(this)
											.html(responseText.rank_title)
											.fadeIn('slow');
									}
								);
							}

							// update user karma rank image if need
							if ($karmaRankImage.html() != responseText.rank_image)
							{
								$karmaRankImage.fadeOut(
									'slow',
									function()
									{
										$(this)
											.html(responseText.rank_title)
											.fadeIn('slow');
									}
								);
							}
						}

						switch (responseText.karma_buttons)
						{
							case 'plus':
								$karmaButtons.filter('.Karma-Button-Increase').fadeOut('slow');
							break;

							case 'minus':
								$karmaButtons.filter('.Karma-Button-Decrease').fadeOut('slow');
							break;

							case 'both':
								$karmaButtons.fadeIn('slow');
						}

						// Hide content and semi-transparent overlay
						ui.overlayHide();

						return;
					} // if ($this.hasClass('Karma-Button-Decrease') === true || $this.hasClass('Karma-Button-Increase') === true)

					// Setup content
					ui.contentSet(responseText);

					// Extend pagination links and replace original jumpto() function with our own
					$('.pagination a', ui.$ajaxContent)
						.on('click', callbacks.karmaButtonsClick)
						.filter('[onclick]')
							.each(
								function()
								{
									$(this)
										.data('onclick', $(this).attr('onclick'))
										.attr('onclick', '');
								}
							);

					// Extend cancel button
					$('input[name="cancel"]', ui.$ajaxContent).on('click', callbacks.formCancelClick);

					// Extend submit button
					$('input[name="post"]', ui.$ajaxContent).on('click', callbacks.formSubmitClick);

					// Extend confirm button
					$('input[name="confirm"]', ui.$ajaxContent).on('click', callbacks.formConfirmClick);

					// Show new content
					ui.contentShow();
				} // success: function() {}
			}); // $.ajax({})

			// Prevent default action
			return false;
		}, // karmaButtonsClick: function() {}

		/**
		* Click on cancel button at karma form
		*/
		formCancelClick: function(event)
		{
			// Hide content and semi-transparent overlay
			ui.overlayHide();

			// Prevent default action
			return false;
		}, // formCancelClick: function() {}

		/**
		* Click on submit button at karma form
		* @todo merge it with formConfirmClick: function()
		*/
		formSubmitClick: function(event)
		{
			// Prepare variables
			var
				formAction	= $(this).closest('form').attr('action'),
				isEdit		= (formAction.indexOf('edit') !== -1) ? true : false;

			// Submit form via AJAX
			ajaxHandler = $(this).closest('form')
				.ajaxSubmit(
					{
						url:		formAction + '&ajax=1&post=1',
						type:		'POST',
						dataType:	'html',
						success:	function(responseText, statusText, xhr, $form)
						{
							if ($.isJSON(responseText) === false)
							{
								// Update content
								ui.contentSet(responseText);

								// Extend cancel button
								$('input[name="cancel"]', ui.$ajaxContent).on('click', callbacks.formCancelClick);

								// Extend submit button
								$('input[name="post"]', ui.$ajaxContent).on('click', callbacks.formSubmitClick);
							}
							else
							{
								// Convert JSON to object
								responseText = $.parseJSON(responseText);

								// Update UI
								if (isEdit === true)
								{
									//@todo update karma value and karma icon
									//@todo update pagination
									// Update comment text
									$('#cpr' + responseText.karma_id)
										.fadeOut
										(
											'slow',
											function()
											{
												$(this)
													.find('.content')
														.html(responseText.karma_message)
													.end()
													.fadeIn('slow');
											}
										);
								}
								else
								{
									// Update karma value and buttons

									// Prepare variables
									var
										$karmaValue		= (responseText.user_id == 1) ? $('.Karma-Data-Post-Value[data-post="' + responseText.post_id + '"]') : $('.Karma-Data-User-Value[data-user="' + responseText.user_id + '"]'),
										$karmaRank		= $('.Karma-Data-User-Rank[data-user="' + responseText.user_id + '"]'),
										$karmaRankImage	= $('.Karma-Data-User-RankImage[data-user="' + responseText.user_id + '"]'),
										$karmaButtons	= $('.Karma-Buttons[data-post="' + responseText.post_id + '"], .Karma-Buttons[data-user="' + responseText.user_id + '"]');

									// Update user's/post's karma value
									$karmaValue
										.fadeOut(
											'slow',
											function()
											{
												$(this)
													.html(responseText.karma_value)
													.fadeIn('slow');
											}
										);

									// Update user's karma rank if need
									if (responseText.user_id == 1)
									{
										// Update user karma rank title if need
										if ($karmaRank.html() != responseText.rank_title)
										{
											$karmaRank.fadeOut(
												'slow',
												function()
												{
													$(this)
														.html(responseText.rank_title)
														.fadeIn('slow');
												}
											);
										}

										// update user karma rank image if need
										if ($karmaRankImage.html() != responseText.rank_image)
										{
											$karmaRankImage.fadeOut(
												'slow',
												function()
												{
													$(this)
														.html(responseText.rank_title)
														.fadeIn('slow');
												}
											);
										}
									}

									// Hide karma buttons for specified post
									$karmaButtons.fadeOut(
										'slow',
										function()
										{
											$(this).remove();
										}
									);
								}

								// Hide content and semi-transparent overlay
								ui.overlayHide();
							}
						}
					}
				);

			// Prevent default action
			return false;
		}, // formSubmitClick: function() {}

		/**
		* Click on confirm button at confirm form
		* @todo merge it with formSubmitClick: function()
		*/
		formConfirmClick: function(event)
		{
			// Prepare variables
			var
				$confirm = $(this);

			// Submit form via AJAX
			ajaxHandler = $confirm.closest('form')
				.ajaxSubmit(
					{
						url:		$(this).closest('form').attr('action'),
						type:		'POST',
						beforeSubmit: function(formData, $form, options)
						{
							formData.push(
								{
									name:	'confirm',
									type:	'submit',
									value:	$confirm.val()
								} // {}
							); // formData.push()
						}, // beforeSubmit: function() {}
						dataType:	'html',
						success:	function(responseText, statusText, xhr, $form)
						{
							if ($.isJSON(responseText) === false)
							{
								// Update content
								ui.contentSet(responseText);
							}
							else
							{
								// Convert JSON to object
								responseText = $.parseJSON(responseText);

								// Update karma value and buttons

								// Prepare variables
								var
									$karmaValue		= (responseText.user_id == 1) ? $('.Karma-Data-Post-Value[data-post="' + responseText.post_id + '"]') : $('.Karma-Data-User-Value[data-user="' + responseText.user_id + '"]'),
									$karmaRank		= $('.Karma-Data-User-Rank[data-user="' + responseText.user_id + '"]'),
									$karmaRankImage	= $('.Karma-Data-User-RankImage[data-user="' + responseText.user_id + '"]'),
									$karmaButtons	= $('.Karma-Buttons[data-post="' + responseText.post_id + '"], .Karma-Buttons[data-user="' + responseText.user_id + '"]');

								// Update user's/post's karma value
								$karmaValue
									.fadeOut(
										'slow',
										function()
										{
											$(this)
												.html(responseText.karma_value)
												.fadeIn('slow');
										}
									);

								// Update user's karma rank if need
								if (responseText.user_id == 1)
								{
									// Update user karma rank title if need
									if ($karmaRank.html() != responseText.rank_title)
									{
										$karmaRank.fadeOut(
											'slow',
											function()
											{
												$(this)
													.html(responseText.rank_title)
													.fadeIn('slow');
											}
										);
									}

									// update user karma rank image if need
									if ($karmaRankImage.html() != responseText.rank_image)
									{
										$karmaRankImage.fadeOut(
											'slow',
											function()
											{
												$(this)
													.html(responseText.rank_title)
													.fadeIn('slow');
											}
										);
									}
								}

								// Hide karma buttons for specified post
								$karmaButtons.fadeOut(
									'slow',
									function()
									{
										$(this).remove();
									}
								);

								// Hide content and semi-transparent overlay
								ui.overlayHide();
							}
						} // success: function() {}
					} // {}
				); // $(this).closest('form').ajaxSubmit()
			// Prevent default action
			return false;
		} // formConfirmClick: function() {}
	}; // callbacks = {}

	/**
	* Extend jQuery object
	*/
	/**
	* Check is string json or not
	* Borrowed from here: http://forum.jquery.com/topic/isjson-str
	*/
	$.isJSON = function(json)
	{
		json = json.replace(/\\["\\\/bfnrtu]/g, '@');
		json = json.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
		json = json.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		return (/^[\],:{}\s]*$/.test(json))
	}

	/**
	* Center element
	* Borrowed from here: http://stackoverflow.com/a/2257651 and slightly modified by m157y
	*/
	$.fn.extend(
		{
			center: function()
			{
				return this.each(
					function()
					{
						// Prepare variables
						var
							$this	= $(this),
							$window	= $(window),

							// Calculate top and left positions
							top		= ($window.height() - $this.outerHeight()) / 2,
							left	= ($window.width() - $this.outerWidth()) / 2;

						// Setup new position
						$this.css(
							{
								position:	'absolute',
								top:		(top > 0)	? top	: 0,
								left:		(left > 0)	? left	: 0
							} // {}
						); // $this.css()
					} // function() {}
				); // return this.each()
			} // center: function() {}
		} // {}
	); // $.fn.extend()

	// Initialize controllers
	ui.initialize();
});
