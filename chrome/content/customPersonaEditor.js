const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

let CustomPersonaEditor = {
  //**************************************************************************//
  // Convenience Getters

  get _stringBundle() {
    let stringBundle = document.getElementById("personasStringBundle");
    delete this._stringBundle;
    this._stringBundle = stringBundle;
    return this._stringBundle;
  },

  get _controlPane() {
    let controlPane = document.getElementById("controlPane");
    delete this._controlPane;
    this._controlPane = controlPane;
    return this._controlPane;
  },
  
  get _servicePane() {
    let servicePane = document.getElementById("servicePane");
    delete this._servicePane;
    this._servicePane = servicePane;
    return this._servicePane;
  },
  
  get _titlebar() {
    let titlebar = document.getElementById("titlebar");
    delete this._titlebar;
    this._titlebar = titlebar;
    return this._titlebar;
  },
  
  get _navbar() {
    let navbar = document.getElementById("navbar");
    delete this._navbar;
    this._navbar = navbar;
    return this._navbar;
  },

  // Preference Service
  get _prefSvc() {
    let prefSvc = Cc["@mozilla.org/preferences-service;1"].
                  getService(Ci.nsIPrefService).
                  getBranch("extensions.personas.");
    delete this._prefSvc;
    this._prefSvc = prefSvc;
    return this._prefSvc;
  },

  get _prefCache() {
    let prefCache = new PersonasPrefCache("extensions.personas.", this);
    delete this._prefCache;
    this._prefCache = prefCache;
    return this._prefCache;
  },

  _getPref: function(aPrefName, aDefaultValue) {
    return this._prefCache.getPref(aPrefName, aDefaultValue);
  },


  //**************************************************************************//
  // Initialization

  init: function() {
    var controlPaneValue = this._getPref("custom.controlPane", "");
	var servicePaneValue = this._getPref("custom.servicePane", "");
	var titlebarValue = this._getPref("custom.titlebar", "");
	var navbarValue = this._getPref("custom.navbar", "");
	
    this._controlPane.value = controlPaneValue;
    this._servicePane.value = servicePaneValue;
    this._titlebar.value = titlebarValue;
    this._navbar.value = navbarValue;
  },


  //**************************************************************************//
  // Controls -> Settings

  
  onSelectBackground: function(aEvent) {
    let control = aEvent.target;
    let textbox = control.parentNode.firstChild;
    let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
    fp.init(window,
            this._stringBundle.getString("backgroundPickerDialogTitle"),
            Ci.nsIFilePicker.modeOpen);
    let result = fp.show();
    if (result == Ci.nsIFilePicker.returnOK) {
      textbox.value = fp.fileURL.spec;
    }
  },
  
  onSelectColor: function(aEvent) {
    let control = aEvent.target;
    let textbox = control.parentNode.firstChild;
    let value = control.color.replace(/^\s*|\s*$/g, "");
    
    textbox.value = value;
  },

  onClose: function() {
    styleSheetUtility.deleteAllRules();
	window.close();
  },

  onApply: function() {
	let controlPaneValue = this._controlPane.value;
	let servicePaneValue = this._servicePane.value;
	let titlebarValue = this._titlebar.value;
	let navbarValue = this._navbar.value;
	
	this._prefSvc.setCharPref("custom.controlPane", controlPaneValue);
	this._prefSvc.setCharPref("custom.servicePane", servicePaneValue);
	this._prefSvc.setCharPref("custom.titlebar", titlebarValue);
	this._prefSvc.setCharPref("custom.navbar", navbarValue);
	
	this.onPreview()
	
	this._prefSvc.setCharPref("selected", "manual");
    window.close();
  },
  
  onPreview: function() {
	var controlPaneStyle = this._createBackgroundStyle(this._controlPane.value);
	var servicePaneStyle = this._createBackgroundStyle(this._servicePane.value);
	var titlebarStyle = this._createBackgroundStyle(this._titlebar.value);
	var navbarStyle = this._createBackgroundStyle(this._navbar.value);
	
	var rule_index = 0;
	var cssRules = new Array();
	cssRules[rule_index++] = "#control_pane { " + controlPaneStyle + " }";
	cssRules[rule_index++] = "#sb_servicepane { " + servicePaneStyle + " }";
	cssRules[rule_index++] = "#sb-sys-titlebar, #main-menubar { " + titlebarStyle + " }";
	cssRules[rule_index++] = "#nav-bar { " + navbarStyle + " }";
	
	//cssRules[rule_index++] = "#sb-sys-title-title, .menubar-text { color: #FF0000 !important; }";
	 
			
	styleSheetUtility.deleteAllRules();
	styleSheetUtility.insertAllRules(cssRules);
	
  },
  
  _createBackgroundStyle: function(input) {
	if (/^#?[0-9AaBbCcDdEeFf]{3,6}$/.test(input) || /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(input) )
		//the value is a color
		return "background-color: " + input + "!important; background-image: none !important;";
	else
		return "background-image: url(" + input + ") !important; background-color: transparent !important;";
  }
  
  
};

window.addEventListener("load", function() { CustomPersonaEditor.init() }, false);
