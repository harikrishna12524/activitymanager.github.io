sap.ui.define([], function(){
    return {
        spreadSheetName : "__activitymanager__dont-edit",

        getRangeData: async function (range){ // Still reprase
            res = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: await this.getSpreadSheetId(),
                range: range 
            })
            return res;
        },

        addDataToCache: async function(){
            if(window.AppCacheData)
                return;
            let data = await this.getRangeData("A1:B1000");
            data = data.result.values || [];
            let column = 0;
            let processedData = {};
            for(let entry of data){
                column++;
                processedData[entry[0]] = {data : JSON.parse(entry[1] || '{}'), column : column};
            }
            window.last_column = column;
            window["AppCacheData"] = processedData;
        },

        updateToSheet: async function(json, date){
            date = date || this.getDate();
            json = json || '[]'
            await this.addDataToCache();
            let id = window.localStorage.getItem("main_sheet_id");
            if(!json.charAt)
                json = JSON.stringify(json);
            if(window.AppCacheData[date]){
                res = await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: id,
                    valueInputOption: "RAW", values : [[date, json]], range : `A${window.AppCacheData[date].column}:B${window.AppCacheData[date].column+1}`
                })
            }else{
                res = await gapi.client.sheets.spreadsheets.values.append({
                    spreadsheetId: id,
                    valueInputOption: "RAW", values : [[date, json]], range : `A1:B${window.last_column++}`
                })
                window.AppCacheData[date] = { data: json , column : window.last_column};
            }
            window.AppCacheData[date].data = json;
        },

        getSpreadSheetId: async function(){
            let id = window.localStorage.getItem("main_sheet_id");
            return id || await this.createSpreadSheet();
        },

        createSpreadSheet: async function(){
            res = await gapi.client.sheets.spreadsheets.create({properties : {title : this.spreadSheetName}});
            window.localStorage.setItem("main_sheet_details", JSON.stringify(res.result));
            window.localStorage.setItem("main_sheet_id", res.result.spreadsheetId);
            return res.result.spreadsheetId;
        },

        getDate: function(){
            let d = new Date();
            return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
        },

        getSheetMeta: function(){
            
        }
    }
})