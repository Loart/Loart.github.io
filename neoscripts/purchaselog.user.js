// ==UserScript==
// @name         Neopets Shop Purchase Tracker
// @namespace    Loart
// @version      1.5
// @description  Log items being bought.
// @author       Loart
// @match        https://www.neopets.com/haggle.phtml*
// @match        https://www.neopets.com/inventory.phtml*
// @match        https://www.neopets.com/objects.*
// @match        https://www.neopets.com/market.*
// @match        https://www.neopets.com/safetydeposit*
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(async function() {
    'use strict';

    let isMenuVisible = false;

        // Function to parse and log data
    async function parseAndLogData() {
        const textContent = document.body.textContent || document.body.innerText;
        const neopointsRegex = /I accept your offer of (\d+) Neopoints!/;
        const itemRegex = /Haggle for ([^\r\n]+)/;

        const neopointsMatch = textContent.match(neopointsRegex);
        const itemMatch = textContent.match(itemRegex);

        if (neopointsMatch && itemMatch) {
            const date = new Date();
            date.setHours(date.getHours() - 5); // Adjust for EST (UTC-5)

            const formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

            const logEntry = {
                neopoints: neopointsMatch[1],
                item: itemMatch[1],
                time: formattedDate // Using the formatted date
            };

            const existingLogs = JSON.parse(await GM.getValue('neopetsHaggleLogs', '[]'));
            existingLogs.push(logEntry);
            await GM.setValue('neopetsHaggleLogs', JSON.stringify(existingLogs));
        }
    }

function createTable(logs) {
    const table = document.createElement('table');
    table.style.width = '100%'; // Full width of the container
    table.style.borderCollapse = 'collapse';
    table.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Light background color with 80% opacity
    table.style.borderRadius = '5px'; // Rounded corners for the table
    table.style.marginTop = '10px'; // Spacing above the table
    table.innerHTML = '<tr style="background-color: #26233E; color: #FFFFFF";><th>Date</th><th>Neopoints</th><th>Item</th><th>SW</th><th>TP</th><th>JN</th><th>Del</th></tr>'; // Header row styling

    logs.forEach((log, index) => {
        const row = table.insertRow();
        row.style.textAlign = 'center'; // Center align text in each cell
        row.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'; // Rows background color with 80% opacity
        row.style.color = 'black';
        row.insertCell().textContent = log.time;
        row.insertCell().textContent = log.neopoints;
        row.insertCell().textContent = log.item;
          // Add a cell with the Shop Wizard link
        const wizardCell = row.insertCell();
        const itemForUrl = encodeURIComponent(log.item); // Properly encode the item name for URL
        wizardCell.innerHTML = `<a href="https://www.neopets.com/shops/wizard.phtml?string=${itemForUrl}" target="_blank" style="margin-right: 5px;"><img src="http://images.neopets.com/themes/h5/basic/images/shopwizard-icon.png" alt="Shop Wizard" style="height: 20px; width: 20px;"></a>`;

        // Add a cell with the Trading Post link
        const tradingPostCell = row.insertCell();
        tradingPostCell.innerHTML = `<a href="https://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&search_string=${itemForUrl}" target="_blank" style="margin-right: 5px;"><img src="http://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png" alt="Trading Post" style="height: 20px; width: 20px;"></a>`;

        // Add a cell with Jellyneo item search link
        const jellyneoCell = row.insertCell();
        jellyneoCell.innerHTML = `<a href="https://items.jellyneo.net/search/?name=${itemForUrl}&name_type=3" target="_blank" style="margin-right: 5px;"><img src="data:image/png;base64,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" alt="Jellyneo" style="height: 20px; width: 20px;"></a>`;

        // Add a cell with a delete button
        const deleteCell = row.insertCell();
        deleteCell.innerHTML = '<span style="color: red; cursor: pointer; font-weight: bold; margin-left: 10px; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">X</span>';
        deleteCell.onclick = () => deleteLogRow(index);
    });

    return table;
}

    async function deleteLogRow(index) {
    // Get the current logs, remove the selected log, and update the storage
    let logs = JSON.parse(await GM.getValue('neopetsHaggleLogs', '[]'));
    logs.splice(index, 1);
    await GM.setValue('neopetsHaggleLogs', JSON.stringify(logs));

    // Re-render the table
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = '';
    logContainer.appendChild(createTable(logs));
}

    // Function to clear logs and display a message
    async function clearLogs() {
        await GM.setValue('neopetsHaggleLogs', JSON.stringify([]));
        const logContainer = document.getElementById('logContainer');
        logContainer.innerHTML = '';
        const message = document.createElement('div');
        message.textContent = 'No logs to display.';
        message.style.textAlign = 'center';
        logContainer.appendChild(message);
    }

    // Function to display or hide logs
    async function toggleLogsDisplay() {
        const logContainer = document.getElementById('logContainer');
        if (!isMenuVisible) {
            const logs = JSON.parse(await GM.getValue('neopetsHaggleLogs', '[]'));
            logContainer.innerHTML = '';

            // Container for buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            logContainer.appendChild(buttonContainer);

            // Create and add Clear Logs button
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Clear Logs';
            clearButton.onclick = clearLogs;
            buttonContainer.appendChild(clearButton);

            // Add the table with logs or a message if no logs
            if (logs.length > 0) {
                logContainer.appendChild(createTable(logs));
            } else {
                const message = document.createElement('div');
                message.textContent = 'No logs to display.';
                message.style.textAlign = 'center';
                logContainer.appendChild(message);
            }

            logContainer.style.display = 'block';
            isMenuVisible = true;
        } else {
            logContainer.style.display = 'none';
            isMenuVisible = false;
        }
    }

    // Add container for logs with enhanced styling
    const logContainer = document.createElement('div');
    logContainer.id = 'logContainer';
    logContainer.style.position = 'fixed';
    logContainer.style.bottom = '50px';
    logContainer.style.left = '10px';
    logContainer.style.width = '400px'; // Fixed width
    logContainer.style.maxHeight = '450px'; // Maximum height
    logContainer.style.overflowY = 'auto'; // Scroll for overflow content
    logContainer.style.backgroundImage = 'url("https://i.ibb.co/99qztr7/Untitled.png")'; // Background image
    logContainer.style.backgroundSize = 'cover'; // Cover the entire area of the container
    logContainer.style.border = '1px solid #ddd';
    logContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    logContainer.style.padding = '15px';
    logContainer.style.borderRadius = '10px'; // Rounded corners
    logContainer.style.display = 'none';
    logContainer.style.zIndex = '1000';
    document.body.appendChild(logContainer);

    // Modify button to toggle logs
    const button = document.createElement('button');
    button.textContent = 'Items Purchase Log';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.left = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.onclick = toggleLogsDisplay;
    document.body.appendChild(button);

    // Parse and log data if on the haggle page
    if (window.location.href.includes('haggle.phtml')) {
        await parseAndLogData();
    }
})();
