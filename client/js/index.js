// Client Side Javascript

// GET method /data
// when the website is loaded, data from a json file is fetched from the server
window.table = async function () {
    try {
        /* send get request */
        var response = await fetch('http://127.0.0.1:8090/data');
        // response.ok = true if the HTTP status code is 200-299
        if (response.ok) {
            var data = JSON.parse(await response.text());
            const table = document.querySelector('table');
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';
            /* sort data by date in descending order */
            data.sort((a, b) => (a.Order > b.Order) ? -1 : 1);
            /* getting the 10 most recent results */
            var ten = [];
            for (let i = 0; i < 10; i++) {
                ten.push(data[i]);
            }
            /* amend table with 10 most recent results */
            ten.forEach(entry => {
                tbody.insertAdjacentHTML('beforeend',
                    `<tr class="trow">
                        <td class="Date">${entry.Date}</td>
                        <td class="Home">${entry.Home}</td>
                        <td class="Team">${entry.HomeTeam}</td>
                        <td class="Score">${entry.Score}</td>
                        <td class="Away">${entry.Away}</td>
                        <td class="Team">${entry.AwayTeam}</td>
                    </tr>`);
            });
            console.log('Successfully updated table with new data');
        } else {
            const searchBtn = document.getElementById('searchBtn');
            searchBtn.disabled = true;
            const refreshBtn = document.getElementById('refreshBtn');
            refreshBtn.disabled = true;
            const addBtn = document.getElementById('addBtn');
            addBtn.disabled = true;
            const spin1 = document.getElementById('spin1');
            spin1.innerHTML = `Error: ${response.status} </br> Please try again later.`;
            spin1.classList = 'alert alert-danger';
            spin1.role = 'alert';
        }
    } catch (error) {
        const searchBtn = document.getElementById('searchBtn');
        searchBtn.disabled = true;
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.disabled = true;
        const addBtn = document.getElementById('addBtn');
        addBtn.disabled = true;
        const spin1 = document.getElementById('spin1');
        spin1.innerHTML = `${error} </br> Please try again later.`;
        spin1.classList = 'alert alert-danger';
        spin1.style = 'position: relative; top: 100px; left:35%;';
        spin1.role = 'alert';
    }
};

/***************************************************************************************/

// POST method /adddata
// when the results add form is submited, a post request is sent to the server
const addForm = document.getElementById('addForm');
addForm.addEventListener('submit', async function (event) {
    try {
        // stop default form action (client-side)
        event.preventDefault();
        const addBtn = document.getElementById('addBtn');
        addBtn.disabled = true;
        addBtn.innerHTML = 'Adding...';
        /* extract input term from form and check all values input */
        var Day = document.getElementById('Day').value;
        var Month = document.getElementById('Month').value;
        var Year = document.getElementById('Year').value;
        var Date = `${Day}-${Month}-${Year}`;
        var Order = `${Year}-${Month}-${Day}`;
        var Home = document.getElementById('Home').value;
        var HomeTeam = `${document.getElementById('HomeCollege').value} ${document.getElementById('HomeRank').value}`;
        var Score = document.getElementById('Score').value;
        var Away = document.getElementById('Away').value;
        var AwayTeam = `${document.getElementById('AwayCollege').value} ${document.getElementById('AwayRank').value}`;
        var newdata = {
            Order: Order,
            Date: Date,
            Home: Home,
            HomeTeam: HomeTeam,
            Score: Score,
            Away: Away,
            AwayTeam: AwayTeam
        };
        /* send post request */
        var response = await fetch('http://127.0.0.1:8090/adddata', {
            method: 'POST',
            body: JSON.stringify(newdata),
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        // response.ok = true if the HTTP status code is 200-299
        if (response.ok) {
            window.table();
            addBtn.innerHTML = 'Success';
            setTimeout(function () {
                addBtn.disabled = false;
                addBtn.innerHTML = 'Add';
                addForm.reset();
            }, 2000);
        } else {
            addBtn.className = 'col btn btn-outline-danger my-2 my-sm-0';
            addBtn.style = 'max-width: 200px';
            addBtn.innerHTML = `Error: ${response.status}<br/>Please try again.`;
            setTimeout(function () {
                addBtn.className = 'col btn btn-outline-success my-2 my-sm-0';
                addBtn.style = 'max-width: fit-content';
                addBtn.disabled = false;
                addBtn.innerHTML = 'Add';
            }, 3000);
        }
    } catch (error) {
        window.alert(error);
    }
});

/***************************************************************************************/

// GET method /search
// when the results add form is submited, a post request is sent to the server with the parameters in the body
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', async function (event) {
    // stop default form action (client-side)
    event.preventDefault();
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.disabled = true;
    searchBtn.innerHTML = 'Getting data from server...';
    /* extract searh term from form */
    const keyword = document.getElementById('keyword').value;
    /* send get request */
    var response = await fetch(`http://127.0.0.1:8090/search?keyword=${keyword}`);
    // response.ok = true if the HTTP status code is 200-299
    if (response.ok) {
        var data = JSON.parse(await response.text());
        // eslint-disable-next-line eqeqeq
        if (data != '') {
            const table = document.querySelector('table');
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';
            /* sort data by date in descending order */
            data.sort((a, b) => (a.Order > b.Order) ? -1 : 1);
            /* getting the 10 most recent results */
            var ten = [];
            for (let i = 0; i < data.length; i++) {
                if (i < 10) {
                    ten.push(data[i]);
                };
            };
            /* amend table with 10 most recent results */
            ten.forEach(entry => {
                tbody.insertAdjacentHTML('beforeend',
                    `<tr class="trow">
                        <td class="Date">${entry.Date}</td>
                        <td class="Home">${entry.Home}</td>
                        <td class="Team">${entry.HomeTeam}</td>
                        <td class="Score">${entry.Score}</td>
                        <td class="Away">${entry.Away}</td>
                        <td class="Team">${entry.AwayTeam}</td>
                    </tr>`);
            });
            const desc = document.getElementById('desc');
            desc.innerHTML = 'Updated table with search results';
            searchBtn.innerHTML = 'Done';
            setTimeout(function () {
                searchBtn.disabled = false;
                searchBtn.innerHTML = 'Search';
            }, 2000);
        } else {
            searchBtn.innerHTML = `No results found for ${keyword}.`;
            searchBtn.className = 'col btn btn-outline-danger my-2 my-sm-0';
            setTimeout(function () {
                searchBtn.disabled = false;
                searchBtn.className = 'col btn btn-outline-success my-2 my-sm-0';
                searchBtn.innerHTML = 'Search';
            }, 2000);
        }
    } else {
        searchBtn.className = 'col btn btn-outline-danger my-2 my-sm-0';
        searchBtn.style = 'min-width: 200px';
        searchBtn.innerHTML = `Error: ${response.status} Please try again.`;
        setTimeout(function () {
            searchBtn.className = 'col btn btn-outline-success my-2 my-sm-0';
            searchBtn.disabled = false;
            searchBtn.style = 'min-width:fit-content';
            searchBtn.innerHTML = 'Search';
        }, 3000);
    }
});

const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', function () {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = 'Getting data from server...';
    window.table();
    const desc = document.getElementById('desc');
    desc.innerHTML = 'Table below shows the 10 latest matches';
    refreshBtn.innerHTML = 'Updated';
    setTimeout(function () {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = 'Refresh';
    }, 2000);
});
/***************************************************************************************/

// The Carousel plugin is a component for cycling through elements, like a carousel (slideshow)
// https://www.w3schools.com/w3css/w3css_slideshow.asp (9/4/2020)
var myIndex = 0;
function carousel () {
    var i;
    const x = document.getElementsByClassName('mySlides');
    for (i = 0; i < x.length; i++) {
        x[i].style.display = 'none';
    }
    myIndex++;
    if (myIndex > x.length) {
        myIndex = 1;
    }
    x[myIndex - 1].style.display = 'block';
    setTimeout(carousel, 5000); // Change image every 5 seconds
}

/***************************************************************************************/

// GET method /imgs
// when the website is loaded, web addresses of images from a json file is fetched from the server
window.gallery = async function () {
    try {
        /* send get request */
        var response = await fetch('http://127.0.0.1:8090/imgs');
        // response.ok = true if the HTTP status code is 200-299
        if (response.ok) {
            var data = JSON.parse(await response.text());
            const imgs = document.querySelector('.w3-content');
            imgs.innerHTML = '';
            window.myIndex = 0;
            /* amend table with 10 most recent results */
            data.forEach(entry => {
                imgs.insertAdjacentHTML('afterbegin',
                    `<img class="mySlides" src="${entry.url}" style=" height: 100%; width: 100%" >`);
            });
            console.log('Successfully updated table with new data');
            carousel();
        } else {
            const imgBtn = document.getElementById('imgBtn');
            imgBtn.disabled = true;
            const spin2 = document.getElementById('spin2');
            spin2.innerHTML = `Error: ${response.status} </br> Please try again later.`;
            spin2.classList = 'alert alert-danger';
            spin2.role = 'alert';
        }
    } catch (error) {
        const imgBtn = document.getElementById('imgBtn');
        imgBtn.disabled = true;
        const spin2 = document.getElementById('spin2');
        spin2.innerHTML = `${error} </br> Please try again later.`;
        spin2.classList = 'alert alert-danger';
        spin2.style = 'text-align:center; max-width:fit-content; left: 40%;';
        spin2.role = 'alert';
    }
};

/***************************************************************************************/

// POST method /addimg
// when the img form is submited, a post request is sent to the server with the parameters in the body
const imgForm = document.getElementById('imgForm');
imgForm.addEventListener('submit', async function (event) {
    try {
        // stop default form action (client-side)
        event.preventDefault();
        const imgBtn = document.getElementById('imgBtn');
        imgBtn.disabled = true;
        imgBtn.innerHTML = 'Adding...';
        /* extract input term from form and check all values input */
        const url = document.getElementById('url').value;
        const newData = {
            url: url
        };
        /* send post request */
        var response = await fetch('http://127.0.0.1:8090/addimg', {
            method: 'POST',
            body: JSON.stringify(newData),
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        // response.ok = true if the HTTP status code is 200-299
        if (response.ok) {
            window.gallery();
            imgBtn.innerHTML = 'Success';
            setTimeout(function () {
                imgBtn.disabled = false;
                imgBtn.innerHTML = 'Add';
                imgForm.reset();
            }, 2000);
        } else {
            imgBtn.className = 'col btn btn-outline-danger my-2 my-sm-0';
            imgBtn.style = 'min-width: 200px';
            imgBtn.innerHTML = '404 Please try again.';
            setTimeout(function () {
                imgBtn.className = 'col btn btn-outline-success my-2 my-sm-0';
                imgBtn.disabled = false;
                imgBtn.style = 'min-width:fit-content';
                imgBtn.innerHTML = 'Add';
            }, 3000);
        }
    } catch (e) {
        window.alert(e);
    }
});

/***************************************************************************************/
// Send get requests from server
function start () {
    window.table();
    window.gallery();
};

/***************************************************************************************/
window.toggle = function () {
    const x = document.getElementById('myDIV');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
};

const addNewBtn = document.getElementById('addNewBtn');
addNewBtn.addEventListener('click', function () {
    window.toggle();
});

window.onload = start();
