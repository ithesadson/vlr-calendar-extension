// Element Selections
const matchList = document.querySelectorAll('.match-item');
const buttonContainer = document.querySelector('.wf-label.mod-large');

// Adding CheckBox
matchList.forEach((match) => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'match-checkbox';
  match.prepend(checkbox);
});

// Date Map
const monthMap = {
  "January": "01", "February": "02", "March": "03", "April": "04",
  "May": "05", "June": "06", "July": "07", "August": "08",
  "September": "09", "October": "10", "November": "11", "December": "12"
};

// Creating and Adding Download Button
const downloadButton = document.createElement('button');
downloadButton.textContent = 'Download selected matches as CSV file';
downloadButton.style.marginBottom = '10px';
downloadButton.style.backgroundColor = '#3B5BA5'; // Dark Blue
downloadButton.style.color = '#FFFFFF';
downloadButton.style.border = 'none';
downloadButton.style.padding = '8px 16px';
downloadButton.style.fontSize = '14px';
downloadButton.style.borderRadius = '5px';
downloadButton.style.cursor = 'pointer';
downloadButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
buttonContainer.before(downloadButton);

// Creating and Adding Go to Link Button
const linkButton = document.createElement('button');
linkButton.textContent = 'Redirect to Calendar Import Page';
linkButton.style.marginBottom = '10px';
linkButton.style.marginLeft = '10px'; 
linkButton.style.backgroundColor = '#F96167'; // Orange
linkButton.style.color = '#FFFFFF';
linkButton.style.border = 'none';
linkButton.style.padding = '8px 16px';
linkButton.style.fontSize = '14px';
linkButton.style.borderRadius = '5px';
linkButton.style.cursor = 'pointer';
linkButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
downloadButton.after(linkButton); 

// Adding Event Listener to Go to Link Button
linkButton.addEventListener('click', () => {
  window.open('https://calendar.google.com/calendar/u/0/r/settings/export', '_blank');
});

downloadButton.addEventListener('click', () => {
  const csvHeader = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private\n';
  let csvContent = csvHeader;

  const selectedMatches = document.querySelectorAll('.match-checkbox:checked');

  // If no matches are selected, do not proceed with CSV generation
  if (selectedMatches.length === 0) {
    alert('[VLR Calendar Extension]: No matches selected to create a CSV file.');
    return;
  }

  csvContent += Array.from(selectedMatches).map(checkbox => {
    const matchItem = checkbox.closest('.match-item');
    const teamNames = Array.from(matchItem.querySelectorAll('.match-item-vs-team-name'))
                           .map(el => el.textContent.trim())
                           .join(' vs ');

    const time = matchItem.querySelector('.match-item-time').textContent.trim();
    const fullDate = checkbox.closest('.wf-card').previousElementSibling.textContent.trim();
    const [weekday, monthName, day, year] = fullDate.split(' ');
    const month = monthMap[monthName];
    const formattedDate = `${year}-${month}-${day.replace(',', '')}`;

    let [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    hours = parseInt(hours) % 12 + (period === "PM" ? 12 : 0);

    const subject = `${teamNames}`;
    const startDate = formattedDate;
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    const endTime = `${(hours + 1).toString().padStart(2, '0')}:${minutes}:00`;
    const description = `[VLR Calendar] Valorant match between the following teams: ${teamNames}`;
    
    return `"${subject}","${startDate}","${startTime}","${startDate}","${endTime}","False","${description}","Online","True"`;
  }).join('\n');

  downloadCsv(csvContent);
});

function downloadCsv(csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'valorant_matches.csv';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
