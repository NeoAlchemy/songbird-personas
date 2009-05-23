
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
  
  // Preference Service to be used for getting children of feather
  get _savedFeathers() {
    var savedFeathers = Cc["@mozilla.org/preferences-service;1"].
                  getService(Ci.nsIPrefBranch).
                  getBranch("extensions.personas.feather.");
    delete this._savedFeathers;
    this._savedFeathers = savedFeathers;
    return this._savedFeathers;
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
  
  get _menuPopup() {
    delete this._menuPopup;
    return this._menuPopup = document.getElementById("personas-selector-menu");
  },
  
  //**************************************************************************//
  // Initialization & Destruction

  startUp: function() {
    styleSheetUtility.init("chrome://personas/skin/personas.css", document.styleSheets);
    
    var selectedPersona = this._getPref("settings.selected", "default");
    if (selectedPersona == "default")
      this._applyDefault();
    else {
      this._getPref(selectedPersona)
      this._applyPersona(JSON.fromString(selectedPersona));
    }
    
  },

  shutDown: function() {
    this._applyDefault();
  },

  //**************************************************************************//
  // General Utilities
  
  debug: function(message) {
    this._logger.logStringMessage(message);
  },


  //**************************************************************************//
  // Appearance Updates

  _applyPersona: function(obj) {
    
    var controlPaneStyle = this._createBackgroundStyle(obj.controlPane);
    var servicePaneStyle = this._createBackgroundStyle(obj.servicePane);
    var titlebarStyle = this._createBackgroundStyle(obj.titlebar);
    var dpServicePaneTitlebarStyle = this._createBackgroundStyle(obj.dpServicePaneTitlebarValue);
    var dpContentPaneTitlebarStyle = this._createBackgroundStyle(obj.dpContentPaneTitlebar);
    var dpRightSidebarTitlebarStyle = this._createBackgroundStyle(obj.dpRightSidebarTitlebarValue);
    var navbarStyle = this._createBackgroundStyle(obj.navbar);
    var statusbarStyle = this._createBackgroundStyle(obj.statusbar);
    var servicePaneStatusbarStyle = this._createBackgroundStyle(obj.servicePaneStatusbar);
    var mainStyle = this._createBackgroundStyle(obj.main);
    
    var titlebarTextStyle = obj.titlebarText;
    
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
      cssRules[rule_index++] = "#mainplayer sb-sys-outer-frame { " + mainStyle + " }";
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
	  this._prefSvc.setCharPref("settings.selected", "default");
    this._applyDefault();
  },

  onSelectCustom: function() {
    window.openUILinkIn("chrome://personas/content/customPersonaEditor.xul", "tab");
  },
  
  onSelectPersona: function(event) {
    var xulElement = event.target;
    var id = xulElement.getAttribute("personaid")
    this._prefSvc.setCharPref("settings.selected", this._getPref("feather."+id));
    var persona = JSON.fromString(this._getPref("feather."+id))
		this._applyPersona(persona);
  },

  onPreviewPersona: function(event) {
    var xulElement = event.target;
    var id = xulElement.getAttribute("personaid")
    var persona = JSON.fromString(this._getPref("feather."+id))
		this._applyPersona(persona);
  },

  onResetPersona: function(event) {
    let selectedPersona = this._getPref("settings.selected", "default");
    if (selectedPersona == "default")
      this._applyDefault();
    else {
      this._applyPersona(JSON.fromString(selectedPersona));
    }
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
    var menuButton = document.getElementById("personas-selector-button");
    this.debug("onMenuButtonMouseDown");
    // If the menu popup isn't on the menu button, then move the popup onto
    // the button so the popup appears when the user clicks the button.  We'll
    // move the popup back to the Tools > Sync menu when the popup hides.
    if (this._menuPopup.parentNode != menuButton) {
        menuButton.appendChild(this._menuPopup);
        this._rebuildMenuItem();
    }
  },

  onMenuPopupHiding: function() {
    var menu = document.getElementById('personas-menu');
    this.debug("onMenuPopupHiding");
    // If the menu popup isn't on the Tools > Personas menu, then move the popup
    // back onto that menu so the popup appears when the user selects the menu.
    // We'll move the popup back to the menu button when the user clicks on
    // the menu button.
    if (this._menuPopup.parentNode != menu) {
      menu.appendChild(this._menuPopup);
      this._rebuildMenuItem();
    }
  },

  onPersonaPopupShowing: function(event) {
    this.debug("onPersonaPopupShowing");
    if (event.target == this._menuPopup)
      this._rebuildMenuItem();
    return true;
  },
  
  _rebuildMenuItem: function() {
    
    let openingSeparator = document.getElementById("personas-opening-separator");
    let closingSeparator = document.getElementById("personas-closing-separator");
    
    // Remove everything between the two separators.
    while (openingSeparator.nextSibling && openingSeparator.nextSibling != closingSeparator)
      this._menuPopup.removeChild(openingSeparator.nextSibling);
      
    // add items back to menu
    var menuItems = this._listOfItems();
    for each (var category in menuItems) {
      var menuFolder = [];
      for (var i=0;i<category.length;i++)
        menuFolder.push(this._createMenuItem(category[i].name, category[i].id));
      //all personas in the array should belong to the same category
      this._menuPopup.insertBefore(this._createMenuFolder(category[0].category, menuFolder), closingSeparator);
    }
    this._changeSelectedItem();
  },
  
  _createMenuFolder: function(folderName, menuItemList) {
    let menu = document.createElement("menu");
    let popupmenu = document.createElement("menupopup");
    
    menu.setAttribute("label", folderName);
    for each (let menuItem in menuItemList)
      popupmenu.appendChild(menuItem);
    
    menu.appendChild(popupmenu);
    return menu;
  },
  
  _createMenuItem: function(name, id) {
    let selectedPersona = this._getPref("settings.selected", "default");
    let personaId = (selectedPersona == "default") ? "Default" : (JSON.fromString(selectedPersona)).id
    let item = document.createElement("menuitem");
    item.setAttribute("label", name);
    item.setAttribute("type", "checkbox");
    item.setAttribute("checked", (id == personaId));
    item.setAttribute("autocheck", "false");
    item.setAttribute("personaid", id);
    item.setAttribute("oncommand", "PersonaController.onSelectPersona(event)");
    item.addEventListener("DOMMenuItemActive", function(evt) { PersonaController.onPreviewPersona(evt) }, false);
    item.addEventListener("DOMMenuItemInactive", function(evt) { PersonaController.onResetPersona(evt) }, false);
    return item;
  },
  
  _changeSelectedItem: function() {
    var selected = this._getPref("settings.selected", "default");
    var personaName = (selected == "default") ? "Default" : (JSON.fromString(selected)).name
    let item = document.getElementById("persona-current");
    item.setAttribute("label", personaName);
  },
  
  _listOfItems: function() {
    var itemList = {};
    var featherArr = this._savedFeathers.getChildList("", []);;
    for each (var feather in featherArr) {
        var personaObj = JSON.fromString(this._getPref("feather."+feather))
        if (typeof itemList[personaObj.category] == "undefined")
          itemList[personaObj.category] = [];
        itemList[personaObj.category].push(personaObj)
        //TODO: this currently won't handle duplicate categories or id's
    }
    return itemList;
  }

};

window.addEventListener("load", function(e) { PersonaController.startUp(e) }, false);
window.addEventListener("unload", function(e) { PersonaController.shutDown(e) }, false);
