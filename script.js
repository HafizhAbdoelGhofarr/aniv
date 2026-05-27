// Typewriter text
const phrases = [
  'Two years of laughter, hugs, and promises, Malika.',
  'Thank you, Malika — you make every day meaningful.',
  'Forever starts today, together with you.'
]
let i = 0, j = 0, current = '', isDeleting = false
const speed = 60
const el = document.getElementById('typewriter')
function type(){
  if(!el) return
  const full = phrases[i]
  if(isDeleting){
    current = full.substring(0, current.length - 1)
  } else {
    current = full.substring(0, current.length + 1)
  }
  el.textContent = current
  if(!isDeleting && current === full){
    setTimeout(()=> isDeleting = true, 1500)
  } else if(isDeleting && current === ''){
    isDeleting = false
    i = (i + 1) % phrases.length
  }
  setTimeout(type, isDeleting ? speed/2 : speed)
}
setTimeout(type, 500)

// Reveal button scrolls to message
const revealBtn = document.getElementById('revealBtn')
if(revealBtn){
  revealBtn.addEventListener('click', ()=>{
    const target = document.getElementById('messageSection')
    target && target.scrollIntoView({behavior:'smooth'})
    burstHearts(18)
  })
}

// Play music (user should add a file path)
const playBtn = document.getElementById('playMusic')
const song = document.getElementById('song')
if(playBtn){
  playBtn.addEventListener('click', async ()=>{
    if(!song.src || song.src.endsWith('/')){
      alert('Please add a file named "favorite-girl.mp3" into the "assets" folder (assets/favorite-girl.mp3)')
      return
    }
    try{
      if(song.paused) await song.play()
      else song.pause()
      playBtn.textContent = song.paused ? 'Play Song' : 'Pause Song'
    }catch(e){
      console.warn(e)
    }
  })
}

// Create floating hearts
function createHeart(x,y,size,delay){
  const el = document.createElement('div')
  el.className = 'heart'
  el.style.left = x + 'px'
  el.style.top = y + 'px'
  el.style.width = size + 'px'
  el.style.height = size + 'px'
  el.style.opacity = '0'
  el.style.transition = `transform 2.6s cubic-bezier(.22,.9,.36,1),opacity 1.4s ease-in-out`
  document.body.appendChild(el)
  requestAnimationFrame(()=>{
    el.style.opacity = '1'
    el.style.transform = `translate(-50%,-50%) translateY(-260px) rotate(${Math.random()*60-30}deg) scale(${1+Math.random()})`
  })
  setTimeout(()=> el.style.opacity = '0', 1600 + delay)
  setTimeout(()=> el.remove(), 3000 + delay)
}

function burstHearts(n){
  for(let k=0;k<n;k++){
    const x = window.innerWidth/2 + (Math.random()*240-120)
    const y = window.innerHeight/2 + (Math.random()*60-30)
    createHeart(x,y,24+Math.random()*24,k*60)
  }
}

// gentle auto floating hearts background
setInterval(()=>{
  const x = Math.random()*window.innerWidth
  const y = window.innerHeight + 20
  createHeart(x,y,14+Math.random()*18,0)
}, 900)

// Confetti implementation (simple canvas particle system)
const confettiCanvas = document.getElementById('confetti')
let confettiCtx, confettiParticles = [], confettiW, confettiH, confettiRunning = false
if(confettiCanvas){
  confettiCtx = confettiCanvas.getContext('2d')
  function resizeConfetti(){
    confettiW = confettiCanvas.width = window.innerWidth
    confettiH = confettiCanvas.height = window.innerHeight
  }
  window.addEventListener('resize', resizeConfetti)
  resizeConfetti()

  function makeConfetti(x,y,count){
    const colors = ['#ff6b8a','#ffd166','#ffb199','#a18cd1','#9be7ff']
    for(let i=0;i<count;i++){
      confettiParticles.push({
        x: x + (Math.random()*40-20),
        y: y + (Math.random()*40-20),
        vx: (Math.random()*6-3),
        vy: (Math.random()*-8-2),
        size: 6+Math.random()*8,
        color: colors[Math.floor(Math.random()*colors.length)],
        rot: Math.random()*360,
        life: 60 + Math.random()*40
      })
    }
    if(!confettiRunning) runConfetti()
  }

  function runConfetti(){
    confettiRunning = true
    function frame(){
      confettiCtx.clearRect(0,0,confettiW,confettiH)
      for(let i=confettiParticles.length-1;i>=0;i--){
        const p = confettiParticles[i]
        p.vy += 0.3
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vx * 2
        p.life--
        confettiCtx.save()
        confettiCtx.translate(p.x,p.y)
        confettiCtx.rotate(p.rot * Math.PI/180)
        confettiCtx.fillStyle = p.color
        confettiCtx.fillRect(-p.size/2,-p.size/2,p.size,p.size)
        confettiCtx.restore()
        if(p.y > confettiH + 40 || p.life <= 0) confettiParticles.splice(i,1)
      }
      if(confettiParticles.length>0) requestAnimationFrame(frame)
      else confettiRunning = false
    }
    requestAnimationFrame(frame)
  }
}

// Trigger confetti on reveal
if(revealBtn){
  revealBtn.addEventListener('click', ()=>{
    const cx = window.innerWidth/2
    const cy = window.innerHeight/2
    if(typeof makeConfetti === 'function') makeConfetti(cx, cy, 80)
    burstHearts(14)
  })
}

// IntersectionObserver for timeline reveal
const timelineItems = document.querySelectorAll('.timeline li')
if(timelineItems.length){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('visible')
    })
  },{threshold:0.2})
  timelineItems.forEach(i=>obs.observe(i))
}

// Lightbox functionality
const galleryImgs = Array.from(document.querySelectorAll('.gallery img'))
const lightbox = document.getElementById('lightbox')
const lbImage = lightbox && lightbox.querySelector('.lb-image')
const lbCaption = lightbox && lightbox.querySelector('.lb-caption')
const lbClose = lightbox && lightbox.querySelector('.lb-close')
const lbPrev = lightbox && lightbox.querySelector('.lb-prev')
const lbNext = lightbox && lightbox.querySelector('.lb-next')
let currentIndex = 0

function openLightbox(idx){
  currentIndex = idx
  const img = galleryImgs[idx]
  lbImage.src = img.src
  lbImage.alt = img.alt || ''
  lbCaption.textContent = img.dataset.caption || img.alt || ''
  lightbox.setAttribute('aria-hidden','false')
  lbClose.focus()
}

function closeLightbox(){
  lightbox.setAttribute('aria-hidden','true')
  lbImage.src = ''
}

function showPrev(){
  currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length
  openLightbox(currentIndex)
}

function showNext(){
  currentIndex = (currentIndex + 1) % galleryImgs.length
  openLightbox(currentIndex)
}

galleryImgs.forEach((im,i)=>{
  im.style.cursor = 'zoom-in'
  im.addEventListener('click', ()=> openLightbox(i))
  im.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') openLightbox(i) })
})

if(lbClose) lbClose.addEventListener('click', closeLightbox)
if(lbPrev) lbPrev.addEventListener('click', showPrev)
if(lbNext) lbNext.addEventListener('click', showNext)

// keyboard nav for lightbox
document.addEventListener('keydown', (e)=>{
  if(!lightbox) return
  if(lightbox.getAttribute('aria-hidden') === 'false'){
    if(e.key === 'ArrowLeft') showPrev()
    if(e.key === 'ArrowRight') showNext()
    if(e.key === 'Escape') closeLightbox()
  }
})

// Improve music toggle label on load
if(song){
  song.addEventListener('play', ()=>{ if(playBtn) playBtn.textContent = 'Pause Song' })
  song.addEventListener('pause', ()=>{ if(playBtn) playBtn.textContent = 'Play Song' })
}

// Surprise animation: overlay text + stars + confetti/hearts
const surpriseBtn = document.getElementById('surpriseBtn')
let surpriseOverlay
function ensureSurpriseOverlay(){
  if(surpriseOverlay) return surpriseOverlay
  surpriseOverlay = document.createElement('div')
  surpriseOverlay.className = 'surprise-overlay'
  surpriseOverlay.innerHTML = '<div class="bg"></div><div class="surprise-text">For you, Malika 💖</div>'
  document.body.appendChild(surpriseOverlay)
  return surpriseOverlay
}

function createStar(x,y,angle,dist,delay,isSparkle){
  const s = document.createElement('div')
  s.className = 'surprise-star' + (isSparkle? ' sparkle':'')
  s.style.left = x + 'px'
  s.style.top = y + 'px'
  s.style.opacity = '0'
  s.style.transition = `transform 900ms cubic-bezier(.2,.9,.3,1) ${delay}ms,opacity 600ms ${delay}ms`
  document.body.appendChild(s)
  requestAnimationFrame(()=>{
    s.style.opacity = '1'
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist - 20
    s.style.transform = `translate(${dx}px, ${-Math.abs(dy)}px) rotate(${(Math.random()*60-30)}deg) scale(1)`
  })
  setTimeout(()=>{ s.style.opacity = '0'; s.style.transform += ' scale(.6)'; }, 1600 + delay)
  setTimeout(()=> s.remove(), 2600 + delay)
}

if(surpriseBtn){
  surpriseBtn.addEventListener('click', ()=>{
    const ov = ensureSurpriseOverlay()
    ov.classList.add('active')
    surpriseBtn.setAttribute('aria-pressed','true')
    // create stars radiating from center
    const cx = window.innerWidth/2
    const cy = window.innerHeight/2
    for(let k=0;k<18;k++){
      const angle = (Math.PI*2) * (k/18) + (Math.random()*0.4-0.2)
      const dist = 140 + Math.random()*160
      createStar(cx + (Math.random()*40-20), cy + (Math.random()*40-20), angle, dist, k*30, k%3===0)
    }
    // additional celebration
    if(typeof makeConfetti === 'function') makeConfetti(cx, cy, 50)
    burstHearts(12)
    // auto-hide overlay
    setTimeout(()=>{
      ov.classList.remove('active')
      surpriseBtn.setAttribute('aria-pressed','false')
    }, 2600)
  })
}

// Intro single-button flow
const intro = document.getElementById('intro')
const startBtn = document.getElementById('startBtn')
const scene = document.querySelector('.scene')
if(startBtn && intro && scene){
  startBtn.addEventListener('click', async ()=>{
    // play small reveal: confetti + hearts + auto-start song + show content
    const cx = window.innerWidth/2
    const cy = window.innerHeight/2
    if(typeof makeConfetti === 'function') makeConfetti(cx, cy, 60)
    burstHearts(16)
    if(song && song.src && !song.src.endsWith('/')){
      try{
        await song.play()
        if(playBtn) playBtn.textContent = 'Pause Song'
      }catch(e){
        console.warn('Auto-play prevented:', e)
      }
    }
    // hide intro overlay
    intro.setAttribute('aria-hidden','true')
    // reveal scene after a short delay for smoothness
    setTimeout(()=>{
      scene.classList.remove('hidden')
      // focus the first interactive element for accessibility
      const firstBtn = document.getElementById('revealBtn') || document.getElementById('playMusic')
      firstBtn && firstBtn.focus()
    }, 420)
  })
}
