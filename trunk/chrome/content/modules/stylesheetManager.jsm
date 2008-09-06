/**
 * Utilities for JavaScript code to handle stylesheet adding/removing of rules
 *
 * Import this module through
 *
 * Components.utils.import("resource://gre/modules/stylesheetManager.jsm");
 *
 * Usage:
 *
 * var rule_index = 0;
 * var cssRules = new Array();
 * cssRules[rule_index] = "#control_pane { background-color: " + elementObj.controlPane + " !important; }";
 * 
 * styleSheetUtility.init("chrome://personas/skin/personas.css");
 * styleSheetUtility.deleteAllRules();
 * styleSheetUtility.insertAllRules(cssRules);
 *
 */

EXPORTED_SYMBOLS = ["styleSheetUtility"];

var styleSheetUtility = 
{
	_backgroundStyleSheet : "",
	
	init : function(styleSheetUrl, styleSheetList) {
		//var styleSheetList = document.styleSheets;
		for (var i=0;i<styleSheetList.length;i++) {
			if (styleSheetList.item(i).href == styleSheetUrl)
				this._backgroundStyleSheet = styleSheetList.item(i);
		}
	},
	
	deleteAllRules: function() {
		var ruleCount = this._backgroundStyleSheet.cssRules.length
		for (var i=0;i<ruleCount;i++) {
			this._backgroundStyleSheet.deleteRule(0);
		}
	},
	
	insertAllRules: function(cssRules) {
		var ruleCount = cssRules.length;
		for (var i=0; i < ruleCount; i++) {
			this._backgroundStyleSheet.insertRule(cssRules[i], i);
		}
	}
	
}


