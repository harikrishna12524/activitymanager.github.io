sap.ui.define([], function(){
    return {

        isValidFirstName: function(name){
            if(/^[a-zA-Z]+$/.test(name)==true){
                if(name.length<3){
                    return "min3char";
                }else if(name.length>30){
                    return "max30char";
                }else{
                    return true;
                }
            }else{
                return "onlyAlphaError";
            }
        },
        
        isValidLastName: function(name){
            if(/^[a-zA-Z]+$/.test(name)==true){
                if(name.length>30){
                    return "max30char";
                }else{
                    return true;
                }
            }else{
                return "onlyAlphaError";
            }
        },

        isValidBirthDay: function(date){
            if(new Date(date).toString() == 'Invalid Date'){
                return "invalidDate";
            }else{
                let todayDate = new Date();
                let allowedDate = new Date(new Date().setFullYear(todayDate.getFullYear()-18));
                var bDay = new Date(date);
                if(bDay>allowedDate){
                    return "minDateError";
                }else{
                    return true;
                }
            }
        },

        isValidEmail: function(email){
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(mailformat.test(email)){
                return true;
            }else{
                return "invalidEmail";
            }
        },

        isValidMoblie: function(number){
            if(/^\d+$/.test(number) && (number.length<=15 && number.length>=10)){
                return true;
            }else{
                return "invalidPhone";
            }
        },

        isValidCompanyName: function(name){
            if(/^[a-zA-Z\s]*$/.test(name)==true){
                if(name.length>20){
                    return "max20char";
                }else{
                    return true;
                }
            }else{
                return "onlyAlphaError";
            }
        },

        isValidZipcode: function(number){
            if(/^\d+$/.test(number) && (number.length<=10 && number.length>=5)){
                return true;
            }else{
                return "invalidZipcode";
            }
        },

        isPureNumber: function(number){
            if(/^\d+$/.test(number)){
                return true;
            }else{
                return "invalidNumber";
            }
        },

        isPureFloat: function(number){
            if(/^\d+(\.\d+)?$/.test(number)){
                return true;
            }else{
                return "invalidNumber";
            }
        },

        isNonNull: function(value){
            return true;
        },

        isValidJoiningDate: function(date){
            if(new Date(date).toString() == 'Invalid Date'){
                return "invalidDate";
            }else{
                return true;
            }
        },

        __isAllAlphabets: function(name){
            var allChar = /^[a-zA-Z]+$/;
            if(allChar.test(name)){
                return true;
            }else{
                return false;
            }
        }
    }
})