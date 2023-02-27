sap.ui.define([
    "./BaseController"
],function(BaseController){
    BaseController.extend("Employee.controller.Home", {
        onInit: function(){

        },

        onNavToListPage: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("list");
        },

        onNavToActivityPage: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("activityview");
        },

        onNavToTodolistPage: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("todolist");
        },
    })
})