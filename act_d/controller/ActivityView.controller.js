sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "Employee/js/google/google.sheet"
],function(BaseController, JSONModel, googleSheet){
    BaseController.extend("Employee.controller.ActivityView", {
        onInit: function(){
            if(!window.initiated){
                this.getOwnerComponent().getRouter().navTo("home");
            }

            this.getOwnerComponent().getRouter().getRoute("activityview").attachPatternMatched(this._attachMatchingPattern, this);

            this.getView().setModel(new JSONModel(
                { 
                    view_control: {
                        view_list : true
                    },
                    mode: "view"
                }
            ), "viewModel");

            this.getView().setModel(new JSONModel(
                this.getActivityData()
            ), 'activityModel');

            this.getView().setModel(new JSONModel(
                {   
                    "str_time": "",
                    "end_time": "",
                    "topic":""
                }
            ), 'dialogueModel')

            this.copyProps = ['str_time', 'end_time', 'topic'];

            this.activityModel = this.getView().getModel("activityModel");
            this.viewModel = this.getView().getModel("viewModel");
            this.dialogueModel = this.getView().getModel("dialogueModel");
        },

        googleSheet : googleSheet,

        _attachMatchingPattern: function(oSource){
            this.activityModel.setProperty('/', this.getActivityData());
        },

        // Tool Bar Activity
        onEdit: function(oEvent){
            this.viewModel.setProperty("/mode", "edit");
        },
        
        onSave: function(oEvent){
            this.setActivityData(this.activityModel.getData() ,this.getDate());
            this.viewModel.setProperty("/mode", "view");
        },

        onCancel: function(oEvent){
            this.activityModel.setProperty('/', this.getActivityData());
            this.viewModel.setProperty("/mode", "view");
        },

        onExport: function(oEvent){
            let preparedText = this.getPreparedText();             
            // navigator.clipboard.writeText(preparedText);
            
            this.byId('textEditor').setValue(preparedText);
            this.oDialog = this.byId("textExportDialog");
            this.oDialog.open();
        },

        onExportAsJson: function(oEvent){
            this.copyToClipBoard(JSON.stringify(this.activityModel.getData()));
            sap.m.MessageToast.show("JSON Copied To ClipBoard");
        },
        
        onAddActivityHour: function(oEvent){
            let index = this.activityModel.getProperty("/").length;
            this.activityModel.getProperty("/").push({
                "str_time": "",
                "end_time": "",
                "topic":"",
                "activities" : [
                ]
            })
            this.activityModel.refresh(true);
            this.onEditActivityHour(null , this.activityModel.getContext('/'+index));
        },

        // Panel Tool Bar Activities

        onEditActivityHour: function(oEvent, context){
            context = context || oEvent.getSource().getParent().getBindingContext('activityModel');
            let oView = this.getView();
            
            this.oDialog = this.byId('activityHourDialog');
            this.activePath = context.sPath;

            this.oDialog.setBindingContext(context,"activityModel");
            this.oDialog.open();
        },

        onDeleteActivityHour: function(oEvent){
            let path = oEvent.getSource().getBindingContext('activityModel').sPath;
            this.activityModel.getData().splice(parseInt(path.slice(1)), 1);
            this.activityModel.refresh(true);
        },


        onAddActivity: function(oEvent){
            let path = oEvent.getSource().getBindingContext('activityModel').sPath + '/activities';
            this.activityModel.getProperty(path).push('');
            this.activityModel.refresh();
        },

        onDeleteActivity: function(oEvent){
            path = oEvent.getSource().getBindingContext('activityModel').sPath;
            this.activityModel.getProperty(path.split("/").slice(0,-1).join("/")).splice(parseInt(path.split("/").pop()), 1);
            this.activityModel.refresh();
        },

        // Dialog Callback

        onCloseDialog: function(oEvent){
            this.oDialog.close();
        },

        onCopyAndClose: function(oEvent){
            this.copyToClipBoard(this.byId('textEditor').getValue());
            sap.m.MessageToast.show("Text Copied To ClipBoard");
            this.onCloseDialog();
        },

        // Util methods

        getActivityData: function(key){
            return window.AppCacheData?.[(key || this.getDate())]?.data || [];
        },

        setActivityData: function(value, key){
            if(!value.startsWith)
                value = JSON.stringify(value)
            googleSheet.updateToSheet(value, key || this.getDate())
        },

        getDate: function(){
            let d = new Date();
            return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
        },

        getPreparedText: function(oEvent){
            let res = '';
            for(let ah of this.activityModel.getData()){
                res +=  ah.topic + ` (${ah.str_time}-${ah.end_time})\n`;
                ah.activities.forEach((act, i)=>{
                    res += ('\t'+ (i+1) + '.' + act + '\n');
                })
            }

            return res;
        },

        copyToClipBoard: function(text){
            if(window.cordova){
                window.cordova.plugins.clipboard.copy(text)
            }
            navigator.clipboard.writeText(text)
        },

        formatTextForWhatsApp: function(text){

        }
    })
})