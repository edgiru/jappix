/*

Jappix - An open social platform
These are the tooltip JS scripts for Jappix

-------------------------------------------------

License: AGPL
Author: Vanaryon
Last revision: 09/04/12

*/

// Creates a tooltip code
function createTooltip(xid, hash, type) {
	// Path to the element
	var path = '#' + hash;
	var path_tooltip = path + ' .chat-tools-' + type;
	var path_bubble = path_tooltip + ' .bubble-' + type;
	
	// Yet exists?
	if(exists(path_bubble))
		return false;
	
	// Generates special tooltip HTML code
	var title = '';
	var content = '';
	
	switch(type) {
		// Smileys
		case 'smileys':
			title = _e("Smiley insertion");
			content = smileyLinks(hash);
			
			break;
		
		// Style
		case 'style':
			title = _e("Change style");
			
			// Generate fonts list
			var fonts = {
				'arial': 'Arial, Helvetica, sans-serif',
				'arial-black': '\'Arial Black\', Gadget, sans-serif',
				'bookman-old-style': '\'Bookman Old Style\', serif',
				'comic-sans-ms': '\'Comic Sans MS\', cursive',
				'courier': 'Courier, monospace',
				'courier-new': '\'Courier New\', Courier, monospace',
				'garamond': 'Garamond, serif',
				'georgia': 'Georgia, serif',
				'impact': 'Impact, Charcoal, sans-serif',
				'lucida-console': '\'Lucida Console\', Monaco, monospace',
				'lucida-sans-unicode': '\'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif',
				'ms-sans-serif': '\'MS Sans Serif\', Geneva, sans-serif',
				'ms-serif': '\'MS Serif\', \'New York\', sans-serif',
				'palatino-linotype': '\'Palatino Linotype\', \'Book Antiqua\', Palatino, serif',
				'symbol': 'Symbol, sans-serif',
				'tahoma': 'Tahoma, Geneva, sans-serif',
				'times-new-roman': '\'Times New Roman\', Times, serif',
				'trebuchet-ms': '\'Trebuchet MS\', Helvetica, sans-serif',
				'verdana': 'Verdana, Geneva, sans-serif',
				'webdings': 'Webdings, sans-serif',
				'wingdings': 'Wingdings, \'Zapf Dingbats\', sans-serif'
			};
			
			var fonts_html = '<div class="font-list">';
			
			// No fonts
			fonts_html += '<a href="#">' + _e("None") + '</a>';
			
			// Available fonts
			$.each(fonts, function(id_name, full_name) {
				// Generate short name
				var short_name = full_name;
				
				if(short_name.match(/,/)) {
					var name_split = short_name.split(',');
					short_name = trim(name_split[0]);
				}
				
				short_name = short_name.replace(/([^a-z0-9\s]+)/gi, '');
				
				// Add this to the HTML
				fonts_html += '<a href="#" data-value="' + encodeQuotes(id_name) + '" data-font="' + encodeQuotes(full_name) + '" style="font-family: ' + encodeQuotes(full_name) + ';">' + short_name.htmlEnc() + '</a>';
			});
			fonts_html += '</div>';
			
			content = 
				'<label class="font">' + 
					'<div class="font-icon talk-images"></div>' + 
					'<div class="font-change">' + 
						'<a class="font-current" href="#">' + _e("None") + '</a>' + 
						fonts_html + 
					'</div>' + 
				'</label>' + 
				'<label class="bold"><input type="checkbox" class="bold" />' + _e("Text in bold") + '</label>' + 
				'<label class="italic"><input type="checkbox" class="italic" />' + _e("Text in italic") + '</label>' + 
				'<label class="underline"><input type="checkbox" class="underline" />' + _e("Underlined text") + '</label>' + 
				'<a href="#" class="color" style="background-color: #b10808; clear: both;" data-color="b10808"></a>' + 
				'<a href="#" class="color" style="background-color: #e5860c;" data-color="e5860c"></a>' + 
				'<a href="#" class="color" style="background-color: #f0f30e;" data-color="f0f30e"></a>' + 
				'<a href="#" class="color" style="background-color: #009a04;" data-color="009a04"></a>' + 
				'<a href="#" class="color" style="background-color: #0ba9a0;" data-color="0ba9a0"></a>' + 
				'<a href="#" class="color" style="background-color: #04228f;" data-color="04228f"></a>' + 
				'<a href="#" class="color" style="background-color: #9d0ab7;" data-color="9d0ab7"></a>' + 
				'<div class="color-picker">' + 
					'<a href="#" class="color-more talk-images"></a>' + 
					'<div class="color-hex">' + 
						'<span class="hex-begin">#</span>' + 
						'<input class="hex-value" type="text" maxlength="6" placeholder="e1e1e1" />' + 
					'</div>' + 
				'</div>';
			
			break;
		
		// File send
		case 'file':
			title = _e("Send a file");
			content = '<p style="margin-bottom: 8px;">' + _e("Once uploaded, your friend will be prompted to download the file you sent.") + '</p>';
			content += '<form id="oob-upload" action="./php/send.php" method="post" enctype="multipart/form-data">' + generateFileShare() + '</form>';
			
			break;
		
		// Chat log
		case 'save':
			title = _e("Save chat");
			content = '<p style="margin-bottom: 8px;">' + _e("Click on the following link to get the chat log, and wait. Then click again to get the file.") + '</p>';
			
			// Possible to generate any log?
			if($(path + ' .one-line').size())
				content += '<a href="#" class="tooltip-actionlog">' + _e("Generate file!") + '</a>';
			else
				content += '<span class="tooltip-nolog">' + _e("This chat is empty!") + '</span>';
			
			break;
	}
	
	// Generates general tooltip HTML code
	var html = 
		'<div class="tooltip bubble-' + type + '">' + 
			'<div class="tooltip-subitem">' + 
				'<p class="tooltip-top">' + title + '</p>' + 
				content + 
			'</div>' + 
			
			'<div class="tooltip-subarrow talk-images"></div>' + 
		'</div>';
	
	// Append the HTML code
	$(path_tooltip).append(html);
	
	// Special events
	switch(type) {
		// Smileys
		case 'smileys':
			// Apply click event on smiley links
			$(path_tooltip + ' a.emoticon').click(function() {
				return insertSmiley($(this).attr('data-smiley'), hash);
			});
			
			break;
		
		// Style
		case 'style':
			// Paths to items
			var message_area = path + ' .message-area';
			var bubble_style = path_tooltip + ' .bubble-style';
			var style = bubble_style + ' input:checkbox';
			var colors = bubble_style + ' a.color';
			var font_current = bubble_style + ' a.font-current';
			var font_list = bubble_style + ' div.font-list';
			var font_select = font_list + ' a';
			var color = bubble_style + ' div.color-picker';
			var color_more = color + ' a.color-more';
			var color_hex = color + ' div.color-hex';
			
			// Click event on style bubble
			$(bubble_style).click(function() {
				// Hide font selector if opened
				if($(font_list).is(':visible'))
					$(font_current).click();
				
				// Hide color selector if opened
				if($(color_hex).is(':visible'))
					$(color_more).click();
			});
			
			// Click event on font picker
			$(font_current).click(function() {
				// The clicked color is yet selected
				if($(font_list).is(':visible'))
					$(this).parent().removeClass('listed');
				else
					$(this).parent().addClass('listed');
				
				return false;
			});
			
			// Click event on a new font in the picker
			$(font_select).click(function() {
				// No font selected
				if(!$(this).attr('data-value')) {
					$(font_current).removeAttr('data-font')
					               .removeAttr('data-value')
					               .text(_e("None"));
					
					$(message_area).removeAttr('data-font');
				}
				
				// A font is defined
				else {
					$(font_current).attr('data-font', $(this).attr('data-font'))
					               .attr('data-value', $(this).attr('data-value'))
					               .text($(font_list).find('a[data-value=' + $(this).attr('data-value') + ']').text());
					
					$(message_area).attr('data-font', $(this).attr('data-value'));
				}
				
				return false;
			});
			
			// Click event on color picker
			$(colors).click(function() {
				// Reset the manual picker
				$(color_hex).find('input').val('');
				
				// The clicked color is yet selected
				if($(this).hasClass('selected')) {
					$(message_area).removeAttr('data-color');
					$(this).removeClass('selected');
				}
				
				else {
					$(message_area).attr('data-color', $(this).attr('data-color'));
					$(colors).removeClass('selected');
					$(this).addClass('selected');
				}
				
				return false;
			});
			
			// Click event on color picker
			$(color_more).click(function() {
				// The clicked color is yet selected
				if($(color_hex).is(':visible'))
					$(this).parent().removeClass('opened');
				
				else {
					$(this).parent().addClass('opened');
					
					// Focus
					$(document).oneTime(10, function() {
						$(color_hex).find('input').focus();
					});
				}
				
				return false;
			});
			
			// Click event on color hex
			$(color_hex).click(function() {
				return false;
			});
			
			// Keyup event on color picker
			$(color_hex).find('input').keyup(function(e) {
				// Submit
				if(e.keyCode == 13) {
					if($(color_hex).is(':visible')) {
						$(color_more).click();
						
						// Focus again on the message textarea
						$(document).oneTime(10, function() {
							$(message_area).focus();
						});
					}
					
					return false;
				}
				
				// Reset current color
				$(message_area).removeAttr('data-color');
				$(colors).removeClass('selected');
				
				// Change value
				var new_value = $(this).val().replace(/([^a-z0-9]+)/gi, '');
				$(this).val(new_value);
				
				if(new_value)
					$(message_area).attr('data-color', new_value);
				
				// Regenerate style
				var style = generateStyle(hash);
				
				// Any style to apply?
				if(style)
					$(message_area).attr('style', style);
				else
					$(message_area).removeAttr('style');
			}).placeholder();
			
			// Change event on text style checkboxes
			$(style).change(function() {
				// Get current type
				var style_data = 'data-' + $(this).attr('class');
				
				// Checked checkbox?
				if($(this).filter(':checked').size())
					$(message_area).attr(style_data, true);
				else
					$(message_area).removeAttr(style_data);
			});
			
			// Update the textarea style when it is changed
			$(style + ', ' + colors + ', ' + font_select).click(function() {
				var style = generateStyle(hash);
				
				// Any style to apply?
				if(style)
					$(message_area).attr('style', style);
				else
					$(message_area).removeAttr('style');
				
				// Focus again on the message textarea
				$(document).oneTime(10, function() {
					$(message_area).focus();
				});
			});
			
			// Load current style
			loadStyleSelector(hash);
			
			break;
		
		// File send
		case 'file':
			// File upload vars
			var oob_upload_options = {
				dataType:	'xml',
				beforeSubmit:	waitUploadOOB,
				success:	handleUploadOOB
			};
			
			// Upload form submit event
			$(path_tooltip + ' #oob-upload').submit(function() {
				if($(path_tooltip + ' #oob-upload input[type=file]').val())
					$(this).ajaxSubmit(oob_upload_options);
				
				return false;
			});
			
			// Upload input change event
			$(path_tooltip + ' #oob-upload input[type=file]').change(function() {
				if($(this).val())
					$(path_tooltip + ' #oob-upload').ajaxSubmit(oob_upload_options);
				
				return false;
			});
			
			// Input click event
			$(path_tooltip + ' #oob-upload input[type=file], ' + path_tooltip + ' #oob-upload input[type=submit]').click(function() {
				if(exists(path_tooltip + ' #oob-upload input[type=reset]'))
					return;
				
				// Lock the bubble
				$(path_bubble).addClass('locked');
				
				// Add a cancel button
				$(this).after('<input type="reset" value="' + _e("Cancel") + '" />');
				
				// Cancel button click event
				$(path_tooltip + ' #oob-upload input[type=reset]').click(function() {
					// Remove the bubble
					$(path_bubble).removeClass('locked');
					destroyTooltip(hash, 'file');
				});
			});
			
			break;
		
		// Chat log
		case 'save':
			// Chat log generation click event
			$(path_tooltip + ' .tooltip-actionlog').click(function() {
				// Replace it with a waiting notice
				$(this).replaceWith('<span class="tooltip-waitlog">' + _e("Please wait...") + '</span>');
				
				generateChatLog(xid, hash);
				
				return false;
			});
			
			break;
	}
	
	return true;
}

// Destroys a tooltip code
function destroyTooltip(hash, type) {
	$('#' + hash + ' .chat-tools-content:not(.mini) .bubble-' + type + ':not(.locked)').remove();
}

// Applies the page-engine tooltips hover event
function hoverTooltip(xid, hash, type) {
	$('#' + hash + ' .chat-tools-' + type).hover(function() {
		createTooltip(xid, hash, type);
	}, function() {
		destroyTooltip(hash, type)
	});
}

// Applies the hoverTooltip function to the needed things
function tooltipIcons(xid, hash) {
	// Hover events
	hoverTooltip(xid, hash, 'smileys');
	hoverTooltip(xid, hash, 'style');
	hoverTooltip(xid, hash, 'file');
	hoverTooltip(xid, hash, 'save');
	
	// Click events
	$('#' + hash + ' a.chat-tools-content, #' + hash + ' .chat-tools-content a').click(function() {
		return false;
	});
}

// Loads the style selector options
function loadStyleSelector(hash) {
	// Define the vars
	var path = '#' + hash;
	var message_area = $(path + ' .message-area');
	var bubble_style = path + ' .bubble-style';
	var font = message_area.attr('data-font');
	var font_select = $(bubble_style + ' div.font-list').find('a[data-value=' + font + ']');
	var color = message_area.attr('data-color');
	
	// Apply message font
	if(font) {
		$(bubble_style + ' a.font-current').attr('data-value', font)
		                                   .attr('data-font', font_select.attr('data-font'))
		                                   .text(font_select.text());
	}
	
	// Apply the options to the style selector
	$(bubble_style + ' input[type=checkbox]').each(function() {
		// Current input enabled?
		if(message_area.attr('data-' + $(this).attr('class')))
			$(this).attr('checked', true);
	});
	
	// Apply message color
	if(color) {
		if($(bubble_style + ' a.color[data-color=' + color + ']').size())
			$(bubble_style + ' a.color[data-color=' + color + ']').addClass('selected');
		else
			$(bubble_style + ' div.color-hex input.hex-value').val(color);
	}
}