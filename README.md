# UIU Google Meet Attendance

This is a Google Chrome extension that will help you automate taking class attendance, and semi-automate saving these attendance records in UCAM. This extension can be run in any Chromium based browsers (like Google Chrome, Microsoft Edge etc.). Unfortunately this will not work for Mozilla Firefox.

## Installation

* Download this repository as zip, and unzip it.
* Click the Google Chrome menu (three dots at the upper right corner). Go to *More Tools* > *Extensions*. Make sure that *Developer mode* is on.
* Click *Load unpacked*. Locate the folder where you extracted the extension (the target folder will contain the *manifest.json* file). Click *Select Folder*.
* The extension is now ready to use. You should see a button with a U written on a dark background.

## Usage

### Save student info

By default, this plugin will capture the attendance of all the participants in any Google Meet meeting you attend. In order to use this information for putting attendance, you need to create a new classroom, and save the students' info there.

* Go to the extension options page by clicking the extension popup button, and then clicking *Manage classes and meetings*.
* Click *New classroom*. You will see a popup.
* Write a name for the new classroom. In the Google Meet code textbox, write down the last hyphenated part of the Google Meet link of your class (e.g. if the class link is meet.google.com/aaa-bbbb-ccc, then the Google Meet code will be *aaa-bbbb-ccc*).
* In the Participants textbox, you have to put the names of the participants. Download the *Section wise Phone* Excel sheet for your class from UCAM, open it, copy the IDs, photos and names from the sheet, and paste it in the textbox.
* Click *Save*. Your students' info is now saved.

In case you need to add more students (probably due to late registration), click *Edit* for the classroom, and similarly copy-paste the student list from the Excel file.

### Manage attendances

You can manage the meeting attendances by clicking the extension popup button, and clicking *Manage attendances* for the meeting instance. You will see a list of absent students, and a list of students who did not register. Sometimes, you may see that some student is marked absent, but is also listed in the unregistered list. This is probably because the student's name in her/his Google ID is not the same as it appears in UCAM. In that case, put the student ID of that student in the corresponding *Alias of* textbox, and click *Save*. This alias will be stored for the next meetings.

### Uploading in UCAM

* Go to UCAM attendance entry or update page as required. Load the student list.
* Click the extension popup button, and click *Manage attendances* for the meeting instance.
* Click *Transfer attendance*. You will now see that the absent students are marked absent in UCAM.
* Save the attendance in UCAM.
