Loading Model From the Server
====

There are use cases where a model's fields needs to be loaded from the server so your application can be dynamic and
even automatically maintained via the database design changing or some server side update. I recently read a blog post
that talked about the same thing but I felt the solution provided was too simplistic and didn't make use of functionality
already in Ext JS. So I wanted to create an example of how I would do it.

### Requirements

Before we start coding, lets map out our requirements:

 - A store needs to load the model data from the server.
 - We need to reuse the model when it is created from server side data so we don't keep creating model definitions.

Pretty simple requirements. The issue with the solution I saw was the second requirement. In that blog post, the store
was sending an `Ext.Ajax.request` to load the fields every time a store instance was created. This is unnecessary as
once you have the fields for the model and the model has been defined, you no longer need to do another ajax request to
load the fields again. Also, the solution used `Ext.Ajax.request` which means you are locked into using it. Once last
issue with that solution, what if the store auto-loaded and it took less time than the request loading the model fields?
You have a racing condition that you can never 100% say will work; network latency, server issues, etc all play a part.

### Ext JS Native Functionality

I mentioned before about the other solution not using functionality that Ext JS already has. When the reader
(the `Ext.data.reader.*`) is asked to read the data (readRecords method), it checks to see if there is a `metaData`
field in the raw response and if so will execute it's `onMetaChange` method which will then define a new model with the
fields returned among other things. Here is the `onMetaChange` method, the code speaks for itself:

    onMetaChange : function(meta) {
        var me = this,
            fields = meta.fields || me.getFields(),
            model,
            newModel,
            clientIdProperty,
            proxy;

        // save off the raw meta data
        me.metaData = meta;

        // set any reader-specific configs from meta if available
        if (meta.root) {
            me.setRootProperty(meta.root);
        }

        if (meta.totalProperty) {
            me.setTotalProperty(meta.totalProperty);
        }

        if (meta.successProperty) {
            me.setSuccessProperty(meta.successProperty);
        }

        if (meta.messageProperty) {
            me.setMessageProperty(meta.messageProperty);
        }

        clientIdProperty = meta.clientIdProperty;

        newModel = Ext.define(null, {
            extend: 'Ext.data.Model',
            fields: fields,
            clientIdProperty: clientIdProperty
        });
        me.setModel(newModel);
        proxy = me.getProxy();
        if (proxy) {
            proxy.setModel(newModel);
        }
        me.buildExtractors(true);
    }

As you can see, the `metaData` allows you to set the root, total, success and message properties but also is going to
define a model. Here is an example JSON response that will make the reader execute this method:

    {
        "metaData" : {
            fields : [...]
        },
        ...
    }

### Cacheing

So now we know that Ext JS can accept metaData to create a new model as we want but the second requirement is we only
want to load it once so we need some sort of way to selectively tell the server to return the meta and we also need to
cache the model definition for subsequent store instances. Since I may have multiple store definitions that need to use
this and I don't want too much logic in my stores, I like to use a singleton class as a utility class. In this example
app, I have a singleton class called `MyApp.util.StoreModelCache` located at `app/util/StoreModelCache.js`. What this
class does is holds an object mapping store class names to model definition. If a model is not cached yet, it adds a
`beforeload` event listener so that it can add a parameter (`needsModel` for this example) to the request to tell the
server to return the meta data for the model. It will also add a `load` event listener to then cache the model
definition the reader created. To kick off the use of the `MyApp.util.StoreModelCache` class, in the `constructor`
method of the `MyApp.store.Cached` store, I execute the get method on teh `MyApp.util.StoreModelCache` class which
returns the model definition from the cache and if one doesn't exist it will add teh event listeners.

Do note, I don't use `MyApp.store.Cached` in my grid, I use `MyApp.store.Users` and have that store extend
`MyApp.store.Cached` to give a good example as to how you can then have multiple stores reuse the logic.

To summarize it, the `MyApp.util.StoreModelCache` holds model definitions in a cache. If one doesn't exist, it tells the
server to return the model meta data and caches the model definition when it's created.

### Example

The example consists of an Ext JS 5 application that has a grid, the stores and the singleton. The example also comes
with a PHP script that will load the data and such from a MySQL database. I provide a `data.sql` file that I used for
my testing.

Once you get the SQL file imported into a MySQL and you setup the MySQL connection details at the top of `data.php`,
you can then run the Ext JS 5 app. The `MyApp.store.Users` store will automatically load so wait a couple seconds for it
to load and you should see 2 rows in the grid. If you look at the network tab in the dev tools, you will see a request
to `data.php` that has the `needsModel` parameter and therefore the response contains the `metaData` data which then
the reader created the model definition.

The grid has 2 tools:

 - **refresh** This will reload the store which shouldn't send the `needsModel` parameter as the model should have been
 cached.
 - **recreate** This will destroy the current grid and recreate the grid. I have this so the grid will get a new store
 instance to show that the model definition created in the first instance was cached.
