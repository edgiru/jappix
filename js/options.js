/*

Jappix - An open social platform
These are the options JS scripts for Jappix

-------------------------------------------------

License: AGPL
Author: Valérian Saliou
Contact: http://project.jappix.com/contact
Last revision: 12/11/10

*/

// Opens the options popup
function optionsOpen() {
	// Popup HTML content
	var html = 
	'<div class="top">' + _e("Edit options") + '</div>' + 
	
	'<div class="tab">' + 
		'<a class="tab1 tab-active" onclick="switchOptions(1);">' + _e("General") + '</a>' + 
		'<a class="tab2 pubsub-hidable" onclick="switchOptions(2);">' + _e("Channel") + '</a>' + 
		'<a class="tab3" onclick="switchOptions(3);">' + _e("Account") + '</a>' + 
	'</div>' + 
	
	'<div class="content">' + 
		'<div id="conf1" class="lap-active one-lap forms">' + 
			'<fieldset class="privacy">' + 
				'<legend>' + _e("Privacy") + '</legend>' + 
				
				'<label for="geolocation" class="pep-hidable">' + _e("Geolocation") + '</label>' + 
				'<input id="geolocation" type="checkbox" class="pep-hidable" />' + 
				
				'<label for="archiving" class="archives-hidable pref">' + _e("Message archiving") + '</label>' + 
				'<input id="archiving" type="checkbox" class="archives-hidable pref" />' + 
			'</fieldset>' + 
			
			'<fieldset>' + 
				'<legend>' + _e("Application") + '</legend>' + 
				
				'<label for="sounds">' + _e("Sounds") + '</label>' + 
				'<input id="sounds" type="checkbox" />' + 
				
				'<label for="showall">' + _e("Show all friends") + '</label>' + 
				'<input id="showall" type="checkbox" />' + 
				
				'<label>' + _e("XMPP links") + '</label>' + 
				'<a class="linked xmpp-links">' + _e("Open XMPP links with Jappix") + '</a>' + 
			'</fieldset>' + 
		'</div>' + 
		
		'<div id="conf2" class="one-lap forms">' + 
			'<fieldset>' + 
				'<legend>' + _e("Channel") + '</legend>' + 
				
				'<label>' + _e("Empty") + '</label>' + 
				'<a class="linked empty-channel">' + _e("Empty channel") + '</a>' + 
				
				'<label>' + _e("Persistent") + '</label>' + 
				'<input id="persistent" type="checkbox" />' + 
				
				'<label>' + _e("Maximum notices") + '</label>' + 
				'<select id="maxnotices">' + 
					'<option value="50">50</option>' + 
					'<option value="100">100</option>' + 
					'<option value="500">500</option>' + 
					'<option value="1000">1000</option>' + 
					'<option value="5000">5000</option>' + 
					'<option value="10000">10000</option>' + 
				'</select>' + 
			'</fieldset>' + 
			
			'<div class="sub-ask sub-ask-empty sub-ask-element">' + 
				'<div class="sub-ask-top">' + 
					'<div class="sub-ask-title">' + _e("Empty channel") + '</div>' + 
					'<a class="sub-ask-close">X</a>' + 
				'</div>' + 
				
				'<div class="sub-ask-content">' + 
					'<label>' + _e("Password") + '</label>' + 
					'<input type="password" class="purge-microblog check-empty" />' + 
				'</div>' + 
				
				'<a class="sub-ask-bottom" onclick="purgeMyMicroblog();">' + _e("Empty") + ' &raquo;</a>' + 
			'</div>' + 
		'</div>' + 
		
		'<div id="conf3" class="one-lap forms">' + 
			'<fieldset>' + 
				'<legend>' + _e("Account") + '</legend>' + 
				
				'<label>' + _e("Password") + '</label>' + 
				'<a class="linked change-password">' + _e("Change password") + '</a>' + 
				
				'<label>' + _e("Delete") + '</label>' + 
				'<a class="linked delete-account">' + _e("Delete account") + '</a>' + 
			'</fieldset>' + 
				
			'<div class="sub-ask sub-ask-pass sub-ask-element">' + 
				'<div class="sub-ask-top">' + 
					'<div class="sub-ask-title">' + _e("Change password") + '</div>' + 
					'<a class="sub-ask-close">X</a>' + 
				'</div>' + 
				
				'<div class="sub-ask-content">' + 
					'<label>' + _e("Old") + '</label>' + 
					'<input type="password" class="password-change old" />' + 
					
					'<label>' + _e("New (2 times)") + '</label>' + 
					'<input type="password" class="password-change new1" />' + 
					'<input type="password" class="password-change new2" />' + 
				'</div>' + 
				
				'<a class="sub-ask-bottom" onclick="sendNewPassword();">' + _e("Continue") + ' &raquo;</a>' + 
			'</div>' + 
			
			'<div class="sub-ask sub-ask-delete sub-ask-element">' + 
				'<div class="sub-ask-top">' + 
					'<div class="sub-ask-title">' + _e("Delete account") + '</div>' + 
					'<a class="sub-ask-close">X</a>' + 
				'</div>' + 
				
				'<div class="sub-ask-content">' + 
					'<label>' + _e("Password") + '</label>' + 
					'<input type="password" class="delete-account check-password" />' + 
				'</div>' + 
				
				'<a class="sub-ask-bottom" onclick="deleteMyAccount();">' + _e("Delete") + ' &raquo;</a>' + 
			'</div>' + 
		'</div>' + 
	'</div>' + 
	
	'<div class="bottom">' + 
		'<div class="wait wait-medium"></div>' + 
		
		'<a class="finish" onclick="return saveOptions();">' + _e("Save") + '</a>' + 
		'<a class="finish" onclick="return closeOptions();">' + _e("Cancel") + '</a>' + 
	'</div>';
	
	// Create the popup
	createPopup('options', html);
	
	// Apply the features
	applyFeatures('options');
	
	// Associate the events
	launchOptions();
}

// Closes the options popup
function closeOptions() {
	// Destroy the popup
	destroyPopup('options');
}

// Switches between the options tabs
function switchOptions(id) {
	$('#options .one-lap').hide();
	$('#options #conf' + id).show();
	$('#options .tab a').removeClass('tab-active');
	$('#options .tab .tab' + id).addClass('tab-active');
}

// Manages the options wait item
function waitOptions(id) {
	var sOptions = $('#options .content');
	
	// Remove the current item class
	sOptions.removeClass(id);
	
	// Hide the waiting items if all was received
	if(!sOptions.hasClass('microblog') && !sOptions.hasClass('archives')) {
		$('#options .wait').hide();
		$('#options .finish:first').removeClass('disabled');
	}
}

// Sends the options to the XMPP server
function storeOptions() {
	// Get the values
	var sounds = getDB('options', 'sounds');
	var geolocation = getDB('options', 'geolocation');
	var showall = getDB('options', 'roster-showall');
	
	// Create an array to be looped
	var oType = new Array('sounds', 'geolocation', 'roster-showall');
	var oContent = new Array(sounds, geolocation, showall);
	
	// New IQ
	var iq = new JSJaCIQ();
	iq.setType('set');
	
	var query = iq.setQuery(NS_PRIVATE);
	var storage = query.appendChild(iq.buildNode('storage', {'xmlns': NS_OPTIONS}));
	
	// Loop the array
	for(i in oType)
		storage.appendChild(iq.buildNode('option', {'type': oType[i], 'xmlns': NS_OPTIONS}, oContent[i]));
	
	con.send(iq, handleStoreOptions);
	
	logThis('Storing options...');
}

// Handles the option storing
function handleStoreOptions(iq) {
	if(!iq || (iq.getType() != 'result'))
		logThis('Options not stored.');
	else
		logThis('Options stored.');
}

// Saves the user options
function saveOptions() {
	// Not yet retrieved?
	if($('#options .finish:first').hasClass('disabled'))
		return;
	
	// We apply the sounds
	var sounds = '0';
	
	if($('#sounds').is(':checked'))
		sounds = '1';
	
	setDB('options', 'sounds', sounds);
	
	// We apply the geolocation
	if($('#geolocation').is(':checked')) {
		setDB('options', 'geolocation', '1');
		
		// We geolocate the user on the go
		geolocate();
	}
	
	else {
		setDB('options', 'geolocation', '0');
		
		// We delete the geolocation informations in pubsub
		sendPosition('', '', '');
	}
	
	// We apply the roster show all
	if($('#showall').is(':checked')) {
		setDB('options', 'roster-showall', '1');
		showAllBuddies('options');
	}
	
	else {
		setDB('options', 'roster-showall', '0');
		showOnlineBuddies('options');
	}
	
	// We apply the message archiving
	if(enabledArchives('pref')) {
		var aEnabled = false;
		
		if($('#archiving').is(':checked'))
			aEnabled = true;
		
		configArchives(aEnabled);
	}
	
	// We apply the microblog configuration
	var persist = '0';
	var maximum = $('#maxnotices').val();
	
	if($('#persistent').is(':checked'))
		persist = '1';
	
	if(enabledPEP() && enabledPubSub())
		configMicroblog(persist, maximum);
	
	// We send the options to the database
	storeOptions();
	
	// Close the options
	closeOptions();
}

// Handles the password changing
function handlePwdChange(iq) {
	// If no errors
	if(!handleErrorReply(iq)) {
		clearLastSession();
		quit();
		openThisInfo(1);
		
		logThis('Password changed.');
	}
	
	else
		logThis('Password not changed.');
}

// Sends the new account password
function sendNewPassword() {
	/* REF: http://xmpp.org/extensions/xep-0077.html#usecases-changepw */
	
	var password0 = $('#options .old').val();
	var password1 = $('#options .new1').val();
	var password2 = $('#options .new2').val();
	
	if ((password1 == password2) && (password0 == getPassword())) {
		// We send the IQ
		var iq = new JSJaCIQ();
		
		iq.setTo(getServer());
		iq.setType('set');
		
		var iqQuery = iq.setQuery(NS_REGISTER);
		
		iqQuery.appendChild(iq.buildNode('username', {'xmlns': NS_REGISTER}, getNick()));
		iqQuery.appendChild(iq.buildNode('password', {'xmlns': NS_REGISTER}, password1));
		
		con.send(iq, handlePwdChange);
		
		logThis('Password change sent.');
	}
	
	else {
		$('.sub-ask-pass input').each(function() {
			if(!$(this).val())
				$(this).addClass('please-complete');
			else
				$(this).removeClass('please-complete');	
		});
		
		if(password0 != getPassword())
			$('#options .old').addClass('please-complete');
		if(password1 != password2)
			$('#options .new1, #options .new2').addClass('please-complete');
	}
}

// Handles the account deletion request
function handleAccDeletion(iq) {
	// If no errors
	if(!handleErrorReply(iq)) {
		clearLastSession();
		destroyTalkPage();
		openThisInfo(2);
		logout();
		
		logThis('Account deleted.');
	}
	
	else
		logThis('Account not deleted.');
}

// Purge the user's microblog items
function purgeMyMicroblog() {
	/* REF: http://xmpp.org/extensions/xep-0060.html#owner-purge */
	
	var password = $('#options .check-empty').val();
	
	if(password == getPassword()) {
		// Send the IQ to remove the item (and get eventual error callback)
		var iq = new JSJaCIQ();
		iq.setType('set');
		
		var pubsub = iq.appendNode('pubsub', {'xmlns': NS_PUBSUB_OWNER});
		pubsub.appendChild(iq.buildNode('purge', {'node': NS_URN_MBLOG, 'xmlns': NS_PUBSUB_OWNER}));
		
		con.send(iq, handleMicroblogPurge);
		
		// Hide the tool
		$('#options .sub-ask').hide();
		
		logThis('Microblog purge sent.');
	}
	
	else {
		var selector = $('#options .check-empty');
		
		if(password != getPassword())
			selector.addClass('please-complete');
		else
			selector.removeClass('please-complete');
	}
}

// Handles the microblog purge
function handleMicroblogPurge(iq) {
	// If no errors
	if(!handleErrorReply(iq)) {
		// Remove the microblog items
		$('.one-update.' + hex_md5(getXID())).remove();
		
		logThis('Microblog purged.');
	}
	
	else
		logThis('Microblog not purged.');
}

// Deletes the user's account
function deleteMyAccount() {
	/* REF: http://xmpp.org/extensions/xep-0077.html#usecases-cancel */
	
	var password = $('#options .check-password').val();
	
	if(password == getPassword()) {
		// We send the IQ
		var iq = new JSJaCIQ();
		iq.setType('set');
		
		var iqQuery = iq.setQuery(NS_REGISTER);
		iqQuery.appendChild(iq.buildNode('remove', {'xmlns': NS_REGISTER}));
		
		con.send(iq, handleAccDeletion);
		
		logThis('Delete account sent.');
	}
	
	else {
		var selector = $('#options .check-password');
		
		if(password != getPassword())
			selector.addClass('please-complete');
		else
			selector.removeClass('please-complete');
	}
}

// Loads the user options
function loadOptions() {
	// Process the good stuffs, depending of the server features
	var enabled_archives_pref = enabledArchives('pref');
	var enabled_pubsub = enabledPubSub();
	var enabled_pep = enabledPEP();
	var sWait = $('#options .content');
	
	// Show the waiting items if necessary
	if(enabled_archives_pref || (enabled_pep && enabled_pubsub)) {
		$('#options .wait').show();
		$('#options .finish:first').addClass('disabled');
	}
	
	// We get the archiving configuration
	if(enabled_archives_pref) {
		sWait.addClass('archives');
		getConfigArchives();
	}
	
	// We get the microblog configuration
	if(enabled_pubsub && enabled_pep) {
		sWait.addClass('microblog');
		getConfigMicroblog();
	}
	
	// We show the "privacy" form if something is visible into it
	if(enabled_archives_pref || enabled_pep)
		$('#options fieldset.privacy').show();
	
	// We get the values of the forms for the sounds
	if(getDB('options', 'sounds') == '0')
		$('#sounds').attr('checked', false);
	else
		$('#sounds').attr('checked', true);
	
	// We get the values of the forms for the geolocation
	if(getDB('options', 'geolocation') == '1')
		$('#geolocation').attr('checked', true);
	else
		$('#geolocation').attr('checked', false);
	
	// We get the values of the forms for the roster show all
	if(getDB('options', 'roster-showall') == '1')
		$('#showall').attr('checked', true);
	else
		$('#showall').attr('checked', false);
}

// Plugin launcher
function launchOptions() {
	// The click events on the links
	$('#options .linked').click(function() {
		$('#options .sub-ask').hide();
	});
	
	$('#options .xmpp-links').click(xmppLinksHandler);
	
	$('#options .empty-channel').click(function() {
		var selector = '#options .sub-ask-empty';
		
		$(selector).show();
		$(selector + ' input').focus();
	});
	
	$('#options .change-password').click(function() {
		var selector = '#options .sub-ask-pass';
		
		$(selector).show();
		$(selector + ' input:first').focus();
	});
	
	$('#options .delete-account').click(function() {
		var selector = '#options .sub-ask-delete';
		
		$(selector).show();
		$(selector + ' input').focus();
	});
	
	$('#options .sub-ask-close').click(function() {
		$('#options .sub-ask').hide();
	});
	
	// The keyup events
	$('#options .sub-ask input').keyup(function(e) {
		if(e.keyCode == 13) {
			// Microblog purge
			if($(this).is('.purge-microblog'))
				purgeMyMicroblog();
			
			// Password change
			else if($(this).is('.password-change'))
				sendNewPassword();
			
			// Account deletion
			else if($(this).is('.delete-account'))
				deleteMyAccount();
		}
	});
	
	// Load the options
	loadOptions();
}