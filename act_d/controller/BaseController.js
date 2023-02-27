sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/core/routing/History"
],function(Controller, Formatter, History){
    return Controller.extend("Employee.controller.BaseController",{
        formatter  :Formatter,

        onDebug: function(){
            debugger;
        },

        onNavBack: function(oEvent){
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("home", {}, true);
			}
        }

        
    })
})