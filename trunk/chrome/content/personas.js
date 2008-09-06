
let PersonaController = {

  //**************************************************************************//
  // Convenience Getters

  // Preference Service
  get _prefSvc() {
    let prefSvc = Cc["@mozilla.org/preferences-service;1"].
                  getService(Ci.nsIPrefBranch).
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
  // Initialization & Destruction

  startUp: function() {
    styleSheetUtility.init("chrome://personas/skin/personas.css", document.styleSheets);
    
    let selectedPersona = this._getPref("selected", "default")
    if (selectedPersona == "manual")
		this._applyPersona();
    
  },

  shutDown: function() {
	this._applyDefault();
  },

  

  //**************************************************************************//
  // Appearance Updates

  _applyPersona: function() {
    
    this._prefSvc.setCharPref("selected", "manual");
    
    var controlPaneStyle = this._createBackgroundStyle(this._getPref("custom.controlPane", ""));
	var servicePaneStyle = this._createBackgroundStyle(this._getPref("custom.servicePane", ""));
    var titlebarStyle = this._createBackgroundStyle(this._getPref("custom.titlebar", ""));
	var navbarStyle = this._createBackgroundStyle(this._getPref("custom.navbar", ""));
	
	var rule_index = 0;
	var cssRules = new Array();
	cssRules[rule_index++] = "#control_pane { " + controlPaneStyle + " }"; 
	cssRules[rule_index++] = "#sb_servicepane { " + servicePaneStyle + " }";
	cssRules[rule_index++] = "#sb-sys-titlebar, #main-menubar  { " + titlebarStyle + " }";
	cssRules[rule_index++] = "#nav-bar { " + navbarStyle + " }";
			
	styleSheetUtility.deleteAllRules();
	styleSheetUtility.insertAllRules(cssRules);


  },

  _applyDefault: function() {
	
	styleSheetUtility.deleteAllRules();
	
  },


  //**************************************************************************//
  // Persona Selection, Preview, and Reset

  onSelectDefault: function() {
	this._prefSvc.setCharPref("selected", "default");
    this._applyDefault();
  },

  onSelectCustom: function() {
    window.openUILinkIn("chrome://personas/content/customPersonaEditor.xul", "tab");
  },

  _createBackgroundStyle: function(input) {
	if (/^#?[0-9AaBbCcDdEeFf]{3,6}$/.test(input) || /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(input) )
		//the value is a color
		return "background-color: " + input + "!important; background-image: none !important;";
	else
		return "background-image: url(" + input + ") !important; background-color: transparent !important;";
  },
  
  //**************************************************************************//
  // Popup Construction

  onMenuButtonMouseDown: function(event) {
    var menuPopup = document.getElementById('personas-selector-menu');
    var menuButton = document.getElementById("personas-selector-button");
    
    // If the menu popup isn't on the menu button, then move the popup onto
    // the button so the popup appears when the user clicks the button.  We'll
    // move the popup back to the Tools > Sync menu when the popup hides.
    if (menuPopup.parentNode != menuButton) {
	  menuButton.appendChild(menuPopup);
     }
  },

  onMenuPopupHiding: function() {
    var menuPopup = document.getElementById('personas-selector-menu');
    var menu = document.getElementById('personas-menu');
	
    // If the menu popup isn't on the Tools > Personas menu, then move the popup
    // back onto that menu so the popup appears when the user selects the menu.
    // We'll move the popup back to the menu button when the user clicks on
    // the menu button.
    if (menuPopup.parentNode != menu)
      menu.appendChild(menuPopup);    
  },

  onPersonaPopupShowing: function(event) {
    if (event.target != this._menu)
      return;
  },

};

window.addEventListener("load", function(e) { PersonaController.startUp(e) }, false);
window.addEventListener("unload", function(e) { PersonaController.shutDown(e) }, false);
