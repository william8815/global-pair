const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const cards = document.querySelector('#cards')
let userList = []
let filterUsers = []
const user_per_page = 36
const paginator = document.querySelector('#paginator')
// api 取得user資訊
axios.get(INDEX_URL).then((response) => {
  userList = response.data.results
  showUser(pageShow(1))
  pageCreate(userList.length)
  heartattack()
}).catch((error) => {
  console.log(error)
})
// card function
function showUser(users) {
  let tempStr = ''
  users.forEach((user) => {
    tempStr += `
      <div class="col-sm-2" class='card'>
        <div class="card mt-3 text-center">
          <img src="${user.avatar}" class="cardImg card-img-top" alt="selfie" data-bs-toggle="modal" data-bs-target="#modal-show" data-id="${user.id}">
          <div class="card-body d-flex align-items-center py-0">
            <h5 class="card-title">${user.name} ${user.surname}</h5>
          </div>
          <div>
           <i class="fs-3 fa-solid fa-heart mb-3 heart-add" id="${user.id}"></i>
           </div>
        </div>
      </div>`
  })
  cards.innerHTML = tempStr
}
// 刷新頁面時，卡片愛心還在
function heartattack() {
  console.log(list)
  const cardHeart = document.querySelectorAll('.heart-add')
  for (let heart of cardHeart) {
    if (list.some((user) => user.id === Number(heart.id))) {
      heart.classList.add('card-heart')
    } else {
      heart.classList.remove('card-heart')
    }
  }
}
// 點擊圖片 顯示出 modal
const heart = document.querySelector(".heart")
cards.addEventListener('click', function onClickedImg(event) {
  if (event.target.matches('.cardImg')) {
    modalShow(event.target.dataset.id)
  }
  // 為了點擊愛心時，也能獲取使用者相關資訊，也在 heart 客製 id 屬性
  heart.id = event.target.dataset.id
  // 當點擊時判斷 list 有無 heart.id 相同的user
  // 有，當下直接在heart 加上 active 屬性
  if (list.some((user) => user.id === Number(heart.id))) {
    heart.classList.add('active')
  } else {
    heart.classList.remove('active')
  }
})

// modal 
function modalShow(id) {
  const picture = document.querySelector('#modal-img')
  const name = document.querySelector('#modal-name')
  const gender = document.querySelector('#modal-gender')
  const birthday = document.querySelector('#modal-birthday')
  const age = document.querySelector('#modal-age')
  const region = document.querySelector('#modal-region')
  const email = document.querySelector('#modal-email')
  axios.get(INDEX_URL + `/${id}`).then((response) => {
    picture.innerHTML = `
    <img src='${response.data.avatar}' class="img-fluid w-50 h-50 mb-2" alt="selfie">`
    name.innerText = `${response.data.name
      } ${response.data.surname}`
    gender.innerText = response.data.gender
    birthday.innerText = response.data.birthday
    age.innerText = response.data.age
    region.innerText = response.data.region
    email.innerText = response.data.email
  }).catch((error) => {
    console.log(error)
  })
}

// 搜尋 user
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
searchForm.addEventListener('submit', function onSubmit(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filterUsers = userList.filter((user) => {
    const userName = user.name + user.surname
    return userName.toLowerCase().includes(keyword)
  })
  if (filterUsers.length === 0) {
    return alert(`搜尋不到名字中含有 ${keyword} 的用戶`)
  }
  showUser(pageShow(1))
  pageCreate(filterUsers.length)
  heartattack()
})
// 點及愛心 將 user 加入/取消最愛
const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
heart.addEventListener('click', function onClickedHeart(event) {
  let id = Number(event.target.id)
  const user = userList.find((user) => user.id === id)
  const index = list.findIndex((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    heart.classList.remove('active')
    list.splice(index, 1)
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
    heartattack()
    return
  }
  heart.classList.add('active')
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
  heartattack()
})


// 頁碼生成
function pageCreate(amount) {
  const totalPages = Math.ceil(amount / user_per_page)
  let tempStr = ''
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1) {
      tempStr += `<li class="page-item"><a class="page-link pageBg" href="#" data-page='${i}'>${i}</a></li>`
      continue
    }
    tempStr += `<li class="page-item"><a class="page-link" href="#" data-page='${i}'>${i}</a></li>`
  }
  paginator.innerHTML = tempStr
}
// 當前頁面
function pageShow(page) {
  const data = filterUsers.length ? filterUsers : userList
  const startIndex = (page - 1) * user_per_page
  return data.slice(startIndex, startIndex + user_per_page)
}
paginator.addEventListener('click', function onClickedPage(event) {
  event.preventDefault()
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  showUser(pageShow(page))
  // 新增樣式 : 點擊時背景為藍色
  const pageBg = document.querySelector('.pageBg')
  if (pageBg) {
    pageBg.classList.remove('pageBg')
  }
  event.target.classList.add('pageBg')
})





