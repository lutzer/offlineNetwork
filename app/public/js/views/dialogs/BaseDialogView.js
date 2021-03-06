define([
    'jquery',
	'underscore',
	'marionette'
], function($, _, Marionette){
	
	var BaseDialogView = Marionette.ItemView.extend({
		
		initialize: function(options) {
			
			//register callback
			if (options.hasOwnProperty('callback'))
				this.callback = options.callback;
			else
				this.callback = false;
		},
		
		className: 'modal-background',
		
		events: {
			'click #acceptButton' : 'onAcceptButtonPress',
			'click #rejectButton' : 'onRejectButtonPress'
		},
		
		onRender: function() {
			setTimeout(this.show,100);
		},
		
		show: function() {
			this.$('#dialog').removeClass('hidden');
		},
		
		hide: function() {
			this.$('#dialog').addClass('hidden');
		},
		
		close: function() {
			this.destroy();
		},

		onShow: function() {
			$('body').addClass('noscroll');
		},
		
		onBeforeDestroy: function() {
			$('body').removeClass('noscroll');
		},
		
		onAcceptButtonPress: function(event) {
			
			event.preventDefault();
			
			if (this.callback)
				this.callback(true);
			
			this.close();
		},
		
		onRejectButtonPress: function(event) {
			
			event.preventDefault();
			
			if (this.callback)
				this.callback(false);
			
			this.close();
		}
		
	});
	return BaseDialogView;
	
});