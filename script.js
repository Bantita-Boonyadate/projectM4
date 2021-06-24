function onLoad() {
    hideAll()
}
document.getElementById('searchButton').addEventListener('click', (event) => {
    const output = document.getElementById('output')
    output.style.display = 'flex'
    const myList = document.getElementById('myList')
    myList.innerHTML=''
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
    img.setAttribute('style', 'height: 25rem;')
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
    let cardButtonHome = document.createElement('div')
    cardButtonHome.classList.add('cardButtonHome') 
    let button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-primary')
    button.setAttribute('type','button')
    button.addEventListener('dblclick', (event) => {
        let confirmMsg = confirm(`ท่านต้องการเพิ่มภาพยนตร์เรื่อง ${movies.title} ใช่หรือไม่`)
            if (confirmMsg) {
                addToList(movies)
                hideAll()
                getListFromDB() 
            }
    })
    button.setAttribute('style', 'background-color: #FF007E; border: #FF007E;')
    button.innerText ='Add to Favorite'
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardEpisodes)
    cardBody.appendChild(cardScore)
    cardButtonHome.appendChild(button)
    cardBody.appendChild(cardButtonHome)
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

function getListFromDB() {
    fetch(`https://se104-project-backend.du.r.appspot.com/movies/632110343`)
	.then((response) => {
		return response.json()
	}).then((data) => { 
		getMyList(data)
	})
}

function getMyList(data) {
    myList.innerHTML = ''
    for (movies of data) {
        createCardMyList (movies)
    }
}

function createCardMyList(movies) {
    const myList = document.getElementById('myList')
    let card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('style', 'width : 18rem')
    let img = document.createElement('img')
    img.classList.add('card-img-top')
    img.setAttribute('src', movies.image_url)
    img.setAttribute('style', 'height: 25rem;')
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
    let cardButton = document.createElement('div')
    cardButton.classList.add('cardButton')
    let detailButton = document.createElement('button')
    detailButton.classList.add('btn')
    detailButton.classList.add('btn-primary')
    detailButton.setAttribute('style', 'margin-right: 8px; background-color: #3E8F55; border: #3E8F55;')
    detailButton.setAttribute('type','button')
    detailButton.setAttribute('id','detailButton')
    detailButton.addEventListener('click', (event) => {
        myList.innerHTML = ''
        const detail = document.getElementById('detail')
        detail.style.display = 'flex'
        showOneDetail(movies.id)
    })
    detailButton.innerText ='Details'
    let deleteButton = document.createElement('button')
    deleteButton.classList.add('btn')
    deleteButton.classList.add('btn-danger')
    deleteButton.setAttribute('type','button')
    deleteButton.addEventListener('click', (event) => {
        let confirmMsg = confirm(`ท่านต้องการลบภาพยนตร์เรื่อง ${movies.title} ใช่หรือไม่`)
            if (confirmMsg) {
                 deleteMyList(movies.id)
            }
    })
    deleteButton.innerText ='Delete'
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardEpisodes)
    cardBody.appendChild(cardScore)
    cardButton.appendChild(detailButton)
    cardButton.appendChild(deleteButton)
    cardBody.appendChild(cardButton)
    card.appendChild(img)
    card.appendChild(cardBody)
    myList.appendChild(card)
}

function hideAll() {
    const output = document.getElementById('output')
    output.style.display = 'none'
    const detail = document.getElementById('detail')
    detail.style.display = 'none'
}

document.getElementById('homeMenu').addEventListener('click', (event) => {
    location.reload() //refresh หน้า home ใหม่ เวลากดที่ my list แล้วกลับมากดที่ home อีกครั้ง
})

document.getElementById('myListMenu').addEventListener('click', (event) => {
    hideAll()
    getListFromDB()
})

function deleteMyList(id) {
    fetch(`https://se104-project-backend.du.r.appspot.com/movie?id=632110343&&movieId=${id}`, {
        method: 'DELETE'
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
    }).then(data => { //data มาจากที่เรา fetchข้อมูลมาแล้วมาเก็บไว้ที่ตัว data
        alert(`ภาพยนตร์เรื่อง ${data.title} ถูกลบสำเร็จแล้ว`)
        myList.innerHTML = ''
        getListFromDB()
    })
}

function showOneDetail(id) {
    fetch(`https://se104-project-backend.du.r.appspot.com/movie/632110343/${id}`, {
        method: 'GET'
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
    }).then(data => {
       document.getElementById('image_url').src = data.image_url
       document.getElementById('title').innerHTML = data.title
       document.getElementById('synopsis').innerHTML = data.synopsis
       document.getElementById('type').innerHTML = data.type
       document.getElementById('episodes').innerHTML = data.episodes
       document.getElementById('score').innerHTML = data.score
       document.getElementById('rated').innerHTML = data.rated
    })
}
document.getElementById('backButton').addEventListener('click',(e)=>{
    document.getElementById('myListMenu').click()
})
