sap.ui.define([
    "./BaseController"
],function(BaseController){
    BaseController.extend("Employee.controller.Activity", {
        onInit: function(){

        },

        onNavToViewActivity: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("activityview");
        }
    })
})