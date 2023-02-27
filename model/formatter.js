sap.ui.define([], function(){
    return {
        dateModifier: function(sDate){
            return new Date(sDate).toString().slice(4,15);
        }
    }
})