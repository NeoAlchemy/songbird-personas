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
  
  get _dpServicePaneTitlebar() {
    let dpServicePaneTitlebar = document.getElementById("dpServicePaneTitlebar");
    delete this._dpServicePaneTitlebar;
    this._dpServicePaneTitlebar = dpServicePaneTitlebar;
    return this._dpServicePaneTitlebar;
  },
  
  get _dpContentPaneTitlebar() {
    let dpContentPaneTitlebar = document.getElementById("dpContentPaneTitlebar");
    delete this._dpContentPaneTitlebar;
    this._dpContentPaneTitlebar = dpContentPaneTitlebar;
    return this._dpContentPaneTitlebar;
  },
  
  get _dpRightSidebarTitlebar() {
    let dpRightSidebarTitlebar = document.getElementById("dpRightSidebarTitlebar");
    delete this._dpRightSidebarTitlebar;
    this._dpRightSidebarTitlebar = dpRightSidebarTitlebar;
    return this._dpRightSidebarTitlebar;
  },
  
  get _titlebar() {
    let titlebar = document.getElementById("titlebar");
    delete this._titlebar;
    this._titlebar = titlebar;
    return this._titlebar;
  },
  
  get _titlebarText() {
    let titlebarText = document.getElementById("titlebarText");
    delete this._titlebarText;
    this._titlebarText = titlebarText;
    return this._titlebarText;
  },
  
  get _navbar() {
    let navbar = document.getElementById("navbar");
    delete this._navbar;
    this._navbar = navbar;
    return this._navbar;
  },
  
  get _statusbar() {
    let statusbar = document.getElementById("statusbar");
    delete this._statusbar;
    this._statusbar = statusbar;
    return this._statusbar;
  },
  
  get _servicePaneStatusbar() {
    let servicePaneStatusbar = document.getElementById("servicePaneStatusbar");
    delete this._servicePaneStatusbar;
    this._servicePaneStatusbar = servicePaneStatusbar;
    return this._servicePaneStatusbar;
  },
  
  get _main() {
    let main = document.getElementById("main");
    delete this._main;
    this._main = main;
    return this._main;
  },
  
  get _saveName() {
    let saveName = document.getElementById("saveName");
    delete this._saveName;
    this._saveName = saveName;
    return this._saveName;
  },
  
  get _importSpace() {
    let importSpace = document.getElementById("importSpace");
    delete this._importSpace;
    this._importSpace = importSpace;
    return this._importSpace;
  },
  
  //TODO:: create getter setters for import, export

  // Preference Service
  get _prefSvc() {
    let prefSvc = Cc["@mozilla.org/preferences-service;1"].
                  getService(Ci.nsIPrefService).
                  getBranch("extensions.personas.");
    delete this._prefSvc;
    this._prefSvc = prefSvc;
    return this._prefSvc;
  },
  
  get _logger() {
    var ConsoleService = Cc["@mozilla.org/consoleservice;1"].
                    getService(Ci.nsIConsoleService);
    delete this._logger;
    this._logger = ConsoleService
    return this._logger;
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
    let selectedPersona = this._getPref("settings.selected", "default");
    if (selectedPersona != "default") {
      var customObj = JSON.fromString(selectedPersona);
      
      this._controlPane.value = customObj.controlPane;
      this._servicePane.value = customObj.servicePane;
      this._dpServicePaneTitlebar.value = customObj.dpServicePaneTitlebar;
      this._dpContentPaneTitlebar.value = customObj.dpContentPaneTitlebar;
      this._dpRightSidebarTitlebar.value = customObj.dpRightSidebarTitlebar;
      this._titlebar.value = customObj.titlebar;
      this._navbar.value = customObj.navbar;
      this._statusbar.value = customObj.statusbar;
      this._servicePaneStatusbar.value = customObj.servicePaneStatusbar;
      this._main.value = customObj.main;
      this._titlebarText.value = customObj.titlebarText;
      
     
      if (this._isColorValue(customObj.controlPane)) document.getElementById("selectcontrolPaneColor").color = customObj.controlPane
      if (this._isColorValue(customObj.servicePane)) document.getElementById("selectservicePaneColor").color = customObj.servicePane
      if (this._isColorValue(customObj.dpServicePaneTitlebar)) document.getElementById("selectdpServicePaneTitlebarColor").color = customObj.dpServicePaneTitlebar
      if (this._isColorValue(customObj.dpContentPaneTitlebar)) document.getElementById("selectdpContentPaneTitlebarColor").color = customObj.dpContentPaneTitlebar
      if (this._isColorValue(customObj.dpRightSidebarTitlebar)) document.getElementById("selectdpRightSidebarTitlebarColor").color = customObj.dpRightSidebarTitlebar
      if (this._isColorValue(customObj.titlebar)) document.getElementById("selecttitlebarColor").color = customObj.titlebar
      if (this._isColorValue(customObj.navbar)) document.getElementById("selectnavbarColor").color = customObj.navbar
      if (this._isColorValue(customObj.statusbar)) document.getElementById("selectstatusbarColor").color = customObj.statusbar
      if (this._isColorValue(customObj.servicePaneStatusbar)) document.getElementById("selectservicePaneStatusbarColor").color = customObj.servicePaneStatusbar
      if (this._isColorValue(customObj.main)) document.getElementById("selectmainColor").color = customObj.main
      if (this._isColorValue(customObj.titlebarText)) document.getElementById("selecttitlebarTextColor").color = customObj.titlebarText
    }
    
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
  
  onImport: function() {
    var importElementBox = document.getElementById("importElements");
    importElementBox.setAttribute("hidden", "false");
  },
  
  onCancelConfirmImport: function() {
    var importElementBox = document.getElementById("importElements");
    importElementBox.setAttribute("hidden", "true");
  },
  
  onConfirmImport: function() {
    let selectedPersona = this._importSpace.value
    if (selectedPersona != "default") {
      var customObj = JSON.fromString(selectedPersona);
      
      this._controlPane.value = customObj.controlPane;
      this._servicePane.value = customObj.servicePane;
      this._dpServicePaneTitlebar.value = customObj.dpServicePaneTitlebar;
      this._dpContentPaneTitlebar.value = customObj.dpContentPaneTitlebar;
      this._dpRightSidebarTitlebar.value = customObj.dpRightSidebarTitlebar;
      this._titlebar.value = customObj.titlebar;
      this._navbar.value = customObj.navbar;
      this._statusbar.value = customObj.statusbar;
      this._servicePaneStatusbar.value = customObj.servicePaneStatusbar;
      this._main.value = customObj.main;
      this._titlebarText.value = customObj.titlebarText;
      
     
      if (this._isColorValue(customObj.controlPane)) document.getElementById("selectcontrolPaneColor").color = customObj.controlPane
      if (this._isColorValue(customObj.servicePane)) document.getElementById("selectservicePaneColor").color = customObj.servicePane
      if (this._isColorValue(customObj.dpServicePaneTitlebar)) document.getElementById("selectdpServicePaneTitlebarColor").color = customObj.dpServicePaneTitlebar
      if (this._isColorValue(customObj.dpContentPaneTitlebar)) document.getElementById("selectdpContentPaneTitlebarColor").color = customObj.dpContentPaneTitlebar
      if (this._isColorValue(customObj.dpRightSidebarTitlebar)) document.getElementById("selectdpRightSidebarTitlebarColor").color = customObj.dpRightSidebarTitlebar
      if (this._isColorValue(customObj.titlebar)) document.getElementById("selecttitlebarColor").color = customObj.titlebar
      if (this._isColorValue(customObj.navbar)) document.getElementById("selectnavbarColor").color = customObj.navbar
      if (this._isColorValue(customObj.statusbar)) document.getElementById("selectstatusbarColor").color = customObj.statusbar
      if (this._isColorValue(customObj.servicePaneStatusbar)) document.getElementById("selectservicePaneStatusbarColor").color = customObj.servicePaneStatusbar
      if (this._isColorValue(customObj.main)) document.getElementById("selectmainColor").color = customObj.main
      if (this._isColorValue(customObj.titlebarText)) document.getElementById("selecttitlebarTextColor").color = customObj.titlebarText
    }
    
    var importLabel = document.getElementById("importLabel");
    var confirmImportButton = document.getElementById("okConfirmImport");
    importLabel.setAttribute("hidden", "true");
    confirmImportButton.setAttribute("hidden", "true");
    this._importSpace.setAttribute("hidden", "true");
  },
  
  onSave: function() {
    var saveElementBox = document.getElementById("saveElements");
    saveElementBox.setAttribute("hidden", "false");
  },

  onConfirmSave: function() {
    var customObject = this._createJSONObject()
    
    this._prefSvc.setCharPref("feather."+customObject.id, JSON.toString(customObject));
    this._prefSvc.setCharPref("settings.selected", JSON.toString(customObject));
    
    this.onPreview()
    window.close();
  },
  
  onCancelConfirmSave: function() {
    var saveElementBox = document.getElementById("saveElements");
    saveElementBox.setAttribute("hidden", "true");
  },
  
  onExport: function() {
    var objectString = JSON.toString(this._createJSONObject());
    alert(objectString.replace(/:/g, " : "));
  },
  
  onPreview: function() {
    var controlPaneStyle = this._createBackgroundStyle(this._controlPane.value);
    var servicePaneStyle = this._createBackgroundStyle(this._servicePane.value);
    var titlebarStyle = this._createBackgroundStyle(this._titlebar.value);
    var dpServicePaneTitlebarStyle = this._createBackgroundStyle(this._dpServicePaneTitlebar.value);
    var dpContentPaneTitlebarStyle = this._createBackgroundStyle(this._dpContentPaneTitlebar.value);
    var dpRightSidebarTitlebarStyle = this._createBackgroundStyle(this._dpRightSidebarTitlebar.value);
    var navbarStyle = this._createBackgroundStyle(this._navbar.value);
    var statusbarStyle = this._createBackgroundStyle(this._statusbar.value);
    var servicePaneStatusbarStyle = this._createBackgroundStyle(this._servicePaneStatusbar.value);
    var mainStyle = this._createBackgroundStyle(this._main.value);
    
    var titlebarTextStyle = this._titlebarText.value;
    
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
    
    /* tabstrip 
    if (controlPaneStyle != emptyStyle)
      cssRules[rule_index++] = ".tabbrowser-tab > .tab-image-middle, .tabbrowser-tab > .tab-image-left, .tabbrowser-tab > .tab-image-right, .tabbrowser-tab > .tab-close-button { " + controlPaneStyle + " }";     
    if (servicePaneStyle != emptyStyle)
      cssRules[rule_index++] = "#tabstrip .tabbrowser-tab[selected=\"true\"] { " + servicePaneStyle + " }";
    if (servicePaneStatusbarStyle != emptyStyle)
      cssRules[rule_index++] = "#tabstrip .scrollbox-innerbox { " + servicePaneStatusbarStyle + " }";
    
    end tabstrip */
      
    if (servicePaneStatusbarStyle != emptyStyle)
      cssRules[rule_index++] = "#servicepane-status-bar { " + servicePaneStatusbarStyle + " }";
    if (mainStyle != emptyStyle)
      cssRules[rule_index++] = "#mainplayer sb-sys-outer-frame { " + mainStyle + " }";
    if (titlebarTextStyle)
      cssRules[rule_index++] = "#sb-sys-title-title, .menubar-text, #displaypane_servicepane_bottom .sb-displaypane-label, #displaypane_contentpane_bottom .sb-displaypane-label, #displaypane_right_sidebar .sb-displaypane-label, #status-bar label, #sb_servicepane_treepane .servicepane-tree, .tabbrowser-tab label { color: " + titlebarTextStyle + " !important; }";
     
        
    styleSheetUtility.deleteAllRules();
    styleSheetUtility.insertAllRules(cssRules);
	
  },
  
  _createBackgroundStyle: function(input) {
	if (this._isColorValue(input))
		//the value is a color
		return "background-color: " + input + "!important; background-image: none !important;";
	else
		return "background-image: url(" + input + ") !important; background-color: transparent !important;";
  },
  
  _isColorValue: function(text) {
	if (/^#?[0-9AaBbCcDdEeFf]{3,6}$/.test(text) || /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(text) )
		return true;
	else
		return false;
  },
  
  debug: function(message) {
    this._logger.logStringMessage(message);
  },
  
  _createJSONObject: function() {
    
    var obj = {
      "id": this._saveName.value.replace(/\s/g, ""),
      "category": "Personal",
      "name": this._saveName.value,
      "controlPane": this._controlPane.value,
      "servicePane": this._servicePane.value,
      "titlebar": this._titlebar.value,
      "dpServicePaneTitlebar": this._dpServicePaneTitlebar.value,
      "dpContentPaneTitlebar": this._dpContentPaneTitlebar.value,
      "dpRightSidebarTitlebar": this._dpRightSidebarTitlebar.value,
      "navbar": this._navbar.value,
      "statusbar": this._statusbar.value,
      "servicePaneStatusbar": this._servicePaneStatusbar.value,
      "main": this._main.value,
      "titlebarText": this._titlebarText.value
    }
    
    return obj;
  }
};

window.addEventListener("load", function() { CustomPersonaEditor.init() }, false);
