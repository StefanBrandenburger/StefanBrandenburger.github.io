/**
 *
 * @author Stefan Brandenburger
 * @licence MIT License
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element and its context
    const canvas  = document.getElementById('game')
    const dpr     = window.devicePixelRatio || 1
    canvas.width  = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr

    const ctx                    = canvas.getContext('2d')
    ctx.imageSmoothingEnabled    = false
    ctx.mozImageSmoothingEnabled = false

    const rects      = []
    const rectCount  = 40
    const rectWidth  = 25
    const rectHeight = 25
    const rectSpeed  = 5
    const options    = ['rock', 'paper', 'scissor']
    const icons      = []

    // // get random start positions
    // const start1 = { x: Math.random() * canvas.width, y: Math.random() * canvas.height }
    // const start2 = { x: Math.random() * canvas.width, y: Math.random() * canvas.height }
    //
    // // Create two rectangles to represent our objects
    // const rect1 = { ...start1, width: 10, height: 10 }
    // const rect2 = { ...start2, width: 10, height: 10 }

    // Create rectangles
    for (let i = 0; i < rectCount; i++) {
        rects[i] = {
            x: Math.random() * (canvas.width - rectWidth),
            y: Math.random() * (canvas.height - rectHeight),
            width: rectWidth,
            height: rectHeight,
            dx: (Math.random() - 0.5) * rectSpeed,
            dy: (Math.random() - 0.5) * rectSpeed,
            color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
            option: options[Math.floor(Math.random() * 3)],
        }
    }


    // Draw the rectangles on the canvas
    function draw () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < rectCount; i++) {
            ctx.fillStyle = rects[i].color
            // ctx.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height)
            // ctx.innerHTML = icons[rects[i].option].toString()
            ctx.drawImage(icons[rects[i].option], rects[i].x, rects[i].y, rects[i].width, rects[i].height)
        }
    }


    // Move the rectangles
    function move () {
        for (let i = 0; i < rectCount; i++) {
            rects[i].x += rects[i].dx
            rects[i].y += rects[i].dy
        }
    }

    function checkCollision() {
        for (let i = 0; i < rectCount; i++) {
            if (rects[i].x < 0 || rects[i].x + rects[i].width > canvas.width) {
                rects[i].x = rects[i].x < 0 ? 0 : canvas.width - rects[i].width
                rects[i].dx = -rects[i].dx
            }
            if (rects[i].y < 0 || rects[i].y + rects[i].height > canvas.height) {
                rects[i].y = rects[i].y < 0 ? 0 : canvas.height - rects[i].height
                rects[i].dy = -rects[i].dy
            }
        }

        for (let i = 0; i < rectCount; i++) {
            for (let j = i + 1; j < rectCount; j++) {
                if (rects[i].x + rects[i].width > rects[j].x && rects[i].x < rects[j].x + rects[j].width &&
                    rects[i].y + rects[i].height > rects[j].y && rects[i].y < rects[j].y + rects[j].height) {
                    rects[i].dx = -rects[i].dx
                    rects[i].dy = -rects[i].dy
                    rects[j].dx = -rects[j].dx
                    rects[j].dy = -rects[j].dy

                    if (rects[i].option === 'rock' && rects[j].option === 'scissor' ||
                        rects[i].option === 'paper' && rects[j].option === 'rock' ||
                        rects[i].option === 'scissor' && rects[j].option === 'paper'
                    ) {
                        rects[j].option = rects[i].option
                        setRandomVelocity(rects[i])
                        setRandomVelocity(rects[j])
                    // } else if (rects[i].option === rects[j].option) {
                    } else {
                        rects[i].option = rects[j].option
                        setRandomVelocity(rects[i])
                        setRandomVelocity(rects[j])
                    }
                }
            }
        }
    }

    function setRandomVelocity(rect) {
        rect.dx = Math.random() * 2 - 1
        rect.dy = Math.random() * 2 - 1

        const magnitude = Math.sqrt(rect.dx * rect.dx + rect.dy * rect.dy)

        rect.dx = rect.dx / magnitude
        rect.dy = rect.dy / magnitude
        rect.dx *= rectSpeed
        rect.dy *= rectSpeed
    }

    // Main animation loop
    function animate () {
        draw()
        move()
        checkCollision()
        requestAnimationFrame(animate)
    }

    // wait for SVGs to load
    Promise.all([
        new Promise((resolve, reject) => {
            icons.rock = new Image()
            icons.rock.onload = resolve
            icons.rock.src = 'rock.svg'
        }),
        new Promise((resolve, reject) => {
            icons.paper = new Image()
            icons.paper.onload = resolve
            icons.paper.src = 'paper.svg'
        }),
        new Promise((resolve, reject) => {
            icons.scissor = new Image()
            icons.scissor.onload = resolve
            icons.scissor.src = 'scissors.svg'
        }),
    ]).then(animate);
})