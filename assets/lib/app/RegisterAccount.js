define([

    "dojo/dom-style",
    "dojo/mouse",
    "dojo/on",
    "dojo/dom-attr",
    "dojo/_base/lang",
    "dojo/query",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojox/validate/web",
    "dojox/widget/Toaster",
    "dojo/topic",
    "dojo/store/Memory",
    "dijit/form/FilteringSelect",
    "dijit/form/ComboBox",
    "dijit/form/CheckBox",
    "dojox/form/PasswordValidator",
    "dojox/validate",
    'dijit/form/_FormMixin',
    'dijit/form/ValidationTextBox',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!app/templates/registerAccount.html',
    'dojo/i18n!app/nls/registerAccount_nls',
    "dijit/form/Button",
    "dojo/NodeList-dom"
], function (domStyle, mouse,on, domAttr, lang,query,_TemplatedMixin,_WidgetsInTemplateMixin, web, Toaster, topic,Memory,FilteringSelect,ComboBox, CheckBox,PasswordValidator, validate, _FormMixin, ValidationTextBox, WidgetBase, declare, template, i18n) {

    var countryStore= new Memory({
    data:i18n.country_arry
    });


    return declare('app.RegisterAccount',[WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,_FormMixin], {
        templateString: template,
        i18n: i18n,

        _setCountryStore: function () {
            var select = new FilteringSelect({
                name: "stateSelect",
                placeHolder: "Select a Country",
                store: countryStore,
                required:true,
                promptMessage:'Please select a country',
                missingMessage:'Please select a country',
                invalidMessage:'No country was select',
                onChange: function(value){
                    if(select.state!=''){
                        isValid=false;
                        return;
                    }
                    isValid=true;
                }
            }, this._country_arr);
        },





        postCreate: function () {
            this.inherited(arguments);
            this._setCountryStore();
            this.initEventHandlers();
        },

        startup: function () {
            this.inherited(arguments);
            this._createControls();

        },

        _createControls: function(){

            /*var nametexbox= new ValidationTextBox({
                value: "",
                pattern: '\\w+',
                required:true,
                promptMessage:this.i18n.name_text.promptMessage,
                missingMessage:this.i18n.name_text.missingMessage,
                invalidMessage:this.i18n.name_text.invalidMessage,
                onChange: function(value){

                    console.log(nametexbox.state);
                    if(nametexbox.state!=''){
                        isValid=false;
                        console.log(isValid);
                        return;
                    }
                    isValid=true;
                }
            },this._name);

            var emailtextbox= new ValidationTextBox({
                value: "",
                required:true,
                validator:dojox.validate.isEmailAddress,
                //regExp: "[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}",
                promptMessage:this.i18n.email_text.promptMessage,
                missingMessage:this.i18n.email_text.missingMessage,
                invalidMessage:this.i18n.email_text.invalidMessage,
                onChange:function(evt){
                    if(emailtextbox.state!=''){
                        isValid=false;
                        console.log(isValid);
                        return;
                    }
                    isValid=true;
                }
            },this._email);

            var altemailtextbox=new ValidationTextBox({
                value: "",
                required:true,
                validator:dojox.validate.isEmailAddress,
                promptMessage:this.i18n.email_text.promptMessage,
                missingMessage:this.i18n.email_text.missingMessage,
                invalidMessage:this.i18n.email_text.invalidMessage,
                onChange:function(evt){
                    if(altemailtextbox.state!=''){
                        isValid=false;
                        console.log(isValid);
                        return;
                    }
                    isValid=true;
                }
            },this._altEmail);


            var countrynumber= new ValidationTextBox({
                required:false,
                regExp:'\\d{2}',
                invalidMessage:this.i18n.country_text.rangeMessage  ,
                invalidMessage:this.i18n.country_text.invalidMessage
            },this._country_number);

            var citynumbertextbox= new ValidationTextBox({
                required:false,
                regExp:'\\d{3}',
                invalidMessage:this.i18n.city_text.invalidMessage
            },this._city_number);

            var phonenumbertextbox=new ValidationTextBox({
                required:false,
                regExp:'\\d{2}',
                invalidMessage:this.i18n.city_text.invalidMessage
            },this._phone_number);

            var mobiletextbox=new ValidationTextBox({
                required:false,
                regExp:'\\d{2}',
                invalidMessage:this.i18n.city_text.invalidMessage,
                onChange:function(evt){
                    if(mobiletextbox.state!=''){
                        isValid=false;
                        return;
                    }
                    //dijit.byId("addBtn").setAttribute('disabled', false);
                    isValid=true;

                }
            },this._mobile);

            on(this._accept_term,'click',function(evt){
                console.log(isValid);
                if(isValid==true){
                    dijit.byId("addBtn").set('disabled', false);
                }
            });*/

            on(this.continue,"click", function(evt){
                var pass1=dijit.byId("pass-text").get("value");
                var pass2=dijit.byId("r-pass-text").get("value");
                console.log(dijit.byId("pass-text").get("value"));
               
                if(pass1==pass2 && pass1!=''){
                    query(".foo_label").style("visibility", "visible");
                    query(".for_email").style("visibility", "visible");
                    query("label[for=for_email2]").style("visibility", "visible");
                    query("label[for=for-phone]").style("visibility", "visible");
                    query("label[for=for-mobile]").style("visibility", "visible");
                    query("label[for=for-country]").style("visibility", "visible");

                    //this._foo.innerHTML=textNew;
                    query(".in-div").forEach(function(value){
                        value.style.visibility="hidden";
                        console.log(value);
                    });

                    var textNew=dijit.byId("name-text").get("value");
                    query("label[for=for-name]")[0].innerHTML = textNew;

                    var textEmail=dijit.byId("email-text").get("value");
                    query(".for_email")[0].innerHTML = textEmail;

                    var textEmail2=dijit.byId("alt-email").get("value");
                    query("label[for=for_email2]")[0].innerHTML = textEmail2;

                    var textCountry=dijit.byId("country-number").get("value");
                    var textCity=dijit.byId("city-number").get("value");
                    var textPhone=dijit.byId("phone-number").get("value");
                    query("label[for=for-phone]")[0].innerHTML = textCountry+"-"+textCity+"-"+textPhone;

                    var textMobile=dijit.byId("mobile-text").get('value');
                    query("label[for=for-mobile]")[0].innerHTML=textMobile;

                    var textSelectCountry=dijit.byId("country").get("value");
                    query("label[for=for-country]")[0].innerHTML=textSelectCountry;

                    topic.publish("testMessageTopic",
                        {
                            message: "All elements are OK! ",
                            type: "fatal",
                            duration: 2000
                        }
                    );
                }else{
                    dijit.byId("pass-text").set("value","");
                    dijit.byId("r-pass-text").set("value","");
                    topic.publish("testMessageTopic",
                        {
                            message: "Passwords are not the same! ",
                            type: "error",
                            duration: 2000
                        }
                    );
                }

            });
            on(this._reset,"click", function(evt){
                query(".in-div").style("visibility", "visible");
                query(".foo_label").style("visibility", "hidden");
                query(".for_email").style("visibility", "hidden");
                query("label[for=for_email2]").style("visibility", "hidden");
                query("label[for=for-phone]").style("visibility", "hidden");
                query("label[for=for-mobile]").style("visibility", "hidden");
                query("label[for=for-country]").style("visibility", "hidden");

                dijit.byId("name-text").set("value","");
                dijit.byId("email-text").set("value","");
                dijit.byId("alt-email").set("value","");
                dijit.byId("country-number").set("value","");
                dijit.byId("city-number").set("value","");
                dijit.byId("phone-number").set("value","");
                dijit.byId("mobile-text").set('value',"");
                dijit.byId("country").set("value","");
                dijit.byId("pass-text").set("value","");
                dijit.byId("pass-text").set("value","");
                dijit.byId("r-pass-text").set("value","");
                console.log(query(".in-div"));
            });
        },

       initEventHandlers: function () {
           /*this.watch('state',function(property, oldvalue, newvalue) {
               console.log("NewValue = "+property);
               this.continue.set('disabled', newvalue !== '');
           });*/
        this.watch('state', lang.hitch(this, function (_, oldValue, newValue) {
            console.log(_);
            this.continue.set('disabled', newValue !== '');
        }));
    }

});
});
