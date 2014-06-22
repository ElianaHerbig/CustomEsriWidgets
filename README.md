EsriJavascriptAttributeTable
============================

A basic attribute table widget for the Esri Javascript API

```
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta content="">
    <link rel="stylesheet" href="http://js.arcgis.com/3.8/js/esri/css/esri.css">
    <style>
	html, body, #attTable {
		width: 100%;
		height:100%;
	}
    </style>
  </head>
  <body>
    <div id="attrTable"></div>
    <script>
	var dojoConfig = {
		parseOnLoad: true,
		packages: [{
			"name": "custom",
			//CHANGE: this value is URL dependent:
			"location": "/custom"
		}]
	};
  </script>
  <script src="//js.arcgis.com/3.8/"></script>
  </body>  
</html>
```

Script:
```
require([
	"custom/attributeTable",
	"esri/layers/ArcGISDynamicMapServiceLayer",
], function(AttributeTable, ArcGISDynamicMapServiceLayer){
	var at = new AttributeTable({
		id: "OBJECTID",
		queryLayer: new ArcGISDynamicMapServiceLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Louisville/LOJIC_LandRecords_Louisville/MapServer/1"),
	});
	at.on("rowClick", function(e) {
		console.log("Row clicked with id:" + e.id);
	});
});
```

<h3>All options:</h3>
Parameters:
Required:
 * queryLayer: null - layer to query for data

Recommended: 
 * id: 'FID' - default unique id for grid, must be in fields if not using default

Optional:
 * structure: [] - array of key-value structure parameters, unless specified, 
 * Table structure defaults to using field alias's as column headings
 * autoHeight: true - grid layout
 * autoWidth: true - grod layout, must be false if using widths in structure
 * fields: ["*"] - fields to use, * means all; 
 * div: "attrTable" - div to place table in
 * loadingMessage: 'Loading...'
 * sortInfo: 1 - collumn number to sort by default

See:
 * DataGrid - http://dojotoolkit.org/reference-guide/1.9/dojox/grid/DataGrid.html
 * ItemStore - https://dojotoolkit.org/reference-guide/1.9/dojo/store.html
