(function() {

	var setClicks = true;
	var setViews = true;
	var clickedEl = {};
	
	function isIntoView(elem) {
		if(!$(elem).length) return false; // element not found

		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();

		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();

		//return ((elemBottom = docViewTop));
		return ((docViewTop < elemTop) && (docViewBottom > elemBottom));
	}
	
	function loadOurAd() {
		if ($('#antiAdBlock').length > 0) $('#antiAdBlock').show();

		//Articles pages
		var product_anti_ad = $('#product_anti_ad');
		if (product_anti_ad.length > 0) {

			ajax.init('/cms/index.php?q=anti_ad/', 'x=1&type=topic_top', function(json) {
				if (json && json.success) {

					product_anti_ad.html(json.message);
					$('#product_anti_ad_bottom').html(json.message2);


					ajax.init('/cms/index.php?q=anti_ad/', 'x=1&type=topic_left&iid=' + json.iid, function(json) {
						if (json && json.success) {
							$('#show_leftpanel_books').html(json.message).show();
						}
					});

				}
			});
		}


		//Index page	
		var indexYandex = $('#yd_index');
		if (indexYandex.length) {
			if( indexYandex.height() == 0 && $('#show_books')){
				ajax.init('/cms/index.php?q=anti_ad/', 'x=1&type=index', function(json) {
					if (json && json.success) {
						$('#show_books').html(json.message).show();
					}
				});

			}
		}

		ga('send', 'event', 'adblock', 'true');

	}

	setTimeout(function() {
		if (setViews) {
			var viewsElements = {};

			$('._my_ctr').each(function (i, el) {
				viewsElements[$(el).data('id')] = {
					showed: false,
					category: $(el).data('category'),
					el: el
				};


				$(el).find('a').click(function () {

					var parent = $(this).parents('._my_ctr');
					var id = parent.data('id');
					var category = parent.data('category') ? 1 : 0;

					var key = id + '_' + category;

					if (!clickedEl[key]) {
						ajax.init('/cms/index.php?q=anti_ad/', 'c=1&id=' + id + '&category=' + category, function (json) {
							clickedEl[key] = true;
						});
					}

				});

			});


			$(window).scroll(function () {
				for (var i in viewsElements) {
					var obj = viewsElements[i];
					if (typeof obj != 'object') continue;


					if (isIntoView(obj.el)) {
						var category = obj.category ? 1 : 0;
						ajax.init('/cms/index.php?q=anti_ad/', 'v=1&id=' + i + '&category=' + category, function (json) {

						});
						delete viewsElements[i];
						continue;
					}

				}


			});

			$(window).scroll();
		}
	}, 1000);


	//Index top page
	ajax.init('/cms/index.php?q=anti_ad/', 'x=1&type=index_top', function(json) {
		if (json && json.success) {
			$('#anti_top_products').html(json.message).show();
		}
	});	
	
	
	
	

	var script = document.createElement('script');
	script.src= '//pagead2.googlesyndication.com/pagead/show_ads.js?' + Date.now();
	script.onload = function() {
		script.parentNode.removeChild(script);
	}
	script.onerror = function() {
		script.parentNode.removeChild(script);
		loadOurAd();
	}

	document.body.appendChild(script);

})();
