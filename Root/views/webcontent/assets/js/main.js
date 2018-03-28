var basicKey = 'bGliaW46bGliaW4=';
var xAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiVG9rZW5Ub0F1dGhlbnRpY2F0ZU1lZGlub3ZpdGFVc2VyIiwiaWF0IjoxNTA4MDQ0OTMwfQ.cZ3pCte1guE8KQkjd1KfY_bLJ-gOatJm2xlwyiLGAl4';
var serverName = 'https://www.medinovita.in/';
//var serverName = 'http://localhost:1337/';
var GLOBAL_VARIABLES = {
	Language: 'en',
	Currency: 'dollar'
}
var countryCodes = [];
var officeAddress = '';
var whyIndia = '';
//Global Methods
// Function replace Native Alert
// window.alert = function (msg) {
// 	var h, html, source, template;
// 	source = $('#tpl-alert').html();
// 	template = Handlebars.compile(source);
// 	html = $(template({
// 		message: new Handlebars.SafeString(msg)
// 	}));
// 	$('body').append(html);
// 	html.addClass('is-visible');
// 	h = html.find('.window-message-container').height();
// 	html.find('.window-message-container').hide().fadeIn('fast');
// 	return html.find('a').on('click', (function (_this) {
// 		return function (e) {
// 			e.stopPropagation();
// 			html.remove();
// 			return false;
// 		};
// 	}(this)));
// };
// END Function replace Native Alert
(function ($) {
	'use strict';
	$('.medinovitaHeader').load('/assets/pages/header.html', function () {
		$.ajax({
			url: serverName + 'api/v1/get/distinctdepartments/meditrip',
			type: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken

			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},
			success: function (response) {
				var display = JSON.parse(JSON.stringify(response));
				$.each(display, function (i) {
					var value = display[i].department
					var li = $('<li class="dropdown"><a onclick=window.location=' + "'/treatmentsoffered/" + value + "'" + '  class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">' + value + '</a></li>')
					$('#treatmentsOfferedUL').append(li);
				});
			},
			error: function (exception) {
				console.log(exception);
			}
		})
		$('#costPageMenu').on('click', function () {
			document.location.href = '/cost.html';
		})
		$('#contactPageMenu').on('click', function () {
			//var id = $(this).attr('id');
			//$('.contact').html('');
			//console.log("hello " + $(this).attr('href'))
			//console.log($(this).val())
			//$('.contact').load("/contact.html")

			document.location.href = '/contact.html';
		});
		$('#homeMenu').on('click', function () {
			document.location.href = '/index.html';
			//homepageCallback();
		})

		$('#medicalVisaPageMenu').on('click', function () {


			document.location.href = '/medical-visa-to-india.html';
		});

		$('#ourServicesPageMenu').on('click', function () {
			document.location.href = '/ourservices.html';
		});
		$('#holidayPageMenu').on('click', function () {
			document.location.href = '/holiday/holiday_home';
		});
		$('#hospitalsPageMenu').on('click', function () {
			document.location.href = '/hospitaldoctors.html';
		});

		//get quote
		// $('.responsiveGetQuote').on('click', function(){
		// 	var userInput = $('#getQuoteTreatment').val();
		// 	console.log('userIn ', userInput);
		// 	var modifiedUserInput = userInput.replace(/\s+/g, '-').toLowerCase();
		// 	console.log('mod ' + modifiedUserInput)
		// 	location.href = serverName + 'search/' + modifiedUserInput;

		// })

		$('#getQuoteTreatment').on('change', function () {
			var treatmentSelected = $('option:selected', this).val();
			var modifiedUserInput = treatmentSelected.replace(/\s+/g, '-').toLowerCase();
			location.href = serverName + 'search/' + modifiedUserInput;
		});

		$(".medinovitaModals").on("hidden.bs.modal", function(){
			//$(".modal-body1").html("");
			document.getElementById('submitEnquiryForm').reset();
		});

	});
	$('.medinovitaFooter').load('/assets/pages/footer.html', function () {
		$.ajax({
			url: serverName + 'api/v1/get/officelocations/meditrip',
			type: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken

			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},
			success: function (response) {
				officeAddress = response[0].country + '<br>' + response[0].officeCity[0].city + '<br>' + response[0].officeCity[0].officeLocation[0].addressLine1 + '<br>' + response[0].officeCity[0].officeLocation[0].addressLine2 + '<br>' + response[0].officeCity[0].officeLocation[0].landMark + '<br>' + response[0].officeCity[0].officeLocation[0].officeEmailId + '<br>' + response[0].officeCity[0].officeLocation[0].contactPerson;
				document.querySelector('p.office-address').innerHTML = officeAddress;
			},
			error: function (exception) {
				console.log(exception);
			}
		});

		$.ajax({
			url: serverName + 'api/v1/get/homepagedetails/meditrip',
			type: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken
			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},
			success: function (response) {

				document.querySelector('p.why-india').innerHTML = response[0].whyIndiaDesc;
				var socialMedia = document.querySelectorAll('a.social-icon');
				socialMedia[0].setAttribute('href', response[0].fburlLink);
				socialMedia[1].setAttribute('href', response[0].twitterurlLink);
				socialMedia[2].setAttribute('href', response[0].linkedlinurlLink);
				//socialMedia[3].setAttribute('href', response[0].instagramurlLink);
				document.querySelector('p.medinovitaDecs').innerHTML = response[0].whymedinovitaDesc;
				document.querySelector('p.customerCareNumber').innerHTML = response[0].whatsappCustomercareno;
				document.querySelector('p.whatsappContactNumber').innerHTML = response[0].customerCareno
			},
			error: function (exception) {
				console.log(exception);
			}
		});
	});
	$('.medinovitaModals').load('/assets/pages/modals.html', function () {

		$('#submitEnquiryForm').on('submit', function (e) {
			e.preventDefault();
			var formData = $(this).serializeArray();
			// var v = grecaptcha.getResponse();
			// if (v.length == 0) {
			// 	document.getElementById('captcha').innerHTML = "Please verify that you are not a robot";
			// 	return false;
			// }
			// else {
			// 	document.getElementById('captcha').innerHTML = "Verification completed";

			// }

		    //Added by libin for s3 file upload
			var attachmentFlag="N";
			var attachmentNames='';
			var uniqueNumber=getUniqueNumber();

			var files = $('#files').get(0).files;
			var fileSize=(files.length)
			var formFileData = new FormData();
			if (fileSize >= 5) {
				$(this).find("#uploadmsg").text("Only 5 files are allowed at a time");
				$(this).find("#files").val('')
				return  false;
			}
			if (fileSize >= 1) {
				var validExt = ".png,.jpeg,.jpg,.pdf,.doc,.docx";
				attachmentFlag="Y"
				// Append the files to the formData.
				for (var i=0; i < fileSize; i++) {
					var file = files[i];
					var filePath=file.name
					attachmentNames = attachmentNames+ filePath + ",";
					var getFileExt = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
					formFileData.append('files', file, file.name);

					// file size and extension validation
					if (file.size*0.000001>5){
						$(this).find("#files").val('')
						$(this).find("#uploadmsg").text("Please upload files having size less than 5MB");
						$(this).find("#uploadmsg").focus();
						return  false;
					}else if(validExt.indexOf(getFileExt)<0 ) {
						$(this).find("#files").val('')
						$(this).find("#uploadmsg").text("Please upload only allowed file types "+ validExt);
						$(this).find("#uploadmsg").focus();
						return  false;
					}
				}
				//give focus to submit button
				$(this).find("#filesubmit").focus();
				//upload files to aws		
				$.ajax({
					url: serverName+ 'cloud/zip/upload/'+uniqueNumber,
					data: formFileData,
					type: 'POST',
					contentType: false,
					processData: false,
					cache: false,
					async: false, //add this
					success: function(response) {
						$(this).find("#uploadmsg").text("File upload is success");			
					},
					error: function(exception) {
                        $(this).find("#uploadmsg").text("File upload is failed");
						console.log("exception -" + exception)						
					},
				});				
				$(this).find("#files").val('')
				$(this).find("#uploadmsg").css('color', 'green');
				$(this).find("#uploadmsg").text(("Files have been uploaded successfully"));
			}

			$.ajax({
				url: serverName + 'api/v1/submit/enquiry/' + uniqueNumber + '/meditrip',
				type: 'POST',
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Basic ' + basicKey,
					'x-access-token': xAccessToken
				},
				beforeSend: function (xhr) {

					xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
				},
				data: JSON.stringify({
					emailID: formData[1].value,
					userFullName: formData[0].value,
					isdCode: formData[2].value,
					primaryPhonenumber: formData[3].value,
					procedureName: formData[4].value,
					commuMedium: 'English',
					caseDescription: formData[5].value,
					attachment: attachmentFlag,
					attachmentName: uniqueNumber + ".zip"
				}),
				success: function (response) {
					$(this).find("#uploadmsg").text("");
					document.getElementById('submitEnquiryForm').reset();
					setTimeout(function () {
						$('#modal-container-SubmitEnquiry').modal('toggle');
					}, 209);

					setTimeout(function () {
						$('#messageModal').modal('show');
					}, 300);
				},
				error: function (exception) {
					console.log('exception', exception);
					$('.modalerrormessage').html('Error : ' + exception);
					// $('.modal-enquiry').css('background-color', '#ccc').html('Your enquiry is received. We will get in touch with you.');
				}
			});

		})
		$.ajax({
			url: serverName + 'api/v1/get/countrylist/meditrip',
			type: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken

			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},
			success: function (response) {
				response.result[0].countrylist.forEach(function (item, index) {
					var locObj = {};
					locObj.name = item.country;
					locObj.dial_code = item.dial_code;
					locObj.code = item.code;
					countryCodes.push(locObj)
				})
				$('#modal-container-SubmitEnquiry').on('shown.bs.modal', function () {
					$('.modal .modal-body').css('overflow-y', 'auto');
					$('.modal .modal-body').css('max-height', $(window).height() * 0.9);

				})
				countryCodes.forEach(function (value, index) {
					$('#inputSubmitEnquiryISDCode').append($('<option>', {
						value: value.dial_code,
						text: value.name + ' (' + value.dial_code + ')'
					}));
				});
			},
			error: function (exception) {
				console.log(exception);
			}
		});


		//Fetch search Treatments list
		// $.ajax({
		// 	url: serverName + 'api/v1/getTreamentlist/all/meditrip',
		// 	type: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: 'Basic ' + basicKey,
		// 		'x-access-token': xAccessToken

		// 	},
		// 	beforeSend: function (xhr) {
		// 		xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		// 	},
		// 	success: function (response) {
		// 		console.log('list: ', response)
		// 		var treatmentList = response;
		// 		//Populate Treatment Dropdown
		// 		$('#getQuoteTreatment').autocomplete({
		// 			source: treatmentList
		// 		});

		// 		var selectBox = document.getElementById('selectSubmitEnquiryProcedure');
		// 		treatmentList.forEach(function (item, index) {
		// 			var option = document.createElement('option')
		// 			option.text = item;
		// 			option.value = item.replace(/\s+/g, '-').toLowerCase();
		// 			selectBox.add(option);
		// 			//console.log(option);
		// 		});

		// 	},
		// 	error: function (exception) {
		// 		console.log(exception);
		// 	}
		// });
		//alter//
		$.ajax({
			url: serverName + 'api/v1/getTreamentlist/all/meditrip',
			type: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken

			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},
			success: function (response) {
				//console.log('list: ', response)
				var treatmentList = response;
				var selectBox = document.getElementById('selectSubmitEnquiryProcedure');
				treatmentList.forEach(function (item, index) {
					var option = document.createElement('option')
					option.text = item;
					option.value = item.replace(/\s+/g, '-').toLowerCase();
					selectBox.add(option);
					//console.log(option);
				});

				treatmentList.forEach(function (item, index) {
					$('#getQuoteTreatment').append('<option class="' + item + '"' + 'data-tokens="' + item + '">' + item + '</option>')
				})
			var elementExists = document.getElementById("getQuoteTreatment");
			if (elementExists){
				$('#getQuoteTreatment').selectpicker('render');
				$('#getQuoteTreatment').selectpicker('refresh');
         }


				//Populate Treatment Dropdown


			},
			error: function (exception) {
				console.log(exception);
			}
		});


		if (window.location.href.indexOf('index') > -1 || window.location.href == 'https://www.medinovita.in/') {
			homepageCallback();
		}
		if (window.location.href.indexOf('treatmentsOffered') > -1) {
			treatmentsOfferedCallback(getCookie('treatmentPage'));
		}
		if (window.location.href.indexOf('medical-visa-to-india') > -1) {
			medicalVisacallback();
		}
		if (window.location.href.indexOf('cost') > -1) {
			costCallback();
		}
		if (window.location.href.indexOf('SearchTreatment') > -1) {
			searchTreatmentCallback();
		}
		// hospitaldoctors**************
		if (window.location.href.indexOf('hospitaldoctors') > -1) {
			hospitalPageHtml();
			hospitalPageCallback('all', '');
		}
		// end of hospitaldoctors******************
	});
	//Hospitals and Doctors selected
	$('#hospitalsPageMenu').on('click', function () {
		$('.main').html('');
		$('.main').load('hospitalzone.html', function (data) {});
	})


	//Google Translate Section starts
	// Change font family and color
	$('iframe').contents().find('.goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *')
		.css({
			color: '#005d9c',
			'font-family': 'tahoma'
		});

	// Change hover effects
	$('iframe').contents().find('.goog-te-menu2-item div').hover(function () {
		$(this).css('background-color', '#F38256').find('span.text').css('color', 'white');
	}, function () {
		$(this).css('background-color', 'white').find('span.text').css('color', '#544F4B');
	});

	// Change Google's default blue border
	$('iframe').contents().find('.goog-te-menu2').css('border', '1px solid #F38256');

	// Change the iframe's box shadow
	$('.goog-te-menu-frame').css({
		'-moz-box-shadow': '0 3px 8px 2px #666666',
		'-webkit-box-shadow': '0 3px 8px 2px #666',
		'box-shadow': '0 3px 8px 2px #666'
	});
	$('.goog-te-combo').css({
		color: '#ffffff',
		'font-family': 'tahoma'
	})
	//Google Translate Section Ends


	//Load for Homepage

	var Simple = {
		initialised: false,
		mobile: false,
		container: $('#portfolio-item-container'),
		blogContainer: $('#blog-item-container'),
		init: function () {

			if (!this.initialised) {
				this.initialised = true;
			} else {
				return;
			}

			// Call Simple Functions
			this.pageLoadAnim();
			this.checkMobile();
			this.menuHover();
			this.mobileMenuDropdownFix();
			this.menuOnClick();
			this.stickyHeader();
			this.overlayMenuToggle();
			this.overlayMenuDropdownFix();
			this.sideMenu();
			this.sideMenuToggle();
			this.productZoom();
			this.scrollToTop();
			this.twitterFeed();
			this.flickerFeed();
			this.instagramFeed();
			this.progressBars();
			this.scrollAnimations();
			this.tooltip();
			this.popover();

			/* Call function if Owl Carousel plugin is included */
			if ($.fn.owlCarousel) {
				this.owlCarousels();
			}

			// Call after carousel to make it work without a problem
			this.countTo();

			/* Call function if noUiSlider plugin is included */
			if (typeof noUiSlider === 'object') {
				this.filterSliders();
			}

			/* Call function if Light Gallery plugin is included */
			if ($.fn.lightGallery) {
				this.lightBox();
			}

			/* Matchheight for products / shop - category pares*/
			if ($.fn.matchHeight) {
				this.matchProducts();
			}

			var self = this;
			/* Imagesloaded plugin included in isotope.pkgd.min.js */
			/* Portfolio isotope + Blog masonry with images loaded plugin */
			if (typeof imagesLoaded === 'function') {
				self.container.imagesLoaded(function () {
					self.isotopeActivate();
					// recall for plugin support
					self.isotopeFilter();
				});

				self.blogContainer.imagesLoaded(function () {
					self.blogMasonry();
				});
			}

		},
		checkMobile: function () {
			/* Mobile Detect*/
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				this.mobile = true;
			} else {
				this.mobile = false;
			}
		},
		pageLoadAnim: function () {
			// Page Loader Animation
			if ($('#page-loader').length) {
				$('#page-loader').delay(700).fadeOut(800, function () {
					$(this).remove();
				});
			}
		},
		menuHover: function () {
			if (typeof Modernizr === 'object' && Modernizr.mq('only all and (min-width: 768px)') && !Modernizr.touchevents) {
				if ($.fn.hoverIntent) {
					$('.medinovitaHeader .header').find('.navbar-nav').not('.nav-overlay').hoverIntent({
						over: function () {
							var $this = $(this);

							$this.addClass('open');
							if ($this.find('ul, div').length) {
								$this.find('.dropdown-toggle').addClass('disabled');
							}
						},
						out: function () {
							var $this = $(this);

							$this.removeClass('open');
							if ($this.hasClass('open')) {
								$this.find('.dropdown-toggle').removeClass('disabled');
							}
						},
						selector: 'li',
						timeout: 100,
						interval: 40
					});
				}
			}
		},
		mobileMenuDropdownFix: function () {
			if (typeof Modernizr === 'object' && (Modernizr.mq('only all and (max-width: 767px)') || Modernizr.touchevents)) {
				$('.navbar-nav').not('.nav-overlay').find('.dropdown-toggle').on('click', function (e) {
					var parent = $(this).closest('li');
					// close all the siblings and their children
					parent.siblings().removeClass('open').find('li').removeClass('open');
					// open which one is clicked
					parent.toggleClass('open');

					// prevent
					e.preventDefault();
					e.stopPropagation();
				});
			}
		},
		menuOnClick: function () {
			var self = this;
			// Menu on click scroll animation for onepages
			// $('.onepage-nav').find('a').on('click', function (e) {
			// 	var target = $(this).attr('href');
			// 	if (target.indexOf('#') === -1 || !$(target).length) {
			// 		return;
			// 	}

			// 	var elem = $(target),
			// 		targetPos = elem.offset().top;

			// 	$('html, body').animate({
			// 		'scrollTop': targetPos
			// 	}, 1200);
			// 	e.preventDefault();
			// });
		},
		stickyHeader: function () {
			// Sticky header - calls if sticky-header class is added to the header
			if ($('.sticky-header').length && $(window).width() >= 992) {
				var sticky = new Waypoint.Sticky({
					element: $('.sticky-header')[0],
					stuckClass: 'fixed',
					offset: -400
				});
			}
		},
		overlayMenuToggle: function () {
			// Overlay Menu Show/Hide via .nav-open class
			$('.menu-toggle').on('click', function (e) {
				$('.navbar-container').toggleClass('nav-open');
				e.preventDefault();
			});
		},
		overlayMenuDropdownFix: function () {
			// Overlay menu sub dropdown toggle fix
			$('.nav-overlay').find('.dropdown-toggle').on('click', function (e) {
				var parent = $(this).closest('li');
				// close all the siblings and their children
				parent.siblings().removeClass('open').find('li').removeClass('open');
				// open which one is clicked
				parent.toggleClass('open');

				// prevent
				e.preventDefault();
				e.stopPropagation();
			});
		},
		sideMenu: function () {
			if ($.fn.metisMenu) {
				$('.side-menu').metisMenu();
			}
		},
		sideMenuToggle: function () {
			// Overlay Menu Show/Hide via .nav-open class
			$('.sidemenu-toggle').on('click', function (e) {
				$('.header-inside').toggleClass('open');
				e.preventDefault();
			});
		},
		owlCarousels: function () {

			/* index2.html - Boxed news Carousel */
			$('.boxed-news-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 25,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 12000,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					},
					1200: {
						items: 3
					}
				}
			});

			/* Index3 - Portfolio Carousel */
			$('.portfolio-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});

			/* Index4 - Latest Posts Carousel */
			$('.latest-posts-carousel-3col.owl-carousel').owlCarousel({
				loop: false,
				margin: 30,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					}
				}
			});

			/* Index5 - Portfolio Carousel */
			$('.portfolio-fullwidth-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 0,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					},
					1280: {
						items: 5
					},
					1600: {
						items: 6
					},
					1920: {
						items: 7
					}
				}
			});

			/* Index6 - Latest PostsCarousel */
			$('.latest-posts-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 30,
				responsiveClass: true,
				nav: true,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});

			/* Index7 - Team Carousel */
			$('.team-carousel-sm.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 3
					}
				}
			});

			/* Index7 - Latest Carousel */
			$('.latest-news-carousel-sm.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 3
					}
				}
			});

			/* Index8 - Portfolio 2col Carousel */
			$('.portfolio-2col-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 0,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					},
					1600: {
						items: 5
					},
					1900: {
						items: 6
					}
				}
			});

			/* Index9 - Clients/Partners Carousel 3col */
			$('.clients-carousel-3col.owl-carousel').owlCarousel({
				loop: true,
				margin: 10,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					280: {
						items: 2
					},
					480: {
						items: 3
					},
					768: {
						items: 2
					},
					992: {
						items: 3
					}
				}
			});

			/* Index9 - Latest news list carousel */
			$('.latest-news-list-carousel.owl-carousel').owlCarousel({
				loop: true,
				margin: 30,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 18000,
				responsive: {
					0: {
						items: 1
					},
					992: {
						items: 2
					}
				}
			});

			/* Index9 - Portfolio 2row carousel */
			$('.portfolio-2row-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 30,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					480: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});

			/* Index-agency5 - Latest Post Carousel */
			$('.latest-posts-carousel-4col.owl-carousel').owlCarousel({
				loop: false,
				margin: 30,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					480: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});

			/* Index-creative3 - Latest Projects Carousel */
			$('.vertical-portfolio-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 0,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					480: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					},
					1440: {
						items: 5
					},
					1800: {
						items: 6
					}
				}
			});

			/* Index-creative3 - Our Team Carousel */
			$('.vertical-team-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					480: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					},
					1440: {
						items: 5
					},
					1800: {
						items: 6
					}
				}
			});

			/* Index-creative3 - Our Blog Carousel */
			$('.vertical-posts-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					480: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					},
					1440: {
						items: 5
					},
					1800: {
						items: 6
					}
				}
			});

			/* index-Blog.html -  Featured Entry Carousel */
			$('.featured-entry-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 0,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 12000,
				responsive: {
					0: {
						items: 1
					},
					480: {
						items: 2
					},
					768: {
						items: 3
					},
					1200: {
						items: 4
					}
				}
			});


			/* Index-dentist - Testimonials Carousel */
			$('.testimonials-carousel-dots.owl-carousel').owlCarousel({
				loop: true,
				margin: 30,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					}
				}
			});

			/* Index-veterinary - Testimonials Carousel */
			$('.testimonials-slider-dots.owl-carousel').owlCarousel({
				loop: true,
				margin: 0,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				items: 1
			});

			/* index-shop.html -  Top Products Carousel */
			$('.top-products-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 12000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					1200: {
						items: 4
					}
				}
			});

			/* index-shop.html -  Banner Slider Widget */
			$('.owl-carousel.banner-widget-slider').owlCarousel({
				loop: true,
				items: 1,
				margin: 0,
				responsiveClass: true,
				nav: false,
				dots: true,
				autoplay: true,
				autoplayTimeout: 18000
			});

			/* index-shop.html -  Latest News Carousel */
			$('.latest-news-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					1200: {
						items: 4
					}
				}
			});

			/* index-shop2.html -  Top Products Carousel 5col */
			$('.top-products-carousel-5col.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 12000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					},
					1200: {
						items: 5
					}
				}
			});

			/* index-shop2.html -  Latest News Carousel 5col */
			$('.latest-news-carousel-5col.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					},
					1200: {
						items: 5
					}
				}
			});

			/* index-shop3.html -  Trending Products Carousel */
			$('.trending-products-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 30,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});

			/* Index-gym2 - Latest Post 4col Carousel */
			$('.latest-posts-4col-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 30,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					480: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});

			/* Product.html -  Product carousel to zoom product section */
			$('.owl-carousel.product-gallery').owlCarousel({
				loop: false,
				margin: 3,
				responsiveClass: true,
				nav: false,
				dots: false,
				autoplay: true,
				autoplayTimeout: 10000,
				responsive: {
					0: {
						items: 4
					},
					480: {
						items: 6
					},
					768: {
						items: 6
					},
					992: {
						items: 5
					},
					1200: {
						items: 6
					}
				}
			});

			/* Similiar Carousel - compare.html - product.html  */
			$('.similiar-products-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 18000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					},
					1200: {
						items: 5
					}
				}
			});

			/* Testimonials Slider */
			$('.testimonials-slider.owl-carousel').owlCarousel({
				items: 1,
				loop: true,
				margin: 0,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000
			});

			/* Clients/Partners Carousel */
			$('.clients-carousel.owl-carousel').owlCarousel({
				loop: true,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 2,
						margin: 10
					},
					420: {
						items: 3,
						margin: 10
					},
					768: {
						items: 4,
						margin: 15
					},
					992: {
						items: 5
					}
				}
			});

			/* Team Carousel */
			$('.team-carousel.owl-carousel').owlCarousel({
				loop: true,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});

			/* Testimonials Carousel */
			$('.testimonials-carousel.owl-carousel').owlCarousel({
				loop: true,
				margin: 30,
				responsiveClass: true,
				nav: true,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					}
				}
			});

			/* About Slider */
			$('.about-slider.owl-carousel').owlCarousel({
				items: 1,
				loop: true,
				margin: 0,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 12000
			});

			/* Portfolio Post - Portfolio Slider */
			$('.portfolio-post-slider.owl-carousel').owlCarousel({
				loop: true,
				items: 1,
				margin: 0,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 12000,
				animateOut: 'fadeOut'
			});

			/* Portfolio Post - Related carousel */
			$('.portfolio-related-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 18000,
				responsive: {
					0: {
						items: 1
					},
					420: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});

			/* Blog Post - Related carousel */
			$('.blog-related-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 20,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 18000,
				responsive: {
					0: {
						items: 1
					},
					600: {
						items: 2
					}
				}
			});


		},
		tooltip: function () {
			// Bootstrap Tooltip
			if ($.fn.tooltip) {
				$('[data-toggle="tooltip"]').tooltip();
			}
		},
		popover: function () {
			// Bootstrap Popover
			if ($.fn.popover) {
				$('[data-toggle="popover"]').popover({
					trigger: 'focus'
				});
			}
		},
		scrollBtnAppear: function () {
			if ($(window).scrollTop() >= 400) {
				$('#scroll-top').addClass('fixed');
			} else {
				$('#scroll-top').removeClass('fixed');
			}
		},
		scrollToTop: function () {
			$('#scroll-top').on('click', function (e) {
				$('html, body').animate({
					scrollTop: 0
				}, 1200);
				e.preventDefault();
			});
		},
		lightBox: function () {
			/* Lightbox for portfolio items and videso and etc.. */
			$('.popup-gallery').lightGallery({
				selector: '.zoom-btn',
				thumbnail: true,
				exThumbImage: 'data-thumb',
				thumbWidth: 50,
				thumbContHeight: 60
			});

			// Lightbox for video with button - see: index-agency
			$('.video-btn-section').lightGallery({
				selector: '.trigger-video-btn',
				thumbnail: false
			});
		},
		productZoom: function () {
			var self = this;
			// Product page zoom plugin settings
			if ($.fn.elevateZoom) {
				$('#product-zoom').elevateZoom({
					responsive: true,
					zoomType: 'inner', // lens or window can be used - options already set below
					borderColour: '#e1e1e1',
					zoomWindowPosition: 1,
					zoomWindowOffetx: 30,
					cursor: 'crosshair', //
					zoomWindowFadeIn: 400,
					zoomWindowFadeOut: 250,
					lensBorderSize: 3, // lens border size
					lensOpacity: 1,
					lensColour: 'rgba(255, 255, 255, 0.5)', // lens color
					lensShape: 'square', // circle lens shape can be uses
					lensSize: 200,
					scrollZoom: true
				});

				/* swap images for zoom on click event */
				$('.product-gallery').find('a').on('click', function (e) {
					var ez = $('#product-zoom').data('elevateZoom'),
						smallImg = $(this).data('image'),
						bigImg = $(this).data('zoom-image');

					ez.swaptheimage(smallImg, bigImg);
					e.preventDefault();
				});
			}
		},
		progressBars: function () {
			var self = this;
			// Calculate and Animate Progress
			$('.progress-animate').waypoint(function (direction) {
				var $this = $(this.element),
					progressVal = $this.data('width');

				$this.css({
					width: progressVal + '%'
				}, 400);
			}, {
				offset: '90%',
				triggerOnce: true
			});
		},
		countTo: function () {
			// CountTo plugin used count animations for homepages
			if ($.fn.countTo) {
				if ($.fn.waypoint) {
					$('.count').waypoint(function () {
						$(this.element).countTo();
					}, {
						offset: '90%',
						triggerOnce: true
					});
				} else {
					$('.count').countTo();
				}
			} else {
				// fallback if count plugin doesn't included
				// Get the data-to value and add it to element
				$('.count').each(function () {
					var $this = $(this),
						countValue = $this.data('to');
					$this.text(countValue);
				});
			}
		},
		scrollAnimations: function () {
			/* Wowy Plugin */
			if (typeof WOW === 'function') {
				new WOW({
					boxClass: 'wow', // default
					animateClass: 'animated', // default
					offset: 0 // default
				}).init();
			}
		},
		twitterFeed: function () {
			/* Twitter feed for user*/
			if ($.fn.tweet && $('.twitter-feed-widget').length) {
				$('.twitter-feed-widget').tweet({
					modpath: '/assets/js/twitter/',
					avatar_size: '',
					count: 2,
					query: 'wrapbootstrap', // change query with username if you want to display search results
					loading_text: 'searching twitter...',
					join_text: '',
					retweets: false,
					template: '<div class="twitter-icon"><i class="fa fa-twitter"></i></div><div class="tweet-content">{text}{time}</div>'
					/* etc... */
				});
			}
		},
		flickerFeed: function () {
			/* Flickr feed plugin  */
			// credits https://www.flickr.com/photos/smanography/
			if ($.fn.jflickrfeed) {
				$('.flickr-widget-list').jflickrfeed({
					limit: 12,
					qstrings: {
						id: '56502208@N00' // change with you flickr id
					},
					itemTemplate: '<li>' + '<a href="{{image}}" target="_blank" title="{{title}}">' + '<img src="{{image_s}}" alt="{{title}}" />' + '</a>' + '</li>'
				});
			}
		},
		instagramFeed: function () {
			// Instagram Feed
			if ($.fn.spectragram && $('#instafeed').length) {

				jQuery.fn.spectragram.accessData = {
					accessToken: '2229187323.566f1cf.c41eaca370664379b822dc3b17bb1464',
					clientID: '7c28e44736494357ba3df343b1c699fe'
				};

				jQuery('#instafeed').spectragram('getUserFeed', {
					query: 'pizza',
					max: 13,
					size: 'medium',
					wrapEachWith: '',
					complete: function () {

						$('#instafeed.owl-carousel').owlCarousel({
							loop: true,
							margin: 0,
							responsiveClass: true,
							nav: false,
							dots: false,
							autoplay: true,
							autoplayTimeout: 15000,
							smartSpeed: 800,
							responsive: {
								0: {
									items: 3
								},
								480: {
									items: 4
								},
								768: {
									items: 6
								},
								992: {
									items: 7
								},
								1200: {
									items: 9
								},
								1500: {
									items: 10
								},
								1900: {
									items: 12
								}
							}
						});
					}
				});
			}
		},
		filterSliders: function () {
			// Slider For category pages / filter price
			var priceSlider = document.getElementById('price-slider');

			// Check if #price-slider elem is exists if not return
			// to prevent error logs
			if (priceSlider == null) return;

			noUiSlider.create(priceSlider, {
				start: [100, 900],
				connect: true,
				step: 50,
				range: {
					min: 0,
					max: 1000
				}
			});

			this.sliderText(priceSlider, '$');
		},
		sliderText: function (slider, currency) {
			// add slider values as a text
			// check for currency too
			var currencyVar = (currency) ? '$' : null,
				divHandles = slider.getElementsByClassName('noUi-handle'),
				divs = [];

			// Add divs to the slider handles.
			for (var i = 0; i < divHandles.length; i++) {
				divs[i] = document.createElement('div');
				divHandles[i].appendChild(divs[i]);
			}

			// When the slider changes, write the value to the tooltips.
			slider.noUiSlider.on('update', function (values, handle) {
				divs[handle].innerHTML = (currencyVar) ? (currencyVar + values[handle]) : Math.round(values[handle]);
			});
		},
		isotopeActivate: function () {
			// Trigger for isotope plugin
			if ($.fn.isotope) {
				var container = this.container,
					layoutMode = container.data('layoutmode');

				container.isotope({
					itemSelector: '.portfolio-item',
					layoutMode: (layoutMode) ? layoutMode : 'masonry'
				});
			}
		},
		isotopeReinit: function () {
			// Recall for isotope plugin
			if ($.fn.isotope) {
				this.container.isotope('destroy');
				this.isotopeActivate();
			}
		},
		isotopeFilter: function () {
			// Isotope plugin filter handle
			var self = this,
				filtersContainer = $('#portfolio-filter, #nav-portfolio-filter');

			filtersContainer.find('a').on('click', function (e) {
				var $this = $(this),
					selector = $this.attr('data-filter');

				filtersContainer.find('.active').removeClass('active');

				// And filter now
				self.container.isotope({
					filter: selector,
					transitionDuration: '0.8s'
				});

				$this.closest('li').addClass('active');
				e.preventDefault();
			});
		},
		blogMasonry: function () {
			// Trigger for isotope plugin
			if ($.fn.isotope) {
				var blogContainer = this.blogContainer;

				blogContainer.isotope({
					itemSelector: '.entry-grid',
					layoutMode: 'masonry'
				});
			}
		},
		matchProducts: function () {
			// Match all products (Category - Shop Pages)
			$('.products-container').each(function () {
				$(this).find('.product').matchHeight();
			});
		}
	};

	//Ready Event
	jQuery(document).ready(function () {
		// Init our app
		Simple.init();
		//	$('.selectpicker').selectpicker();
	});

	// Load Event
	$(window).on('load', function () {
		Simple.scrollBtnAppear();
	});

	// Scroll Event
	$(window).on('scroll', function () {
		Simple.scrollBtnAppear();
	});



	//Login Page

	//contact page

	$('#contact-form').submit(function (event) {
		event.preventDefault();
		var contactname = $('#contactname').val();
		var contactemail = $('#contactemail').val();
		var contactsubject = $('#contactsubject').val();
		var contactmessage = $('#contactmessage').val();
		var contactsubmit = $('#sendMessage').val();

		$.ajax({
			type: 'post',
			url: serverName + 'api/v1/post/contactus/meditrip',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken

			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},

			data: JSON.stringify({
				emailID: contactemail,
				userFullName: contactname,
				subject: contactsubject,
				message: contactmessage,
			}),
			success: function (response) {
				// alert("Thanks for contacting us, we will get back to you soon")
				// $('.form-message').append("<span ><strong> Thanks for contacting us, we will get back to you soon</strong></span>");
				// $('#contactname, #contactemail, #contactsubject, #contactmessage').val("");


				$('.officeAdd').hide();
				$('.toHide').slideUp(400, function () {
					$('.form-message').append('<span>Thank you for contacting us, we will get back to you as soon as possible!</span>');
				});


				//$('#toHide').hide();
				// $('.form-message').append("<span ><strong> Thanks for contacting us, we will get back to you soon</strong></span>");
				//$('#toShow').html(response);

			},
			error: function (exception) {
				console.log(exception)
			}
		});
		return false;

	});


})(jQuery);


// (function (i, s, o, g, r, a, m) {
// 	i['GoogleAnalyticsObject'] = r;
// 	i[r] = i[r] || function () {
// 		(i[r].q = i[r].q || []).push(arguments)
// 	}, i[r].l = 1 * new Date();
// 	a = s.createElement(o),
// 		m = s.getElementsByTagName(o)[0];
// 	a.async = 1;
// 	a.src = g;
// 	m.parentNode.insertBefore(a, m)
// })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

// ga('create', 'UA-57177726-9', 'auto');
// ga('send', 'pageview');


//Common Functions
//homepage functions


//Callbacks

//HomePage Load callback
function homepageCallback() {
	//Homepage Variables
	var treatmentList = '';

	var featuredTreatmentsItems = [{
			img: '/assets/images/blocks/index-medical/item2.jpg',
			svgImg: '/assets/images/services/index-medical/stethoscope.svg',
			altText: 'Stethoscope',
			shortContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.',
			title: 'Nursing'
		},
		{
			img: '/assets/images/blocks/index-medical/item1.jpg',
			svgImg: '/assets/images/services/index-medical/microscope.svg',
			altText: 'Microscope',
			shortContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.',
			title: 'Laboratory'
		},
		{
			img: '/assets/images/blocks/index-medical/item1.jpg',
			svgImg: '/assets/images/services/index-medical/microscope.svg',
			altText: 'Microscope',
			shortContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.',
			title: 'Laboratory'
		},
		{
			img: '/assets/images/blocks/index-medical/item1.jpg',
			svgImg: '/assets/images/services/index-medical/microscope.svg',
			altText: 'Microscope',
			shortContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.',
			title: 'Laboratory'
		},
		{
			img: '/assets/images/blocks/index-medical/item1.jpg',
			svgImg: '/assets/images/services/index-medical/microscope.svg',
			altText: 'Microscope',
			shortContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.',
			title: 'Laboratory'
		},
		{
			img: '/assets/images/blocks/index-medical/item1.jpg',
			svgImg: '/assets/images/services/index-medical/microscope.svg',
			altText: 'Microscope',
			shortContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.',
			title: 'Laboratory'
		}
	]
	var latestNewsItems = [

		{
			newsId: '1',

			imgPath: '/assets/images/blog/index-medical/post1.jpg',

			postedDate: '17 Jan, 2016',

			postedBy: 'Admin',

			postHeading: 'Lorem ipsum dolor sit ametli elits.',

			postShortContent: 'Molestiae neque doloremque, voluptatum nostrum praesentium esse fugiat sus siel. Deserunt praesentium archite.',


		},

		{
			newsId: '2',

			imgPath: '/assets/images/blog/index-medical/post2.jpg',

			postedDate: '17 Jan, 2016',

			postedBy: 'Admin',

			postHeading: 'Lorem ipsum dolor sit ametli elits.',

			postShortContent: 'Molestiae neque doloremque, voluptatum nostrum praesentium esse fugiat sus siel. Deserunt praesentium archite.',

		},

		{
			newsId: '2',

			imgPath: '/assets/images/blog/index-medical/post3.jpg',

			postedDate: '17 Jan, 2016',

			postedBy: 'Admin',

			postHeading: 'Lorem ipsum dolor sit ametli elits.',

			postShortContent: 'Molestiae neque doloremque, voluptatum nostrum praesentium esse fugiat sus siel. Deserunt praesentium archite.',

		}

	];
	var homePageHighLightsItems = [{
			imgSrc: '/assets/images/services/index-medical/first-aid-kit.svg',
			altText: 'Emergency',
			title: 'Emergency',
			content: 'Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem.'
		},
		{
			imgSrc: '/assets/images/services/index-medical/first-aid-kit.svg',
			altText: 'Emergency',
			title: 'Emergency',
			content: 'Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem.'
		},
		{
			imgSrc: '/assets/images/services/index-medical/first-aid-kit.svg',
			altText: 'Emergency',
			title: 'Emergency',
			content: 'Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem.'
		}, {
			imgSrc: '/assets/images/services/index-medical/first-aid-kit.svg',
			altText: 'Emergency',
			title: 'Emergency',
			content: 'Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem.'
		}, {
			imgSrc: '/assets/images/services/index-medical/first-aid-kit.svg',
			altText: 'Emergency',
			title: 'Emergency',
			content: 'Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem.'
		}, {
			imgSrc: '/assets/images/services/index-medical/first-aid-kit.svg',
			altText: 'Emergency',
			title: 'Emergency',
			content: 'Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem.'
		}, {
			imgSrc: '/assets/images/services/index-medical/first-aid-kit.svg',
			altText: 'Emergency',
			title: 'Emergency',
			content: 'Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem.'
		}, {
			imgSrc: '/assets/images/services/index-medical/first-aid-kit.svg',
			altText: 'Emergency',
			title: 'Emergency',
			content: 'Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem.'
		}
	]


	$.ajax({
		url: serverName + 'api/v1/gethighlighttreatments/meditrip?limit=8',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},
		success: function (response) {
			var homePageHighLightsItems = response;
			var a = document.getElementsByClassName('service-box')
			$.each(a, function (index, element) {
				$(element).find('h3').html(homePageHighLightsItems[index].title);
				$(element).find('p').html(homePageHighLightsItems[index].content);
				$(element).find('img').attr('src', homePageHighLightsItems[index].imgSrc);
			});

		},
		error: function (exception) {
			console.log(exception);
		}
	});

	$.ajax({
		url: serverName + 'api/v1/get/newssection/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},
		success: function (response) {
			var latestNewsItems = response
			//Loading Latest news items
			var latestNewsHtmlString = '';

			latestNewsItems.forEach(function (item, index) {
				//console.log(item.newsId)

				latestNewsHtmlString += ' <article data-id="' + item.newsId + '" class="entry entry-grid"><div class="entry-media"><figure><a href="news/' + item.newsId + '/"><img src="' + item.imgPath + '" alt="Post image"></a></figure><div class="entry-meta"><span><i class="fa fa-calendar"></i>' + item.postedDate + '</span><a href="#"><i class="fa fa-user"></i> ' +
					item.postedBy + '</a></div></div><h2 class="entry-title"><i class="fa fa-newspaper-o"></i><a href="news/' + item.newsId + '/">' +
					item.postHeading + '</a></h2><div class="entry-content"><p>' +
					item.postShortContent + '</p></div></article>';

			});
			$('#latestNewsCarousel').html(latestNewsHtmlString);
			/* Index-medical - Latest Post Medical Carousel */
			$('.latest-posts-medical-carousel.owl-carousel').owlCarousel({
				loop: false,
				margin: 30,
				responsiveClass: true,
				nav: false,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: true,
				autoplay: true,
				autoplayTimeout: 15000,
				responsive: {
					0: {
						items: 1
					},
					480: {
						items: 2
					},
					768: {
						items: 3
					},
					992: {
						items: 4
					}
				}
			});
		},
		error: function (exception) {
			console.log(exception);
		}
	});

	$.ajax({
		url: serverName + 'api/v1/getaboutMedical/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},
		success: function (response) {
			var aboutData = response;
			$('#aboutSubtitle').text(aboutData.aboutSubTitle);
			$('#aboutContent').html($.parseHTML(aboutData.aboutContent))
		},
		error: function (exception) {
			console.log(exception);
		}
	});

	//Get Featured Treatment
	$.ajax({
		url: serverName + 'api/v1/getFeaturedtreatments/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		success: function (response) {

			var featuredTreatmentsHtmlStringOne = '';
			var featuredTreatmentsHtmlStringTwo = '';
			response.forEach(function (item, index) {
				if (index <= 2) {
					featuredTreatmentsHtmlStringOne += ' <div class="col-sm-4"><div class="text-block hover-bg text-center" style="background-image:url(' + item.img + ')"><h3 class="block-title"><a href="#">' + item.title + '</a></h3><p>' + item.shortContent + '</p><div class="index' + index + '"><a href=' + item.pagePath + ' class="readmore custom2">ReadMore <i class="fa fa-angle-right"></i></a></div></div></div>'
				} else if (index > 2) {
					featuredTreatmentsHtmlStringTwo += ' <div class="col-sm-4"><div class="text-block hover-bg text-center" style="background-image:url(' + item.img + ')"><h3 class="block-title"><a href="#">' + item.title + '</a></h3><p>' + item.shortContent + '</p><div class="index' + index + '"><a href=' + item.pagePath + ' class="readmore custom2">ReadMore <i class="fa fa-angle-right"></i></a></div></div></div>'
				}

			});
			$('#featuredTreatmentsSection1').html(featuredTreatmentsHtmlStringOne);
			$('#featuredTreatmentsSection2').html(featuredTreatmentsHtmlStringTwo);
		},
		error: function (exception) {
			console.log(exception);
		}
	});

	//Homepage Carousel initialization
	$('#homepageCarousel').carousel({
		interval: 3500,
		cycle: true
	});


	//Populate latest news modal
	$(document).on('click', '.latestNewsReadmore', function () {
		//debugger;
		var newsID = $(this).data('id');
		$('#modal-container-LatestNews #myModalLabel').text(newsID);
		$('#modal-container-LatestNews .modal-body').text('Modal Content');
	});


	//Country Dropdown
	var availableCountries = [{
			text: 'India',
			value: 'India'
		}

	];

	// var optionList = document.getElementById('getQuoteCountry').options;
	// availableCountries.forEach( function(option,index)
	// {
	// 	optionList.add( new Option(option.text, option.value ) )
	// });

	// $('.responsiveGetQuote').on('click',function(){
	// 	document.location.href="/SearchTreatment.html";
	// 	setCookie("Search-Treatment",$('#getQuoteTreatment').val(),1)
	// });

}

//Cost page callback


function costCallback(data) {


	$.ajax({
		url: serverName + 'api/v1/get/distinctprocedurenames/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},
		success: function (response) {
			response[0].treatmentNames.forEach(function (item, index) {
				//$('#treatmentCostDropdown').append("<li><a href = '#'>"+item["procedureName"]+"</a></li>")

				var selectOption = $('<option>' + item.procedureName + '</option>')
				$('.treatment-select #costSelectTreatment').append(selectOption);

				// $('.treatment-select #costSelectTreatment').append('<option class= costtreatmentselect data-tokens="'+ item["procedureName"]+'">' + item["procedureName"] +'</option>')
			})
			$('#costSelectTreatment').selectpicker('render');
			$('#costSelectTreatment').selectpicker('refresh');

		},
		error: function (exception) {
			console.log(exception);
		}
	})

	$.ajax({
		url: serverName + 'api/v1/get/evisacountries/all/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		success: function (response) {
			// console.log("visa-response: "+ response);
			var countryArr = [];
			response.forEach(function (item) {
				countryArr.push({
					country: item.country,
					fee: item.fee
				});
				// console.log("my country " + item.country)
			})
			//console.log("countryArr-response: "+ countryArr[1].country);

			countryArr.forEach(function (item) {

				var selectOption = $('<option>' + item.country + '</option>')
				$('.treatment-select #costcountry').append(selectOption);

				// $('.treatment-select #costcountry').append('<option class="costcountry" data-tokens="'+ item.country+'">' + item.country +'</option>')

			})
			$('#costcountry').selectpicker('render');
			$('#costcountry').selectpicker('refresh');

		},
		error: function (exception) {
			console.log(exception);
		}
	});


	$.ajax({
		url: serverName + 'api/get/holidayPackage/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},
		success: function (response) {
			response.result.forEach(function (item, index) {

				var selectOption = $('<option>' + item.packageShortName + '</option>')
				$('.treatment-select #holidayPackageDropdown').append(selectOption);


				// $('.treatment-select #holidayPackageDropdown').append('<option class="costholidaypackage" data-tokens="'+ item["packageShortName"]+'">' + item["packageShortName"] +'</option>')
			})
			$('#holidayPackageDropdown').selectpicker('render');
			$('#holidayPackageDropdown').selectpicker('refresh');
			// 	$("#treatmentCostDropdown li a").on('click',function(){
			// 		// remove previously added selectedLi
			// 		$('.selectedLi').removeClass('selectedLi');
			// 		// add class `selectedLi`
			// 		$(this).addClass('selectedLi');
			// 		var selText = $(this).text();///User selected value...****
			// 		$(this).parent().parent().prev().html(selText+' <span class="caret"></span>');

			//   });

			//   $("#bystanderDropdown li a").click(function(){
			// 	// remove previously added selectedLi
			// 	$('.selectedBystanderLi').removeClass('selectedBystanderLi');
			// 	// add class `selectedLi`
			// 	$(this).addClass('selectedBystanderLi');
			// 	var selText = $(this).text();
			// 	$(this).parent().parent().prev().html(selText+' <span class="caret"></span>');


			// });
			// $("#holidayPackageDropdown li a").on('click',function(){
			// 	// remove previously added selectedLi
			// 	$('.selectedpackageLi').removeClass('selectedpackageLi');
			// 	// add class `selectedLi`
			// 	$(this).addClass('selectedpackageLi');
			// 	var selText = $(this).text();
			// 	$(this).parent().parent().prev().html(selText+' <span class="caret"></span>');

			// });

		},
		error: function (exception) {
			console.log(exception);
		}
	})

	$('.top-doctors-carousel.owl-carousel').owlCarousel({
		loop: false,
		margin: 30,
		responsiveClass: true,
		nav: true,
		navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
		dots: false,
		autoplay: true,
		autoplayTimeout: 150000,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 2
			},
			992: {
				items: 2
			}
		}
	});

	$('.top-hospitals-carousel.owl-carousel').owlCarousel({
		loop: false,
		margin: 30,
		responsiveClass: true,
		nav: true,
		navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
		dots: false,
		autoplay: true,
		autoplayTimeout: 150000,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 2
			},
			992: {
				items: 2
			}
		}
	});


	$('#getCostDetails').on('click', function (e) {
		var procedurName = $('#costSelectTreatment').val();

		var bystandercount = $('#bystanderDropdown').val();

		var holidayPackage = $('#holidayPackageDropdown').val();

		var countryName = $('#costcountry').val();


		$.ajax({
			url: serverName + 'api/v1/get/cost/meditrip?procedurename=' + procedurName + '&bystandercount=' + bystandercount + '&holidaypackage=' + holidayPackage + '&hotelrate=3 star&vehicletype=sedan&countryName=' + countryName,
			type: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken

			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},
			success: function (response) {
				console.log(response);
				$('#costTemplateDiv').html(response);
			},
			error: function (exception) {
				console.log(exception);
			}
		})
		e.preventDefault();
	});
}


//treatmentsOfferedCallback
function treatmentsOfferedCallback(id) {
	var treatmentCategory = '';
	switch (id) {
		case 'cardiacTreatmentMenu':
			treatmentCategory = 'Cardiac';
			break;
		case 'ayurvedaTreatmentMenu':
			treatmentCategory = 'Ayurveda';
			break;
		case 'dentalTreatmentMenu':
			treatmentCategory = 'Dental';
			break;
		default:
			treatmentCategory = 'Cardiac';
			break;
	}

	$.ajax({
		url: serverName + 'api/v1/get/treatmentdescription/nocost/meditrip?department=' + treatmentCategory,
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},
		success: function (response) {

			$('.treatmentDecsription h1').html(response[0].department);
			$('.treatmentDecsription p').html(response[0].departmentDescription);
			var htmlString = '<h2 style="margin-top: 20px">Available Procedures</h2>';
			console.log(JSON.stringify(response, null, '\t'))
			response.forEach(function (item, index) {

				var treatmentArray = item.treatmentList;

				treatmentArray.forEach(function (treatmentItem, treatmentIndex) {
					var displayName = treatmentItem.displayName;
					var treatmentDescription = treatmentItem.treatmentDescription;
					var procedureImagepath = treatmentItem.procedureImagepath.replace(/\//g, '\/');
					htmlString += '<div class="blog-card"><div class="photo photo1" style="background: url(' + procedureImagepath + ') center no-repeat;"></div><ul class="details"><li class="author"><a href="#">' + treatmentItem.procedureName + '</a></li><li class="date"> Heal Time: ' + treatmentItem.healingTimeInDays + '</li><li class="date"> Surgical Time: ' + treatmentItem.surgicalTime + '</li><li class="date"> Estimate Cost: ' + treatmentItem.procedureCost + '</li></ul><div class="description"><h1>' + displayName + '</h1><h2>' + displayName + '</h2><p class="summary">' + treatmentDescription + '</p><a href="/procedure/Bone Grafting">Read More</a></div></div>'
					//htmlString+='<div class="treatments-hover" style="min-height:100px;padding:20px;width:90%;overflow:auto;border-radius: 7px;position:relative;margin-bottom: 20px;background-color:#eff6ef;border-bottom: 1px solid #DAD8D8;border-right: 0.2px solid #DAD8D8;"><div class="one-third" style="width:120px"><img src="'+procedureImagepath +'" height="100" width="140" style="display:inline-block"/></div><div class="three-fourths last-col" style="line-height: 1em;background-color: #eff6ef"> <p>'+displayName+'</p> <p><u>Hospital Stay:</u> '+treatmentItem.minHospitalization+'-'+treatmentItem.maxHospitalization+' days</p>     <p><u>Healing Time:</u> '+treatmentItem.healingTimeInDays+' days</p>     <p>Description of Procedure:</br>'+treatmentDescription+'</p></div>   <a href="#" style="float:right">more details</a></div>'

				});
			});
			document.getElementById('availableProceduresDiv').innerHTML = htmlString;

		},
		error: function (exception) {
			console.log(exception);
		}
	});

	///api/v1/searchHospitaldetails/Dental/searchHospital
	//contactPageCallBack(data);


}

//Search Treatment Callback
function searchTreatmentCallback() {
	var treatmentName = getCookie('Search-Treatment');
	$.ajax({
		url: serverName + 'api/v1/searchHospitaldetails/' + treatmentName + '/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		success: function (response) {
			var htmlString = '';
			response.forEach(function (item, index) {
				htmlString += '<div class="card-media"><div class="card-media-object-container"><div class="card-media-object" style="background-image: url(' + item.hospitalimage + ');"></div><span class="card-media-object-tag subtle">Trusted</span><ul class="card-media-object-social-list"></ul></div><div class="card-media-body"><div class="card-media-body-top"><span class="" style="font-size:20px;color:blue">' + item.hospitalName + '</span><button class="btn btn-success pull-right" onclick="openSubmitEnquiry()">Contact Us</button><div class="card-media-body-top-icons u-float-right"></div></div><span class="card-media-body-heading">' +
					item.hospitalContact.country + ', ' + item.hospitalContact.addressLine1 + ', ' + item.hospitalContact.City + ', ' + item.hospitalContact.PostalCode + '<br>' + item.hospitalContact.website + '</span><div class="card-media-body-supporting-bottom"><span class="card-media-body-supporting-bottom-text subtle">NABL: ' + item.Accreditation.NABL + ', NABH: ' + item.Accreditation.NABH + ', JCI: ' + item.Accreditation.JCI + '</span><span class="card-media-body-supporting-bottom-text subtle u-float-right"></span></div><div class="card-media-body-supporting-bottom card-media-body-supporting-bottom-reveal"><span class="card-media-body-supporting-bottom-text subtle">' + item.Treatment[0].name + '</span><a href="#/" class="card-media-body-supporting-bottom-text card-media-link u-float-right">More Details</a></div></div></div>';
			});
			$('#seearchTreatmentPageContainer').append(htmlString);

		},
		error: function (exception) {
			console.log(exception);
		}
	});
}


function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function medicalVisacallback() {

	$.ajax({
		url: serverName + 'api/v1/get/evisacountries/all/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		success: function (response) {
			// console.log("visa-response: "+ response);
			var countryArr = [];
			response.forEach(function (item) {
				countryArr.push({
					country: item.country,
					fee: item.fee
				});
				// console.log("my country " + item.country)
			})
			//console.log("countryArr-response: "+ countryArr[1].country);

			countryArr.forEach(function (item) {
				$('.select-country #countryfeeslist').append('<option class="' + item.fee + '"' + 'data-tokens="' + item.country + '">' + item.country + '</option>')
			})
			$('#countryfeeslist').selectpicker('render');
			$('#countryfeeslist').selectpicker('refresh');
		},
		error: function (exception) {
			console.log(exception);
		}
	});
	$('.selectpicker').on('change', function () {
		$('table#t01 tr').hide();
		var countrySelected = $('option:selected', this).val();

		var countryFee = $('option:selected', this).attr('class');

		$('table#t01 tr th').removeClass('no-show');


		$('table#t01 tbody').append('<tr><th >Country</th><th>Fees (USD)<br><div style="font-size:0.9rem;">2.5% additional charge on bank transactions</div></th></tr>' + '<tr class="new-row"><td>' + countrySelected + '</td><td>' + countryFee + '</td></tr>');

	});
}

function getCookie(cname) {
	var name = cname + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}


//1hospitalPageCallback
function hospitalPageHtml() {
	$.ajax({
		url: serverName + 'api/v1/getTreamentlist/all/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},
		success: function (response) {
			var treatmentList = response;
			//Populate Treatment Dropdown
			//console.log('treatment :' + response)
			treatmentList.forEach(function (item) {
				var selectOption = $('<option>' + item + '</option>')
				$('.hospital-select #selectTreatment').append(selectOption);
			})


			$('#selectTreatment').selectpicker('render');
			$('#selectTreatment').selectpicker('refresh');
		},
		error: function (exception) {
			console.log(exception);
		}
	});
	//console.log("hello " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+ ":" +today.getMilliseconds())
	$.ajax({
		url: serverName + 'api/v1/getcitylist/meditrip',
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},
		success: function (response) {
			var citylist = response;
			//Populate citry name Dropdown
			//console.log('city :' + response)
			citylist.forEach(function (item) {
				var selectOption = $('<option>' + item + '</option>')
				$('.hospital-select-city #selectCity').append(selectOption);
			})

			$('#selectCity').selectpicker('render');
			$('#selectCity').selectpicker('refresh');
		},
		error: function (exception) {
			console.log(exception);
		}
	});

	$('.searchhosp button').on('click', function () {

		var treatmentSel = $('#selectTreatment').val();
		//console.log("selected treat: "+treatmentSel)
		var citySel = $('#selectCity').val();
		//console.log("selected city: "+citySel);
		if (treatmentSel == '' || citySel == '') {
			//console.log('un selected!');
			//alert('select city')
		} else {
			hospitalPageCallback(treatmentSel, citySel);
		}

	})


}

//2hospitalPageCallback
function hospitalPageCallback(treatmentName, city) {
	//var today = new Date();
	// to load tratmentList in selectbox
	//console.log("hello " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+ ":" +today.getMilliseconds())

	//*****shortcut******** */
	//console.log("hello " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+ ":" +today.getMilliseconds())

	$.ajax({
		url: serverName + 'api/v1/searchHospitaldetails/' + treatmentName + '/meditrip?city=' + city,
		type: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + basicKey,
			'x-access-token': xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
		},

		success: function (response) {
			//console.log(" response: " + response);
			//$('.tobehidden').hide();
			//	console.log("hello");
			var mainDiv = $('.hosp-main');
			if (response == '') {
				//console.log("no response");
				mainDiv.html('<div style="text-align:center;font-weight:bold;font-size:1.4em;">No hospital records in the selected city</div>');
				$('.pagination').hide();
			} else {
				$('.pagination').show();
				mainDiv.html('');
				$.each(response, function (index, hospital) {

					var myHtml = '';

					var rowDiv = $('.hosp-row');

					if (hospital.Treatment.length > 3) {
						var treatmentArr = hospital.Treatment.slice(0, 3);
						$.each(treatmentArr, function (index, item) {
							if (index !== treatmentArr.length - 1) {
								myHtml += item.name + ', ';
							} else {
								myHtml += item.name;
							}
						})
					} else {
						$.each(hospital.Treatment, function (index, treatment) {


							if (index !== hospital.Treatment.length - 1) {
								myHtml += treatment.name + ', ';
							} else {
								myHtml += treatment.name;
							}

						})

					}
					var modifiedhosname = hospital.hospitalName.replace(/\s+/g, '-').toLowerCase();
					if (index % 2 === 0) {
						var htmlStr = $('<div class="row is-flex hosp-row" style="margin-bottom:30px"><div class="col-md-5 test even hosp-' + index + '"' + 'style="background-color:#f9f9f9; padding:28px"><p class="test1"><img src=' + hospital.hospitalimage + '><a href="#modal-container-SubmitEnquiry" data-toggle="modal"><button type="button" class="btn btn-success btn-rounded btn-sm" style="float:right">Contact</button></a><a href="/hospitals/' + modifiedhosname + '"><strong style="font-size:18px;line-height:1.6em;">' + hospital.hospitalName + '</strong></a><br><i class="fa fa-map-marker"  aria-hidden="true"></i>' + ' ' + hospital.hospitalContact.City + ', ' + hospital.hospitalContact.country + '<br><span>Specialities: ' + myHtml + '</span></p><div class="margin20"> <a href="/hospitals/' + hospital.hospitalName + '"style="float:right;font-weight:bold">Learn More...</a></div></div></div>')

						mainDiv.append(htmlStr);
					} else {
						var htmlStrr = $('<div class="col-md-5 col-md-offset-1 test odd hosp-' + index + '"' + 'style="background-color:#f9f9f9; padding:28px"><p class="test1"><img src=' + hospital.hospitalimage + '><a href="#modal-container-SubmitEnquiry" data-toggle="modal"><button type="button" class="btn btn-success btn-rounded btn-sm" style="float:right">Contact</button></a><a href="/hospitals/' + modifiedhosname + '"><strong style="font-size:18px;line-height:1.6em;">' + hospital.hospitalName + '</strong></a><br><i class="fa fa-map-marker color=blue" aria-hidden="true"></i>' + ' ' + hospital.hospitalContact.City + ', ' + hospital.hospitalContact.country + '<br><span>Specialities: ' + myHtml + '</span></p><div class="margin20"> <a href="/hospitals/' + hospital.hospitalName + '" style="float:right;font-weight:bold">Learn More...</a></div></div>')

						rowDiv.last().append(htmlStrr);
					}

				})
				//console.log("hello " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+ ":" +today.getMilliseconds())
				// *****************pagination***********************
				var items = $('.hosp-main .row');
				//console.log("items: ", items)
				var numItems = items.length;
				var perPage = 5;
				//console.log("numItems, perPage: "+numItems +" " +perPage)
				items.slice(perPage).hide();
				if (numItems != 0) {
					$('.pagination').pagination({
						items: numItems,
						itemsOnPage: perPage,
						cssStyle: 'dark-theme',

						onPageClick: function (pageNumber) {
							var showFrom = perPage * (pageNumber - 1);
							var showTo = showFrom + perPage;
							items.hide().slice(showFrom, showTo).show();
						}
					});
				}
				// *****************end of pagination***********************
			}
		},
		error: function (exception) {
			console.log(exception);
		}
	});

	// *******end of shortcut**********/


}

function openSubmitEnquiry() {
	$('#modal-container-SubmitEnquiry').modal('show');
}

//This function is used to set initial height and left padding in treatments offered page
function setInitialHeightForContainers() {
	//get and set height for all content and contact divs
	var initialHeight = $('[id^="content_"]').outerHeight(true);
	$('[id^="contact_"]').height((initialHeight - 2) + 'px');
	//get and set left offset for all content and contact divs
	var p = $('[id^="content_"]').filter(':visible:first');
	var contentleftOffset = p.offset();
	var p1 = $('[id^="contact_"]').filter(':visible:first');
	var contactleftOffset = p1.offset();
	var filterleftOffset = $('#filter').offset();
	//set left alignment for all content and contact divs
	$('[id^="content_"]').offset({
		left: contentleftOffset.left
	});
	$('[id^="contact_"]').offset({
		left: contactleftOffset.left
	});
	$('#top_desc').offset({
		left: filterleftOffset.left
	});

}
//This function is used to filter the treatments based on user selection
function filterProcedureListAndDisplay(isChecked, id) {
	//get the offset length of first visible content and contact divs in the screen
	var p = $('[id^="content_"]').filter(':visible:first');
	var contentleftOffset = p.offset();
	//reload the page if all elements are de selected by user
	if (contentleftOffset == null) {
		window.location = window.location.href;
		return
	}
	var p1 = $('[id^="contact_"]').filter(':visible:first');
	var contactleftOffset = p1.offset();
	//hide elements
	if (!isChecked) {
		$('#content_' + id).hide();
		$('#contact_' + id).hide();
		$('#space_' + id).hide();
	} else {
		//Show hidden elements
		var isVisible = $('#content_' + id).is(':visible');
		if (!isVisible) {
			$('#content_' + id).show();
			$('#contact_' + id).show();
			$('#space_' + id).show();
		}
	}
	//set left alignment for all content and contact divs
	$('[id^="content_"]').offset({
		left: contentleftOffset.left
	});
	$('[id^="contact_"]').offset({
		left: contactleftOffset.left
	});
}
//set expand and collapse bootstrap  Accordion
function setExpandCollpaseAccordion() {

	// Add minus icon for collapse element which is open by default
	$('.collapse.in').each(function () {
		$(this).siblings('.panel-heading').find('.glyphicon').addClass('glyphicon-minus').removeClass('glyphicon-plus');
	});

	// Toggle plus minus icon on show hide of collapse element
	$('.collapse').on('show.bs.collapse', function () {
		$(this).parent().find('.glyphicon').removeClass('glyphicon-plus').addClass('glyphicon-minus');
	}).on('hide.bs.collapse', function () {
		$(this).parent().find('.glyphicon').removeClass('glyphicon-minus').addClass('glyphicon-plus');
	});

}

$('#questionnaire-form').on('submit', function (e) {	
	e.preventDefault();
	var uniqueNumber=getUniqueNumber();
    $.ajax({
			url: serverName+ 'api/v1/post/questionnaire',
			data: $("#questionnaire-form").serialize(),
			type: 'POST',			
			success: function(response) {				
				$('#messageModal').modal('show');
				document.getElementById("questionnaire-form").reset();				
		        $(this).find("#uploadmsg").css('color', 'green');
				$(this).find("#uploadmsg").text("Submitted form successfully");
			},
			error: function(exception) {			
		        $(this).find("#uploadmsg").css('color', 'red');
				$(this).find("#uploadmsg").text("Failed to submit the questionannire");								
			},
		});
		
		var attachmentFlag="N";
		var attachmentNames='';

		var files = $('#files').get(0).files;
		var fileSize=(files.length)
		var formFileData = new FormData();
		
		if (fileSize >= 1) {
			var validExt = ".png,.jpeg,.jpg,.pdf,.doc,.docx";
			attachmentFlag="Y"
			if (fileSize >= 5) {
			$(this).find("#uploadmsg").text("Only 5 files are allowed at a time");
			$(this).find("#files").val('')
			return  false;
		}
		// Append the files to the formData.
		for (var i=0; i < fileSize; i++) {
			var file = files[i];
			var filePath=file.name
			attachmentNames = attachmentNames+ filePath + ",";
			var getFileExt = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
			formFileData.append('files', file, file.name);

			// file size and extension validation
			if (file.size*0.000001>5){
				$(this).find("#files").val('')
				$(this).find("#uploadmsg").text("Please upload files having size less than 5MB");
				$(this).find("#uploadmsg").focus();
				return  false;
			}else if(validExt.indexOf(getFileExt)<0 ) {
				$(this).find("#files").val('')
				$(this).find("#uploadmsg").text("Please upload only allowed file types "+ validExt);
				$(this).find("#uploadmsg").focus();
				return  false;
			}
		}
		//give focus to submit button
		$(this).find("#filesubmit").focus();
				
		$.ajax({
			url: serverName+ 'cloud/zip/upload/'+uniqueNumber,
			data: formFileData,
			type: 'POST',
			contentType: false,
			processData: false,
			async: false, //add this
			success: function(response) {
				$(this).find("#files").val('')
				console.log("File upload success")				
			},
			error: function(exception) {
				$(this).find("#uploadmsg").text("File upload is failed");
				console.log("upload exception")
				$(this).find("#files").val('')
				$(this).find("#uploadmsg").css('color', 'red');
				$(this).find("#uploadmsg").text(("File upload failed,but rest of the details were submitted successfully"));
			},
		});
		$(this).find("#files").val('')
	}
})
//Added by Libin to populate the model when user click on a link in enquiries page
$('.enq_desc_lnk').on('click', function (e) {	
	e.preventDefault();
	$('#questionnairemodel').modal('show');
    var txt=$(".hdn_desc").text();	
	if (txt=='') {
		txt='User did not submit the case details'
	}
	$('#questionnairemodel').find(".mdlbody").text((txt));
})
$('.enq_quest_lnk').on('click', function (e) {	
	e.preventDefault();
	var txt=$(".hdn_qstn").text();
	if (txt=='') {
		txt='User is yet to submit questionnaire'
	}
	$('#questionnairemodel').modal('show');
    $('#questionnairemodel').find(".mdlbody").text((txt));	
})
/* To download files from S3 on button click in getpendingenquiry page */
$('#meddoc').on('click', function (e) {	
	e.preventDefault();	
	$.ajax({
			url: serverName + 'api/cloud/download/medicaldocs/meditrip',
			type: 'POST',
            async: false, //add this			
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken

			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},
			data: JSON.stringify({
					fileName: $(this).attr("value")					
			}),	
            dataType: 'json',			
			success: function (response) {				               			
				window.location = response.URL;	//start download automatically	
			},
			error: function (exception) {				
				console.log(exception.message);
			}
		})
	
})

function getUniqueNumber(){
	
	var date = new Date();
	var components = [
		date.getYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds()
	];

	var id = components.join("") //+ Math.random().toString().replace(".","");
	
	return id
}

/* To save enquiry status on button click in getpendingenquiry page */
$('#enqsave').on('click', function (e) {
	
    /*var select = $(this).closest("tr").find("select.input-sm")[0];
    var textContent = select.selectedOptions[0].textContent;    
    console.log("value: ", select.value);
    console.log("textContent: ", textContent); */
	
	e.preventDefault();	
	$.ajax({
			url: serverName + 'api/update/enqstatus/meditrip',
			type: 'POST',
            async: false, //add this			
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + basicKey,
				'x-access-token': xAccessToken

			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + basicKey);
			},
			data: JSON.stringify({
					enquiryID: $(this).attr("value"),
					//var	select = $(this).closest("tr").find("select.input-sm")[0],        					
                    enqstatus: $(this).closest("tr").find("select.input-sm")[0].selectedOptions[0].textContent,
                    userEmail:$(this).closest('tr').find("td:eq(2)").text()				
			}),	
            dataType: 'json',			
			success: function (response) {
				console.log('success');
				$('#questionnairemodel').find(".mdlbody").text(response.Data);
                $('#questionnairemodel').modal('show');                			
			},
			error: function (exception) {				
				console.log("error");
				console.log(exception);
			}
		})
	
})