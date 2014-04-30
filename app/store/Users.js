Ext.define('MyApp.store.Users', {
    extend : 'MyApp.store.Cached',
    alias  : 'store.users',

    autoLoad : true,

    proxy : {
        type   : 'ajax',
        url    : 'data.php',
        reader : {
            type         : 'json',
            rootProperty : 'data'
        }
    }
});
