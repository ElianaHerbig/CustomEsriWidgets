EsriJavascriptAttributeTable
============================

A basic attribute table widget for the Esri Javascript API using dgrid. 

http://dojofoundation.org/packages/dgrid/

Constructor:
=======================
```JavaScript
var table = new Esri_dgrid({options});
```

Options
========

Name | Default | Description
-----|---------|------------
featureService | `null` | Required - URL or feature service
div | `null` | div identifier to place attribute table if using startup() method
fields | `[*]` | field names to place in attribute table in an array of strings
labels | {} | key value pairs of fields mapped to their labels to display in column headings
formatters | {} | key value pairs of field names or field types to their formatter function


Methods
=======
Name | Description
-----|------------
startup | starts the grid in the div specified. If no div id is specified in the constructor, the grid will not be created
getGrid | returns the attribute table's grid object after it is created. Useful if you want to manipulate/extend the grid.

Events
======
-ready: fires when the data has been fetched and ready to use. Usage: 
```JavaScript
table.on("ready", function(data) {
	table.startup(); //start the attribute table
	console.log(data); //or do something with the grid data
});
```
