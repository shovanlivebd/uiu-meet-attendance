/*btnFind.addEventListener('click', async() => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.tabs.sendMessage(tab.id, {id: txtId.value});
});*/
var classrooms = null;
var records = null;

document.addEventListener('click', function(e) {
	if(e.target && e.target.classList.contains('manage-button')) {
		e.preventDefault();
		showAttendanceReport(classrooms, records, e.target.getAttribute('data-index'), e.target.getAttribute('data-meetcode'));
		document.getElementById('content-attendance').classList.add('d-none');
		document.getElementById('content-meeting-info').classList.remove('d-none');
	} else if(e.target && e.target.classList.contains('merge-button')) {
		e.preventDefault();
		mergeMeetings(records, e.target.getAttribute('data-index'), function() {
			meetingRecordRefresh();
		});
	} else if(e.target && e.target.classList.contains('alias-save')) {
		e.preventDefault();
		saveNewAlias(e.target.closest('tr'), classrooms, records);
	} else if(e.target && e.target.classList.contains('meeting-delete-button')) {
		if(confirm('Are you sure? You cannot undo this action.')) {
			var index = e.target.getAttribute('data-index');
			records.splice(index, 1);
			chrome.storage.local.set({ 'attendances': records }, function() {
				meetingRecordRefresh();
			})
		}
	}
});

btnBack.addEventListener('click', function(e) {
	document.getElementById('content-attendance').classList.remove('d-none');
	document.getElementById('content-meeting-info').classList.add('d-none');
});

btnSendAttendance.addEventListener('click', async() => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if(tab.url.includes('ucam.uiu.ac.bd') && (tab.url.includes('ClassAttendanceEntry.aspx') || tab.url.includes('ClassAttendanceUpdate.aspx'))) {
		sendAttendance(tab);
	} else {
		showAlert('Please go to UIU UCAM attendance entry/update page.');
	}
});

if(document.querySelector('#btnForceSave') != null) {
	btnForceSave.addEventListener('click', async() => {
		let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		if(tab.url.includes('meet.google.com')) {
			chrome.tabs.sendMessage(tab.id, {forceSave: "forceSave"});
		} else {
			showAlert('Please go to a Google Meet meeting for this action.');
		}
	});
}

btnReset.addEventListener('click', async() => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if(tab.url.includes('ucam.uiu.ac.bd') && (tab.url.includes('ClassAttendanceEntry.aspx') || tab.url.includes('ClassAttendanceUpdate.aspx'))) {
		chrome.tabs.sendMessage(tab.id, {reset: 'reset'});
	} else {
		showAlert('Please go to UIU UCAM attendance entry/update page.');
	}
});

btnAlertOk.addEventListener('click', function(e) {
	document.getElementById('alert').classList.add('d-none');
});

btnOptions.addEventListener('click', function(e) {
	chrome.runtime.openOptionsPage();
})

function classroomRefresh() {
	chrome.storage.local.get(['classrooms'], function(result) {
		classrooms = result['classrooms'];
	});
}

function meetingRecordRefresh() {
	chrome.storage.local.get(['attendances'], function(result) {
		records = result['attendances'];
		showMeetingList(classrooms, records);
	});
}

function showAlert(text) {
	document.getElementById('alert-text').innerHTML = text;
	document.getElementById('alert').classList.remove('d-none');
}

classroomRefresh();
meetingRecordRefresh();