const searchField = document.querySelector("input[type='search']");

// ------------------------------------------------------------------------------------------------------

// GETTING DATA FROM CAFE API & PLACE API 
async function getDataFromApi(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw Error(res.statusText)
        const data = await res.json();
        return data;
    } catch (error) { console.log(error); }
}

// ------------------------------------------------------------------------------------------------------

// DISPLAYS ALL THE DATA IN TABULAR FORM FOR EVERY UPDATE AND RELOAD/PAGE-REFRESH
function displayingData(cafeList, pname) {
    const fileredCafePlaces = cafeList.reduce((arr, cafe) => {
        pname.forEach((place) => {
            if (cafe.location_id == place.id) {
                let tempObj = {};
                tempObj.name = cafe.name
                tempObj.locality = place.locality;
                tempObj.postal_code = place.postal_code
                tempObj.lat = place.lat
                tempObj.long = place.long
                arr.push(tempObj)
            }
        })
        return arr;
    }, []);

    let text = '';
    let tbody = document.querySelector('tbody');
    //WE CAN SECURELY USE 'innerHTMl' WHEN WE SURE ABOUT THAT THE DATA IS COMING FROM A TRUSTED SOURCE
    fileredCafePlaces.forEach((final, i) => {
        text += `
        <tr>
        <td class="col-1">${i + 1}.</td>
        <td class="col-2">${final.name}</td>
        <td class="col-3">${final.locality}</td>
        <td class="col-4">${final.postal_code}</td>
        <td class="col-5">${final.lat}</td>
        <td class="col-6">${final.long}</td>
        </tr>
        `;
    })
    tbody.innerHTML = text;
}


// ------------------------------------------------------------------------------------------------------


//DISPLAYS THE DATA ON EVERY LOAD/PAGE-REFRESH
document.addEventListener('DOMContentLoaded', async () => {
    // GETTING DATA FROM CAFE FETCH METHOD
    const cname = await getDataFromApi('https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/cafes.json');
    // GETTING DATA FROM PLACE FETCH METHOD
    const pname = await getDataFromApi('https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/places.json');

    displayingData(cname.cafes, pname.places)
}, false);


// ------------------------------------------------------------------------------------------------------


// SHOWING RESULT ON EVERY KEY STROKE 
searchField.addEventListener('keyup', (e) => {
    searchValue = e.target.value;

    // PLACE ALL ID'S ARE DIFFERENT BUT CAFE'S SOME ID'S ARE REDUNDANT
    async function main() {
        // GETTING DATA FROM CAFE FETCH METHOD
        const cafeList = await getDataFromApi('https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/cafes.json');

        // MAKING CASE INSENSITIVE BY SEARCING THE INPUTTED VALUE WITH THE CAFE'S NAME AVAILABLE
        const cname = cafeList.cafes.filter((cafe) => {
            return cafe.name.toLowerCase().includes(searchValue.toLowerCase())
        });

        // GETTING DATA FROM PLACE FETCH METHOD
        const pname = await getDataFromApi('https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/places.json');

        if (cname.length != 0) {
            document.querySelector('.not_found').textContent = ''
            // GETTING THE VALUE ON "COMPARING THE location_id OF CAFE TO id OF PLACE"
            displayingData(cname, pname.places);
        }
        else {
            document.querySelector('tbody').innerHTML = '';
            document.querySelector('.not_found').innerHTML = `
            <h1>NOT FOUND!</h1> <br> TRY SEARCHING WITH ANOTHER KEYWORD`;
        }
    }
    //SHOWING RESULT WHEN SEARCH VALUE IS EMPTY
    if (searchValue != '' || searchValue == '') {
        main()
    }
})


