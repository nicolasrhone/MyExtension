/*
 * File: app/store/ProductTypesForStock.js
 *
 * This file was generated by Sencha Architect version 3.2.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Rubedo.store.ProductTypesForStock', {
    extend: 'Ext.data.Store',
    alias: 'store.ProductTypesForStock',

    requires: [
        'Rubedo.model.typesContenusDataModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            isOptimised: true,
            usedCollection: 'ContentTypes',
            autoLoad: false,
            model: 'Rubedo.model.typesContenusDataModel',
            storeId: 'ProductTypesForStock',
            pageSize: 100000,
            proxy: {
                type: 'ajax',
                api: {
                    read: 'content-types'
                },
                extraParams: {
                    tFilter: '[{"property":"dependant","value":false},{"property":"productType","value":"configurable"},{"property":"system","value":{"$ne":true}},{"property":"manageStock","value":true}]'
                },
                reader: {
                    type: 'json',
                    messageProperty: 'message',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});
