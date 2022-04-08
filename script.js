const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const PLAYER_STORAGE_KEY = 'DINHHAI_PLAYER'

const app = {

  songs : [
      {
        name: "Chang mot ai thay",
        singer: "Trang",
        path: "./accets/music/song1.mp3",
        image: "./accets/img/song1.png"
      },
  
      {
        name: "Chiec hop",
        singer: "Bich Phuong",
        path: "./accets/music/song2.mp3",
        image:
          "./accets/img/song2.png"
      }, 

      {
        name: "Chuyen rang",
        singer: "Thinh Suy",
        path:
          "./accets/music/song3.mp3",
        image: "./accets/img/song3.png"
      },

      {
        name: "Da tung nhu the",
        singer: "Nguyen Ha",
        path: "./accets/music/song4.mp3",
        image:
          "./accets/img/song4.png"
      },

      {
        name: "Lac nhau co phai muon doi",
        singer: "Erik",
        path: "./accets/music/song5.mp3",
        image:
          "./accets/img/song5.png"
      },

      {
        name: "Minh yeu den day thoi",
        singer: "Toc Tien",
        path:
          "./accets/music/song6.mp3",
        image:
          "./accets/img/song6.png"
      },

      {
        name: "Nam ngu em ru",
        singer: "Bich Phuong",
        path: "./accets/music/song7.mp3",
        image:
          "./accets/img/song7.png"
      },

      {
        name: "Nguoi ta dau thuong em",
        singer: "Ly Ly",
        path: "./accets/music/song8.mp3",
        image:
          "./accets/img/song8.png"
      }
      
    ],

    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    setConfig : function(key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    
    render: function() {

      const htmls = this.songs.map((song, index) => {
        return `
                <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
      });
      playList.innerHTML = htmls.join('')

    },

    defineProperties : function() {
      Object.defineProperty(this, 'currentSong', {
        get: function() {
          return this.songs[this.currentIndex]
        }
      })
    },

    handleEvent: function() {
      const _this = this
      const cdWidth = cd.offsetWidth

      const cdThumbAnimate = cdThumb.animate([
        {
          transform: 'rotate(360deg)'
        }
      ], {
        duration: 10000,
        iterations: Infinity
      })
      cdThumbAnimate.pause()

      document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const newCDwidth = cdWidth - scrollTop

        cd.style.width = newCDwidth > 0 ? newCDwidth + 'px' : 0
        cd.style.opacity = newCDwidth / cdWidth
      }

      playBtn.onclick = function() {
        if(_this.isPlaying) {
          audio.pause()
        }
        else{
          audio.play()
        }
      }

      audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
      }

      audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }

      audio.ontimeupdate = function() {
        if(audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPercent
        }
      }

      progress.onchange = function(e) {
        const seekTime = audio.duration / 100 * e.target.value
        audio.pause()
        audio.currentTime = seekTime
        audio.play()
      }

      nextBtn.onclick = function() {
        if(_this.isRandom){
          _this.playRandomSong()
        }
        else{
          _this.loadNextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      prevBtn.onclick = function() {
        if(_this.isRandom){
          _this.playRandomSong()
        }
        else{
          _this.loadPrevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      randomBtn.onclick = function() {
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom', _this.isRandom)
        randomBtn.classList.toggle('active', _this.isRandom)
      }

      audio.onended = function() {
        if(_this.isRepeat){
          audio.play()
        }
        else{
          nextBtn.click()
        }
      }

      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat', _this.isRepeat)
        repeatBtn.classList.toggle('active', _this.isRepeat)

      }

      playList.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)')

        if(songNode || (e.target.closest('.option'))){
           if(songNode){
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            audio.play()
            _this.render()
          }
        }
      }

    },

    scrollToActiveSong: function() {
      setTimeout(function() {
        $('.song.active').scrollIntoView(
          {
            behavior: 'smooth',
            block : 'nearest',
          }) 
      }, 300)
    },

    loadConfig: function() {
      this.isRandom = this.config.isRandom
      this.isRepeat = this.config.isRepeat
    },

    loadCurrentSong : function() {

      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
    },

    loadNextSong : function() {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },

    loadPrevSong : function() {
      this.currentIndex--
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
    },

    playRandomSong : function() {
      let newIndex
      
      do{
        newIndex = Math.floor(Math.random() * this.songs.length)
      }while(newIndex === this.currentIndex)

      this.currentIndex = newIndex
      this.loadCurrentSong()
    },
    
    start: function() {
      this.loadConfig()

      this.defineProperties()

      this.handleEvent()

      this.render()

      this.loadCurrentSong()

      randomBtn.classList.toggle('active', this.isRandom)
      repeatBtn.classList.toggle('active', this.isRepeat)

    }
}

app.start()