// ==UserScript==
// @name         Neo Gallery CSV Extract
// @namespace    Loart.github.io
// @version      1
// @description  Feed me spreadsheet addiction
// @author       Loart
// @grant        none
// @match        *://www.neopets.com/gallery/quickremove.phtml*
// ==/UserScript==

(function() {
    'use strict';

    function downloadCSV(csv, filename) {
        let csvFile;
        let downloadLink;

        csvFile = new Blob([csv], {type: "text/csv"});

        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    function exportTableToCSV(filename) {
        var csv = [];
        var targetedTables = Array.from(document.querySelectorAll('table'));

        for (var table of targetedTables) {
            var headerRow = table.querySelector('tr');
            if (headerRow && headerRow.style.backgroundColor === 'rgb(204, 204, 204)' && headerRow.style.fontWeight === 'bold') {
                var headerCells = headerRow.querySelectorAll('td');
                if (headerCells.length >= 4 && headerCells[2].textContent.trim() === 'Item Name' && headerCells[3].textContent.trim() === 'Amount') {
                    var rows = table.querySelectorAll("tr");
                    for (var i = 1; i < rows.length; i++) {
                        var row = [], cols = rows[i].querySelectorAll("td");
                        if (cols.length > 3) {
                            row.push(cols[2].innerText.trim());
                            let quantityInput = cols[3].querySelector('input[type="text"]');
                            row.push(quantityInput ? quantityInput.value.trim() : '0');
                            csv.push(row.join(","));
                        }
                    }
                }
            }
        }

        if (csv.length > 0) {
            downloadCSV(csv.join("\n"), filename);
        } else {
            alert('No valid table found.');
        }
    }

    const button = document.createElement("button");
    button.textContent = "Export to CSV";
    button.onclick = function () {
        exportTableToCSV("export.csv");
    };
    button.style.margin = "auto";
    button.style.display = "block";
    const container = document.createElement("div");
    container.style.textAlign = "center";
    container.appendChild(button);

    const targetParagraph = Array.from(document.querySelectorAll('p')).find(p => p.innerHTML.includes('Toggle View Images'));
    if (targetParagraph) {
        targetParagraph.parentNode.insertBefore(container, targetParagraph.nextSibling);
    }
})();
