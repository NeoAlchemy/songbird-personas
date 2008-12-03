
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
    var dpServicePaneTitlebarStyle = this._createBackgroundStyle(this._getPref("custom.dpServicePaneTitlebarValue", ""));
	var dpContentPaneTitlebarStyle = this._createBackgroundStyle(this._getPref("custom.dpContentPaneTitlebar", ""));
	var dpRightSidebarTitlebarStyle = this._createBackgroundStyle(this._getPref("custom.dpRightSidebarTitlebarValue", ""));
	var navbarStyle = this._createBackgroundStyle(this._getPref("custom.navbar", ""));
	var statusbarStyle = this._createBackgroundStyle(this._getPref("custom.statusbar", ""));
	var servicePaneStatusbarStyle = this._createBackgroundStyle(this._getPref("custom.servicePaneStatusbar", ""));
	var mainStyle = this._createBackgroundStyle(this._getPref("custom.main", ""));
	
	var titlebarTextStyle = this._getPref("custom.titlebarText", "");
	
	var emptyStyle = this._createBackgroundStyle("");
	
	var rule_index = 0;
	var cssRules = new Array();
	if (controlPaneStyle != emptyStyle)
		cssRules[rule_index++] = "#control_pane, #control_pane_box { " + controlPaneStyle + " }"; 
	if (servicePaneStyle != emptyStyle)
		cssRules[rule_index++] = "#sb_servicepane { " + servicePaneStyle + " }";
	if (titlebarStyle != emptyStyle)
		cssRules[rule_index++] = "#sb-sys-titlebar, #main-menubar { " + titlebarStyle + " }";
	if (dpServicePaneTitlebarStyle != emptyStyle)
		cssRules[rule_index++] = "#displaypane_servicepane_bottom .sb-displaypane-header  { " + dpServicePaneTitlebarStyle + " }";
	if (dpContentPaneTitlebarStyle != emptyStyle)
		cssRules[rule_index++] = "#displaypane_contentpane_bottom .sb-displaypane-header  { " + dpContentPaneTitlebarStyle + " }";
	if (dpRightSidebarTitlebarStyle != emptyStyle)
		cssRules[rule_index++] = "#displaypane_right_sidebar .sb-displaypane-header  { " + dpRightSidebarTitlebarStyle + " }";
	if (navbarStyle != emptyStyle)
		cssRules[rule_index++] = "#nav-bar { " + navbarStyle + " }";
	if (statusbarStyle != emptyStyle)
		cssRules[rule_index++] = "#status-bar { " + statusbarStyle + " }";
	if (servicePaneStatusbarStyle != emptyStyle)
		cssRules[rule_index++] = "#servicepane-status-bar { " + servicePaneStatusbarStyle + " }";
	if (mainStyle != emptyStyle)
		cssRules[rule_index++] = "#mainplayer, #displaypane_contentpane_bottom browser { " + mainStyle + " }";
	if (titlebarTextStyle)
		cssRules[rule_index++] = "#sb-sys-title-title, .menubar-text, #displaypane_servicepane_bottom .sb-displaypane-label, #displaypane_contentpane_bottom .sb-displaypane-label, #displaypane_right_sidebar .sb-displaypane-label, #status-bar label { color: " + titlebarTextStyle + " !important; }";
			
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
