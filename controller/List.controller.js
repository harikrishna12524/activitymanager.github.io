sap.ui.define([
    "./BaseController"
],function(BaseController){
    BaseController.extend("Employee.controller.List", {
        onInit: function(){

        },

        onClickEmployee: function(oEvent){
            var path = oEvent.getSource().getBindingContext("employee").getPath().slice(1);
            this.getOwnerComponent().getRouter().navTo("detail", {
                    employeePath: window.encodeURIComponent(path),
                }
            );
        }
    })
})