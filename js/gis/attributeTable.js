/**
 * @title AttributeTable widget
 * @description: 
 * Creates an attribute table similar to that of ArcGIS. Essentially a 
 * wrapper for a Dojox.Datagrid object 
 * @author: Gregg Roemhildt
 * 
 * @see: 
 * DataGrid - http://dojotoolkit.org/reference-guide/1.9/dojox/grid/DataGrid.html
 * ItemStore - https://dojotoolkit.org/reference-guide/1.9/dojo/store.html
 * 
 * Parameters:
 * Required:
 * queryLayer: null - layer to query for data
 * 
 * Recommended: id: 'FID' - default unique id for grid, must be in fields if not using default
 * 
 * Optional:
 * structure: [] - array of key-value structure parameters, unless specified, 
 * Table structure defaults to using field alias's as column headings
 * autoHeight: true - grid layout
 * autoWidth: true - grod layout, must be false if using widths in structure
 * fields: ["*"] - fields to use, * means all; 
 * div: "attrTable" - div to place table in
 * loadingMessage: 'Loading...'
 * sortInfo: 1 - collumn number to sort by default
 * 
 * Events:
 * rowClick: returns e { id: rowID }
 */

define([
    "dojo/Evented",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/_base/array",
    "dojox/grid/DataGrid",
    "dojo/data/ItemFileReadStore",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/ready"
], function(Evented, Query, QueryTask, Array, DataGrid, ItemFileReadStore,
        Declare, Lang, Ready) {
    return Declare([Evented, DataGrid], {
        queryLayer: null,
        structure: [],
        autoHeight: true,
        autoWidth: true,
        id: 'FID',
        fields: ["*"],
        div: "attrTable",
        loadingMessage: 'Loading...',
        maxResults: 51,
        sortInfo: 1,
        dataset: 1,
        minLength: 10, //min field length
        /**
         * default constructor - initializes the data members
         * called by using new AttributeTable( {} );
         * @param {object} options
         * 
         */
        constructor: function(options) {
            var T = this;           //copy this object

            Lang.mixin(T, options);

            //setup query on layer
            if(typeof(T.queryLayer === "string"))
                T.url = T.queryLayer;
            else if(T.queryLayer.url)
                T.url = T.queryLayer.url;
            else
                console.log("queryLayer must be a feature layer or url");
            T.qt = new QueryTask(T.url);
            T.q = new Query();
            T.q.returnGeometry = false;
            T.q.outFields = T.fields;
            T.q.where = "1=1";
            T.rows = [];
            T.qt.execute(T.q, function(results) {
                //if no structure exists, setup a default using field alias and width of 100% / number_fields
                if (T.structure.length === 0) {
                    T.alias = {};
                    var width = 0;
                    //calculate total width based on field.length
                    Array.forEach(results.fields, function(field) {
                        if (!field.length)
                            field.length = T.minLength; //min width
                        width += field.length;
                    });
                    //set up structure
                    Array.forEach(results.fields, function(field) {
                        T.structure.push({
                            name: field.alias,
                            field: field.name,
                            width: T.float2int(field.length / width * 100)});
                    });
                    
                }

                //load the rows of data
                Array.forEach(results.features, function(feature) {
                    var row = {};
                    Array.forEach(results.fields, function(field) {
                        row[field.name] = feature.attributes[field.name];
                    });
                    T.rows.push(row);
                });

                //create the data store and grid
                T.store = new ItemFileReadStore({
                    data: {
                        identifier: T.id,
                        items: T.rows
                    }
                });

                T.grid = new DataGrid({
                    id: "attributeTable",
                    store: T.store,
                    structure: T.structure,
                    autoWidth: T.autoWidth,
                    autoHeight: T.autoHeight,
                    loadingMessage: T.loadingMessage,
                    sortInfo: T.sortInfo
                });
                T.grid.placeAt(T.div);
                T.grid.startup();

                window.onresize = function() {
                    T.grid._refresh();
                };


                T.grid.on("rowClick", function(e) {
                    var id = T.grid.getItem(e.rowIndex)[T.id][0];
                    T.emit("rowClick", {id: id});
                });

            });
        },
        float2int: function(value) {
            return value | 0;
        }
    });
});