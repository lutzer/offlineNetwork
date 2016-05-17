define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'models/AppModel',
	'text!templates/actionElementTemplate.html'
], function($, _, Backbone, Marionette, AppModel, template){
	
	var ActionElementView = Marionette.ItemView.extend({

		initialize: function(options) {

			var id = options.model.get('id');

			
            console.log(Backbone.settings);

			if (Backbone.settings.has(id) && Backbone.settings.get(id))
				this.model.set({ result : Backbone.settings.get(id) });
		},

		events: {
			'change .input-element' : '_onInputChanged',
			'onpropertychange .input-element' : '_onInputChanged',
			'keyup .input-element' : '_onInputChanged'
		},
		
		className: 'element',

		template: _.template(template),

		templateHelpers: function() {
			return {
				cid : this.model.cid
			}
		},

		_onInputChanged : function(ele) {

			this.trigger('inputChanged');

			if (this.model.get('type') == 'image')
				this.model.set({
					result : true, 
					file : this.$('.input-element')
				});
			else if (this.model.get('type') == 'poll')
				this.model.set({'result' : $('.input-element:checked').val() });
			else
				this.model.set({'result' : this.$('.input-element').val() });


			this.$('#result-text').removeClass('hidden');
		}

	});
	
	return ActionElementView;
	
});