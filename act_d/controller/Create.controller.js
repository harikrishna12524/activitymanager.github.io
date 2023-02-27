sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
],function(BaseController, JSONModel){
    BaseController.extend("Employee.controller.Create", {
        onInit: function(){

            this.getView().setModel(new JSONModel({
                    "CompanyId":null,
                    "Company":null,
                    "CompanyAddress":[null,null,null,null],
                    "Designation":null,
                    "FirstName":null,
                    "LastName":null,
                    "EmployeeId":null,
                    "Image":null,
                    "Salary":null,
                    "BalanceAmount":null,
            
                    "Email":null,
                    "Phone":[null,null],
                    "Gender":null,
                    "DateOfBirth":null,
                    "MaritalStatus":null,
                    "WorkType":null,
                    "Country":null,

                    "JoiningDate":null,
                    "BondPeriod":null,
                    "Experience":null
                })
            );
        }
    })
})