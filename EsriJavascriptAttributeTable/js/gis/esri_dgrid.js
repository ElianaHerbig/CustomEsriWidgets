define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dgrid/Grid",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/extensions/ColumnResizer",
    "dgrid/editor",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/_base/array",
    "dojo/Evented",
    "dojo/domReady!"
], function(declare, Lang, _WidgetBase,
        Grid, Keyboard, Selection, ColumnResizer, Editor,
        Query, QueryTask, Array, Evented) {
    var CustomGrid = declare([Grid, Keyboard, Selection, ColumnResizer]);
    return declare([_WidgetBase, Evented], {
        //feature service url
        featureService: null,
        //fields to select
        fields: ["*"],
        //mapped object field name to label
        labels: {},
		//mapped object field type or name to formatter function
		formatters: {}, 
        div: null,
        constructor: function(params) {
            Lang.mixin(this, params);
            if (typeof (this.featureService) === "string")
                this._queryFeatureService(this.featureService);
            else if (typeof (this.featureService.url) === "string")
                this._queryFeatureService(this.featureService.url);
            else
                console.log("featureService must be a URL or esri featureService");

        },
        startup: function() {
            var t = this;
			if(t.div){
				t.grid = new CustomGrid({
					columns: t.columns
				}, t.div);
				t.grid.renderArray(t.values);
			}
        },
		getGrid: function() {
			return this.grid;
		},
        _queryFeatureService: function(url) {
            var t = this;
            var qt, q;
            qt = new QueryTask(url);
            q = new Query();
            q.returnGeometry = false;
            q.outFields = this.fields;
            q.where = "1=1";
            qt.execute(q, function(results) {
                t._buildFields(results.fields);
                t._buildGridData(results.features);
                t.emit("ready", {values: t.values, columns: t.columns});
            });
        },
        _createGrid: function() {
        },
        _buildFields: function(fields) {
            var t = this;
            t.fields = {};
            Array.forEach(fields, function(field) {
                t.fields[field.name] = field;
                t.fields[field.name].alias = t.labels[field.name] || field.alias;
                if (t.formatters[field.name])
                    t.fields[field.name].formatter = t.formatters[field.name];
                else if (t.formatters[field.type])
                    t.fields[field.name].formatter = t.formatters[field.type];
            });
        },
        _buildGridData: function(features) {
            var t = this;
            t.values = [];
            t.values = [];
            t.columns = [];
            Array.forEach(features, function(feature) {
                var row = {};
                for (var field in t.fields)
                    row[field] = feature.attributes[field];
                t.values.push(row);
            });
            for (var field in t.fields) {
                t.columns.push({
                    field: field,
                    label: t.fields[field].alias,
                    formatter: t.formatters[field] || t.formatters[t.fields[field].type],
                    editor: "text",
                    editOn: "dblclick"
                });
            }
        }
    });
});

