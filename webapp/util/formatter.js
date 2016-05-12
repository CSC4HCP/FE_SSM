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
	}
};