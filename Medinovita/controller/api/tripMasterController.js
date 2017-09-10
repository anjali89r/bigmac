var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/tripMasterModel.js');
var tripMasterModel = mongoose.model('trip_master');
var counterSchema = require('../../model/identityCounterModel.js');

/******************/
module.exports.inserttripDetails = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call inserttripDetails")
        return;
    }  

    tripMasterModel.create(
        {
            "tripid": "1000258",
            "tripPatientId": "784515",
            "tripDoctorid": "147852",
            "tripcaseManagerid": "963258",
            "tripDepartmentid": "0124587",
            "tripProcedureid": "14785236",
            "tripStartdate": "2017-07-28T23:07:11Z",
            "tripEnddate": "2017-07-28T23:07:11Z",
            "tripBystandercount": "1",
            "tripInitiatedby": "PATIENT",
            "tripHoteltype": "1",
            "tripHotelname": "HILTON",
            "tripHotelid": "12345",
            "tripTransporttypeid": "12",
            "tripCaseDescription": "4 start hotel",
            "tripPercentageCompletion": "50",
            "tripStatus": "IN_PROGRESS",
            "medicalHistoryfilename": "SCANNED.doc",
            "medicalHistoryfilepath": "C:\\HOTEL\\" ,
             "tripFeedbackdisplaypic": "N",
            "tripVisastatus": "READY",
            "visahelpRequired": "N",
            "tripHospitalexpense": "15200",
            "tripTravelexpense": "4500",
            "tripAccomadationexpense": "3500",
            "tripNoofdaysstay": "2",
            "tripMiscamnity": "1",
            "tripMiscexpense": "4520",
            "tripDoctorcomments": "GOING GOOD",
            "itinerary": {
                "tripeventid": "78121123",
                "onwardFlightstatus": "BOOKED",
                "onwardFlightbookingCost": "1500",
                "onwardFlightname": "EMIRATES",
                "onwardFlightnumber": "EK7896",
                "onwardflightStartdate": "2017-07-28T23:07:11Z",
                "onwardflightarrivaldate": "2017-07-28T23:07:11Z",
                "onwardFlightpnrno": "EKPNR312345",
                "returnFlightstatus": "BOOKED",
                "returnFlightbookingCost": "4500",
                "returnFlightname": "ETIHAD",
                "returnFlightnumber": "ET4512",
                "returnFlightstartDate": "2017-07-28T23:07:11Z",
                "returnFlightarrivalDate": "2017-07-28T23:07:11Z",
                "returnFlightpnrno": "ETPNR321312",
                "flightBookinghelprequested": "Y"
            },

            "localTransport": [{
                "eventId": "423423",
                "providerId": "42342432",
                "providerName": "MERUCABS",
                "driverName": "SUNIL",
                "driverContactnumber": "9447852963",
                "pickupDatetime": "2017-07-28T23:07:11Z",
                "dropDatetime": "2017-07-28T23:07:11Z",
                "pickupPlace": "HILTON HOTEL",
                "dropPlace": "HOSPITAL",
                "transportExpense": "1500"

            }],

            "hospital":
            {
                "eventId": "4324234243",
                "procedureId": "312312",
                "procedureDocId": "31231",
                "hospitalId": "25534543",
                "admissionDate": "2017-07-28T23:07:11Z",
                "dischargeDate": "2017-07-28T23:07:11Z",
                "hospitalExpense": "1000"
            },

            "hotel":
            {
                "eventId": "12313123",
                "hotelId": "312313123",
                "hotelName": "HILTON",
                "hotelnoOfroomsbooked": "2",
                "hotelnoOfadditionalbeds": "1",
                "hotelextraBedcost": "0",
                "hotelcheckIndate": "2017-07-28T23:07:11Z",
                "hotelcheckOutdate": "2017-07-28T23:07:11Z",
                "hotelExpense": "4500"

            },

            "holiday":
            {
                "eventId": "8745255",
                "packageId": "312312",
                "isHolidayopted": "N",
                "holidayPriortotreatment": "N",
                "holidayPosttreatment": "N",
                "startDate": "",
                "endDate": "",
                "totalCost": "",
                "transportCost": ""

            },
            "paymentDetails":
            {
                "eventId": "31231312",
                "transactionId": "31313123",
                "transactionName": "CC-AVENUNE3123123",
                "transactionAmount": "4500",
                "transactionDate": "2017-07-28T23:07:11Z",
                "paymentGateway": "CC-AVENUNE",
                "paymentStatus": "COMPLETED"
            },
            "miscFacility":
            {
                "id": "321312",
                "name": "COFFEE",
                "cost": "750",
                "description": "COFFEE SHOP"
            },
            "order":
            {
                "tripId": "312312312341",
                "tripEventid": "312331231",
                "subject": "MY ORDEr",
                "date": "2017-07-28T23:07:11Z",
                "description": "testing my office",
                "quantity": "1",
                "assignedTo": "Govind",
                "cost": "850",
                "paymentStatus": "COMPLETED",
                "shippedStatus": "COMPLETED",
                "deliveryStatus": "COMPLETED",
                "shippingCouriername": "FEDEX",
                "shippingCouriertrackingId": "321314567879765"
            }
        }, function (err) {
            if (err) {
                logger.error("Error while inserting record : - " + err)
                return res.json({ "err": err.message.split(":")[2].trim() });
            }
            return res.send("Data got inserted");
        });
        
};

