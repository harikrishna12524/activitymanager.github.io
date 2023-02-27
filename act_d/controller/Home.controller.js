sap.ui.define([
    "./BaseController",
    "Employee/js/google/google.sheet"
],function(BaseController, sheet){
    BaseController.extend("Employee.controller.Home", {
        credentials: {
            android: {
                CLIENT_ID : "473557024572-iv9jc3los821g3r5eqcvkk8dcc2svcso.apps.googleusercontent.com",
                API_KEY : "AIzaSyDDWTGgVNJXeBQrujDQYuLoCCwMkIjeF1k"
            },
            browser: {
                CLIENT_ID : "473557024572-8agv37qruiv9ok18ose3hvs8s4abmslf.apps.googleusercontent.com",
                API_KEY : "AIzaSyCtSNFuWfncbwXctV7z0tzyXzkCtkvL-FA"
            },
        },

        sheet : sheet,

        otherApiData: {
            DISCOVERY_DOC : [
                "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest", // Gmail 
                "https://sheets.googleapis.com/$discovery/rest?version=v4", // Google Sheet 
                "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", // Google Calender
            ],
            SCOPE: [
                "https://www.googleapis.com/auth/spreadsheets", // Google Sheet CRUD
                "https://www.googleapis.com/auth/gmail.send", // Send Email on your behalf access
                "https://www.googleapis.com/auth/calendar.events.readonly", // View Events on your calender
            ]

        },

        onInit: function(){

        },

        onNavToListPage: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("list");
        },

        onNavToActivityPage: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("activityview");
        },

        // Google Handlers

        onLogin: async function(oEvent){
            oThis = this;
            window.homeController = this;

            scope = oThis.otherApiData.SCOPE.join(" ");
            debugger;
            scope = scope || "email profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/calendar.events.readonly openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile";
            if(window.cordova){
                await window.devicePromise;
                await new Promise((res, rej)=>{
                    gapi.load('client', async ()=>{
                        await gapi.client.init({
                            apiKey: oThis.credentials.android.API_KEY,
                            discoveryDocs: oThis.otherApiData.DISCOVERY_DOC,
                        });
                        res();
                    });
                });

                let old_token = window.localStorage.getItem("gToken") || null;
                if(old_token)
                    gapi.client.setToken(JSON.parse(old_token));

                let new_token = await new Promise((res,rej)=>{
                    window.plugins.googleplus.login(
                        {
                          'scopes': scope,
                          'webClientId': oThis.credentials.android.CLIENT_ID,
                          'offline': true
                        },
                        function (obj) {
                            res(obj);
                        },
                        function (msg) {
                            res({error : msg});
                        }
                    );
                }) 

                gapi.client.setToken(new_token);
                this.onLoginSuccess(new_token);
                debugger;
            }else{
                let tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: oThis.credentials.browser.CLIENT_ID,
                    scope: oThis.otherApiData.SCOPE.join(" "),
                    callback: function(res){ oThis.onLoginSuccess(res) },
                });
                // Google Client Init
                await new Promise((res, rej)=>{
                    gapi.load('client', async ()=>{
                        await gapi.client.init({
                            apiKey: oThis.credentials.browser.API_KEY,
                            discoveryDocs: oThis.otherApiData.DISCOVERY_DOC,
                        });
                        res();
                    });
                });

                let old_token = window.localStorage.getItem("gToken") || null;
                if(old_token)
                    gapi.client.setToken(JSON.parse(old_token));
                
                if (gapi.client.getToken() === null) {
                    tokenClient.requestAccessToken({prompt: 'consent'});
                } else {
                    tokenClient.requestAccessToken({prompt: ''});
                }
            }
        },


        onLoginSuccess: async function(resp){
            let oThis = this;
            if(resp.error){
                console.log("Client Login Error " + resp.error);
                window.localStorage.removeItem("gToken");
            }else{
                window.localStorage.setItem("gToken", JSON.stringify(resp));
            }

            if(!window.localStorage.getItem("main_sheet_id")){
                await new Promise((res,rej)=>{
                    oThis.dialogPromise = res;
                    oThis.byId("sheetdialog").open();
                })
            }

            await sheet.addDataToCache()
            window.initiated = true;
            this.onNavToActivityPage();
        },

        onSetSheet:async function(){
            let value = this.byId("sheetidimport").getValue();
            if(!value)
                oThis.dialogPromise();
            try{
                res = await gapi.client.sheets.spreadsheets.get({
                    spreadsheetId: value.split("/")[5]
                })
                window.localStorage.setItem("main_sheet_details", JSON.stringify(res.result));
                window.localStorage.setItem("main_sheet_id", res.result.spreadsheetId);
                sap.m.MessageToast.show(`File Sync successful`);
                oThis.byId("sheetdialog").close();
                oThis.dialogPromise();
            }catch(err){
                sap.m.MessageToast.show(`File Sync failed : ${err.result.error.message}`);
            }
        },

        onCloseDialog: function(){
            sap.m.MessageToast.show(`File Sync Cancelled, New sheet will be create`);
            oThis.byId("sheetdialog").close();
            oThis.dialogPromise();
        },

        onLogout : function(){
            const token = gapi.client.getToken();
            if (token !== null) {
                google.accounts.oauth2.revoke(token.access_token);
                gapi.client.setToken('');
            }
        }
    })
})