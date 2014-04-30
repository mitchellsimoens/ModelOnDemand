Ext.define('MyApp.store.Cached', {
    extend : 'Ext.data.Store',

    constructor : function(config) {
        var me    = this,
            model = MyApp.util.StoreModelCache.get(me);

        if (model) {
            //model is cached so server already told us about it
            config.model = model;
        }

        me.callParent([config]);
    }
});
