Ext.define('MyApp.view.main.MainController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.main',

    doRefresh : function() {
        var grid  = this.getView(),
            store = grid.getStore();

        store.reload();
    },

    doRecreate : function() {
        var grid = this.getView(),
            app  = MyApp.getApplication();

        grid.destroy();

        app.initViewport();
    }
});
