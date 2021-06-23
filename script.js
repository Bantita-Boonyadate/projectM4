document.getElementById('searchButton').addEventListener('click', (event) => {
	let name = document.getElementById('searchBox').value
	console.log(name)
	fetch(`https://api.jikan.moe/v3/search/anime?q=${name}`)
	.then((response) => {
		return response.json()
	}).then((data) => { 
		getMovie(data.results)
	})
})

function getMovie (data) {
    output.innerHTML = ''
    for (movies of data) {
        createCard (movies)
    }
}

function createCard (movies) {
    const output = document.getElementById('output')
    let card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('style', 'width : 18rem')
    let img = document.createElement('img')
    img.classList.add('card-img-top')
    img.setAttribute('src', movies.image_url)
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    let cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    cardTitle.innerHTML = movies.title
    let cardEpisodes = document.createElement('p')
    cardEpisodes.classList.add('card-episodes')
    cardEpisodes.innerHTML = 'Episodes: ' + movies.episodes
    let cardScore = document.createElement('p')
    cardScore.classList.add('card-score')
    cardScore.innerHTML = 'Score: ' + movies.score
    let button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-primary')
    button.setAttribute('type','button')
    button.addEventListener('dblclick', (event) => {
        let confirmMsg = confirm(`ท่านต้องการเพิ่มเรื่อง ${movies.title} ใช่หรือไม่`)
            if (confirmMsg) {
                addToList(movies)
            }
    })
    button.setAttribute('style', 'background-color: #CC5A1C; border: #CC5A1C;')
    button.innerText ='Add to List'
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardEpisodes)
    cardBody.appendChild(cardScore)
    cardBody.appendChild(button)
    card.appendChild(img)
    card.appendChild(cardBody)
    output.appendChild(card)
}

function addToList(movies) {
    let results = {
        id: "632110343",
        movie: {
            url: movies.url ,
            image_url: movies.image_url ,
            title: movies.title ,
            synopsis: movies.synopsis ,
            type: movies.type ,
            episodes: movies.episodes ,
            score: movies.score ,
            rated: movies.rated
        }
    }
    addListToDB(results)
}

function addListToDB(results) {
    fetch('https://se104-project-backend.du.r.appspot.com/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(results)
    }) .then((response) => {
        return response.json()
    }).then(data => {
        console.log('อัปเดตข้อมูลสำเร็จ')
    })
}