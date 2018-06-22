/**/
(function(window, jQuery, flmodal){
	$ = jQuery;
	/*el = form*/
	function fe(el, options){
		if($(el).prop("tagName") !== 'FORM'){
			console.error("Tagname have to be form");
			return false;
		}
		this.options = {
			ln: 'en',
			show_error_text: true,
			show_modal: true,
			show_message: true,
			reactive_form: true
		}

		if(options.ln != undefined){
			this.options.ln = options.ln;
		}

		if(options.show_error_text != undefined){
			this.options.show_error_text = options.show_error_text;
		}

		if(options.show_modal != undefined){
			this.options.show_modal = options.show_modal;
		}

		if(options.show_message != undefined){
			this.options.show_message = options.show_message;
		}

		if(options.reactive_form != undefined){
			this.options.reactive_form = options.reactive_form;
		}

		this.errors = [];
		this.el = el;
		this.$el = $(el);

		this.ln = {};

		this.init = function(ln){
			self = this;
			this.ln = JSON.parse(ln);

			if(this.options.reactive_form){
				$(this.el.elements).each(function(i, val){
					$(this).on('blur', function(event){
						self.validateOne(self, this)
					});
				});
			} 

			this.el.addEventListener("submit", function(event){
				var va = self.validateAll(self);
				if(!va){
					event.preventDefault();
				}
			});

			self.$el.find('input').each(function(i, val){
				$(this).fltooltip();
			});
			self.$el.find('textarea').each(function(i, val){
				$(this).fltooltip();
			});


		}
		
		this.__loadJSON(this.init.bind(this), fe_root + 'ln/' + this.options.ln + '.json');
	}

	fe.prototype.beforeSubmit = function(){
		return this.validateAll(this);
	}

	fe.prototype.__loadJSON = function(callback, path) {  
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', path, true); 
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callback(xobj.responseText);
				$(document).trigger('fe_ln_loaded');
			}
		};
		xobj.send(null);  
	}

	fe.prototype.init_modal = function(){
		var self = this;
		if($('#fe_modal').length == 0){
			$('body').append(
				'<div class="modal fade" tabindex="-1" role="dialog" id="fe_modal"> \
					<div class="modal-dialog" role="document"> \
						<div class="modal-content">  \
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
							<div class="modal-body"> \
							</div>  \
						</div>  \
					</div>  \
				</div>'
			);

			$('#fe_modal').flmodal();
		}
	}

	fe.prototype.showModal = function(message){
		this.init_modal();
		$('#fe_modal').find('.modal-body').empty().append(message);
		$('#fe_modal').flmodal('show');
	}

	fe.prototype.validateOne = function(self, el){
		var $el = $(el);
		var name = self.__getElementName(el);
		var val = $el.val();
		var is_error = false;
		/*Check required*/
		if($el.prop('required')){
			if(!val){
				self.addError(el, name + ' ' + self.ln.error_required);
				return;
			} 
		}

		/*check email*/
		if($el.attr('type') == 'email' ){
			if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)){
				self.addError(el, name + ' ' + self.ln.error_email);
				return;
			}
		}

		/*check repeat fiels*/
		if($el.attr('repeat_to')){
			var compare_value = self.$el.find('name="' + $el.attr('repeat_to') + '"').val();

			if(compare_value != val){
				self.addError(el, name + ' ' + self.ln.repeat_error);
				return;
			}
		}
		

		if(!is_error){
			self.addSuccess(el);
		}
	}

	fe.prototype.__getElementName = function(el){
		var name = $(el).attr('fe-name');
		if(!name){
			name = $(el).attr('name');
		}

		return name;
	}

	fe.prototype.validateAll = function(self){
		self.resetErrors();
		var is_error = false;
		var errors = [];
		/*Check required fields*/

		self.$el.find('[required]').each(function(i, val){
			var $cur_el = $(this);
			var name = self.__getElementName(this);

			if(!$cur_el.val()){
				var error = name + " " + self.ln.error_required;
				self.addError(this, error);
				errors.push(error);
				is_error = true;
			}
		});

		/*Check emails*/
		self.$el.find('[type="email"]').each(function(i, val){
			var $cur_el = $(this);
			var name = self.__getElementName(this);

			if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($cur_el.val())){
				var error = name + " " + self.ln.error_email;
				self.addError(this, error);
				errors.push(error);
				is_error = true;
			}
		});



		self.$el.find('[repeat_to]').each(function(i, val){
			var $cur_el = $(this);
			var name = self.__getElementName(this);
			var compare_value = self.$el.find('name="' + $cur_el.attr('repeat_to') + '"').val();


			if(compare_value != $cur_el.val()){
				var error = name + ' ' + self.ln.repeat_error;
				self.addError(this,  error);
				errors.push(error);
				is_error = true;
			}
		});

		if(is_error){
			err_str = self.errorToString(errors);
			if(self.options.show_message){
				self.showErrorMessage(err_str);
			}
			
			if(self.options.show_modal){
				this.showModal(err_str);
			}
			return false;
		}

		return true;
	}

	fe.prototype.showSuccessMessage = function(){
		this.$fe_messages.empty().append(this.ln.success_send);
	}

	fe.prototype.errorToString = function(err_arr){
		var err_str = '';
		if(err_arr.length > 0){
			err_str += '<div class="fe_errors"><div class="fe_line">' + this.ln.error_send + '</div>';
			for(var i = 0; i < err_arr.length; i++){
				err_str += '<div class="fe_line">' + err_arr[i] + '</div>';
			}

			err_str += '</div>';
		}

		return err_str;
	}

	fe.prototype.showErrorMessage = function(err_str){
		this.$fe_messages.empty().append(err_str);
	}

	fe.prototype.addSuccess = function(el){
		var $el = $(el);
		$el.removeClass('fe_error');
		$el.addClass('fe_suc');
		this.removeNotification($el);
	}

	fe.prototype.addError = function(el, error_message){
		var $el = $(el);
		$el.removeClass('fe_suc');
		$el.addClass('fe_error');
		var cl = $el.attr('name');
		this.errors.push(error_message);
		if(this.options.show_error_text){
			$el.attr('data-original-title', error_message).attr('title', error_message).fltooltip('show');
		}
	}

	fe.prototype.removeNotification = function($el){
		$el.attr.fltooltip('hide');
	}

	fe.prototype.resetErrors = function(){
		this.errors = [];
		for(var i = 0; i < this.el.elements.length; i++){
			$(self.el.elements[i]).removeClass('fe_error');
		}
		this.$fe_messages.empty();

		this.$el.find('input').each(function(i, val){
			$(this).fltooltip('hide');
		});
		this.$el.find('textarea').each(function(i, val){
			$(this).fltooltip('hide');
		});
	}

	/*functions for external usage*/

	fe.prototype.showSuccessModal = function(){
		var self = this;
		if(self.ln.success_send){
			self.showModal(self.ln.success_send);
		} else {
			$(document).on('fe_ln_loaded', function(){
				self.showModal(self.ln.success_send);
			})
		}
	}

	fe.prototype.validate = function(){
		var res = this.validateAll(this);
		return res;
	}

	window.fe = fe;
})(window, jQuery);
