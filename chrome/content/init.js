const PERSONAS_EXTENSION_ID = "personas@neoalchemy.org";

{
  let ioSvc = Components.classes["@mozilla.org/network/io-service;1"].
              getService(Components.interfaces.nsIIOService);
  let resProt = ioSvc.getProtocolHandler("resource").
                QueryInterface(Components.interfaces.nsIResProtocolHandler);
  if (!resProt.hasSubstitution("personas")) {
    let extMgr = Components.classes["@mozilla.org/extensions/manager;1"].
                 getService(Components.interfaces.nsIExtensionManager);
    let loc = extMgr.getInstallLocation(PERSONAS_EXTENSION_ID);
    let extD = loc.getItemLocation(PERSONAS_EXTENSION_ID);
    resProt.setSubstitution("personas", ioSvc.newFileURI(extD));
  }

  Components.utils.import("resource://personas/chrome/content/modules/PrefCache.js");
  Components.utils.import("resource://personas/chrome/content/modules/stylesheetManager.jsm");
  
}





