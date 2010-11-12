/*

Jappix - An open social platform
These are the interface JS scripts for Jappix

-------------------------------------------------

License: AGPL
Author: Valérian Saliou
Contact: http://project.jappix.com/contact
Last revision: 12/11/10

*/

// Changes the title of the document
function pageTitle(title) {
	// Title DOM element selector
	var select = 'head title';
	
	// Anonymous mode?
	var xid = getXID();
	
	if(isAnonymous())
		xid = ANONYMOUS_ROOM + ' (' + _e("anonymous mode") + ')';
	
	// We change the title of the page so that it will give the user's XID when he's logged in
	switch(title) {
		case 'home':
			$(select).html(SERVICE_NAME.htmlEnc() + ' &bull; ' + _e("An open social network"));
			break;
		
		case 'talk':
			$(select).html('Jappix &bull; ' + xid);
			break;
		
		case 'new':
			$(select).html('[*] Jappix &bull; ' + xid);
			break;
	}
}

// Creates a general-wait item
function showGeneralWait() {
	// Item exists?
	if(exists('#general-wait'))
		return false;
	
	// Generate the HTML code
	var html = 
	'<div id="general-wait" class="removable">' + 
		'<div class="general-wait-content wait-big"></div>' + 
	'</div>';
	
	// Append the HTML code
	$('body').append(html);
	
	return true;
}

// Removes the general-wait item
function removeGeneralWait() {
	$('#general-wait').remove();
}

// Switches to the given chan
function switchChan(id) {
	if(exists('#' + id)) {
		// We show the chat-engine content
		$('.chat-engine-chan').hide();
		$('#' + id).show();
		
		// We edit the tab switcher
		$('#chat-switch .switcher').removeClass('activechan').addClass('chan');
		$('#chat-switch .' + id).addClass('activechan').removeClass('chan');
		
		if(id != 'channel') {
			// We scroll down to the last message
			autoScroll(id);
			
			// We put the focus on the target chat input
			$('#chat-engine #' + id + ' .text .message-area').focus();
		}
	}
}

// Puts the selected smiley in the good chat-engine input
function insertSmiley(smiley, hash) {
	// We define the variables
	var selector = $('#' + hash + ' .message-area');
	var oValue = selector.val();
	var nValue = oValue + ' ' + smiley + ' ';
	
	// Put the new value and focus on it
	selector.val(nValue).focus();
}

// Deletes all the associated elements of the chat we want to remove
function deleteThisChat(hash) {
	$('#' + hash + ', #chat-switch .' + hash).remove();
}

// Closes the given chat
function quitThisChat(xid, hash, type) {
	if(type == 'groupchat') {
		// Send our unavailable presence
		sendPresence(xid + '/' + getMUCNick(hash), 'unavailable');
		
		// Remove all presence database entries for this groupchat
		for(var i = 0; i < sessionStorage.length; i++) {
			// Get the pointer values
			var current = sessionStorage.key(i);
			var cXID = explodeThis('_', current, 1);
			
			// If the pointer is on a presence from this groupchat
			if((explodeThis('_', current, 0) == 'presence') && (cutResource(cXID) == xid)) {
				// Generate the hash for the current XID
				var cHash = hex_md5(cXID);
				
				// Disable the message textarea
				$('#' + cHash + ' .message-area').attr('disabled', true);
				
				// Remove the presence for this XID
				removeDB('presence', cXID);
				presenceFunnel(cXID, cHash);
			}
		}
	}
	
	else
		chatStateSend('gone', xid, hash, 'chat');
	
	// Get the chat ID which is before
	var previous = $('#' + hash).prev().attr('id');
	
	// Remove the chat
	deleteThisChat(hash);
	
	// Reset the switcher
	switchChan(previous);
	
	// Reset the notifications
	chanCleanNotify(hash);
}

// Generates the chat logs
function generateChatLog(xid, hash) {
	// Get the main values
	var path = '#' + hash + ' ';
	var content = $(path + '#chatContentFor' + hash).clone().contents();
	var avatar = $(path + '.top .avatar-container:first').html();
	var nick = $(path + '.top .bc-name').text();
	var date = getXMPPTime('local');
	
	// Filter the content smileys
	$(content).find('span.emoticon').each(function() {
		$(this).replaceWith($(this).attr('data-text'));
	});
	
	// Remove the content click events
	$(content).find('a').removeAttr('onclick');
	
	// Extract the content HTML code
	content = $(content).parent().html();
	
	// No avatar?
	if(!avatar || !avatar.match(/data:/))
		avatar = 'none';
	
	// POST the values to the server
	$.post('./php/generate-chat.php', { content: content, xid: xid, nick: nick, avatar: avatar, date: date }, function(data) {
		// Handled!
		$(path + '.tooltip-waitlog').replaceWith('<a class="tooltip-actionlog" href="./php/download-chat.php?id=' + data + '" target="_blank">' + _e("Download file!") + '</a>');
	});
}

// Notifies the user from a new incoming message
function messageNotify(hash, type) {
	// We notify the user if he has not the focus on the chat
	var chat_switch = '#chat-switch .';
	var tested = $(chat_switch + hash);
	
	if(!tested.hasClass('activechan') || !document.hasFocus()) {
		if(type == 'personnal') {
			$(chat_switch + hash + ', ' + chat_switch + 'more-button').addClass('chan-newmessage');
			pageTitle('new');
		}
		
		else
			tested.addClass('chan-unread');
	}
}

// Cleans the given chat notifications
function chanCleanNotify(hash) {
	// We remove the class that tell the user of a new message
	var chat_switch = '#chat-switch .';
	$(chat_switch + hash).removeClass('chan-newmessage chan-unread');
	
	// We reset the global notifications if no more unread messages
	if(!$(chat_switch + 'chans .chan-newmessage').size()) {
		$(chat_switch + 'more-button').removeClass('chan-newmessage');
		pageTitle('talk');
	}
}

// Scrolls to the last chat message
function autoScroll(hash) {
	if(exists('#' + hash)) {
		var objDiv = document.getElementById('chatContentFor' + hash);
		
		objDiv.scrollTop = objDiv.scrollHeight;
	}
}

// Shows all the buddies in the buddy-list
function showAllBuddies(from) {
	// Put a marker
	BLIST_ALL = true;
	
	// We switch the two modes
	$('.buddy-conf-more-display-unavailable').hide();
	$('.buddy-conf-more-display-available').show();
	
	// Security: reset all the groups toggle event
	$('#buddy-list .group-buddies').show();
	$('#buddy-list .group span').text('-');
	
	// We show the disconnected buddies
	$('.hidden-buddy').show();
	
	// We show all the groups
	$('#buddy-list .one-group').show();
	
	if(SEARCH_FILTERED)
		funnelFilterBuddySearch();
	
	// Store this in the options
	if(from == 'roster') {
		setDB('options', 'roster-showall', '1');
		storeOptions();
	}
}

// Shows only the online buddies in the buddy-list
function showOnlineBuddies(from) {
	// Remove the marker
	BLIST_ALL = false;
	
	// We switch the two modes
	$('.buddy-conf-more-display-available').hide();
	$('.buddy-conf-more-display-unavailable').show();
	
	// Security: reset all the groups toggle event
	$('#buddy-list .group-buddies').show();
	$('#buddy-list .group span').text('-');
	
	// We hide the disconnected buddies
	$('.hidden-buddy').hide();
	
	// We check the groups to hide
	updateGroups();
	
	if(SEARCH_FILTERED)
		funnelFilterBuddySearch();
	
	// Store this in the options
	if(from == 'roster') {
		setDB('options', 'roster-showall', '0');
		storeOptions();
	}
}