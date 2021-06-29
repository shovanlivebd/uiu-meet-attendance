var meetcode = document.URL.split("/")[3].split("?")[0];
var meetdate = (new Date()).toLocaleString();

//var classid = meetcode + ' ' + meetdate;

var participants = {};
var attendance = [];

var indices = {};
var nextIndex = 0;

var listObserver = new MutationObserver(function(mutations, me) {
	for(var mutation of mutations) {
		for(var node of mutation.addedNodes) {
			addAttendance(node);
		}
		for(var node of mutation.removedNodes) {
			removeAttendance(node);
		}
	}
});

var documentObserver = new MutationObserver(function(mutations, me) {
	for(var mutation of mutations) {
		for(var node of mutation.addedNodes) {
			if(node instanceof Element) {
				if(node.getAttribute('aria-label') == 'Show everyone') {
					var btn = node;
					setTimeout(function() { 
						btn.click();
						setTimeout(function() {
							btn.click();
						}, 5000);
					}, 2000);
				} else if((plist = node.querySelector('div[aria-label="Participants"]')) != null) {
					initAttendanceList(plist);
					listObserver.observe(plist, { childList: true });
				} else if(node.classList.contains('TqTEJc') || node.classList.contains('Fi0Gqc')) {
					listObserver.disconnect();
					if(node.classList.contains('Fi0Gqc')) {
						documentObserver.disconnect();
						cleanAttendanceList();
					}
				}
			}
		}
	}
});

documentObserver.observe(document.querySelector('c-wiz'), { childList: true, subtree: true });

function initAttendanceList(container) {
	var now = new Date();
	var survived = [];
	var nodes = container.querySelectorAll('div[role="listitem"]');

	for(var node of nodes) {
		survived.push(node.dataset.participantId);
		if(!alreadyPresent(node)) {
			addAttendance(node);
		}
	}

	for(var id in participants) {
		if(survived.includes(id)) {
			continue;
		}
		delete participants[id];
		attendance[indices[id]]['leaving_time'] = now.toLocaleString();
	}
}

function cleanAttendanceList() {
	var now = new Date();
	for(var i = 0; i < attendance.length; i++) {
		if(attendance[i]['leaving_time'] == '') {
			attendance[i]['leaving_time'] = now.toLocaleString();
		}
	}

	chrome.storage.sync.get(['attendances'], function(result) {
		if(result['attendances'] == undefined) {
			/*var entry = {};
			entry[classid] = makeEntry();*/
			var array = [ makeEntry() ];
			chrome.storage.sync.set({ 'attendances' : array });
		} else {
			result['attendances'].push(makeEntry());
			chrome.storage.sync.set({ 'attendances' : result['attendances'] });
		}
	})
}

function alreadyPresent(node) {
	return participants.hasOwnProperty(node.dataset.participantId);
}

function addAttendance(node) {
	if(node.querySelector('.QMC9Zd') == null && node.querySelector('.jcGw9c') == null) {
		var now = new Date();
		var name = node.querySelector('.ZjFb7c').innerHTML;
		var id = node.dataset.participantId;

		indices[id] = nextIndex++;
		participants[id] = name;
		attendance[indices[id]] = {'name': name, 'joining_time': now.toLocaleString(), 'leaving_time': ''};
	}
	console.log(participants);
	console.log(attendance);
}

function removeAttendance(node) {
	if(node.querySelector('.QMC9Zd') == null) {
		var now = new Date();
		var id = node.dataset.participantId;
		
		delete participants[id];
		attendance[indices[id]]['leaving_time'] = now.toLocaleString();
	}
	console.log(participants);
	console.log(attendance);
}

function makeEntry() {
	return {
		'room': meetcode,
		'date': meetdate,
		'attendance': attendance
	};
}