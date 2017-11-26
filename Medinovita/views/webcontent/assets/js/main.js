/* ================================================
----------------- Simple Main.js ------------- */
//Global Variables




var basicKey = "bGliaW46bGliaW4=";
var xAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiVG9rZW5Ub0F1dGhlbnRpY2F0ZU1lZGlub3ZpdGFVc2VyIiwiaWF0IjoxNTA4MDQ0OTMwfQ.cZ3pCte1guE8KQkjd1KfY_bLJ-gOatJm2xlwyiLGAl4";
var serverName = "https://www.medinovita.in/";
var GLOBAL_VARIABLES = {
	"Language": "en",
	"Currency": "dollar"
}

var countryCodes = [{ "name": "Afghanistan", "dial_code": "+93", "code": "AF" }, { "name": "Aland Islands", "dial_code": "+358", "code": "AX" }, { "name": "Albania", "dial_code": "+355", "code": "AL" }, { "name": "Algeria", "dial_code": "+213", "code": "DZ" }, { "name": "AmericanSamoa", "dial_code": "+1684", "code": "AS" }, { "name": "Andorra", "dial_code": "+376", "code": "AD" }, { "name": "Angola", "dial_code": "+244", "code": "AO" }, { "name": "Anguilla", "dial_code": "+1264", "code": "AI" }, { "name": "Antarctica", "dial_code": "+672", "code": "AQ" }, { "name": "Antigua and Barbuda", "dial_code": "+1268", "code": "AG" }, { "name": "Argentina", "dial_code": "+54", "code": "AR" }, { "name": "Armenia", "dial_code": "+374", "code": "AM" }, { "name": "Aruba", "dial_code": "+297", "code": "AW" }, { "name": "Australia", "dial_code": "+61", "code": "AU" }, { "name": "Austria", "dial_code": "+43", "code": "AT" }, { "name": "Azerbaijan", "dial_code": "+994", "code": "AZ" }, { "name": "Bahamas", "dial_code": "+1242", "code": "BS" }, { "name": "Bahrain", "dial_code": "+973", "code": "BH" }, { "name": "Bangladesh", "dial_code": "+880", "code": "BD" }, { "name": "Barbados", "dial_code": "+1246", "code": "BB" }, { "name": "Belarus", "dial_code": "+375", "code": "BY" }, { "name": "Belgium", "dial_code": "+32", "code": "BE" }, { "name": "Belize", "dial_code": "+501", "code": "BZ" }, { "name": "Benin", "dial_code": "+229", "code": "BJ" }, { "name": "Bermuda", "dial_code": "+1441", "code": "BM" }, { "name": "Bhutan", "dial_code": "+975", "code": "BT" }, { "name": "Bolivia, Plurinational State of bolivia", "dial_code": "+591", "code": "BO" }, { "name": "Bosnia and Herzegovina", "dial_code": "+387", "code": "BA" }, { "name": "Botswana", "dial_code": "+267", "code": "BW" }, { "name": "Brazil", "dial_code": "+55", "code": "BR" }, { "name": "British Indian Ocean Territory", "dial_code": "+246", "code": "IO" }, { "name": "Brunei Darussalam", "dial_code": "+673", "code": "BN" }, { "name": "Bulgaria", "dial_code": "+359", "code": "BG" }, { "name": "Burkina Faso", "dial_code": "+226", "code": "BF" }, { "name": "Burundi", "dial_code": "+257", "code": "BI" }, { "name": "Cambodia", "dial_code": "+855", "code": "KH" }, { "name": "Cameroon", "dial_code": "+237", "code": "CM" }, { "name": "Canada", "dial_code": "+1", "code": "CA" }, { "name": "Cape Verde", "dial_code": "+238", "code": "CV" }, { "name": "Cayman Islands", "dial_code": "+ 345", "code": "KY" }, { "name": "Central African Republic", "dial_code": "+236", "code": "CF" }, { "name": "Chad", "dial_code": "+235", "code": "TD" }, { "name": "Chile", "dial_code": "+56", "code": "CL" }, { "name": "China", "dial_code": "+86", "code": "CN" }, { "name": "Christmas Island", "dial_code": "+61", "code": "CX" }, { "name": "Cocos (Keeling) Islands", "dial_code": "+61", "code": "CC" }, { "name": "Colombia", "dial_code": "+57", "code": "CO" }, { "name": "Comoros", "dial_code": "+269", "code": "KM" }, { "name": "Congo", "dial_code": "+242", "code": "CG" }, { "name": "Congo, The Democratic Republic of the Congo", "dial_code": "+243", "code": "CD" }, { "name": "Cook Islands", "dial_code": "+682", "code": "CK" }, { "name": "Costa Rica", "dial_code": "+506", "code": "CR" }, { "name": "Cote d'Ivoire", "dial_code": "+225", "code": "CI" }, { "name": "Croatia", "dial_code": "+385", "code": "HR" }, { "name": "Cuba", "dial_code": "+53", "code": "CU" }, { "name": "Cyprus", "dial_code": "+357", "code": "CY" }, { "name": "Czech Republic", "dial_code": "+420", "code": "CZ" }, { "name": "Denmark", "dial_code": "+45", "code": "DK" }, { "name": "Djibouti", "dial_code": "+253", "code": "DJ" }, { "name": "Dominica", "dial_code": "+1767", "code": "DM" }, { "name": "Dominican Republic", "dial_code": "+1849", "code": "DO" }, { "name": "Ecuador", "dial_code": "+593", "code": "EC" }, { "name": "Egypt", "dial_code": "+20", "code": "EG" }, { "name": "El Salvador", "dial_code": "+503", "code": "SV" }, { "name": "Equatorial Guinea", "dial_code": "+240", "code": "GQ" }, { "name": "Eritrea", "dial_code": "+291", "code": "ER" }, { "name": "Estonia", "dial_code": "+372", "code": "EE" }, { "name": "Ethiopia", "dial_code": "+251", "code": "ET" }, { "name": "Falkland Islands (Malvinas)", "dial_code": "+500", "code": "FK" }, { "name": "Faroe Islands", "dial_code": "+298", "code": "FO" }, { "name": "Fiji", "dial_code": "+679", "code": "FJ" }, { "name": "Finland", "dial_code": "+358", "code": "FI" }, { "name": "France", "dial_code": "+33", "code": "FR" }, { "name": "French Guiana", "dial_code": "+594", "code": "GF" }, { "name": "French Polynesia", "dial_code": "+689", "code": "PF" }, { "name": "Gabon", "dial_code": "+241", "code": "GA" }, { "name": "Gambia", "dial_code": "+220", "code": "GM" }, { "name": "Georgia", "dial_code": "+995", "code": "GE" }, { "name": "Germany", "dial_code": "+49", "code": "DE" }, { "name": "Ghana", "dial_code": "+233", "code": "GH" }, { "name": "Gibraltar", "dial_code": "+350", "code": "GI" }, { "name": "Greece", "dial_code": "+30", "code": "GR" }, { "name": "Greenland", "dial_code": "+299", "code": "GL" }, { "name": "Grenada", "dial_code": "+1473", "code": "GD" }, { "name": "Guadeloupe", "dial_code": "+590", "code": "GP" }, { "name": "Guam", "dial_code": "+1671", "code": "GU" }, { "name": "Guatemala", "dial_code": "+502", "code": "GT" }, { "name": "Guernsey", "dial_code": "+44", "code": "GG" }, { "name": "Guinea", "dial_code": "+224", "code": "GN" }, { "name": "Guinea-Bissau", "dial_code": "+245", "code": "GW" }, { "name": "Guyana", "dial_code": "+592", "code": "GY" }, { "name": "Haiti", "dial_code": "+509", "code": "HT" }, { "name": "Holy See (Vatican City State)", "dial_code": "+379", "code": "VA" }, { "name": "Honduras", "dial_code": "+504", "code": "HN" }, { "name": "Hong Kong", "dial_code": "+852", "code": "HK" }, { "name": "Hungary", "dial_code": "+36", "code": "HU" }, { "name": "Iceland", "dial_code": "+354", "code": "IS" }, { "name": "India", "dial_code": "+91", "code": "IN" }, { "name": "Indonesia", "dial_code": "+62", "code": "ID" }, { "name": "Iran, Islamic Republic of Persian Gulf", "dial_code": "+98", "code": "IR" }, { "name": "Iraq", "dial_code": "+964", "code": "IQ" }, { "name": "Ireland", "dial_code": "+353", "code": "IE" }, { "name": "Isle of Man", "dial_code": "+44", "code": "IM" }, { "name": "Israel", "dial_code": "+972", "code": "IL" }, { "name": "Italy", "dial_code": "+39", "code": "IT" }, { "name": "Jamaica", "dial_code": "+1876", "code": "JM" }, { "name": "Japan", "dial_code": "+81", "code": "JP" }, { "name": "Jersey", "dial_code": "+44", "code": "JE" }, { "name": "Jordan", "dial_code": "+962", "code": "JO" }, { "name": "Kazakhstan", "dial_code": "+7", "code": "KZ" }, { "name": "Kenya", "dial_code": "+254", "code": "KE" }, { "name": "Kiribati", "dial_code": "+686", "code": "KI" }, { "name": "Korea, Democratic People's Republic of Korea", "dial_code": "+850", "code": "KP" }, { "name": "Korea, Republic of South Korea", "dial_code": "+82", "code": "KR" }, { "name": "Kuwait", "dial_code": "+965", "code": "KW" }, { "name": "Kyrgyzstan", "dial_code": "+996", "code": "KG" }, { "name": "Laos", "dial_code": "+856", "code": "LA" }, { "name": "Latvia", "dial_code": "+371", "code": "LV" }, { "name": "Lebanon", "dial_code": "+961", "code": "LB" }, { "name": "Lesotho", "dial_code": "+266", "code": "LS" }, { "name": "Liberia", "dial_code": "+231", "code": "LR" }, { "name": "Libyan Arab Jamahiriya", "dial_code": "+218", "code": "LY" }, { "name": "Liechtenstein", "dial_code": "+423", "code": "LI" }, { "name": "Lithuania", "dial_code": "+370", "code": "LT" }, { "name": "Luxembourg", "dial_code": "+352", "code": "LU" }, { "name": "Macao", "dial_code": "+853", "code": "MO" }, { "name": "Macedonia", "dial_code": "+389", "code": "MK" }, { "name": "Madagascar", "dial_code": "+261", "code": "MG" }, { "name": "Malawi", "dial_code": "+265", "code": "MW" }, { "name": "Malaysia", "dial_code": "+60", "code": "MY" }, { "name": "Maldives", "dial_code": "+960", "code": "MV" }, { "name": "Mali", "dial_code": "+223", "code": "ML" }, { "name": "Malta", "dial_code": "+356", "code": "MT" }, { "name": "Marshall Islands", "dial_code": "+692", "code": "MH" }, { "name": "Martinique", "dial_code": "+596", "code": "MQ" }, { "name": "Mauritania", "dial_code": "+222", "code": "MR" }, { "name": "Mauritius", "dial_code": "+230", "code": "MU" }, { "name": "Mayotte", "dial_code": "+262", "code": "YT" }, { "name": "Mexico", "dial_code": "+52", "code": "MX" }, { "name": "Micronesia, Federated States of Micronesia", "dial_code": "+691", "code": "FM" }, { "name": "Moldova", "dial_code": "+373", "code": "MD" }, { "name": "Monaco", "dial_code": "+377", "code": "MC" }, { "name": "Mongolia", "dial_code": "+976", "code": "MN" }, { "name": "Montenegro", "dial_code": "+382", "code": "ME" }, { "name": "Montserrat", "dial_code": "+1664", "code": "MS" }, { "name": "Morocco", "dial_code": "+212", "code": "MA" }, { "name": "Mozambique", "dial_code": "+258", "code": "MZ" }, { "name": "Myanmar", "dial_code": "+95", "code": "MM" }, { "name": "Namibia", "dial_code": "+264", "code": "NA" }, { "name": "Nauru", "dial_code": "+674", "code": "NR" }, { "name": "Nepal", "dial_code": "+977", "code": "NP" }, { "name": "Netherlands", "dial_code": "+31", "code": "NL" }, { "name": "Netherlands Antilles", "dial_code": "+599", "code": "AN" }, { "name": "New Caledonia", "dial_code": "+687", "code": "NC" }, { "name": "New Zealand", "dial_code": "+64", "code": "NZ" }, { "name": "Nicaragua", "dial_code": "+505", "code": "NI" }, { "name": "Niger", "dial_code": "+227", "code": "NE" }, { "name": "Nigeria", "dial_code": "+234", "code": "NG" }, { "name": "Niue", "dial_code": "+683", "code": "NU" }, { "name": "Norfolk Island", "dial_code": "+672", "code": "NF" }, { "name": "Northern Mariana Islands", "dial_code": "+1670", "code": "MP" }, { "name": "Norway", "dial_code": "+47", "code": "NO" }, { "name": "Oman", "dial_code": "+968", "code": "OM" }, { "name": "Pakistan", "dial_code": "+92", "code": "PK" }, { "name": "Palau", "dial_code": "+680", "code": "PW" }, { "name": "Palestinian Territory, Occupied", "dial_code": "+970", "code": "PS" }, { "name": "Panama", "dial_code": "+507", "code": "PA" }, { "name": "Papua New Guinea", "dial_code": "+675", "code": "PG" }, { "name": "Paraguay", "dial_code": "+595", "code": "PY" }, { "name": "Peru", "dial_code": "+51", "code": "PE" }, { "name": "Philippines", "dial_code": "+63", "code": "PH" }, { "name": "Pitcairn", "dial_code": "+64", "code": "PN" }, { "name": "Poland", "dial_code": "+48", "code": "PL" }, { "name": "Portugal", "dial_code": "+351", "code": "PT" }, { "name": "Puerto Rico", "dial_code": "+1939", "code": "PR" }, { "name": "Qatar", "dial_code": "+974", "code": "QA" }, { "name": "Romania", "dial_code": "+40", "code": "RO" }, { "name": "Russia", "dial_code": "+7", "code": "RU" }, { "name": "Rwanda", "dial_code": "+250", "code": "RW" }, { "name": "Reunion", "dial_code": "+262", "code": "RE" }, { "name": "Saint Barthelemy", "dial_code": "+590", "code": "BL" }, { "name": "Saint Helena, Ascension and Tristan Da Cunha", "dial_code": "+290", "code": "SH" }, { "name": "Saint Kitts and Nevis", "dial_code": "+1869", "code": "KN" }, { "name": "Saint Lucia", "dial_code": "+1758", "code": "LC" }, { "name": "Saint Martin", "dial_code": "+590", "code": "MF" }, { "name": "Saint Pierre and Miquelon", "dial_code": "+508", "code": "PM" }, { "name": "Saint Vincent and the Grenadines", "dial_code": "+1784", "code": "VC" }, { "name": "Samoa", "dial_code": "+685", "code": "WS" }, { "name": "San Marino", "dial_code": "+378", "code": "SM" }, { "name": "Sao Tome and Principe", "dial_code": "+239", "code": "ST" }, { "name": "Saudi Arabia", "dial_code": "+966", "code": "SA" }, { "name": "Senegal", "dial_code": "+221", "code": "SN" }, { "name": "Serbia", "dial_code": "+381", "code": "RS" }, { "name": "Seychelles", "dial_code": "+248", "code": "SC" }, { "name": "Sierra Leone", "dial_code": "+232", "code": "SL" }, { "name": "Singapore", "dial_code": "+65", "code": "SG" }, { "name": "Slovakia", "dial_code": "+421", "code": "SK" }, { "name": "Slovenia", "dial_code": "+386", "code": "SI" }, { "name": "Solomon Islands", "dial_code": "+677", "code": "SB" }, { "name": "Somalia", "dial_code": "+252", "code": "SO" }, { "name": "South Africa", "dial_code": "+27", "code": "ZA" }, { "name": "South Sudan", "dial_code": "+211", "code": "SS" }, { "name": "South Georgia and the South Sandwich Islands", "dial_code": "+500", "code": "GS" }, { "name": "Spain", "dial_code": "+34", "code": "ES" }, { "name": "Sri Lanka", "dial_code": "+94", "code": "LK" }, { "name": "Sudan", "dial_code": "+249", "code": "SD" }, { "name": "Suriname", "dial_code": "+597", "code": "SR" }, { "name": "Svalbard and Jan Mayen", "dial_code": "+47", "code": "SJ" }, { "name": "Swaziland", "dial_code": "+268", "code": "SZ" }, { "name": "Sweden", "dial_code": "+46", "code": "SE" }, { "name": "Switzerland", "dial_code": "+41", "code": "CH" }, { "name": "Syrian Arab Republic", "dial_code": "+963", "code": "SY" }, { "name": "Taiwan", "dial_code": "+886", "code": "TW" }, { "name": "Tajikistan", "dial_code": "+992", "code": "TJ" }, { "name": "Tanzania, United Republic of Tanzania", "dial_code": "+255", "code": "TZ" }, { "name": "Thailand", "dial_code": "+66", "code": "TH" }, { "name": "Timor-Leste", "dial_code": "+670", "code": "TL" }, { "name": "Togo", "dial_code": "+228", "code": "TG" }, { "name": "Tokelau", "dial_code": "+690", "code": "TK" }, { "name": "Tonga", "dial_code": "+676", "code": "TO" }, { "name": "Trinidad and Tobago", "dial_code": "+1868", "code": "TT" }, { "name": "Tunisia", "dial_code": "+216", "code": "TN" }, { "name": "Turkey", "dial_code": "+90", "code": "TR" }, { "name": "Turkmenistan", "dial_code": "+993", "code": "TM" }, { "name": "Turks and Caicos Islands", "dial_code": "+1649", "code": "TC" }, { "name": "Tuvalu", "dial_code": "+688", "code": "TV" }, { "name": "Uganda", "dial_code": "+256", "code": "UG" }, { "name": "Ukraine", "dial_code": "+380", "code": "UA" }, { "name": "United Arab Emirates", "dial_code": "+971", "code": "AE" }, { "name": "United Kingdom", "dial_code": "+44", "code": "GB" }, { "name": "United States", "dial_code": "+1", "code": "US" }, { "name": "Uruguay", "dial_code": "+598", "code": "UY" }, { "name": "Uzbekistan", "dial_code": "+998", "code": "UZ" }, { "name": "Vanuatu", "dial_code": "+678", "code": "VU" }, { "name": "Venezuela, Bolivarian Republic of Venezuela", "dial_code": "+58", "code": "VE" }, { "name": "Vietnam", "dial_code": "+84", "code": "VN" }, { "name": "Virgin Islands, British", "dial_code": "+1284", "code": "VG" }, { "name": "Virgin Islands, U.S.", "dial_code": "+1340", "code": "VI" }, { "name": "Wallis and Futuna", "dial_code": "+681", "code": "WF" }, { "name": "Yemen", "dial_code": "+967", "code": "YE" }, { "name": "Zambia", "dial_code": "+260", "code": "ZM" }, { "name": "Zimbabwe", "dial_code": "+263", "code": "ZW" }]

var officeAddress = "Kakkanad PO,Kochi, Kerala,India";

var whyIndia = "Because India.";

//Global Methods
// Function replace Native Alert
  window.alert = function (msg) {
    var h, html, source, template;
    source = $("#tpl-alert").html();
    template = Handlebars.compile(source);
    html = $(template({
      message: new Handlebars.SafeString(msg)
    }));
    $("body").append(html);
    html.addClass("is-visible");
    h = html.find(".window-message-container").height();
    html.find(".window-message-container").hide().fadeIn("fast");
    return html.find("a").on("click", function (_this) {
      return function (e) {
        e.stopPropagation();
        html.remove();
        return false;
      };
    }(this));
  };
  // END Function replace Native Alert





(function ($) {
	"use strict";
	$(".medinovitaHeader").load("../assets/pages/header.html",function(){
		$('#costPageMenu').on('click',function(){
			document.location.href='/cost.html';
		})
		$('#contactPageMenu').on('click', function () {
			//var id = $(this).attr('id');
			//$('.contact').html('');
			//console.log("hello " + $(this).attr('href'))
			//console.log($(this).val())
			//$('.contact').load("/contact.html")

			document.location.href = '/contact.html';
		});
		$('#homeMenu').on('click',function(){
			document.location.href = '/index.html';
			//homepageCallback();
		})
		$('#treatmentsOfferedUL li a').on('click', function (e) {
			e.preventDefault();
			var id = $(this).attr('id');

			setCookie("treatmentPage", id,1);
			document.location.href = '/treatmentsOffered.html';
		})

		$('#medicalVisaPageMenu').on('click', function () {


			document.location.href = '/MedicalVisatoIndia.html';
		});

		$('#ourServicesPageMenu').on('click', function () {
			document.location.href = '/ourservices.html';
		});

	});
$(".medinovitaFooter").load("../assets/pages/footer.html",function(){
$.ajax({
	url: serverName+"api/v1/get/officelocations/meditrip",
	type: 'GET',
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Basic "+ basicKey,
		"x-access-token": xAccessToken

	},
	beforeSend: function (xhr) {
		xhr.setRequestHeader("Authorization", "Basic " + basicKey);
	},
	success: function (response) {
		officeAddress = response[0].country +"<br>"+response[0].officeCity[0].city+ "<br>" +response[0].officeCity[0].officeLocation[0].addressLine1 +"<br>"+response[0].officeCity[0].officeLocation[0].addressLine2 + "<br>" + response[0].officeCity[0].officeLocation[0].landMark + "<br>" + response[0].officeCity[0].officeLocation[0].officeEmailId + "<br>" + response[0].officeCity[0].officeLocation[0].contactPerson;
		document.querySelector('p.office-address').innerHTML = officeAddress;
	},
	error: function (exception) {
		console.log(exception);
	}
});




$.ajax({
	url: serverName+"api/v1/get/homepagedetails/meditrip",
	type: 'GET',
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Basic " + basicKey,
		"x-access-token": xAccessToken
	},
	beforeSend: function (xhr) {
		xhr.setRequestHeader("Authorization", "Basic " + basicKey);
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
$(".medinovitaModals").load("../assets/pages/modals.html",function(){

	$('#submitEnquiryForm').on('submit',function(e){
		e.preventDefault();
		var formData=$(this).serializeArray();
		var v = grecaptcha.getResponse();
		if (v.length == 0) {
			document.getElementById('captcha').innerHTML = "Please verify that you are not a robot";
			return false;
		}
		else {
			document.getElementById('captcha').innerHTML = "Verification completed";
	
		}
	$.ajax({
			url: serverName+"api/v1/submit/enquiry/meditrip",
			type: 'POST',
			headers: {
					'Content-type': 'application/json',
				"Authorization": "Basic "+ basicKey,
				"x-access-token": xAccessToken
			},
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + basicKey);
			},
			data:JSON.stringify({emailID:formData[1].value,
		userFullName:formData[0].value,
		isdCode:formData[2].value,
		primaryPhonenumber:formData[3].value,
		procedureName:formData[4].value,
		commuMedium:"English",
		caseDescription:formData[5].value,
		attachment:"N",
		attachmentName:"null"}),
			success: function (response) {
				alert("Thanks for contacting us, we will get back to you soon")
			},
			error: function (exception) {
				console.log(exception)
			}
		});
	
		$('#modal-container-SubmitEnquiry').modal('toggle');
	})
	
	$('#modal-container-SubmitEnquiry').on('shown.bs.modal',function(){
		 $('.modal .modal-body').css('overflow-y', 'auto');
		$('.modal .modal-body').css('max-height', $(window).height() *0.9);
	
		})
		countryCodes.forEach(function(value,index){
			 $('#inputSubmitEnquiryISDCode').append($('<option>', {
			value: value.dial_code,
			text : value.name.substr(0,5) + " (" + value.code+ ") " + value.dial_code
		}));
	});

	//Fetch search Treatments list
	$.ajax({
		url: serverName + "api/v1/getTreamentlist/all/meditrip",
		type: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + basicKey,
			"x-access-token": xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + basicKey);
		},
		success: function (response) {
			var treatmentList = response;
			//Populate Treatment Dropdown
			$("#getQuoteTreatment").autocomplete({
				source: treatmentList
			});

			var selectBox = document.getElementById("selectSubmitEnquiryProcedure");
			treatmentList.forEach(function (item, index) {
				var option = document.createElement("option")
				option.text = item;
				option.value = item.substr(0, item.length - 10).trim();
				selectBox.add(option);
			});

		},
		error: function (exception) {
			console.log(exception);
		}
	});

if(window.location.href.indexOf("index")>-1 || window.location.href=="https://www.medinovita.in/"){
	homepageCallback();
}
if (window.location.href.indexOf("treatmentsOffered") > -1) {
	treatmentsOfferedCallback(getCookie("treatmentPage"));
}
if (window.location.href.indexOf("MedicalVisatoIndia") > -1) {
	medicalVisacallback();
}
if(window.location.href.indexOf("cost")>-1){
	costCallback();
}
});
//Hospitals and Doctors selected
$('#hospitalsPageMenu').on('click',function(){
	$('.main').html('');
	$('.main').load("hospitalzone.html", function (data) { });
})







	//Google Translate Section starts
	// Change font family and color
	$("iframe").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *")
		.css({
			'color': '#005d9c',
			'font-family': 'tahoma'
		});

	// Change hover effects
	$("iframe").contents().find(".goog-te-menu2-item div").hover(function () {
		$(this).css('background-color', '#F38256').find('span.text').css('color', 'white');
	}, function () {
		$(this).css('background-color', 'white').find('span.text').css('color', '#544F4B');
	});

	// Change Google's default blue border
	$("iframe").contents().find('.goog-te-menu2').css('border', '1px solid #F38256');

	// Change the iframe's box shadow
	$(".goog-te-menu-frame").css({
		'-moz-box-shadow': '0 3px 8px 2px #666666',
		'-webkit-box-shadow': '0 3px 8px 2px #666',
		'box-shadow': '0 3px 8px 2px #666'
	});
	$(".goog-te-combo").css({
		'color': '#ffffff',
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
			if (typeof noUiSlider === "object") {
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
			if (typeof Modernizr === "object" && Modernizr.mq('only all and (min-width: 768px)') && !Modernizr.touchevents) {
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
			if (typeof Modernizr === "object" && (Modernizr.mq('only all and (max-width: 767px)') || Modernizr.touchevents)) {
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
					'scrollTop': 0
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
					cursor: "crosshair", //
					zoomWindowFadeIn: 400,
					zoomWindowFadeOut: 250,
					lensBorderSize: 3, // lens border size
					lensOpacity: 1,
					lensColour: 'rgba(255, 255, 255, 0.5)', // lens color
					lensShape: "square", // circle lens shape can be uses
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
					'width': progressVal + '%'
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
					modpath: '../assets/js/twitter/',
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
					'min': 0,
					'max': 1000
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


	// Google Map api v3 - Map for contact pages
	if (document.getElementById("map") && typeof google === "object") {
		// Map pin coordinates and content of pin box
		var locations = [
			[
				'<address><strong>Address:</strong> Hollywood Blvd, Los Angeles, CA, USA <br> <strong>Phone:</strong> +01 010 554 11 22 </address>',
				34.101780, -118.333655
			]
		];

		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 14,
			center: new google.maps.LatLng(34.101780, -118.333655), // Map Center coordinates
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		var infowindow = new google.maps.InfoWindow();


		var marker, i;

		for (i = 0; i < locations.length; i++) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i][1], locations[i][2]),
				map: map,
				animation: google.maps.Animation.DROP,
				icon: 'assets/images/pin.png'
			});

			google.maps.event.addListener(marker, 'click', (function (marker, i) {
				return function () {
					infowindow.setContent(locations[i][0]);
					infowindow.open(map, marker);
				}
			})(marker, i));
		}
	}

	//Login Page

//contact page

$('#contact-form').submit(function(event){
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
"Content-Type": "application/json",
"Authorization": "Basic " + basicKey,
"x-access-token": xAccessToken

},
beforeSend: function (xhr) {
xhr.setRequestHeader("Authorization", "Basic " + basicKey);
},

data:JSON.stringify({emailID:contactemail,
userFullName:contactname,
subject:contactsubject,
message:contactmessage,
}),
success: function (response) {
// alert("Thanks for contacting us, we will get back to you soon")
// $('.form-message').append("<span ><strong> Thanks for contacting us, we will get back to you soon</strong></span>");
// $('#contactname, #contactemail, #contactsubject, #contactmessage').val("");


$('.officeAdd').hide();
$('.toHide').slideUp(400, function(){
	$('.form-message').append("<span>Thank you for contacting us, we will get back to you as soon as possible!</span>");
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
	var treatmentList = "";

	var featuredTreatmentsItems=[{
img:"../assets/images/blocks/index-medical/item2.jpg",
svgImg:"../assets/images/services/index-medical/stethoscope.svg",altText:"Stethoscope",
shortContent:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.",
title:"Nursing"
	},
{
img:"../assets/images/blocks/index-medical/item1.jpg",
svgImg:"../assets/images/services/index-medical/microscope.svg",altText:"Microscope",
shortContent:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.",
title:"Laboratory"
	},
{
img:"../assets/images/blocks/index-medical/item1.jpg",
svgImg:"../assets/images/services/index-medical/microscope.svg",altText:"Microscope",
shortContent:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.",
title:"Laboratory"
	},
{
img:"../assets/images/blocks/index-medical/item1.jpg",
svgImg:"./assets/images/services/index-medical/microscope.svg",altText:"Microscope",
shortContent:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.",
title:"Laboratory"
	},
{
img:"../assets/images/blocks/index-medical/item1.jpg",
svgImg:"../assets/images/services/index-medical/microscope.svg",altText:"Microscope",
shortContent:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.",
title:"Laboratory"
	},
{
img:"../assets/images/blocks/index-medical/item1.jpg",
svgImg:"../assets/images/services/index-medical/microscope.svg",altText:"Microscope",
shortContent:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto debitis nemo ipsa iure aliquid! Impedit et rem in distin.",
title:"Laboratory"
	}]
	var latestNewsItems = [

		{
			"newsId": "1",

			"imgPath": "../assets/images/blog/index-medical/post1.jpg",

			"postedDate": "17 Jan, 2016",

			"postedBy": "Admin",

			"postHeading": "Lorem ipsum dolor sit ametli elits.",

			"postShortContent": "Molestiae neque doloremque, voluptatum nostrum praesentium esse fugiat sus siel. Deserunt praesentium archite.",



		},

		{
			"newsId": "2",

			"imgPath": "../assets/images/blog/index-medical/post2.jpg",

			"postedDate": "17 Jan, 2016",

			"postedBy": "Admin",

			"postHeading": "Lorem ipsum dolor sit ametli elits.",

			"postShortContent": "Molestiae neque doloremque, voluptatum nostrum praesentium esse fugiat sus siel. Deserunt praesentium archite.",

		},

		{
			"newsId": "2",

			"imgPath": "../assets/images/blog/index-medical/post3.jpg",

			"postedDate": "17 Jan, 2016",

			"postedBy": "Admin",

			"postHeading": "Lorem ipsum dolor sit ametli elits.",

			"postShortContent": "Molestiae neque doloremque, voluptatum nostrum praesentium esse fugiat sus siel. Deserunt praesentium archite.",

		}

	];
	var homePageHighLightsItems=[{
		imgSrc:"../assets/images/services/index-medical/first-aid-kit.svg",
		altText:"Emergency",
		title:"Emergency",
		content:"Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem."
	},
{
		imgSrc:"../assets/images/services/index-medical/first-aid-kit.svg",
		altText:"Emergency",
		title:"Emergency",
		content:"Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem."
	},
{
		imgSrc:"../assets/images/services/index-medical/first-aid-kit.svg",
		altText:"Emergency",
		title:"Emergency",
		content:"Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem."
	},{
		imgSrc:"../assets/images/services/index-medical/first-aid-kit.svg",
		altText:"Emergency",
		title:"Emergency",
		content:"Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem."
	},{
		imgSrc:"../assets/images/services/index-medical/first-aid-kit.svg",
		altText:"Emergency",
		title:"Emergency",
		content:"Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem."
	},{
		imgSrc:"../assets/images/services/index-medical/first-aid-kit.svg",
		altText:"Emergency",
		title:"Emergency",
		content:"Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem."
	},{
		imgSrc:"../assets/images/services/index-medical/first-aid-kit.svg",
		altText:"Emergency",
		title:"Emergency",
		content:"Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem."
	},{
		imgSrc:"../assets/images/services/index-medical/first-aid-kit.svg",
		altText:"Emergency",
		title:"Emergency",
		content:"Lorem ipsum dolor sit amet, consectetur adipi sunt nisi id magni dignissimos rem."
	}]

	

	$.ajax({
		url: serverName + "api/v1/gethighlighttreatments/meditrip?limit=8",
		type: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + basicKey,
			"x-access-token": xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + basicKey);
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
		url: serverName + "api/v1/get/newssection/meditrip",
		type: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + basicKey,
			"x-access-token": xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + basicKey);
		},
		success: function (response) {
			var latestNewsItems = response
			//Loading Latest news items
			var latestNewsHtmlString = '';

			latestNewsItems.forEach(function (item, index) {

				latestNewsHtmlString += ' <article data-id="' + item.newsId + '" class="entry entry-grid"><div class="entry-media"><figure><a href="single.html"><img src="' + item.imgPath + '" alt="Post image"></a></figure><div class="entry-meta"><span><i class="fa fa-calendar"></i>' + item.postedDate + '</span><a href="#"><i class="fa fa-user"></i> ' +
					item.postedBy + '</a></div></div><h2 class="entry-title"><i class="fa fa-newspaper-o"></i><a href="single.html">' +
					item.postHeading + '</a></h2><div class="entry-content"><p>' +
					item.postShortContent + '</p><a data-id="' + item.newsId + '" href="#modal-container-LatestNews" class="readmore latestNewsReadmore" data-toggle="modal">Read more<i class="fa fa-angle-right"></i></a></div></article>';

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
		url: serverName + "api/v1/getaboutMedical/meditrip",
		type: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + basicKey,
			"x-access-token": xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + basicKey);
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
		url: serverName + "api/v1/getFeaturedtreatments/meditrip",
		type: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + basicKey,
			"x-access-token": xAccessToken

		},
		success: function (response) {

			var featuredTreatmentsHtmlString="";
response.forEach(function(item,index){
featuredTreatmentsHtmlString+=' <div class="col-sm-4"><div class="text-block hover-bg text-center" style="background-image:url('+ item.img+')"><h3 class="block-title"><a href="#">'+item.title+'</a></h3><p>'+item.shortContent +'</p><a href="#" class="readmore custom2">ReadMore <i class="fa fa-angle-right"></i></a></div></div>'
});
$('#featuredTreatmentsSection').html(featuredTreatmentsHtmlString);
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
	$(document).on("click", ".latestNewsReadmore", function () {
		debugger;
		var newsID = $(this).data('id');
		$("#modal-container-LatestNews #myModalLabel").text(newsID);
		$("#modal-container-LatestNews .modal-body").text("Modal Content");
	});



	//Country Dropdown
	var availableCountries = [
  {
    "text"  : "India",
    "value" : "India"
  }

];

			var optionList = document.getElementById('getQuoteCountry').options;
			availableCountries.forEach( (option) => optionList.add( new Option(option.text, option.value ) ));



}

//Cost page callback
function costCallback(data) {

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

			$('#getCostDetails').on('click',function(){
				var procedurName=$('#getProcedureName').val();
				var bystandercount=$('#bystandercount').val();


$.ajax({
	url: serverName + "api/v1/get/treatmentcost/meditrip?procedurename="+ procedurName+"&bystandercount="+ bystandercount+"&holidaypackage=short name 1&hotelrate=3 star&vehicletype=sedan",
	type: 'GET',
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Basic " + basicKey,
		"x-access-token": xAccessToken

	},
	beforeSend: function (xhr) {
		xhr.setRequestHeader("Authorization", "Basic " + basicKey);
	},
	success: function (response) {
		htmlString="<tr class='info' ><td>" + 1+bystandercount+"</td><td>3</td><td>5</td><td>"+ response.ProcedureAvarageCost[0].avarageTreatmentCost+"</td><td>"+response.holidayCost[0].totalPackageCost+"</td><td>"+response.totalExpense.mediTourEstimate+"</td></tr>";




		$('#costRow').append(htmlString)


	},
	error: function (exception) {
		console.log(exception);
	}
})
			});
}


//treatmentsOfferedCallback
function treatmentsOfferedCallback(id) {
	var treatmentCategory = '';
	switch (id) {
		case 'cardiacTreatmentMenu':
			treatmentCategory = "Cardiac";
			break;
		case 'ayurvedaTreatmentMenu':
			treatmentCategory = "Ayurveda";
			break;
		case 'dentalTreatmentMenu':
			treatmentCategory = "Dental";
			break;
		default:
			treatmentCategory = "Cardiac";
			break;
	}

	$.ajax({
		url: serverName + "api/v1/get/treatmentdescription/cost/meditrip?department=" + treatmentCategory,
		type: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + basicKey,
			"x-access-token": xAccessToken

		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + basicKey);
		},
		success: function (response) {

			$('.treatmentDecsription h1').html(response[0].department);
			$('.treatmentDecsription p').html(response[0].departmentDescription);
			var htmlString='<h2 style="margin-top: 20px">Available Procedures</h2>';
			console.log(JSON.stringify(response,null,'\t'))
			response.forEach(function(item,index){

			var treatmentArray=item.treatmentList;

		treatmentArray.forEach(function(treatmentItem,treatmentIndex){
		var displayName=treatmentItem.displayName;
		var treatmentDescription=treatmentItem.treatmentDescription;
		var procedureImagepath=treatmentItem.procedureImagepath.replace(/\//g, "\/");
		htmlString += '<div class="blog-card"><div class="photo photo1" style="background: url('+procedureImagepath+') center no-repeat;"></div><ul class="details"><li class="author"><a href="#">' + treatmentItem.procedureName + '</a></li><li class="date"> Heal Time: ' + treatmentItem.healingTimeInDays + '</li><li class="date"> Surgical Time: ' + treatmentItem.surgicalTime + '</li><li class="date"> Estimate Cost: ' + treatmentItem.procedureCost +'</li></ul><div class="description"><h1>' + displayName+'</h1><h2>' + displayName + '</h2><p class="summary">' + treatmentDescription+'</p><a href="/procedure/Bone Grafting">Read More</a></div></div>'

			//htmlString+='<div class="treatments-hover" style="min-height:100px;padding:20px;width:90%;overflow:auto;border-radius: 7px;position:relative;margin-bottom: 20px;background-color:#eff6ef;border-bottom: 1px solid #DAD8D8;border-right: 0.2px solid #DAD8D8;"><div class="one-third" style="width:120px"><img src="'+procedureImagepath +'" height="100" width="140" style="display:inline-block"/></div><div class="three-fourths last-col" style="line-height: 1em;background-color: #eff6ef"> <p>'+displayName+'</p> <p><u>Hospital Stay:</u> '+treatmentItem.minHospitalization+'-'+treatmentItem.maxHospitalization+' days</p>     <p><u>Healing Time:</u> '+treatmentItem.healingTimeInDays+' days</p>     <p>Description of Procedure:</br>'+treatmentDescription+'</p></div>   <a href="#" style="float:right">more details</a></div>'

	});
});
document.getElementById('availableProceduresDiv').innerHTML=htmlString;

		},
		error: function (exception) {
			console.log(exception);
		}
	});

	///api/v1/searchHospitaldetails/Dental/searchHospital
//contactPageCallBack(data);


}




function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function medicalVisacallback(){

			$.ajax({
				url: serverName + "api/v1/get/evisacountries/all/meditrip",
				type: 'GET',
				headers: {
						"Content-Type": "application/json",
						"Authorization": "Basic " + basicKey,
						"x-access-token": xAccessToken

				},
				success: function(response){
					 // console.log("visa-response: "+ response);
						var countryArr = [];
				response.forEach(function(item){
						countryArr.push({"country": item.country, "fee": item.fee});
					 // console.log("my country " + item.country)
				})
				//console.log("countryArr-response: "+ countryArr[1].country);

				countryArr.forEach(function(item){
						$('.select-country .country-list').append('<option class="'+item.fee + '"' +'data-tokens="'+ item.country+'">' + item.country +'</option>')
				})

				//$('.selectpicker').selectpicker();
				$('.selectpicker').selectpicker('render');
				$('.selectpicker').selectpicker('refresh');
				},
				error: function (exception) {
						console.log(exception);
				}
		});
		$('.selectpicker').on('change', function(){
			$('table#t01 tr').hide();
			var countrySelected = $("option:selected",this).val();

			var countryFee  = $('option:selected',this).attr('class');

			$('table#t01 tr th').removeClass('no-show');


			$('table#t01 tbody').append('<tr><th >Country</th><th>Fees (USD)<br><div style="font-size:0.9rem;">2.5% additional charge on bank transactions</div></th></tr>'+'<tr class="new-row"><td>'+countrySelected+'</td><td>'+countryFee+'</td></tr>');

			});
}


function getCookie(cname) {
	var name = cname + "=";
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
	return "";
}