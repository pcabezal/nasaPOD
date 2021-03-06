const imagePlacer = document.querySelector('img')
const videoPlacer = document.querySelector('iframe')
const datePlacer = document.querySelector('h2')
const descriptionPlacer = document.querySelector('h3')
const titlePlacer = document.querySelector('#title')
const stopButton = document.querySelector('#stop')
const goButton = document.querySelector('#go')

function getDate(range, oneOrStartYear) { 
    temp = Math.floor(Math.random()*range) + oneOrStartYear;
    return (temp > 9) ? temp.toString() : `0` + temp;
  }

function getFetch(){
    year = getDate(26, 1997); // selects starting from 1997
    month = getDate(12, 1);
    day = getDate(31, 1);
    choice = year + `-` + month + `-` + day;
            
    const url = `https://api.nasa.gov/planetary/apod?api_key=w8jtpDdC9YBTsCkPYfkkipoXxKJW6cTBZoe4t2S5&thumbs&date=${choice}`;

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            imagePlacer.style.display = 'none';
            videoPlacer.style.display = 'none';
            datePlacer.innerText = data.date;
            imagePlacer.title = ``;
            if (data.code == 400 || data.code == 404) {
                getFetch();                
            } else if (data.media_type == 'image') {
                imagePlacer.style.display = 'block';
                imagePlacer.src = data.hdurl    
                if (data.copyright) imagePlacer.title = `Copyright: ` + data.copyright;
            } else if (data.media_type == 'video') {
                videoPlacer.style.display = 'block';
                videoPlacer.src = data.url;          
            }   
            titlePlacer.innerText = data.title;
            descriptionPlacer.innerText = data.explanation; 
            
        })
        .catch(err => {
            console.log(`error ${err}`);
        })
}

let myInterval;
let timer = 10000;

function myStart() {
    clearInterval(myInterval);
    getFetch();
    myInterval = setInterval(getFetch, timer);
    goButton.removeEventListener('click', myStart);
    goButton.style.opacity = "30%";
    goButton.style.cursor = "";
    stopButton.style.opacity = "87%";
    stopButton.style.cursor= "pointer";
}

function myStop() {
    clearInterval(myInterval);
    goButton.addEventListener('click', myStart);
    stopButton.style.opacity = "30%";
    stopButton.style.cursor= "";
    goButton.style.opacity = "87%";
    goButton.style.cursor = "pointer";
}

myStart();
goButton.addEventListener('click', myStart);
stopButton.addEventListener('click', myStop);