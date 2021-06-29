var ids;
var present;
var absent;
var notfound;

function showMeetingList(classes, meetings) {
	var list = document.querySelector('#records-list');

	if(meetings == undefined || meetings.length == 0) {
		list.innerHTML = '<div class="mb-3">No meetings held yet. Any new meeting will be recorded by the extension automatically.</div>';
		return;
	}
	list.innerHTML = '';
	for(var i = meetings.length - 1; i >= 0; i--) {
		list.innerHTML += meetingListItem(classes, meetings, i);
	}
}

function showAttendanceReport(classes, meetings, index, meetcode) {
	var meeting = meetings[index];

	ids = [];
	present = [];
	absent = [];
	notfound = [];

	for(var pname in classes[meetcode]['participants']) {
		if(!ids.includes(classes[meetcode]['participants'][pname])) {
			ids.push(classes[meetcode]['participants'][pname]);
		}
	}
	ids.sort();

	for(var id of ids) {
		present.push(0);
	}

	for(var item of meeting['attendance']) {
		var pname = item['name'];
		if(pname in classes[meetcode]['participants']) {
			var id = classes[meetcode]['participants'][pname];
			var i = ids.indexOf(id);
			present[i] = 1;
		} else {
			notfound.push(pname);
		}
	}

	for(var i = 0; i < present.length; i++) {
		if(present[i] == 0) {
			absent.push(ids[i]);
		}
	}

	document.querySelector('#absent-table tbody').innerHTML = '';
	for(var id of absent) {
		var pname = Object.keys(classes[meetcode]['participants']).find(key => classes[meetcode]['participants'][key] == id);
		document.querySelector('#absent-table tbody').innerHTML += '<tr><td>' + id + '</td><td>' + pname + '</td></tr>';
	}

	document.querySelector('#unregistered-table tbody').innerHTML = '';
	for(var pname of notfound) {
		document.querySelector('#unregistered-table tbody').innerHTML += '<tr><td class="alias-name">' + pname + '</td><td><input type="text" class="form-control alias-id" style="width:120px" data-meetcode="' + meetcode + '" data-index="' + index + '"></td><td><button type="button" class="btn btn-primary alias-save">Save</button></td></tr>';
	}
	//document.querySelector('#meeting-record-modal .modal-body').innerHTML = '<pre>' + JSON.stringify(absent) + '</pre>' + '<pre>' + JSON.stringify(notfound) + '</pre>';
}

function mergeMeetings(meetings, index, callback = null) {
	meetings[index - 1]['attendance'] = meetings[index - 1]['attendance'].concat(meetings[index]['attendance']);
	meetings.splice(index, 1);
	if(typeof callback == 'function') {
		chrome.storage.sync.set({ 'attendances': meetings }, callback);
	} else {
		chrome.storage.sync.set({ 'attendances': meetings });
	}
}

function saveNewAlias(row, classes, meetings) {
	var pname = row.querySelector('.alias-name').innerHTML;
	var id = row.querySelector('.alias-id').value;
	var index = row.querySelector('.alias-id').getAttribute('data-index');
	var meetcode = row.querySelector('.alias-id').getAttribute('data-meetcode');

	if(id == '') {
		alert('Please input student ID.');
		return;
	}

	classes[meetcode]['participants'][pname] = id;
	chrome.storage.sync.set({ 'classrooms': classes }, function() {
		showAttendanceReport(classes, meetings, index, meetcode);
	});
}

function sendAttendance(tab) {
	chrome.tabs.sendMessage(tab.id, {ids: absent});
}

function meetingListItem(classes, meetings, index) {
	var classroomName;
	if(classes == undefined || !(meetings[index]['room'] in classes)) {
		classroomName = meetings[index]['room'];
	} else {
		classroomName = classes[meetings[index]['room']]['name'];
	}

	var managelink = '', mergelink = '';
	if(classes != undefined && meetings[index]['room'] in classes) {
		managelink = '<a href="#" class="manage-button" data-meetcode="' + meetings[index]['room'] + '" data-index="' + index + '">Manage attendances</a>';
	}
	if(index > 0 && meetings[index - 1]['room'] == meetings[index]['room']) {
		mergelink = (managelink == '' ? '' : ' | ') + '<a href="#" class="merge-button" data-meetcode="' + meetings[index]['room'] + '" data-index="' + index + '">Merge bottom</a>';
	}
	
	return '<div class="bg-light mb-3 p-3"><div>' + meetings[index]['date'] + '</div><h5>' + classroomName + '</h5>' + managelink + mergelink + (managelink == '' && mergelink == '' ? '' : ' | ') + '<a href="#" class="text-danger meeting-delete-button" data-index="' + index + '">Delete</a></div>';
}