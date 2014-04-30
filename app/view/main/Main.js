Ext.define('MyApp.view.main.Main', {
    extend : 'Ext.grid.Panel',
    xtype  : 'app-main',

    controller : 'main',
    viewModel  : {
        type : 'main'
    },

    bind : '{users}', //bind store to grid

    title : 'Users',

    tools : [
        {
            type    : 'refresh',
            tooltip : 'Refresh Store',
            handler : 'doRefresh'
        },
        {
            type    : 'gear',
            tooltip : 'Recreate Grid',
            handler : 'doRecreate'
        }
    ],

    columns : [
        {
            text      : 'First Name',
            dataIndex : 'firstName',
            flex      : 1
        },
        {
            text      : 'Last Name',
            dataIndex : 'lastName',
            flex      : 1
        },
        {
            text      : 'Email',
            dataIndex : 'email',
            flex      : 1
        },
        {
            text      : 'Age',
            dataIndex : 'age',
            width     : 100
        }
    ]
});
