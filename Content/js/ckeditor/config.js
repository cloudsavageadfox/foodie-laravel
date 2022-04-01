/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.extraPlugins = 'uploadimage';
	config.extraPlugins = 'uploadwidget';
	config.uploadUrl = '/Image/EditorUpload';
    config.filebrowserUploadUrl =  '/Image/EditorUpload';
	config.extraPlugins = 'filetools';
	config.extraPlugins = 'notificationaggregator';
	config.extraPlugins = 'notification';
	config.extraPlugins = 'toolbar';
	config.extraPlugins = 'button';
	config.contentsCss = '../../../Content/js/ckeditor/fonts.css';
//the next line add the new font to the combobox in CKEditor
	config.font_names = 'Open Sans Light;Open Sans Regular;Open Sans Semibold;' + config.font_names;
};
