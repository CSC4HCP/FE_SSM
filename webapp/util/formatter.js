jQuery.sap.declare("ssms.util.formatter");
ssms.util.formatter = {
	formatVisibility: function(sValue) {
	   var sResult;
	    if(sValue){
	        sResult = "Public";
	    }
	    else{
	        sResult = "Private";
	    }
	    return sResult;
	},
	formatDateTime: function(sValue) {
	    var dDate,dTime;
	    
	        dDate = sValue.substring(0,sValue.indexOf("T"));
	    dTime = sValue.substring(sValue.indexOf("T") +1,sValue.indexOf("+") );

	    return dDate + " " +dTime;
	},
	formatDate: function(sValue){
	    return sValue.substring(0,sValue.indexOf("T"));
	},
	formatTime: function(sValue) {
	    return sValue.substring(sValue.indexOf("T") +1,sValue.indexOf("+") );
	}
};