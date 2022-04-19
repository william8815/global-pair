const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const cards = document.querySelector('#cards')
const userList = JSON.parse(localStorage.getItem('favoriteUsers'))
let filterUsers = []

showUser(userList)
// card function
function showUser(users) {
  let tempStr = ''
  users.forEach((user) => {
    tempStr += `
      <div class="col-sm-2" class='card'>
        <div class="card mt-3 text-center">
          <img src="${user.avatar}" class="cardImg card-img-top" alt="selfie" data-bs-toggle="modal" data-bs-target="#modal-show" data-id="${user.id}">
          <div class="card-body d-flex align-items-center">
            <h5 class="card-title">${user.name} ${user.surname}</h5>
          </div>
        </div>
      </div>`
  })
  cards.innerHTML = tempStr
}
// 點擊圖片 顯示出 modal
const heart = document.querySelector("#heart")
cards.addEventListener('click', function onClickedImg(event) {
  if (event.target.matches('.cardImg')) {
    modalShow(event.target.dataset.id)
  }
  // 為了點擊愛心時，也能獲取使用者相關資訊，也在 heart 客製 id 屬性
  heart.dataset.id = event.target.dataset.id
  heart.classList.add("active")
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
  filterUsers = userList.filter((user) => user.name.toLowerCase().includes(keyword))
  if (filterUsers.length === 0) {
    return alert(`搜尋不到名字中含有 ${keyword} 的用戶`)
  }
  showUser(filterUsers)
})

// 將 user 取消最愛
heart.addEventListener('click', function onClickedHeart(event) {
  let id = Number(event.target.dataset.id)
  const index = userList.findIndex((user) => user.id === id)
  if (userList.some((user) => user.id === id)) {
    userList.splice(index, 1)
    event.target.classList.remove("active")
    localStorage.setItem('favoriteUsers', JSON.stringify(userList))
  }
  showUser(userList)
})
