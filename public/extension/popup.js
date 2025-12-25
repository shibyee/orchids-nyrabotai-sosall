const DEFAULTS = {
    homeName: "111",
    bal: "1.22",
    delta: "-0.0274",
    pct: "-2.21",
    tokAmt: "0.01 SOL",
    tokUsd: "1.22",
    tokChg: "-0.03",
    badgeCount: "3",
    addr: "7fXB...Hin7",
    banner: "Meet Phantom Terminal, your new home for desktop trading",
    tokName: "Solana"
};

let currentData = { ...DEFAULTS };

function updateUI() {
    const data = currentData;
    
    // Display updates
    document.getElementById('disp-homeName').textContent = data.homeName;
    document.getElementById('disp-bal').textContent = data.bal;
    document.getElementById('disp-banner').textContent = data.banner;
    document.getElementById('disp-badgeCount').textContent = data.badgeCount;
    document.getElementById('disp-tokName').textContent = data.tokName;
    
    // Delta
    const deltaStr = String(data.delta);
    const deltaVal = deltaStr.replace('-', '').replace('+', '');
    const isNegDelta = deltaStr.startsWith('-');
    document.getElementById('disp-delta').textContent = deltaVal;
    document.getElementById('disp-delta-sign').textContent = isNegDelta ? "-$" : "+$";
    document.getElementById('disp-delta-color').style.color = isNegDelta ? "var(--down-color)" : "var(--up-color)";
    
    // Pct
    const pctStr = String(data.pct);
    const pctVal = pctStr.replace('-', '').replace('+', '');
    const isNegPct = pctStr.startsWith('-');
    document.getElementById('disp-pct').textContent = pctVal;
    document.getElementById('disp-pct-sign').textContent = isNegPct ? "-" : "+";
    document.getElementById('disp-pct-badge').className = "pct-badge " + (isNegPct ? "" : "up");
    
    // Token
    document.getElementById('disp-tokAmt').textContent = data.tokAmt;
    document.getElementById('disp-tokUsd').textContent = data.tokUsd;
    
    const chgStr = String(data.tokChg);
    const chgVal = chgStr.replace('-', '').replace('+', '');
    const isNegChg = chgStr.startsWith('-');
    document.getElementById('disp-tokChg').textContent = chgVal;
    document.getElementById('disp-tokChg-sign').textContent = isNegChg ? "-$" : "+$";
    document.getElementById('disp-tokChg-color').style.color = isNegChg ? "var(--down-color)" : "var(--up-color)";

    // Import PK screen address disp
    if (document.getElementById('import-addr-disp')) {
        document.getElementById('import-addr-disp').textContent = data.addr;
    }
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if (id) {
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
    }
}

function switchTab(tabId) {
    showScreen(null);
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const navItem = document.querySelector(`[data-tab="${tabId}"]`);
    if (navItem) navItem.classList.add('active');
}

function openEditor() {
    document.getElementById('edit-addr').value = currentData.addr;
    document.getElementById('edit-bal').value = currentData.bal;
    document.getElementById('edit-delta').value = currentData.delta;
    document.getElementById('edit-pct').value = currentData.pct;
    document.getElementById('edit-tokAmt').value = currentData.tokAmt;
    document.getElementById('edit-tokUsd').value = currentData.tokUsd;
    document.getElementById('edit-tokChg').value = currentData.tokChg;
    document.getElementById('edit-homeName').value = currentData.homeName;
    document.getElementById('edit-badgeCount').value = currentData.badgeCount;
    document.getElementById('edit-tokName').value = currentData.tokName;
    document.getElementById('edit-banner').value = currentData.banner;
    showScreen('s-editor');
}

function saveData() {
    currentData = {
        ...currentData,
        addr: document.getElementById('edit-addr').value,
        bal: document.getElementById('edit-bal').value,
        delta: document.getElementById('edit-delta').value,
        pct: document.getElementById('edit-pct').value,
        tokAmt: document.getElementById('edit-tokAmt').value,
        tokUsd: document.getElementById('edit-tokUsd').value,
        tokChg: document.getElementById('edit-tokChg').value,
        homeName: document.getElementById('edit-homeName').value,
        badgeCount: document.getElementById('edit-badgeCount').value,
        tokName: document.getElementById('edit-tokName').value,
        banner: document.getElementById('edit-banner').value,
    };
    
    updateUI();
    showScreen(null);
    switchTab('tab-home');
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ mockData: currentData });
    } else {
        localStorage.setItem('phantom_mock_data', JSON.stringify(currentData));
    }
}

window.onload = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['mockData'], (res) => {
            if (res.mockData) {
                currentData = { ...DEFAULTS, ...res.mockData };
                updateUI();
            }
        });
    } else {
        const saved = localStorage.getItem('phantom_mock_data');
        if (saved) {
            currentData = { ...DEFAULTS, ...JSON.parse(saved) };
            updateUI();
        }
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.getAttribute('data-tab'));
        });
    });

    document.getElementById('btn-s1-close')?.addEventListener('click', () => showScreen(null));
    document.getElementById('btn-s1-close-bottom')?.addEventListener('click', () => showScreen(null));
    document.getElementById('badge-account')?.addEventListener('click', () => showScreen('s1'));
    
    document.getElementById('item-import-phrase')?.addEventListener('click', () => openEditor());
    document.getElementById('item-import-pk')?.addEventListener('click', () => showScreen('s-import-pk'));
    document.getElementById('btn-import-pk-action')?.addEventListener('click', () => {
        showScreen(null);
        switchTab('tab-home');
    });

    document.getElementById('banner-close')?.addEventListener('click', (e) => {
        document.getElementById('banner').style.display = 'none';
    });
    document.getElementById('btn-editor-back')?.addEventListener('click', () => showScreen('s1'));
    document.getElementById('btn-save')?.addEventListener('click', () => saveData());

    updateUI();
};