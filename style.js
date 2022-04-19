// 更改 css 效果樣式
const nav = document.querySelector('#nav')
const hometag = document.querySelector('#nav .hometag')
const search = document.querySelector('#search-form')
const addBtn = document.querySelector('#addBtn')

window.addEventListener("scroll", (event) => {
  if (this.scrollY > 10) {
    nav.setAttribute('style', ' box-shadow: 0 10px 20px #333; background-color:rgba(255,255,255,.8);transition: all .25s;')
    hometag.setAttribute('style', 'color:#000; transition: all .5s;')
    search.setAttribute('style', 'box-shadow: 0 6px 20px #333;')
    addBtn.setAttribute('style', ' background-color: #de435f;')
  } else {
    nav.removeAttribute('style')
    hometag.removeAttribute('style')
    search.removeAttribute('style')
    addBtn.removeAttribute('style')
  }
});