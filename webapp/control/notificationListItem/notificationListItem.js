sap.ui.define([
	"sap/m/NotificationListItem",
	'sap/m/OverflowToolbar',
	'sap/ui/core/InvisibleText'
], function(NotificationListItem,OverflowToolbar,InvisibleText) {
	"use strict";
	return NotificationListItem.extend("ssms.control.notificationListItem.notificationListItem", {
		metadata: {
			properties : {
			notificationId : {type : "string"},
				notificationTarget : {type : "string"}
		}
		},

		init : function() {
        var r = sap.ui.getCore().getLibraryResourceBundle('sap.m');
        this._expandText = r.getText('NOTIFICATION_LIST_ITEM_SHOW_MORE');
        this._collapseText = r.getText('NOTIFICATION_LIST_ITEM_SHOW_LESS');
        this.setType('Active');
        this._closeButton = new sap.m.Button(this.getId() + '-closeButton', {
            type: sap.m.ButtonType.Transparent,
            icon: sap.ui.core.IconPool.getIconURI('decline'),
            press: function() {
                this.close();
            }.bind(this)
        });
        this._collapseButton = new sap.m.Button({
            type: sap.m.ButtonType.Transparent,
            text: this.getTruncate() ? this._expandText: this._collapseText,
            id: this.getId() + '-expandCollapseButton',
            press: function() {
                this._deregisterResize();
                this.setProperty('truncate', !this.getTruncate(), true);
                this._collapseButton.setText(this.getTruncate() ? this._expandText: this._collapseText);
                this.getDomRef().querySelector('.sapMNLI-TextWrapper').classList.toggle('sapMNLI-TextWrapper--is-expanded');
                this.getDomRef().querySelector('.sapMNLI-Header').classList.toggle('sapMNLI-TitleWrapper--is-expanded');
                this._registerResize();
            }.bind(this)
        });
        this._ariaDetailsText = new InvisibleText({
            id: this.getId() + '-info'
        }).toStatic();
        this.setAggregation('_overflowToolbar', new OverflowToolbar());
    },


		
		close: function() {
			this.fireClose();
		},
		renderer: {}
	});
});