document.addEventListener('DOMContentLoaded', () => {
    const followersInput = document.getElementById('followers');
    const followingInput = document.getElementById('following');
    const resultTableBody = document.querySelector('#result tbody');
    const checkUnfollowButton = document.getElementById('checkUnfollow');
    const resetAllButton = document.getElementById('resetAll');
    const filterAZ = document.getElementById('filterAZ');
    const filterZA = document.getElementById('filterZA');

    let followersData = [];
    let followingData = [];
    let notFollowingBack = [];

    // Load saved data from localStorage if available
    if (localStorage.getItem('unfollowers')) {
        notFollowingBack = JSON.parse(localStorage.getItem('unfollowers'));
        displayResult(notFollowingBack);
    }

    function extractUsernames(data) {
        return data.map(item => item.string_list_data[0].value);
    }

    followersInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileType = file.name.split('.').pop();
                if (fileType === 'json') {
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        followersData = extractUsernames(jsonData);
                        console.log('Followers Data Loaded:', followersData);
                    } catch (error) {
                        alert('Ganti nama file menjadi "followers" dan unggah file JSON yang valid.');
                        followersData = [];
                    }
                } else if (fileType === 'html') {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(e.target.result, 'text/html');
                    followersData = Array.from(doc.querySelectorAll('a[href^="https://www.instagram.com/"]')).map(el => el.textContent.trim());
                    console.log('Followers Data Loaded from HTML:', followersData);
                }
            };
            reader.readAsText(file);
        }
    });

    followingInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileType = file.name.split('.').pop();
                if (fileType === 'json') {
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        followingData = extractUsernames(jsonData.relationships_following);
                        console.log('Following Data Loaded:', followingData);
                    } catch (error) {
                        alert('Ganti nama file menjadi "following" dan unggah file JSON yang valid.');
                        followingData = [];
                    }
                } else if (fileType === 'html') {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(e.target.result, 'text/html');
                    followingData = Array.from(doc.querySelectorAll('a[href^="https://www.instagram.com/"]')).map(el => el.textContent.trim());
                    console.log('Following Data Loaded from HTML:', followingData);
                }
            };
            reader.readAsText(file);
        }
    });

    checkUnfollowButton.addEventListener('click', () => {
        if (followersData.length === 0 || followingData.length === 0) {
            alert('Please upload both followers and following data.');
            return;
        }

        const followersSet = new Set(followersData);
        notFollowingBack = followingData.filter(user => !followersSet.has(user));

        displayResult(notFollowingBack);

        localStorage.setItem('unfollowers', JSON.stringify(notFollowingBack));
    });

    function displayResult(notFollowingBack) {
        resultTableBody.innerHTML = '';
        if (notFollowingBack.length === 0) {
            resultTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No unfollowers found.</td></tr>';
            return;
        }

        notFollowingBack.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user}</td>
                <td><a href="https://www.instagram.com/${user}" target="_blank">Lihat Profile</a></td>
            `;
            resultTableBody.appendChild(row);
        });
    }

    resetAllButton.addEventListener('click', () => {
        localStorage.removeItem('unfollowers');
        notFollowingBack = [];
        displayResult(notFollowingBack);
    });

    filterAZ.addEventListener('click', () => {
        notFollowingBack.sort();
        displayResult(notFollowingBack);
    });

    filterZA.addEventListener('click', () => {
        notFollowingBack.sort().reverse();
        displayResult(notFollowingBack);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('themeSwitch');
    const body = document.body;

    // Set initial theme based on user preference or default to light
    let currentTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(currentTheme + '-theme');

    // Update button text based on the current theme
    themeSwitch.textContent = currentTheme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme';

    themeSwitch.addEventListener('click', () => {
        // Toggle theme
        currentTheme = body.classList.contains('light-theme') ? 'dark' : 'light';

        // Update body class
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');

        // Save current theme in localStorage
        localStorage.setItem('theme', currentTheme);

        // Update button text
        themeSwitch.textContent = currentTheme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme';
    });
});