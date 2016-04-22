define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/cookie",
    "dojo/date",
    "dojo/json",
    "dojo/dom-class",
    "dojo/topic",
    'dijit/form/_FormMixin',
    "dojo/text!./templates/AppointmentBookingVerificationFacade.html",
    "dojo/i18n!./nls/AppointmentBookingVerificationFacade_nls",
    "hsbc/common/bijit/_BijitBase",
    "../store/comms/VerifyPhoneNumber",
    'mcab/config/config',
    'dijit/form/Button',
    "dijit/form/ValidationTextBox",
    "hsbc/common/dijit/MessageArea"
], function (declare, lang, cookie, date,JSON, domClass, topic, _FormMixin, template, i18n,
             _BijitBase, VerifyPhoneNumber, config) {
    return declare([_BijitBase, _FormMixin], {

        templateString: template,
        i18n: i18n,
        MAX_VERIFICATION_ATTEMPT: config.get("mcab/config/Misc").verification.MAX_VERIFICATION_ATTEMPT,
        VERIFICATION_ATTEMPT_COOKIE_ID: config.get("mcab/config/Misc").verification.VERIFICATION_ATTEMPT_COOKIE_ID,
        VERIFICATION_COOKIE_EXPIRES: config.get("mcab/config/Misc").verification.VERIFICATION_COOKIE_EXPIRES,
       
        wtch: null,
        checkWatch : true,
        verifyPhoneNumber : null,
        
        
        _setSaltedHashAttr: function (saltedHash) {
            
            this.hashValue=saltedHash;
                   },
        _setDataContextAttr: function (data,saltedHash) {
            this.dataContext = data;
            this.encryptedPhoneNumber = this.dataContext.appointmentDetails.appointmentContact.phone.phoneNumber;
            this.referenceNumber = this.dataContext.appointmentDetails.appointmentIdentifier.appointmentIdentifier;
            this.hashValue=saltedHash;
            this._infoNode.innerHTML = this.referenceNumber;
        },
        
        postCreate: function () {
            this.inherited(arguments);
            this._awakeWatch();
        },

        _onVerify: function () {
        	var verifiedPhone = this._phoneNumberNode.get("value");
            if (this.isValid()) {
                this._requestVerification()
                    .then(lang.hitch(this, function (data) {
                        this._hideLoadingIndicator();
                            if(this.dataContext.appointmentDetails.appointmentIdentifier.appointmentIdentifier) {
                            	this.dataContext.appointmentDetails.appointmentContact.phone.phoneNumber=verifiedPhone;
                            	this.dataContext.appointmentDetails.appointmentContact.phone.fullNumber=verifiedPhone;
                            	this.dataContext.appointmentDetails.attendee.appointmentContact.phone.fullNumber=verifiedPhone;
                            	this.dataContext.appointmentDetails.attendee.appointmentContact.phone.phoneNumber=verifiedPhone;
                            	lang.setObject("mcab.dataContext",this.dataContext);
                              topic.publish('mcab-change-facade/verified', this.dataContext, this.referenceNumber,this.hashValue);
                        }
                    }),lang.hitch(this, function(error) {
                    	 this._hideLoadingIndicator();
                    	var responseCode=error.data;
                    	var parsedJSON = JSON.stringify(responseCode);
                    	var code=JSON.parse(parsedJSON);
                    	var statusCode=code.reasons[0].code; 
                    	
                        switch(statusCode)
                        {
                        case "E105":
                        	     var tryAgain = this._verifyCookie();
                                if (tryAgain) {
                                    this.showError("phoneVerificationError");
                                                                }
                                else {
                                    this.showError("exceedTimesError");
                                }
                          	break;
                        }
                    		
                    }));
            }
        },

        _verifyCookie: function () {
            var verificationAttempt = cookie(this.VERIFICATION_ATTEMPT_COOKIE_ID);
            var expires = date.add(new Date(), "minute", this.VERIFICATION_COOKIE_EXPIRES);
            if(typeof verificationAttempt=="undefined")
            	{
            	cookie(this.VERIFICATION_ATTEMPT_COOKIE_ID, 1, {expires: expires});
            	verificationAttempt = cookie(this.VERIFICATION_ATTEMPT_COOKIE_ID);
            	}
            if (typeof verificationAttempt !== "undefined") {
                verificationAttempt = parseInt(verificationAttempt);
                if (verificationAttempt < this.MAX_VERIFICATION_ATTEMPT) {
                    cookie(this.VERIFICATION_ATTEMPT_COOKIE_ID, verificationAttempt + 1, {expires: expires});
                    return true;
                }
                return false;
            }
            cookie(this.VERIFICATION_ATTEMPT_COOKIE_ID, 1, {expires: expires});
        },

        _requestVerification: function () {
            this._showLoadingIndicator();
                       var phone = this._phoneNumberNode.get("value");
            return VerifyPhoneNumber.get({
                        "phoneNumber": phone,
                        "encryptedPhoneNumber":this.encryptedPhoneNumber
            });
            
        },

        showError: function (error) {
            this.clearMessageArea();
            this.messageArea.addMessage('error', i18n.verificationErrorList[error]);
            domClass.add(this.appointmentVerificationNode, 'hasError');
        },

        clearMessageArea: function () {
            this.messageArea.clear();
            domClass.remove(this.appointmentVerificationNode, 'hasError');
        },

        _showLoadingIndicator: function(){
            domClass.add(this._loadingIndicator, "loadingIndicator");
            domClass.add(this.appointmentVerificationNode, "loading");
            var fadeArgs = {
                node: this._loadingIndicator
            };
            dojo.fadeIn(fadeArgs).play();
        },

        _hideLoadingIndicator: function(){
            domClass.remove(this._loadingIndicator, "loadingIndicator");
            domClass.remove(this.appointmentVerificationNode, "loading");
        },

        _awakeWatch: function(){
            if(this.checkWatch){
                wtch = this.watch('state', function(_, oldValue, newValue) {
                    this._next.set('disabled', newValue !== "");
                });
            }
        }

    });
});