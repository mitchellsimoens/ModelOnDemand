Ext.define('MyApp.util.StoreModelCache', {
    singleton : true,

    // maps store class name to model definition
    map : {},

    get : function(store) {
        var me    = this,
            model = store.model; //does store have a model already?

        if (model) {
            model = Ext.data.schema.Schema.lookupEntity(model); //handle if string

            me.map[store.$className] = model;   //store had a model, cache it
        } else {
            model = me.map[store.$className];   //find cached model if any
        }

        if (!model) {
            //<debug>
            console.warn('****', 'Expecting server to return metaData for store:', store.$className);
            //</debug>

            //no model, add listeners to store
            store.on({
                scope      : me,
                single     : true,
                beforeload : me.addNeedParam,
                load       : me.set
            });
        }

        return model;
    },

    addNeedParam : function(store, operation) {
        var params = operation.getParams() || {};

        //add param to tell the server to return model data
        params.needsModel = true;

        operation.setParams(params);
    },

    set : function(store) {
        var proxy  = store.getProxy(),
            reader = proxy.getReader();

        //cache the model for future store instances
        this.map[store.$className] = reader.getModel();
    }
});
