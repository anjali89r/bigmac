var basicKey = "bGliaW46bGliaW4=",
	xAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiVG9rZW5Ub0F1dGhlbnRpY2F0ZU1lZGlub3ZpdGFVc2VyIiwiaWF0IjoxNTA4MDQ0OTMwfQ.cZ3pCte1guE8KQkjd1KfY_bLJ-gOatJm2xlwyiLGAl4",
	serverName = "http://localhost:3000/",
	GLOBAL_VARIABLES = {
		Language: "en",
		Currency: "dollar"
	},
	countryCodes = [],
	officeAddress = "",
	whyIndia = "";

function sticky_relocate() {
	var e = $(window).scrollTop(),
		t = $(".medinovitaFooter").offset().top,
		a = $("#sticky-anchor").offset().top,
		o = $("#sticky").height();
	e + o > t - 20 ? $("#sticky").css({
		top: -1 * (e + o - t + 20)
	}) : e > a ? ($("#sticky").addClass("stick"), $("#sticky").css({
		top: 0
	})) : $("#sticky").removeClass("stick")
}

function homepageCallback() {
	$.ajax({
		url: serverName + "api/v1/getdepttreatmentlist/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			var t = e;
			t.forEach(function (e, t) {
				$("#getQuoteTreatment").append('<optgroup id="' + e.department + '" label="' + e.department + '"></optgroup>')
			}), t.forEach(function (e, t) {
				var a = e.department;
				e.treatmentNames.forEach(function (e, t) {
					$("#" + a).append('<option class="' + e + '"data-tokens="' + e + '">' + e + "</option>")
				})
			}), document.getElementById("getQuoteTreatment") && ($("#getQuoteTreatment").selectpicker("render"), $("#getQuoteTreatment").selectpicker("refresh"))
		},
		error: function (e) {
			console.log(e)
		}
	}), $.ajax({
		url: serverName + "api/v1/get/newssection/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			var t = "";
			e.forEach(function (e, a) {
				t += ' <article data-id="' + e.newsId + '" class="entry entry-grid"><div class="entry-media"><figure><a href="news/' + e.newsId + '/"><img src="' + e.imgPath + '" alt="Post image"></a></figure><div class="entry-meta"><span><i class="fa fa-calendar"></i>' + e.postedDate + '</span><a href="#"><i class="fa fa-user"></i> ' + e.postedBy + '</a></div></div><h2 class="entry-title"><i class="fa fa-newspaper-o"></i><a href="news/' + e.newsId + '/">' + e.postHeading + '</a></h2><div class="entry-content"><p>' + e.postShortContent + "</p></div></article>"
			}), $("#latestNewsCarousel").html(t), $(".latest-posts-medical-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 30,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			})
		},
		error: function (e) {
			console.log(e)
		}
	}), $.ajax({
		url: serverName + "api/v1/getaboutMedical/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			var t = e;
			$("#aboutSubtitle").text(t.aboutSubTitle), $("#aboutContent").html($.parseHTML(t.aboutContent))
		},
		error: function (e) {
			console.log(e)
		}
	}), $.ajax({
		url: serverName + "api/v1/getFeaturedtreatments/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		success: function (e) {
			var t = "",
				a = "";
			e.forEach(function (e, o) {
				o <= 2 ? t += ' <div class="col-sm-4"><div class="text-block hover-bg text-center" style="background-image:url(' + e.img + ')"><h3 class="block-title"><a href="#">' + e.title + "</a></h3><p>" + e.shortContent + '</p><div class="index' + o + '"><a href=' + e.pagePath + ' class="readmore custom2">ReadMore <i class="fa fa-angle-right"></i></a></div></div></div>' : o > 2 && (a += ' <div class="col-sm-4"><div class="text-block hover-bg text-center" style="background-image:url(' + e.img + ')"><h3 class="block-title"><a href="#">' + e.title + "</a></h3><p>" + e.shortContent + '</p><div class="index' + o + '"><a href=' + e.pagePath + ' class="readmore custom2">ReadMore <i class="fa fa-angle-right"></i></a></div></div></div>')
			}), $("#featuredTreatmentsSection1").html(t), $("#featuredTreatmentsSection2").html(a)
		},
		error: function (e) {
			console.log(e)
		}
	}), $("#homepageCarousel").carousel({
		interval: 3500,
		cycle: !0
	}), $(document).on("click", ".latestNewsReadmore", function () {
		var e = $(this).data("id");
		$("#modal-container-LatestNews #myModalLabel").text(e), $("#modal-container-LatestNews .modal-body").text("Modal Content")
	})
}

function costCallback(e) {
	$.ajax({
		url: serverName + "api/v1/get/distinctprocedurenames/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			e[0].treatmentNames.forEach(function (e, t) {
				var a = $("<option>" + e.displayName + "</option>");
				$(".treatment-select #costSelectTreatment").append(a)
			}), $("#costSelectTreatment").selectpicker("render"), $("#costSelectTreatment").selectpicker("refresh")
		},
		error: function (e) {
			console.log(e)
		}
	}), $.ajax({
		url: serverName + "api/v1/get/evisacountries/all/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		success: function (e) {
			var t = [];
			e.forEach(function (e) {
				t.push({
					country: e.country,
					fee: e.fee
				})
			}), t.forEach(function (e) {
				var t = $("<option>" + e.country + "</option>");
				$(".treatment-select #costcountry").append(t)
			}), $("#costcountry").selectpicker("render"), $("#costcountry").selectpicker("refresh")
		},
		error: function (e) {
			console.log(e)
		}
	}), $.ajax({
		url: serverName + "api/get/holidayPackage/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			e.result.forEach(function (e, t) {
				var a = $("<option>" + e.packageShortName + "</option>");
				$(".treatment-select #holidayPackageDropdown").append(a)
			}), $("#holidayPackageDropdown").selectpicker("render"), $("#holidayPackageDropdown").selectpicker("refresh")
		},
		error: function (e) {
			console.log(e)
		}
	}), $(".top-doctors-carousel.owl-carousel").owlCarousel({
		loop: !1,
		margin: 30,
		responsiveClass: !0,
		nav: !0,
		navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
		dots: !1,
		autoplay: !0,
		autoplayTimeout: 15e4,
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
	}), $(".top-hospitals-carousel.owl-carousel").owlCarousel({
		loop: !1,
		margin: 30,
		responsiveClass: !0,
		nav: !0,
		navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
		dots: !1,
		autoplay: !0,
		autoplayTimeout: 15e4,
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
	}), $("#getCostDetails").on("click", function (e) {
		var t = $("#costSelectTreatment").val(),
			a = $("#bystanderDropdown").val(),
			o = $("#holidayPackageDropdown").val(),
			s = $("#costcountry").val();
		$.ajax({
			url: serverName + "api/v1/get/cost/meditrip?procedurename=" + t + "&bystandercount=" + a + "&holidaypackage=" + o + "&hotelrate=3 star&vehicletype=sedan&countryName=" + s + "&currency=Dollar",
			type: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Basic " + basicKey,
				"x-access-token": xAccessToken
			},
			beforeSend: function (e) {
				e.setRequestHeader("Authorization", "Basic " + basicKey)
			},
			success: function (e) {
				console.log(e), $("#costTemplateDiv").html(e)
			},
			error: function (e) {
				console.log(e)
			}
		}), e.preventDefault()
	})
}

function treatmentsOfferedCallback(e) {
	var t = "";
	switch (e) {
		case "cardiacTreatmentMenu":
			t = "Cardiac";
			break;
		case "ayurvedaTreatmentMenu":
			t = "Ayurveda";
			break;
		case "dentalTreatmentMenu":
			t = "Dental";
			break;
		default:
			t = "Cardiac"
	}
	$.ajax({
		url: serverName + "api/v1/get/treatmentdescription/nocost/meditrip?department=" + t,
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			$(".treatmentDecsription h1").html(e[0].department), $(".treatmentDecsription p").html(e[0].departmentDescription);
			var t = '<h2 style="margin-top: 20px">Available Procedures</h2>';
			console.log(JSON.stringify(e, null, "\t")), e.forEach(function (e, a) {
				e.treatmentList.forEach(function (e, a) {
					var o = e.displayName,
						s = e.treatmentDescription,
						i = e.procedureImagepath.replace(/\//g, "/");
					t += '<div class="blog-card"><div class="photo photo1" style="background: url(' + i + ') center no-repeat;"></div><ul class="details"><li class="author"><a href="#">' + e.procedureName + '</a></li><li class="date"> Heal Time: ' + e.healingTimeInDays + '</li><li class="date"> Surgical Time: ' + e.surgicalTime + '</li><li class="date"> Estimate Cost: ' + e.procedureCost + '</li></ul><div class="description"><h1>' + o + "</h1><h2>" + o + '</h2><p class="summary">' + s + '</p><a href="/procedure/Bone Grafting">Read More</a></div></div>'
				})
			}), document.getElementById("availableProceduresDiv").innerHTML = t
		},
		error: function (e) {
			console.log(e)
		}
	})
}

function searchTreatmentCallback() {
	var e = getCookie("Search-Treatment");
	$.ajax({
		url: serverName + "api/v1/searchHospitaldetails/" + e + "/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		success: function (e) {
			var t = "";
			e.forEach(function (e, a) {
				t += '<div class="card-media"><div class="card-media-object-container"><div class="card-media-object" style="background-image: url(' + e.hospitalimage + ');"></div><span class="card-media-object-tag subtle">Trusted</span><ul class="card-media-object-social-list"></ul></div><div class="card-media-body"><div class="card-media-body-top"><span class="" style="font-size:20px;color:blue">' + e.hospitalName + '</span><button class="btn btn-success pull-right" onclick="openSubmitEnquiry()">Contact Us</button><div class="card-media-body-top-icons u-float-right"></div></div><span class="card-media-body-heading">' + e.hospitalContact.country + ", " + e.hospitalContact.addressLine1 + ", " + e.hospitalContact.City + ", " + e.hospitalContact.PostalCode + "<br>" + e.hospitalContact.website + '</span><div class="card-media-body-supporting-bottom"><span class="card-media-body-supporting-bottom-text subtle">NABL: ' + e.Accreditation.NABL + ", NABH: " + e.Accreditation.NABH + ", JCI: " + e.Accreditation.JCI + '</span><span class="card-media-body-supporting-bottom-text subtle u-float-right"></span></div><div class="card-media-body-supporting-bottom card-media-body-supporting-bottom-reveal"><span class="card-media-body-supporting-bottom-text subtle">' + e.Treatment[0].name + '</span><a href="#/" class="card-media-body-supporting-bottom-text card-media-link u-float-right">More Details</a></div></div></div>'
			}), $("#seearchTreatmentPageContainer").append(t)
		},
		error: function (e) {
			console.log(e)
		}
	})
}

function setCookie(e, t, a) {
	var o = new Date;
	o.setTime(o.getTime() + 24 * a * 60 * 60 * 1e3);
	var s = "expires=" + o.toUTCString();
	document.cookie = e + "=" + t + ";" + s + ";path=/"
}

function medicalVisacallback() {
	$.ajax({
		url: serverName + "api/v1/get/evisacountries/all/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		success: function (e) {
			var t = [];
			e.forEach(function (e) {
				t.push({
					country: e.country,
					fee: e.fee
				})
			}), t.forEach(function (e) {
				$(".select-country #countryfeeslist").append('<option class="' + e.fee + '"data-tokens="' + e.country + '">' + e.country + "</option>")
			}), $("#countryfeeslist").selectpicker("render"), $("#countryfeeslist").selectpicker("refresh")
		},
		error: function (e) {
			console.log(e)
		}
	}), $(".selectpicker").on("change", function () {
		$("table#t01 tr").hide();
		var e = $("option:selected", this).val(),
			t = $("option:selected", this).attr("class");
		$("table#t01 tr th").removeClass("no-show"), $("table#t01 tbody").append('<tr><th >Country</th><th>Fees (USD)<br><div style="font-size:0.9rem;">2.5% additional charge on bank transactions</div></th></tr><tr class="new-row"><td>' + e + "</td><td>" + t + "</td></tr>")
	})
}

function getCookie(e) {
	for (var t = e + "=", a = document.cookie.split(";"), o = 0; o < a.length; o++) {
		for (var s = a[o];
			" " == s.charAt(0);) s = s.substring(1);
		if (0 == s.indexOf(t)) return s.substring(t.length, s.length)
	}
	return ""
}

function hospitalPageHtml() {
	$.ajax({
		url: serverName + "api/v1/getTreamentlist/all/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			e.forEach(function (e) {
				var t = $('<li><input type="radio" value="' + e + '"name="treatment-group"> ' + e + "</li>");
				$(".hospital-selectTreatment #selectTreatment").append(t)
			})
		},
		error: function (e) {
			console.log(e)
		}
	}), $.ajax({
		url: serverName + "api/v1/getcitylist/meditrip",
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			e.forEach(function (e) {
				var t = $('<li><input type="radio" value="' + e + '"name="city-group"> ' + e + "</li>");
				$(".hospital-select-city #selectCity").append(t)
			})
		},
		error: function (e) {
			console.log(e)
		}
	}), $(".detail-treatment button").on("click", function () {
		console.log("inside button");
		var e = $('input[type="radio"][name="treatment-group"]:checked').val(),
			t = $('input[type="radio"][name="city-group"]:checked').val();
		console.log("treatmentSel: " + e), console.log("citySel: ", t), "" == e || "" == t ? console.log("hehe") : (console.log("SUEPRRRRR"), hospitalPageCallback(e, t))
	})
}

function hospitalPageCallback(e, t) {
	$.ajax({
		url: serverName + "api/v1/searchHospitaldetails/" + e + "/meditrip?city=" + t,
		type: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		success: function (e) {
			var t = $(".hosp-main");
			if ("" == e) t.html('<div style="text-align:center;font-weight:bold;font-size:1.4em;">No hospital records in the selected city</div>');
			else {
				$(".pagination").show(), $.each(e, function (e, t) {
					var a = "";
					if (t.Treatment.length > 3) {
						var o = t.Treatment.slice(0, 3);
						$.each(o, function (e, t) {
							e !== o.length - 1 ? a += t.name + ", " : a += t.name
						})
					} else $.each(t.Treatment, function (e, o) {
						e !== t.Treatment.length - 1 ? a += o.name + ", " : a += o.name
					});
					var s = t.hospitalName.replace(/\s+/g, "-").toLowerCase();
					$('<div class="product product-list hosp-' + e + '"><div class="row"><div class="col-md-4 col-sm-5"><div class="product-top"><figure><img src=' + t.hospitalimage + '></figure></div></div><div class="col-md-8 col-sm-7"><h3><a href="/hospitals/' + s + '"><strong style="font-size:18px;line-height:1.6em;">' + t.hospitalName + '</strong></a></h3><div class="location-sp" style="font-size:16px;"><div><i class="fa fa-map-marker"  aria-hidden="true"></i> ' + t.hospitalContact.City + ", " + t.hospitalContact.country + "</div><div>Specialities: " + a + '</div><a href="#modal-container-SubmitEnquiry" data-toggle="modal"><button type="button" class="btn btn-success btn-rounded btn-sm" style="float:right">Contact</button></a></div><div style="font-size:14px;"> <a href="/hospitals/' + s + '"style="font-weight:bold">Learn More...</a></div></div></div></div></div></div>').insertBefore(".pagination-container")
				}), $(".pagination").show();
				var a = $(".hosp-main .product"),
					o = a.length;
				a.slice(5).hide(), 0 != o && $(".pagination").pagination({
					items: o,
					itemsOnPage: 5,
					cssStyle: "dark-theme",
					onPageClick: function (e) {
						var t = 5 * (e - 1),
							o = t + 5;
						a.hide().slice(t, o).show()
					}
				})
			}
		},
		error: function (e) {
			console.log(e)
		}
	})
}

function openSubmitEnquiry() {
	$("#modal-container-SubmitEnquiry").modal("show")
}

function setInitialHeightForContainers() {
	var e = $('[id^="content_"]').outerHeight(!0);
	$('[id^="contact_"]').height(e - 2 + "px");
	var t = $('[id^="content_"]').filter(":visible:first").offset(),
		a = $('[id^="contact_"]').filter(":visible:first").offset(),
		o = $("#filter").offset();
	$('[id^="content_"]').offset({
		left: t.left
	}), $('[id^="contact_"]').offset({
		left: a.left
	}), $("#top_desc").offset({
		left: o.left
	})
}

function filterProcedureListAndDisplay(e, t) {
	var a = $('[id^="content_"]').filter(":visible:first").offset();
	if (null != a) {
		var o = $('[id^="contact_"]').filter(":visible:first").offset();
		if (e) $("#content_" + t).is(":visible") || ($("#content_" + t).show(), $("#contact_" + t).show(), $("#space_" + t).show());
		else $("#content_" + t).hide(), $("#contact_" + t).hide(), $("#space_" + t).hide();
		$('[id^="content_"]').offset({
			left: a.left
		}), $('[id^="contact_"]').offset({
			left: o.left
		})
	} else window.location = window.location.href
}

function setExpandCollpaseAccordion() {
	$(".collapse.in").each(function () {
		$(this).siblings(".panel-heading").find(".glyphicon").addClass("glyphicon-minus").removeClass("glyphicon-plus")
	}), $(".collapse").on("show.bs.collapse", function () {
		$(this).parent().find(".glyphicon").removeClass("glyphicon-plus").addClass("glyphicon-minus")
	}).on("hide.bs.collapse", function () {
		$(this).parent().find(".glyphicon").removeClass("glyphicon-minus").addClass("glyphicon-plus")
	})
}

function getUniqueNumber() {
	var e = new Date;
	return [e.getYear(), e.getMonth(), e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()].join("")
}! function (e) {
	"use strict";
	e(".medinovitaHeader").load("/assets/pages/header.html", function () {
		e.ajax({
			url: serverName + "api/v1/get/distinctdepartments/meditrip",
			type: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Basic " + basicKey,
				"x-access-token": xAccessToken
			},
			beforeSend: function (e) {
				e.setRequestHeader("Authorization", "Basic " + basicKey)
			},
			success: function (t) {
				var a = JSON.parse(JSON.stringify(t));
				e.each(a, function (t) {
					var o = a[t].department,
						s = a[t].shortname,
						i = e('<li class="dropdown"><a href="/treatmentsoffered/' + s + '" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">' + o + "</a></li>");
					e("#treatmentsOfferedUL").append(i);
					i.on('click', function(){
						window.location='/treatmentsoffered/' + s;
					})

				})
			},
			error: function (e) {
				console.log(e)
			}
		}), e("#costPageMenu").on("click", function () {
			document.location.href = "/cost.html"
		}), e("#contactPageMenu").on("click", function () {
			document.location.href = "/contact.html"
		}), e("#homeMenu").on("click", function () {
			document.location.href = "/index.html"
		}), e("#medicalVisaPageMenu").on("click", function () {
			document.location.href = "/medical-visa-to-india.html"
		}), e("#ourServicesPageMenu").on("click", function () {
			document.location.href = "/ourservices.html"
		}), e("#holidayPageMenu").on("click", function () {
			document.location.href = "/holiday/holiday-home"
		}), e("#hospitalsPageMenu").on("click", function () {
			document.location.href = "/hospitaldoctors.html"
		}), e("#getQuoteTreatment").on("change", function () {
			var t = e("option:selected", this).val().replace(/\s+/g, "-").toLowerCase();
			location.href = serverName + "search/" + t
		}), e(".medinovitaModals").on("hidden.bs.modal", function () {
			document.getElementById("submitEnquiryForm").reset()
		})
	}), e(".medinovitaFooter").load("/assets/pages/footer.html", function () {}), e(".medinovitaModals").load("/assets/pages/modals.html", function () {
		e("#submitEnquiryForm").on("submit", function (t) {
			t.preventDefault();
			var a = e(this).serializeArray(),
				o = "N",
				s = "",
				i = getUniqueNumber(),
				n = e("#files").get(0).files,
				l = n.length,
				r = new FormData;
			if (l >= 5) return e(this).find("#uploadmsg").text("Only 5 files are allowed at a time"), e(this).find("#files").val(""), !1;
			if (l >= 1) {
				var c = ".png,.jpeg,.jpg,.pdf,.doc,.docx";
				o = "Y";
				for (var u = 0; u < l; u++) {
					var d = n[u],
						p = d.name;
					s = s + p + ",";
					var m = p.substring(p.lastIndexOf(".") + 1).toLowerCase();
					if (r.append("files", d, d.name), 1e-6 * d.size > 5) return e(this).find("#files").val(""), e(this).find("#uploadmsg").text("Please upload files having size less than 5MB"), e(this).find("#uploadmsg").focus(), !1;
					if (c.indexOf(m) < 0) return e(this).find("#files").val(""), e(this).find("#uploadmsg").text("Please upload only allowed file types " + c), e(this).find("#uploadmsg").focus(), !1
				}
				e(this).find("#filesubmit").focus(), e.ajax({
					url: serverName + "cloud/zip/upload/" + i,
					data: r,
					type: "POST",
					contentType: !1,
					processData: !1,
					cache: !1,
					async: !1,
					success: function (t) {
						e(this).find("#uploadmsg").text("File upload is success")
					},
					error: function (t) {
						e(this).find("#uploadmsg").text("File upload is failed"), console.log("exception -" + t)
					}
				}), e(this).find("#files").val(""), e(this).find("#uploadmsg").css("color", "green"), e(this).find("#uploadmsg").text("Files have been uploaded successfully")
			}
			e.ajax({
				url: serverName + "api/v1/submit/enquiry/" + i + "/meditrip",
				type: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: "Basic " + basicKey,
					"x-access-token": xAccessToken
				},
				beforeSend: function (e) {
					e.setRequestHeader("Authorization", "Basic " + basicKey)
				},
				data: JSON.stringify({
					emailID: a[1].value,
					userFullName: a[0].value,
					isdCode: a[2].value,
					primaryPhonenumber: a[3].value,
					procedureName: a[4].value,
					commuMedium: "English",
					caseDescription: a[5].value,
					attachment: o,
					attachmentName: i + ".zip"
				}),
				success: function (t) {
					e(this).find("#uploadmsg").text(""), document.getElementById("submitEnquiryForm").reset(), setTimeout(function () {
						e("#modal-container-SubmitEnquiry").modal("toggle")
					}, 209), setTimeout(function () {
						e("#messageModal").modal("show")
					}, 300)
				},
				error: function (t) {
					console.log("exception", t), e(".modalerrormessage").html("Error : " + t)
				}
			})
		}), e.ajax({
			url: serverName + "api/v1/get/countrylist/meditrip",
			type: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Basic " + basicKey,
				"x-access-token": xAccessToken
			},
			beforeSend: function (e) {
				e.setRequestHeader("Authorization", "Basic " + basicKey)
			},
			success: function (t) {
				t.result[0].countrylist.forEach(function (e, t) {
					var a = {};
					a.name = e.country, a.dial_code = e.dial_code, a.code = e.code, countryCodes.push(a)
				}), e("#modal-container-SubmitEnquiry").on("shown.bs.modal", function () {
					e(".modal .modal-body").css("overflow-y", "auto"), e(".modal .modal-body").css("max-height", .9 * e(window).height())
				}), countryCodes.forEach(function (t, a) {
					e("#inputSubmitEnquiryISDCode").append(e("<option>", {
						value: t.dial_code,
						text: t.name + " (" + t.dial_code + ")"
					}))
				})
			},
			error: function (e) {
				console.log(e)
			}
		}), e.ajax({
			url: serverName + "api/v1/getTreamentlist/all/meditrip",
			type: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Basic " + basicKey,
				"x-access-token": xAccessToken
			},
			beforeSend: function (e) {
				e.setRequestHeader("Authorization", "Basic " + basicKey)
			},
			success: function (e) {
				var t = e,
					a = document.getElementById("selectSubmitEnquiryProcedure");
				t.forEach(function (e, t) {
					var o = document.createElement("option");
					o.text = e, o.value = e.replace(/\s+/g, "-").toLowerCase(), a.add(o)
				})
			},
			error: function (e) {
				console.log(e)
			}
		}), (window.location.href.indexOf("index") > -1 || "https://www.medinovita.com/" == window.location.href || "http://medinovita.com/" == window.location.href || "https://medinovita.com/" == window.location.href) && homepageCallback(), window.location.href.indexOf("treatmentsOffered") > -1 && treatmentsOfferedCallback(getCookie("treatmentPage")), window.location.href.indexOf("medical-visa-to-india") > -1 && medicalVisacallback(), window.location.href.indexOf("cost") > -1 && costCallback(), window.location.href.indexOf("SearchTreatment") > -1 && searchTreatmentCallback(), window.location.href.indexOf("hospitaldoctors") > -1 && (hospitalPageHtml(), hospitalPageCallback("all", ""))
	}), e("#hospitalsPageMenu").on("click", function () {
		e(".main").html(""), e(".main").load("hospitalzone.html", function (e) {})
	}), e("iframe").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *").css({
		color: "#005d9c",
		"font-family": "tahoma"
	}), e("iframe").contents().find(".goog-te-menu2-item div").hover(function () {
		e(this).css("background-color", "#F38256").find("span.text").css("color", "white")
	}, function () {
		e(this).css("background-color", "white").find("span.text").css("color", "#544F4B")
	}), e("iframe").contents().find(".goog-te-menu2").css("border", "1px solid #F38256"), e(".goog-te-menu-frame").css({
		"-moz-box-shadow": "0 3px 8px 2px #666666",
		"-webkit-box-shadow": "0 3px 8px 2px #666",
		"box-shadow": "0 3px 8px 2px #666"
	}), e(".goog-te-combo").css({
		color: "#ffffff",
		"font-family": "tahoma"
	});
	var t = {
		initialised: !1,
		mobile: !1,
		container: e("#portfolio-item-container"),
		blogContainer: e("#blog-item-container"),
		init: function () {
			if (!this.initialised) {
				this.initialised = !0, this.pageLoadAnim(), this.checkMobile(), this.menuHover(), this.mobileMenuDropdownFix(), this.menuOnClick(), this.stickyHeader(), this.overlayMenuToggle(), this.overlayMenuDropdownFix(), this.sideMenu(), this.sideMenuToggle(), this.productZoom(), this.scrollToTop(), this.twitterFeed(), this.flickerFeed(), this.instagramFeed(), this.progressBars(), this.scrollAnimations(), this.tooltip(), this.popover(), e.fn.owlCarousel && this.owlCarousels(), this.countTo(), "object" == typeof noUiSlider && this.filterSliders(), e.fn.lightGallery && this.lightBox(), e.fn.matchHeight && this.matchProducts();
				var t = this;
				"function" == typeof imagesLoaded && (t.container.imagesLoaded(function () {
					t.isotopeActivate(), t.isotopeFilter()
				}), t.blogContainer.imagesLoaded(function () {
					t.blogMasonry()
				}))
			}
		},
		checkMobile: function () {
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? this.mobile = !0 : this.mobile = !1
		},
		pageLoadAnim: function () {
			e("#page-loader").length && e("#page-loader").delay(700).fadeOut(800, function () {
				e(this).remove()
			})
		},
		menuHover: function () {
			"object" == typeof Modernizr && Modernizr.mq("only all and (min-width: 768px)") && !Modernizr.touchevents && e.fn.hoverIntent && e(".medinovitaHeader .header").find(".navbar-nav").not(".nav-overlay").hoverIntent({
				over: function () {
					var t = e(this);
					t.addClass("open"), t.find("ul, div").length && t.find(".dropdown-toggle").addClass("disabled")
				},
				out: function () {
					var t = e(this);
					t.removeClass("open"), t.hasClass("open") && t.find(".dropdown-toggle").removeClass("disabled")
				},
				selector: "li",
				timeout: 100,
				interval: 40
			})
		},
		mobileMenuDropdownFix: function () {
			"object" == typeof Modernizr && (Modernizr.mq("only all and (max-width: 767px)") || Modernizr.touchevents) && e(".navbar-nav").not(".nav-overlay").find(".dropdown-toggle").on("click", function (t) {
				var a = e(this).closest("li");
				a.siblings().removeClass("open").find("li").removeClass("open"), a.toggleClass("open"), t.preventDefault(), t.stopPropagation()
			})
		},
		menuOnClick: function () {},
		stickyHeader: function () {
			if (e(".sticky-header").length && e(window).width() >= 992) new Waypoint.Sticky({
				element: e(".sticky-header")[0],
				stuckClass: "fixed",
				offset: -400
			})
		},
		overlayMenuToggle: function () {
			e(".menu-toggle").on("click", function (t) {
				e(".navbar-container").toggleClass("nav-open"), t.preventDefault()
			})
		},
		overlayMenuDropdownFix: function () {
			e(".nav-overlay").find(".dropdown-toggle").on("click", function (t) {
				var a = e(this).closest("li");
				a.siblings().removeClass("open").find("li").removeClass("open"), a.toggleClass("open"), t.preventDefault(), t.stopPropagation()
			})
		},
		sideMenu: function () {
			e.fn.metisMenu && e(".side-menu").metisMenu()
		},
		sideMenuToggle: function () {
			e(".sidemenu-toggle").on("click", function (t) {
				e(".header-inside").toggleClass("open"), t.preventDefault()
			})
		},
		owlCarousels: function () {
			e(".boxed-news-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 25,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 12e3,
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
			}), e(".portfolio-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".latest-posts-carousel-3col.owl-carousel").owlCarousel({
				loop: !1,
				margin: 30,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".portfolio-fullwidth-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !1,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".latest-posts-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 30,
				responsiveClass: !0,
				nav: !0,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !1,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".team-carousel-sm.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".latest-news-carousel-sm.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".portfolio-2col-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !1,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".clients-carousel-3col.owl-carousel").owlCarousel({
				loop: !0,
				margin: 10,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".latest-news-list-carousel.owl-carousel").owlCarousel({
				loop: !0,
				margin: 30,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 18e3,
				responsive: {
					0: {
						items: 1
					},
					992: {
						items: 2
					}
				}
			}), e(".portfolio-2row-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 30,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".latest-posts-carousel-4col.owl-carousel").owlCarousel({
				loop: !1,
				margin: 30,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".vertical-portfolio-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !1,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".vertical-team-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !1,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".vertical-posts-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !1,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".featured-entry-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 12e3,
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
			}), e(".testimonials-carousel-dots.owl-carousel").owlCarousel({
				loop: !0,
				margin: 30,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					}
				}
			}), e(".testimonials-slider-dots.owl-carousel").owlCarousel({
				loop: !0,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
				items: 1
			}), e(".top-products-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 12e3,
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
			}), e(".owl-carousel.banner-widget-slider").owlCarousel({
				loop: !0,
				items: 1,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 18e3
			}), e(".latest-news-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".top-products-carousel-5col.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 12e3,
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
			}), e(".latest-news-carousel-5col.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".trending-products-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 30,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".latest-posts-4col-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 30,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".owl-carousel.product-gallery").owlCarousel({
				loop: !1,
				margin: 3,
				responsiveClass: !0,
				nav: !1,
				dots: !1,
				autoplay: !0,
				autoplayTimeout: 1e4,
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
			}), e(".similiar-products-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 18e3,
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
			}), e(".testimonials-slider.owl-carousel").owlCarousel({
				items: 1,
				loop: !0,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3
			}), e(".clients-carousel.owl-carousel").owlCarousel({
				loop: !0,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".team-carousel.owl-carousel").owlCarousel({
				loop: !0,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 15e3,
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
			}), e(".testimonials-carousel.owl-carousel").owlCarousel({
				loop: !0,
				margin: 30,
				responsiveClass: !0,
				nav: !0,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !1,
				autoplay: !0,
				autoplayTimeout: 15e3,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					}
				}
			}), e(".about-slider.owl-carousel").owlCarousel({
				items: 1,
				loop: !0,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 12e3
			}), e(".portfolio-post-slider.owl-carousel").owlCarousel({
				loop: !0,
				items: 1,
				margin: 0,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 12e3,
				animateOut: "fadeOut"
			}), e(".portfolio-related-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 18e3,
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
			}), e(".blog-related-carousel.owl-carousel").owlCarousel({
				loop: !1,
				margin: 20,
				responsiveClass: !0,
				nav: !1,
				navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
				dots: !0,
				autoplay: !0,
				autoplayTimeout: 18e3,
				responsive: {
					0: {
						items: 1
					},
					600: {
						items: 2
					}
				}
			})
		},
		tooltip: function () {
			e.fn.tooltip && e('[data-toggle="tooltip"]').tooltip()
		},
		popover: function () {
			e.fn.popover && e('[data-toggle="popover"]').popover({
				trigger: "focus"
			})
		},
		scrollBtnAppear: function () {
			e(window).scrollTop() >= 400 ? e("#scroll-top").addClass("fixed") : e("#scroll-top").removeClass("fixed")
		},
		scrollToTop: function () {
			e("#scroll-top").on("click", function (t) {
				e("html, body").animate({
					scrollTop: 0
				}, 1200), t.preventDefault()
			})
		},
		lightBox: function () {
			e(".popup-gallery").lightGallery({
				selector: ".zoom-btn",
				thumbnail: !0,
				exThumbImage: "data-thumb",
				thumbWidth: 50,
				thumbContHeight: 60
			}), e(".video-btn-section").lightGallery({
				selector: ".trigger-video-btn",
				thumbnail: !1
			})
		},
		productZoom: function () {
			e.fn.elevateZoom && (e("#product-zoom").elevateZoom({
				responsive: !0,
				zoomType: "inner",
				borderColour: "#e1e1e1",
				zoomWindowPosition: 1,
				zoomWindowOffetx: 30,
				cursor: "crosshair",
				zoomWindowFadeIn: 400,
				zoomWindowFadeOut: 250,
				lensBorderSize: 3,
				lensOpacity: 1,
				lensColour: "rgba(255, 255, 255, 0.5)",
				lensShape: "square",
				lensSize: 200,
				scrollZoom: !0
			}), e(".product-gallery").find("a").on("click", function (t) {
				var a = e("#product-zoom").data("elevateZoom"),
					o = e(this).data("image"),
					s = e(this).data("zoom-image");
				a.swaptheimage(o, s), t.preventDefault()
			}))
		},
		progressBars: function () {
			e(".progress-animate").waypoint(function (t) {
				var a = e(this.element),
					o = a.data("width");
				a.css({
					width: o + "%"
				}, 400)
			}, {
				offset: "90%",
				triggerOnce: !0
			})
		},
		countTo: function () {
			e.fn.countTo ? e.fn.waypoint ? e(".count").waypoint(function () {
				e(this.element).countTo()
			}, {
				offset: "90%",
				triggerOnce: !0
			}) : e(".count").countTo() : e(".count").each(function () {
				var t = e(this),
					a = t.data("to");
				t.text(a)
			})
		},
		scrollAnimations: function () {
			"function" == typeof WOW && new WOW({
				boxClass: "wow",
				animateClass: "animated",
				offset: 0
			}).init()
		},
		twitterFeed: function () {
			e.fn.tweet && e(".twitter-feed-widget").length && e(".twitter-feed-widget").tweet({
				modpath: "/assets/js/twitter/",
				avatar_size: "",
				count: 2,
				query: "wrapbootstrap",
				loading_text: "searching twitter...",
				join_text: "",
				retweets: !1,
				template: '<div class="twitter-icon"><i class="fa fa-twitter"></i></div><div class="tweet-content">{text}{time}</div>'
			})
		},
		flickerFeed: function () {
			e.fn.jflickrfeed && e(".flickr-widget-list").jflickrfeed({
				limit: 12,
				qstrings: {
					id: "56502208@N00"
				},
				itemTemplate: '<li><a href="{{image}}" target="_blank" title="{{title}}"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
			})
		},
		instagramFeed: function () {
			e.fn.spectragram && e("#instafeed").length && (jQuery.fn.spectragram.accessData = {
				accessToken: "2229187323.566f1cf.c41eaca370664379b822dc3b17bb1464",
				clientID: "7c28e44736494357ba3df343b1c699fe"
			}, jQuery("#instafeed").spectragram("getUserFeed", {
				query: "pizza",
				max: 13,
				size: "medium",
				wrapEachWith: "",
				complete: function () {
					e("#instafeed.owl-carousel").owlCarousel({
						loop: !0,
						margin: 0,
						responsiveClass: !0,
						nav: !1,
						dots: !1,
						autoplay: !0,
						autoplayTimeout: 15e3,
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
					})
				}
			}))
		},
		filterSliders: function () {
			var e = document.getElementById("price-slider");
			null != e && (noUiSlider.create(e, {
				start: [100, 900],
				connect: !0,
				step: 50,
				range: {
					min: 0,
					max: 1e3
				}
			}), this.sliderText(e, "$"))
		},
		sliderText: function (e, t) {
			for (var a = t ? "$" : null, o = e.getElementsByClassName("noUi-handle"), s = [], i = 0; i < o.length; i++) s[i] = document.createElement("div"), o[i].appendChild(s[i]);
			e.noUiSlider.on("update", function (e, t) {
				s[t].innerHTML = a ? a + e[t] : Math.round(e[t])
			})
		},
		isotopeActivate: function () {
			if (e.fn.isotope) {
				var t = this.container,
					a = t.data("layoutmode");
				t.isotope({
					itemSelector: ".portfolio-item",
					layoutMode: a || "masonry"
				})
			}
		},
		isotopeReinit: function () {
			e.fn.isotope && (this.container.isotope("destroy"), this.isotopeActivate())
		},
		isotopeFilter: function () {
			var t = this,
				a = e("#portfolio-filter, #nav-portfolio-filter");
			a.find("a").on("click", function (o) {
				var s = e(this),
					i = s.attr("data-filter");
				a.find(".active").removeClass("active"), t.container.isotope({
					filter: i,
					transitionDuration: "0.8s"
				}), s.closest("li").addClass("active"), o.preventDefault()
			})
		},
		blogMasonry: function () {
			e.fn.isotope && this.blogContainer.isotope({
				itemSelector: ".entry-grid",
				layoutMode: "masonry"
			})
		},
		matchProducts: function () {
			e(".products-container").each(function () {
				e(this).find(".product").matchHeight()
			})
		}
	};
	jQuery(document).ready(function () {
		t.init(), document.querySelector("#clinic-details") && (e(window).scroll(sticky_relocate), sticky_relocate())
	}), e(window).on("load", function () {
		t.scrollBtnAppear()
	}), e(window).on("scroll", function () {
		t.scrollBtnAppear()
	}), e("#bestHosp-submitEnquiryForm").submit(function (t) {
		console.log("hello"), t.preventDefault();
		var a = getUniqueNumber(),
			o = e("#besthosp-contactname").val(),
			s = e("#besthosp-contactemail").val(),
			i = e("#inputSubmitEnquiryISDCode").val(),
			n = e("#besthosp-contactNumber").val();
		e.ajax({
			url: serverName + "api/v1/submit/enquiry/" + a + "/meditrip",
			type: "POST",
			headers: {
				"Content-type": "application/json",
				Authorization: "Basic " + basicKey,
				"x-access-token": xAccessToken
			},
			beforeSend: function (e) {
				e.setRequestHeader("Authorization", "Basic " + basicKey)
			},
			data: JSON.stringify({
				emailID: s,
				userFullName: o,
				isdCode: i,
				primaryPhonenumber: n,
				procedureName: "ayur",
				commuMedium: "English",
				caseDescription: "Best hospitals page info",
				attachment: "N",
				attachmentName: a + ".zip"
			}),
			success: function (t) {
				document.getElementById("bestHosp-submitEnquiryForm").reset();
				var a = document.createElement("p");
				a.classList.add("tokenMsg"), e(".gotoHide").slideUp(400, function () {
					a.textContent = "Thank you for contacting us, our customer care team will get back to you as soon as possible!", e(".bestHosp-toHide").append(a)
				})
			},
			error: function (e) {
				console.log("exception", e)
			}
		})
	}), e("#contact-form").submit(function (t) {
		console.log("contact submit"), t.preventDefault();
		var a = e("#contactname").val(),
			o = e("#contactemail").val(),
			s = e("#contactsubject").val(),
			i = e("#contactmessage").val();
		e("#sendMessage").val();
		return e.ajax({
			type: "post",
			url: serverName + "api/v1/post/contactus/meditrip",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Basic " + basicKey,
				"x-access-token": xAccessToken
			},
			beforeSend: function (e) {
				e.setRequestHeader("Authorization", "Basic " + basicKey)
			},
			data: JSON.stringify({
				emailID: o,
				userFullName: a,
				subject: s,
				message: i
			}),
			success: function (t) {
				e(".officeAdd").hide(), e(".toHide").slideUp(400, function () {
					e(".form-message").append("<span>Thank you for contacting us, we will get back to you as soon as possible!</span>")
				})
			},
			error: function (e) {
				console.log(e)
			}
		}), !1
	})
}(jQuery), $("#questionnaire-form").on("submit", function (e) {
	e.preventDefault();
	var t = getUniqueNumber();
	$.ajax({
		url: serverName + "api/v1/post/questionnaire",
		data: $("#questionnaire-form").serialize(),
		type: "POST",
		success: function (e) {
			$("#messageModal").modal("show"), document.getElementById("questionnaire-form").reset(), $(this).find("#uploadmsg").css("color", "green"), $(this).find("#uploadmsg").text("Submitted form successfully")
		},
		error: function (e) {
			$(this).find("#uploadmsg").css("color", "red"), $(this).find("#uploadmsg").text("Failed to submit the questionannire")
		}
	});
	var a = "",
		o = $("#files").get(0).files,
		s = o.length,
		i = new FormData;
	if (s >= 1) {
		var n = ".png,.jpeg,.jpg,.pdf,.doc,.docx";
		if ("Y", s >= 5) return $(this).find("#uploadmsg").text("Only 5 files are allowed at a time"), $(this).find("#files").val(""), !1;
		for (var l = 0; l < s; l++) {
			var r = o[l],
				c = r.name;
			a = a + c + ",";
			var u = c.substring(c.lastIndexOf(".") + 1).toLowerCase();
			if (i.append("files", r, r.name), 1e-6 * r.size > 5) return $(this).find("#files").val(""), $(this).find("#uploadmsg").text("Please upload files having size less than 5MB"), $(this).find("#uploadmsg").focus(), !1;
			if (n.indexOf(u) < 0) return $(this).find("#files").val(""), $(this).find("#uploadmsg").text("Please upload only allowed file types " + n), $(this).find("#uploadmsg").focus(), !1
		}
		$(this).find("#filesubmit").focus(), $.ajax({
			url: serverName + "cloud/zip/upload/" + t,
			data: i,
			type: "POST",
			contentType: !1,
			processData: !1,
			async: !1,
			success: function (e) {
				$(this).find("#files").val(""), console.log("File upload success")
			},
			error: function (e) {
				$(this).find("#uploadmsg").text("File upload is failed"), console.log("upload exception"), $(this).find("#files").val(""), $(this).find("#uploadmsg").css("color", "red"), $(this).find("#uploadmsg").text("File upload failed,but rest of the details were submitted successfully")
			}
		}), $(this).find("#files").val("")
	}
}), $(".enq_desc_lnk").on("click", function (e) {
	e.preventDefault(), $("#questionnairemodel").modal("show");
	var t = $(".hdn_desc").text();
	"" == t && (t = "User did not submit the case details"), $("#questionnairemodel").find(".mdlbody").text(t)
}), $(".enq_quest_lnk").on("click", function (e) {
	e.preventDefault();
	var t = $(".hdn_qstn").text();
	"" == t && (t = "User is yet to submit questionnaire"), $("#questionnairemodel").modal("show"), $("#questionnairemodel").find(".mdlbody").text(t)
}), $("#meddoc").on("click", function (e) {
	e.preventDefault(), $.ajax({
		url: serverName + "api/cloud/download/medicaldocs/meditrip",
		type: "POST",
		async: !1,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		data: JSON.stringify({
			fileName: $(this).attr("value")
		}),
		dataType: "json",
		success: function (e) {
			window.location = e.URL
		},
		error: function (e) {
			console.log(e.message)
		}
	})
}), $("#enqsave").on("click", function (e) {
	e.preventDefault(), $.ajax({
		url: serverName + "api/update/enqstatus/meditrip",
		type: "POST",
		async: !1,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + basicKey,
			"x-access-token": xAccessToken
		},
		beforeSend: function (e) {
			e.setRequestHeader("Authorization", "Basic " + basicKey)
		},
		data: JSON.stringify({
			enquiryID: $(this).attr("value"),
			enqstatus: $(this).closest("tr").find("select.input-sm")[0].selectedOptions[0].textContent,
			userEmail: $(this).closest("tr").find("td:eq(2)").text()
		}),
		dataType: "json",
		success: function (e) {
			console.log("success"), $("#questionnairemodel").find(".mdlbody").text(e.Data), $("#questionnairemodel").modal("show")
		},
		error: function (e) {
			console.log("error"), console.log(e)
		}
	})
});
