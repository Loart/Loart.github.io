// ==UserScript==
// @name         Bank Transaction History Logger
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Logs bank transactions in the game
// @author       You
// @match        https://www.neopets.com/bank.*
// @grant        none
// @run-at document-idle
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const initialBalance = getCurrentBalance();
        let currentBalance = initialBalance;

        function parseCurrency(currencyStr) {
            return parseInt(currencyStr.replace(/[^0-9]/g, ''), 10);
        }

        function logTransaction(type, amount) {
            let transactions = JSON.parse(localStorage.getItem('bankTransactions')) || [];
            currentBalance += (type === 'deposit' || type === 'interest' ? amount : -amount);
            transactions.push({
                type,
                amount,
                date: new Date().toISOString(),
                newBalance: currentBalance
            });
            if (transactions.length > 20) {
                transactions.shift();
            }
            localStorage.setItem('bankTransactions', JSON.stringify(transactions));
            updateDisplay();
        }

        function getCurrentBalance() {
            const balanceSpan = document.getElementById('txtCurrentBalance');
            return balanceSpan ? parseCurrency(balanceSpan.textContent) : 0;
        }

        function waitForElement(selector, callback) {
            const element = document.querySelector(selector);
            if (element) {
                return callback(element);
            }

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (!mutation.addedNodes) return;
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.matches && node.matches(selector)) {
                            observer.disconnect();
                            return callback(node);
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        function handleFormSubmit(event) {
            const form = event.target;
            const type = form.querySelector('input[type="hidden"][name="type"]').value;
            if (type === 'interest') {
                waitForElement('#txtDailyInterest', (interestElement) => {
                    const amount = parseCurrency(interestElement.textContent);
                    logTransaction(type, amount);
                });
            } else {
                const amountInput = form.querySelector('input[type="text"][name="amount"]');
                const amount = parseCurrency(amountInput.value);
                logTransaction(type, amount);
            }
            event.preventDefault();
        }

        function setupDisplay() {
            let displayContainer = document.getElementById('transactionLog');
            if (!displayContainer) {
                displayContainer = document.createElement('div');
                displayContainer.id = 'transactionLog';
                displayContainer.className = 'bank-upgrade bank-section-container';
                displayContainer.innerHTML = `
                    <div class="bank-upgrade-header bank-backing-header bank-backing-t4">
                        <h2>Transaction Log</h2>
                    </div>
                    <div class="bank-upgrade-body bank-backing-marble">
                        <center><table id="transactionTable" style="width: 75%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>New Balance</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                        </center>
                        <br>
                        <center><button id="clearLogButton" class="button-default__2020 button-yellow__2020 btn-single__2020" style="margin: 10px 0;">Clear Log</button></center>
                    </div>`;

                const targetDiv = document.querySelector('.bank-upgrade');
                if (targetDiv) {
                    targetDiv.parentNode.insertBefore(displayContainer, targetDiv.nextSibling);
                } else {
                    console.error('Target div for transaction log not found.');
                    return;
                }
            }

            document.getElementById('clearLogButton').addEventListener('click', function() {
                localStorage.removeItem('bankTransactions');
                localStorage.setItem('initialBalance', JSON.stringify(initialBalance));
                updateDisplay();
            });

            document.getElementById('frmDeposit')?.addEventListener('submit', handleFormSubmit);
            document.getElementById('frmWithdraw')?.addEventListener('submit', handleFormSubmit);
            document.getElementById('frmCollectInterest')?.addEventListener('submit', handleFormSubmit);
        }

        function updateDisplay() {
            const transactions = JSON.parse(localStorage.getItem('bankTransactions')) || [];
            const tbody = document.getElementById('transactionTable').querySelector('tbody');
            tbody.innerHTML = '';
            for (let i = transactions.length - 1; i >= 0; i--) {
                const transaction = transactions[i];
                const tr = document.createElement('tr');
                const formattedDate = new Date(transaction.date).toLocaleDateString();
                const formattedAmount = `${transaction.amount.toLocaleString()} NP`;
                const formattedBalance = transaction.newBalance.toLocaleString() + ' NP';
                const transactionType = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);

                tr.innerHTML = `<td><center>${formattedDate}</center></td>
                        <td><center>${transactionType}</center></td>
                        <td style="color: ${transaction.type === 'deposit' ? 'green' : transaction.type === 'withdraw' ? 'red' : 'blue'};"><center><b>${formattedAmount}<b></center></td>
                        <td><center>${formattedBalance}</center></td>`;
                tbody.appendChild(tr);
            }
        }

        setupDisplay();
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });

        if (!localStorage.getItem('initialBalanceLogged')) {
            logTransaction('initial', getCurrentBalance());
            localStorage.setItem('initialBalanceLogged', 'true');
        }

        updateDisplay();
    });
})();
