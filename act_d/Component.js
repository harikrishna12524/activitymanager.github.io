sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("Employee.Component", {

		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set data model
			var oData = {
				recipient: {
					name: "World"
				}
			};
			var oModel = new JSONModel(oData);
			this.setModel(oModel);

			// create the views based on the url/hash
			this.getRouter().initialize();

			let res;
			let rej;
			window.devicePromise = new Promise((resolve, reject)=>{
				res = resolve;
				rej = reject;
			}) 
			document.addEventListener('deviceready', function() {
				//I get called when everything's ready for the plugin to be called!
				window.isCordova = true;
				res();
				debugger;
				// window.plugins.googleplus.trySilentLogin(...);
			}, false);

			
		}
	});

});