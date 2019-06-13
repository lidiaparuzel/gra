document.addEventListener("DOMContentLoaded", function (event) {
    var context, controller, Rectangle, rectangle, loop, resize;
    let can_height = 500;
    let can_width = 700;
    context = document.getElementById("game").getContext("2d");
    context.canvas.height = can_height;
    context.canvas.width = can_width;
    var P1 = new Image();
    P1.src = "images/parallax/l1.png";
    var p1_off = 0;
    var P2 = new Image();
    P2.src = "images/parallax/l2.png";
    var p2_off = 0;
    var P3 = new Image();
    P3.src = "images/parallax/l3.png";
    var p3_off = 0;
    var P4 = new Image();
    P4.src = "images/parallax/l4.png";
    var p4_off = 0;
    var P5 = new Image();
    P5.src = "images/parallax/l5.png";
    var p5_off = 0;
    var tile = new Image();
    tile.src = "images/tile.png";
    var coinImage = new Image();
    coinImage.src = "images/coin.png";
    var birdImage = new Image();
    birdImage.src = "images/bird_right.png";
    var heroImage = new Image();
    heroImage.src = "images/hero_right.png";

    Sprite = function (x, y, width, height, image, loop, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.frameIndex = 0,
        this.tickCount = 0,
        this.loop = loop;
        this.ticksPerFrame = 2;
        this.numberOfFrames = 9;
        this.status = true;
        this.position = 0;
        this.direction = "right";
        this.collisionState = "none";
        this.jumping = true;
        this.x_velocity = 0;
        this.y_velocity = 0;
        this.temp = x;
        this.type = type;
        this.running = true;
    };
    Sprite.prototype = {
        draw: function () {
            context.drawImage(this.image, this.frameIndex * this.width, 0, this.width, this.height, this.x + this.position, this.y, this.width, this.height);
        },
        drawFlying: function () {
            if (this.direction == "right") {
                this.image.src = "images/bird_right.png"

                context.drawImage(this.image, this.frameIndex * this.width, 0, this.width, this.height, this.x + this.position, this.y, this.width, this.height);
                if (this.x + this.position >= 500) { this.direction = "left"; }
            }
            else if (this.direction == "left") {
                this.image.src = "images/bird_left.png";
                context.drawImage(this.image, this.frameIndex * this.width, 0, this.width, this.height, this.x + this.position, this.y, this.width, this.height);
                if (this.position <= 100) { this.direction = "right"; }
            }
        },
        drawHero: function () {
            if (controller.right) { this.direction = "right"; }
            if (controller.left) { this.direction = "left"; }

            if (this.direction == "right") {
                this.image.src = "images/hero_right.png"
                context.drawImage(this.image, this.frameIndex * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            }
            else if (this.direction == "left") {
                this.image.src = "images/hero_left.png";
                context.drawImage(this.image, this.frameIndex * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            }
        },
        update: function () {
            this.tickCount += 1;
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                if (this.frameIndex < this.numberOfFrames - 1) {
                    this.frameIndex += 1;
                } else if (this.loop) {
                    this.frameIndex = 0;
                }
            }
            if (this.type == "bird") {
                if (this.direction == "left") this.position -= 3;
                else this.position += 3;
            }

        },
        get bottom() { return this.y + this.height; },
        get left() { return this.x + this.position; },
        get right() { return this.x + this.width + this.position; },
        get top() { return this.y; },
        testCollisionB: function (bird) {
            if (this.top >= bird.bottom || this.right <= bird.left || this.bottom <= bird.top || this.left >= bird.right) {
                return false
            }
            return true;
        },
        testCollision: function (rectangle) {
            if (this.top >= rectangle.y + (rectangle.height + 3) || this.right <= rectangle.left || this.bottom <= rectangle.top || this.left >= rectangle.right) { return false; }
            return true;
        }
    }
    var blocks = [];
    var coins = [];
    var coords = [[220,220],[520,250],[820,280],[1120,260],[1420,220]];
    var coordsCoins = [[320,320],[450,150],[650,350],[1020,260],[1720,220]];
    for (let i=0;i<5;i++) {
        blocks[i]=new Sprite(coords[i][0], coords[i][1], 65, 65, tile, 1, "block");
        coins[i]= new Sprite(coordsCoins[i][0], coordsCoins[i][1], 44, 40, coinImage, 10, "coin");
    }
    bird = new Sprite(context.canvas.width - 660, context.canvas.height - 240 - 100 - 55 - 2, 88, 75, birdImage, 10, "bird");
    bird.numberOfFrames = 4;
    bird.ticksPerFrame = 5;
    hero = new Sprite(context.canvas.width - 660, context.canvas.height - 150 - 55 - 2, 48, 42, heroImage, 10, "hero");
    hero.numberOfFrames = 8;
    hero.ticksPerFrame = 2;

    controller = {
        left: false,
        right: false,
        up: false,

        keyListener: function (event) {
            var key_state = (event.type == "keydown") ? true : false;
            switch (event.keyCode) {
                case 37:// left key
                    controller.left = key_state;
                    break;
                case 38:// up key
                    controller.up = key_state;
                    break;
                case 39:// right key
                    controller.right = key_state;
                    break;
            }
        },
        restart: function (event) {
            bird = new Sprite(context.canvas.width - 660, context.canvas.height - 240 - 100 - 55 - 2, 88, 75, birdImage, 10, "bird");
            bird.numberOfFrames = 4;
            bird.ticksPerFrame = 5;
            hero = new Sprite(context.canvas.width - 660, context.canvas.height - 150 - 55 - 2, 48, 42, heroImage, 10, "hero");
            hero.numberOfFrames = 8;
            hero.ticksPerFrame = 2;
            p1_off=0;
            p2_off=0;
            p3_off=0;
            p4_off=0;
            p5_off=0;
            blocks.forEach(element => {
                element.position=0;
            });
            coins.forEach(element => {
                element.position=0;
                element.status=true;
            });
            window.addEventListener("keydown", controller.keyListener);
            game_status = true;

            document.getElementById("game_status").textContent = ""
            document.getElementById("score").textContent = "0"
        }
    };

    loop = function () {

        context.clearRect(0, 0, can_width, can_height);

        context.drawImage(P5, 0 + p5_off, 0, can_width, can_height);
        context.drawImage(P5, 0 + p5_off + can_width, 0, can_width, can_height);
        context.drawImage(P4, 0 + p4_off, 0, can_width, can_height);
        context.drawImage(P4, 0 + p4_off + can_width, 0, can_width, can_height);
        context.drawImage(P3, 0 + p3_off, 0, can_width, can_height);
        context.drawImage(P3, 0 + p3_off + can_width, 0, can_width, can_height);
        context.drawImage(P2, 0 + p2_off, 0, can_width, can_height);
        context.drawImage(P2, 0 + p2_off + can_width, 0, can_width, can_height);
        context.drawImage(P1, 0 + p1_off, 0, can_width, can_height);
        context.drawImage(P1, 0 + p1_off + can_width, 0, can_width, can_height);

        hero.drawHero();
        hero.update();
        blocks.forEach(element => {
            element.draw();
        });
        if (bird.status == true) {
            bird.drawFlying();
            bird.update();
        }
        else {
            bird.drawFlying();
        }
        coins.forEach(coin => {
            if (coin.status == true) {
                coin.draw();
                coin.update();
                if (hero.testCollision(coin)) {
                    coin.status = false;
                    let points = document.getElementById("score").textContent;
                    points = parseInt(points) + 1;
                    document.getElementById("score").textContent = points;
                }
            }
        });

        if ((hero.testCollisionB(bird))||(parseInt(document.getElementById("score").textContent)==5)) {
            //game over
            hero.y_velocity = 0;
            hero.x_velocity = 0;
            game_status = false;
            bird.status = false;
            if (parseInt(document.getElementById("score").textContent)==5)document.getElementById("game_status").textContent = "Wygrałeś!"
            else document.getElementById("game_status").textContent = "Przegrałeś!";
            window.removeEventListener("keydown", controller.keyListener);
        }
        if (controller.up && hero.jumping == false) {
            if (game_status != false) {
                hero.y_velocity -= 35;
                hero.jumping = true;
            }
        }
        if (controller.left) {
            if (game_status != false) {
                hero.x_velocity -= 1.5;
                hero.running = true;
            }
        }
        else if (controller.right) {
            if (game_status != false) {
                hero.x_velocity += 1.5;
                hero.running = true;
                if (hero.x >= can_width / 2 - 30) {
                    p1_off -= 3;
                    p2_off -= 2.5;
                    p3_off -= 2;
                    p4_off -= 1.5;
                    p5_off -= 1;
                    if (bird.direction=="right") bird.position-=1.5;
                    blocks.forEach(element => {
                        element.position -= 5;
                    });
                    coins.forEach(coin => {
                        coin.position -= 5;
                    });

                };
                if ((p5_off >= can_width) || (p5_off <= -can_width)) {
                    p5_off = 0;
                }
                if ((p4_off >= can_width) || (p4_off <= -can_width)) {
                    p4_off = 0;
                }
                if ((p3_off >= can_width) || (p3_off <= -can_width)) {
                    p3_off = 0;
                }
                if ((p2_off >= can_width) || (p2_off <= -can_width)) {
                    p2_off = 0;
                }
                if ((p1_off >= can_width) || (p1_off <= -can_width)) {
                    p1_off = 0;
                }
            }
        } else hero.running = false;
        if (game_status != false) {
            hero.y_velocity += 1;// gravity
            hero.x += hero.x_velocity;
            hero.y += hero.y_velocity;
            hero.x_velocity *= 0.8;// friction
            hero.y_velocity *= 0.9;// friction
        }
        // if hero is falling below ground line
        if (hero.y > can_height - 50 - 40 - 40) {
            hero.jumping = false;
            hero.y = can_height - 50 - 40 - 40;
            hero.y_velocity = 0;
        }
        //not fall out for left and stay in the middle
        if (hero.x < 0+30) {
            hero.x = 0+30;
        }
        if (hero.x > (can_width / 2) - 30) {
            hero.x = (can_width / 2) - 30;
        }
        blocks.forEach(block => {
            if (hero.testCollision(block)) {
                if ((hero.x + hero.width > block.x+block.position) && (hero.x < block.x+block.position + (block.width / 2)) && ((hero.y < block.y + block.height - 10) && (hero.y > block.y - hero.height + 10))) { hero.x = block.x+block.position - hero.width; hero.collisionState = "fallingLeft" }
                else if ((hero.x < block.x+block.position + block.width) && ((hero.y < block.y + block.height - 10) && (hero.y > block.y - hero.height + 10))) { hero.x = block.x+block.position + block.width; hero.collisionState = "fallingRight" }
                else {
                    hero.collisionState = "none";
                    if (hero.y + hero.height - 10 <= block.y) {
                        hero.collisionState = "top";
                        hero.y = block.y - hero.height;
                        hero.y_velocity = 0;
                        hero.jumping = false;
                    }
                    if (hero.y_velocity < 0) hero.y_velocity = 0;
                    if ((hero.top <= block.bottom) && (hero.collisionState == "none")) {
                        hero.jumping = true;
                        hero.y = block.y + block.height;
                        hero.y_velocity += 1;// gravity
                        hero.y_velocity *= 0.9;//friction
                        controller.up = false;
                    }
                }
            }
        });
        
        if (hero.direction == "left") {
            if (hero.running == false) {
                hero.numberOfFrames = 1;
                hero.frameIndex = 0;
            }
            else { hero.numberOfFrames = 8; }
            if (hero.jumping == true) {
                hero.numberOfFrames = 1;
                hero.frameIndex = 7;
            } else { hero.numberOfFrames = 8; }
        } else {
            if (hero.running == false) {
                hero.numberOfFrames = 1;
                hero.frameIndex = 7;
            }
            else { hero.numberOfFrames = 8; }
            if (hero.jumping == true) {
                hero.numberOfFrames = 1;
                hero.frameIndex = 0;
            } else { hero.numberOfFrames = 8; }
        }
        window.requestAnimationFrame(loop);
    };
    window.addEventListener("keydown", controller.keyListener);
    window.addEventListener("keyup", controller.keyListener);
    var button_restart = document.getElementById("restart");
    button_restart.addEventListener("click", controller.restart);
    window.requestAnimationFrame(loop);
});