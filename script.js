function onLoad() {
    hideAll() 
}
document.getElementById('searchButton').addEventListener('click', (event) => {
    const output = document.getElementById('output') //เมื่อกดปุ่มsearch ให้ตัวhtml id=output แสดงผลเป็นflex
    output.style.display = 'flex'
    const myList = document.getElementById('myList') //เคลียร์ข้างในตัว html id=myListก่อน เพื่อเวลากดsearchในหน้า Favorite ค่าในlist จะไม่ทับกับข้อมูลในlistของเรา
    myList.innerHTML=''
    let name = document.getElementById('searchBox').value
	console.log(name)
	fetch(`https://api.jikan.moe/v3/search/anime?q=${name}`) //มาจาก GET 01.anime api search 
	.then((response) => {
		return response.json()
	}).then((data) => { //data เป็นค่าที่รับมาจากการfetch
		getMovie(data.results) //results มาจากตอน GET ใน DB ตัวแปรresultsใช้เก็บกลุ่มข้อมูลต่างๆของภาพยนตร์เอาไว้ จึงเรียกdata.resultsแบบเจาะจง
	})
})

function getMovie (data) {
    output.innerHTML = '' //เป็นการเคลียร์ค่าข้างในตัวHTMLอันก่อนหน้าก่อนจะเริ่มลูปข้อมูล
    for (movies of data) { //ลูปข้อมูล โดย movies คือ ภาพยนตร์นั้นๆ บรรทัดนี้ เช็คค่าว่าmoviesมีอยู่ในdataหรือไม่ ถ้ามีให้สร้างcardออกมา ทำจนกว่าจะหลุดลูป
        createCard (movies)
    }
}

function createCard (movies) {
    const output = document.getElementById('output')
    let card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('style', 'width : 18rem')
    let img = document.createElement('img') //โปสเตอร์ภาพยนตร์
    img.classList.add('card-img-top')
    img.setAttribute('src', movies.image_url)
    img.setAttribute('style', 'height: 25rem;')
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    let cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title') //ชื่อเรื่อง
    cardTitle.innerHTML = movies.title
    let cardEpisodes = document.createElement('p')
    cardEpisodes.classList.add('card-episodes') //จำนวนตอน
    cardEpisodes.innerHTML = 'Episodes: ' + movies.episodes
    let cardScore = document.createElement('p')
    cardScore.classList.add('card-score') //คะแนน
    cardScore.innerHTML = 'Score: ' + movies.score
    let cardButtonHome = document.createElement('div')
    cardButtonHome.classList.add('cardButtonHome') 
    let button = document.createElement('button')
    button.classList.add('btn') //ปุ่ม Add to Favorite
    button.classList.add('btn-primary')
    button.setAttribute('type','button')
    button.addEventListener('dblclick', (event) => { //เมื่อ double Click ที่ปุ่ม Add to Favorite
        let confirmMsg = confirm(`ท่านต้องการเพิ่มภาพยนตร์เรื่อง ${movies.title} ใช่หรือไม่`)
            if (confirmMsg) { //ระบบแสดง confirm box เพื่อถามความต้องการของผู้ใช้
                addToList(movies) //ฟังก์ชันสำหรับเพิ่มภาพยนตร์ที่เลือกเข้า Favorite ของตัวเอง
                hideAll() //ฟังก์ชันสำหรับทำให้ข้อมูลทั้งหมดถูกซ่อนเอาไว้
                getListFromDB() //ฟังก์ชันสำหรับการดึงข้อมูลออกมาจากDB แล้วนำมาแสดงในหน้า Favorite
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

function addToList(movies) { //ฟังก์ชันสำหรับเพิ่มภาพยนตร์ที่เลือกเข้า Favorite ของตัวเอง
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
    addListToDB(results) //ฟังก์ชันสำหรับการเพิ่มlist ที่ผู้ใช้เลือกไว้ใน Favorite ลงในDB 
}

function addListToDB(results) {
    fetch('https://se104-project-backend.du.r.appspot.com/movies', { //ค่า results ที่ถูกส่งมาจาก addToList จะถูกเพิ่มไปที่ POST 02.Post Movie
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

function getListFromDB() { //ฟังก์ชันรับค่าที่มาจาก 02. Post Movie ในDB ไป GET 03.get movie
    fetch(`https://se104-project-backend.du.r.appspot.com/movies/632110343`)
	.then((response) => {
		return response.json()
	}).then((data) => { 
		getMyList(data) //ฟังก์ชันในการรับภาพยนตร์แล้วเชคค่าโดยการลูปข้อมูล
	})
}

function getMyList(data) { 
    myList.innerHTML = ''
    for (movies of data) { 
        createCardMyList (movies)
    }
}

function createCardMyList(movies) { //สร้างcardของFavoriteออกมา
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
    detailButton.classList.add('btn') //ปุ่มdetails
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
    deleteButton.classList.add('btn') //ปุ่มdelete
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

function hideAll() { //ฟังก์ชันในการซ่อนค่าต่างๆในโปรแกรม
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

function deleteMyList(id) { //ฟังก์ชันลบlistใน Favorite 
    fetch(`https://se104-project-backend.du.r.appspot.com/movie?id=632110343&&movieId=${id}`, {
        method: 'DELETE' //เรียกใช้ในDBจาก DELETE 04.remove movies (with id)
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
    }).then(data => { //data มาจากที่เรา fetchข้อมูลมาแล้วมาเก็บไว้ที่ตัว data
        alert(`ภาพยนตร์เรื่อง ${data.title} ถูกลบสำเร็จแล้ว`)
        myList.innerHTML = ''
        getListFromDB() //ฟังก์ชันรับค่าที่มาจาก02. Post Movie ในDB ไป GET 03.get movie
    })
}

function showOneDetail(id) { //ฟังก์ชันในการโชว์detailของภาพยนตร์ที่เราเลือกไว้ในหน้า Favorite
    fetch(`https://se104-project-backend.du.r.appspot.com/movie/632110343/${id}`, {
        method: 'GET' //เรียกใช้ในDBจาก GET 04.get individual movie details
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
    }).then(data => { //แสดงรายละเอียดของภาพยนตร์ในหน้า detail 
       document.getElementById('image_url').src = data.image_url //โปสเตอร์ภาพยนตร์
       document.getElementById('title').innerHTML = data.title //ชื่อเรื่อง
       document.getElementById('synopsis').innerHTML = data.synopsis //เรื่องย่อ
       document.getElementById('type').innerHTML = data.type //ประเภทภาพยนตร์
       document.getElementById('episodes').innerHTML = data.episodes //จำนวนตอน
       document.getElementById('score').innerHTML = data.score //คะแนน
       document.getElementById('rated').innerHTML = data.rated //rate
    })
}

document.getElementById('backButton').addEventListener('click',(event)=>{ //เมื่อกดปุ่ม Back to List
    document.getElementById('myListMenu').click() //กดปุ่ม Back to List จะลิ้งค์ไปหน้า Favorite
})
