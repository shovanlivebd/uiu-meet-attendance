chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if('ids' in message) {
		var ids = message.ids;
		var spans = document.querySelectorAll('span[id$="lblStudentRoll"]');

		if(spans.length == 0) {
			alert('Please load the attendance input table.');
			return;
		}

		resetRadioButtons();
		for(var span of spans) {
			if(ids.includes(span.innerHTML)) {
				var row = span.closest('tr');
				row.querySelector('input[type="radio"][value="2"]').click();
			}
		}
	} else if('reset' in message) {
		resetRadioButtons();
	}
});

function resetRadioButtons() {
	var radios = document.querySelectorAll('input[type="radio"][value="1"]');
	for(var radio of radios) {
		if(radio.closest('th') != null) {
			continue;
		}
		radio.click();
	}
}