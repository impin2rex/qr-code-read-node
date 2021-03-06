# qr-code-read-node

This is a QR Code reader prototype using node.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
```

Also, need these system dependencies.

# GraphicsMagick installation  
  
This guide will help you install the required dependencies to get started!  
  

## Linux (Debian based)  
  
For linux users, you can run the following commands on your terminal.  
  
```
$ sudo apt-get update
$ sudo apt-get install ghostscript
$ sudo apt-get install graphicsmagick
```
  
Once everything is installed, the library should work as expected.  
  
## Mac OS  
  
For rich people, you can run the following commands on your terminal.  
  
```
$ brew update
$ brew install gs graphicsmagick
```  
  
Once everything is installed, the library should work as expected.  
  
## Windows  

For windows users.. open the links and download installers.

- Download Ghostscript **9.52** for Windows: https://github.com/ArtifexSoftware/ghostpdl-downloads/releases/tag/gs952
- Download GraphicsMagick for Windows: http://ftp.icm.edu.pl/pub/unix/graphics/GraphicsMagick/windows/

Add Windows Environment Variables for your version(****)
- C:\Program Files\gs\gs****\bin
- C:\program files\graphicsmagick-****

An error occurred when the Ghostscript version was 9.53 or later.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC](https://choosealicense.com/licenses/isc/)