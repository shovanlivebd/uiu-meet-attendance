var classrooms = null;
var records = null;

var newClassroomModal = new bootstrap.Modal(document.querySelector('#new-classroom-modal'));
var meetingRecordModal = new bootstrap.Modal(document.querySelector('#meeting-record-modal'));

document.querySelector('.navbar-brand').addEventListener('click', function(e) {
	e.preventDefault();
});

var navLinks = document.querySelectorAll('.nav-link');
for(var navLink of navLinks) {
	navLink.addEventListener('click', function(e) {
		e.preventDefault();
		if(!this.classList.contains('active')) {
			for(var link of navLinks) {
				link.classList.remove('active');
			}
			this.classList.add('active');
		}
	});
}

document.querySelector('#tab-classrooms').addEventListener('click', function() {
	document.querySelector('#content-classrooms').classList.remove('d-none');
	document.querySelector('#content-attendance').classList.add('d-none');
});
document.querySelector('#tab-attendance').addEventListener('click', function() {
	document.querySelector('#content-classrooms').classList.add('d-none');
	document.querySelector('#content-attendance').classList.remove('d-none');
});

document.addEventListener('click', function(e) {
	if(e.target && e.target.classList.contains('edit-button')) {
		e.preventDefault();
		var meetcode = e.target.getAttribute('data-meetcode');

		txtClassroomName.value = classrooms[meetcode]['name'];
		txtClassroomOldCode.value = meetcode;
		txtClassroomMeetCode.value = meetcode;

		document.querySelector('#participants-help').classList.remove('d-none');
		newClassroomModal.show();
	} else if(e.target && e.target.classList.contains('statistics-button')) {
		e.preventDefault();
	} else if(e.target && e.target.classList.contains('manage-button')) {
		e.preventDefault();
		showAttendanceReport(classrooms, records, e.target.getAttribute('data-index'), e.target.getAttribute('data-meetcode'));
		meetingRecordModal.show();
	} else if(e.target && e.target.classList.contains('merge-button')) {
		e.preventDefault();
		mergeMeetings(records, e.target.getAttribute('data-index'), function() {
			meetingRecordRefresh();
		});
	} else if(e.target && e.target.classList.contains('alias-save')) {
		e.preventDefault();
		saveNewAlias(e.target.closest('tr'), classrooms);
	} else if(e.target && e.target.classList.contains('classroom-delete-button')) {
		if(confirm('Are you sure? You cannot undo this action.')) {
			var meetcode = e.target.getAttribute('data-meetcode');
			delete classrooms[meetcode];
			chrome.storage.local.set({ 'classrooms': classrooms }, function() {
				classroomRefresh();
				meetingRecordRefresh();
			});
		}
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

btnClassroomSave.addEventListener('click', function(e) {
	if(txtClassroomName.value == '' || txtClassroomMeetCode.value == '') {
		alert('Fill up all the required fields.');
		return;
	}
	classroomSave(txtClassroomName.value, txtClassroomMeetCode.value, txtClassroomParticipants.value, txtClassroomOldCode.value, function() {
		classroomRefresh();
		newClassroomModal.hide();
	});
});

document.querySelector('#new-classroom-modal').addEventListener('hidden.bs.modal', function(e) {
	cleanModal();
});

function classroomRefresh() {
	chrome.storage.local.get(['classrooms'], function(result) {
		classrooms = result['classrooms'];
		var list = document.querySelector('#classrooms-list');

		if(classrooms == undefined || Object.keys(classrooms).length == 0) {
			list.innerHTML = '<div class="col-12 mb-3">No classrooms created yet.</div>';
			return;
		}
		list.innerHTML = '';
		for(var meetcode in classrooms) {
			list.innerHTML += classroomListItem(classrooms[meetcode]);
		}
		//list.innerHTML = JSON.stringify(classrooms);
	});
}

function meetingRecordRefresh() {
	chrome.storage.local.get(['attendances'], function(result) {
		records = result['attendances'];
		showMeetingList(classrooms, records);
	});
}

function cleanModal() {
	txtClassroomName.value = '';
	txtClassroomOldCode.value = '';
	txtClassroomMeetCode.value = '';
	txtClassroomParticipants.value = '';
	document.querySelector('#participants-help').classList.add('d-none');
}

function classroomListItem(classroom) {
	var participants = '';
	/*for(var pname in classroom['participants']) {
		participants += '<br>' + classroom['participants'][pname] + ' - ' + pname
	}*/
	return '<div class="col-4"><div class="bg-light mb-3 p-3"><h5>' + classroom['name'] + '</h5><div class="mb-2">Google Meet code: ' + classroom['meetcode'] + '</div>' + participants + '<a href="#" class="btn btn-link p-0 edit-button" data-meetcode="' + classroom['meetcode'] + '">Edit</a> | <a href="#" class="btn btn-link p-0 statistics-button" data-meetcode="' + classroom['meetcode'] + '">Attendance statistics</a> | <a href="#" class="btn btn-link text-danger p-0 classroom-delete-button" data-meetcode="' + classroom['meetcode'] + '">Delete</a></div></div>';
}

classroomRefresh();
meetingRecordRefresh();