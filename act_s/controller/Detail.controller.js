sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
],function(BaseController, JSONModel){
    BaseController.extend("Employee.controller.Detail", {
        onInit: function(){
            this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._attachMatchingPattern, this);

            this.getView().setModel(new JSONModel(
                {
                    editMode:false
                }
            ));
        },

        _attachMatchingPattern: function(oSource){
            this.getView().bindElement({
                path: "/" + window.decodeURIComponent(oSource.getParameter("arguments").employeePath),
                model: "employee"
            })
        },

        onEdit: function(oEvent){
            this.getView().getModel().setProperty("/editMode", true);
        },

        onSave: function(oEvent){
            this.getView().getModel().setProperty("/editMode", false);
        },

        onCreate: function(oEvent){
            // Conditions To be Taken care.
            this.getOwnerComponent().getRouter().navTo("create");
        }
    })
})