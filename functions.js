function classroomSave(name, meetcode, participantsText, oldcode, callback) {
	var match = [...participantsText.matchAll(/([0-9]+)\t+(.+[A-Za-z])/g)];
	var entries = {};

	for(var item of match) {
		entries[item[2]] = item[1];
	}

	chrome.storage.sync.get(['classrooms'], function(result) {
		if(result['classrooms'] == undefined) { // No database, create new
			var classroom = {
				'name': name,
				'meetcode': meetcode,
				'participants': entries
			};
			var table = {};
			table[meetcode] = classroom;

			if(typeof callback == 'function') {
				chrome.storage.sync.set({ 'classrooms': table }, callback);
			} else {
				chrome.storage.sync.set({ 'classrooms': table });
			}
		} else {
			var participants;

			if(oldcode != '' && oldcode != meetcode) { // Change Google Meet code, save previous list
				participants = result['classrooms'][oldcode]['participants'];
				delete result['classrooms'][oldcode];
			} else if(result['classrooms'][meetcode] != undefined) {
				participants = result['classrooms'][meetcode]['participants'];
			} else {
				participants = {};
			}

			for(var pname in entries) {
				if(!(pname in participants)) {
					participants[pname] = entries[pname];
				}
			}

			var classroom = {
				'name': name,
				'meetcode': meetcode,
				'participants': participants
			};
			result['classrooms'][meetcode] = classroom;

			if(typeof callback == 'function') {
				chrome.storage.sync.set({ 'classrooms': result['classrooms'] }, callback);
			} else {
				chrome.storage.sync.set({ 'classrooms': result['classrooms'] });
			}
		}
	});
}