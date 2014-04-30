/**
 *
 */
Ext.define('Ext.form.field.FileButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.filebutton',
    
    childEls: [
        'btnEl', 'btnWrap', 'btnInnerEl', 'btnIconEl', 'fileInputEl'
    ],
    
    inputCls: Ext.baseCSSPrefix + 'form-file-input',
    
    cls: Ext.baseCSSPrefix + 'form-file-btn',
    
    preventDefault: false,

    autoEl: {
        tag: 'div',
        unselectable: 'on'
    },

    renderTpl: [
        '<span id="{id}-btnWrap" role="presentation" class="{baseCls}-wrap',
            '<tpl if="splitCls"> {splitCls}</tpl>',
            '{childElCls}" unselectable="on">',
            '<span id="{id}-btnEl" class="{baseCls}-button" role="button">',
                '<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}',
                    '{childElCls}" unselectable="on">',
                    '{text}',
                '</span>',
                '<span role="presentation" id="{id}-btnIconEl" class="{baseCls}-icon-el {iconCls}',
                    '{childElCls} {glyphCls}" unselectable="on" style="',
                    '<tpl if="iconUrl">background-image:url({iconUrl});</tpl>',
                    '<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">',
                    '<tpl if="glyph">&#{glyph};</tpl><tpl if="iconCls || iconUrl">&#160;</tpl>',
                '</span>',
            '</span>',
        '</span>',
        '<input id="{id}-fileInputEl" class="{childElCls} {inputCls}" type="file" size="1" name="{inputName}" role="{role}" tabIndex="{tabIndex}">'
    ],
    
    getTemplateArgs: function(){
        var args = this.callParent();
        args.inputCls = this.inputCls;
        args.inputName = this.inputName;
        args.tabIndex = this.ownerCt.tabIndex;
        return args;
    },
    
    afterRender: function(){
        var me = this;
        me.callParent(arguments);
        me.fileInputEl.on('change', me.fireChange, me);    
    },
    
    fireChange: function(e){
        this.fireEvent('change', this, e, this.fileInputEl.dom.value);
    },
    
    /**
     * @private
     * Creates the file input element. It is inserted into the trigger button component, made
     * invisible, and floated on top of the button's other content so that it will receive the
     * button's clicks.
     */
    createFileInput : function(isTemporary) {
        var me = this;
        me.fileInputEl = me.el.createChild({
            name: me.inputName,
            id: !isTemporary ? me.id + '-fileInputEl' : undefined,
            cls: me.inputCls,
            tag: 'input',
            type: 'file',
            size: 1,
            role: 'button'
        });
        me.fileInputEl.on('change', me.fireChange, me);  
    },
    
    reset: function(remove){
        if (remove) {
            this.fileInputEl.destroy();
        }
        this.createFileInput(!remove);
    },
    
    restoreInput: function(el){
        this.fileInputEl.destroy();
        el = Ext.get(el);
        this.el.appendChild(el);
        this.fileInputEl = el;
    },
    
    onDisable: function(){
        this.callParent();
        this.fileInputEl.dom.disabled = true;
    },

    onEnable : function() {
        this.callParent();
        this.fileInputEl.dom.disabled = false;
    }
});
