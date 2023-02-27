sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
],function(BaseController, JSONModel){
    BaseController.extend("Employee.controller.TodoList", {
        onInit: function(){

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
                this.getActivityData("TODOLIST")
            ), 'activityModel');

            this.getView().setModel(new JSONModel(
                this.getActivityData("COMP_TODOLIST")
            ), 'compList');


            this.activityModel = this.getView().getModel("activityModel");
            this.viewModel = this.getView().getModel("viewModel");
        },

        _attachMatchingPattern: function(oSource){
            // TODO Implement on comming to page
        },

        // Tool Bar Activity
        onEdit: function(oEvent){
            this.viewModel.setProperty("/mode", "edit");
        },
        
        onSave: function(oEvent){
            this.setActivityData(this.activityModel.getData() ,"TODOLIST");
            this.viewModel.setProperty("/mode", "view");
        },

        onCancel: function(oEvent){
            this.activityModel.setProperty('/', this.getActivityData("TODOLIST"));
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
            this.activityModel.getProperty(path).push({text : '', state: "NC"});
            this.activityModel.refresh();
        },

        onDeleteActivity: function(oEvent){
            path = oEvent.getSource().getBindingContext('activityModel').sPath;
            this.activityModel.getProperty(path.split("/").slice(0,-1).join("/")).splice(parseInt(path.split("/").pop()), 1);
            this.activityModel.refresh();
        },

        onCompleteActivity: function(oEvent){
            path = oEvent.getSource().getBindingContext('activityModel').sPath;
            let completedTask = this.activityModel.getProperty(path.split("/").slice(0,-1).join("/"))[parseInt(path.split("/").pop())];
            completedTask["state"]  = "C"
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
            return JSON.parse(localStorage.getItem((key || this.getDate())) || '[]');
        },

        setActivityData: function(value, key){
            if(!value.startsWith)
                value = JSON.stringify(value)
            localStorage.setItem((key || this.getDate()), value)
        },

        getDate: function(){
            let d = new Date();
            return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
        },

        getPreparedText: function(oEvent){
            let res = '';
            for(let ah of this.activityModel.getData()){
                res +=  ah.topic `\n`;
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