# Form-js-errors
>Js library for showing form errors
## Table of contents
* [Use](#use)
* [Requirements](#requirements)
* [Getting started](#getting-started)
* [Options](#options)
## Use
* [jQuery v1.9.1+](https://jquery.com/)
* [Flui](https://github.com/Ajjya/File-library/tree/master/js/media-library/flui)
## Requirements
* [jQuery v1.9.1+](https://jquery.com/)
* [Flui](https://github.com/Ajjya/File-library/tree/master/js/media-library/flui)
## Getting started
### Quick start
Four quick start options are available:
* [Download the latest release](https://github.com/Ajjya/Form-js-errors/archive/master.zip)
* Clone the repository: git clone [Form-js-errors](https://github.com/Ajjya/Form-js-errors.git)
### Installation
Include files:
```html
<link rel="stylesheet" href="/path/to/flui.css">
<link rel="stylesheet" href="/path/to/form-error.css">
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<script src="/path/to/flui.js"></script><!-- Flui is required -->
<script src="/path/to/form-error.js"></script>
```
### Usage
#### Activation File Library
In head tag add link to path/to/form-error-folder
```html
<script type="text/javascript">
	var fe_root = '/path/to/form-error-folder';
</script>
```
In footer (or in default js file) add next code.
```html
<script type="text/javascript">
	var formErr = new fe(document.getElementById('contact-form'), options);
</script>
```
_Where:_
_options - object with options_
### Options
_You can translate ln/en.json, create needed language and add it to ln folder.
#### show_error_text: boolean
Show errors under form elements. Default: true.
#### show_modal: boolean
Show modal after sending email. Default: true.
#### show_message: boolean
Show message with errors under form. Default: true.
#### reactive_form: boolean
Show error on each form element after blur. Default: true.
#### language: 'ln'
Default: 'en'.

**Example**
```js
	if(document.getElementById('contact-form')){
		formErr = new fe(document.getElementById('contact-form'), 
			{
				show_error_text: true,
				show_modal: false,
				show_message: false,
				reactive_form: true
			}
		);
	} 
```