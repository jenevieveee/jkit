# Installing

## Quick Install

* Download the most recent jkit xpi. Currently jkit-0.1-fx.xpi
* Firefox should automatically install the add-on for you.

The signed xpi file is the version that allows you to save settings, but often it will not have the latest features. Development is quite rapid right now, and new features are being added daily. I will try to put out a new release at least every other week until it becomes stable. 

Currently, there is no automatic check for updates.

### Setting up JKit

* Now, go to about:addons. 
* Click "Extensions" in the left column. The JKit add-on should appear in your list of extensions.
* Click on the JKit extension. This will open information about JKit
* Click "Preferences". This will open the JKit util options.
* Set the options you wish to enable. 

Open BDSMLR or refresh your tab, and enjoy. Some options will take effect immediately, others require a refresh.



## For Developers/Contributors

Only Firefox is supported at the moment. You can try with Chrome, but I make no guarantees that it will work.

### Via the xpi
* Download the jkit.xpi file.
* Open Firefox.
* Go to about:debugging
* Click "This Firefox" on the left side column.
* Click "Load Temporary Add-on" on the upper right.
* Navigate to the folder where you downloaded the xpi
* Select and open jkit.xpi

### Via source
* Download the source from github. Github provides an option to download all source as a zip file, or you can clone the repository.
* Unzip the files to a convenient location on your computer, if you downloaded the zip file.
* Open Firefox.
* Go to about:debugging
* Click "This Firefox" on the left side column.
* Click "Load Temporary Add-on" on the upper right.
* Navigate to the folder where the source was unzipped or cloned.
* Select and open the manifest.json file.



For first-time use, I recommend turning on the Boss screen, and all tweaks/fixes. The other modules are more specific to your individual tastes. Also feel free to play with the tabs module, but keep in mind your settings will not be saved when you exit Firefox.

Keep in mind this is a temporary add-on in alpha development. **Settings will not be saved when you close** Firefox. Once a signed xpi is created, you can permanently add the extension, and keep your settings.
