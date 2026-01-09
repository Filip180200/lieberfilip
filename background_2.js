 document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('squares-canvas');
            const ctx = canvas.getContext('2d');
            
            let width, height;
            let squares = [];
            
            function resize() {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                initSquares();
            }
            
            class Square {
                constructor() {
                    this.size = Math.random() * 50 + 10;
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.speedY = Math.random() * 0.5 + 0.1;
                    this.opacity = Math.random() * 0.1 + 0.02;
                    this.color = `rgba(255, 255, 255, ${this.opacity})`;
                }
                
                update() {
                    this.y -= this.speedY;
                    if (this.y + this.size < 0) {
                        this.y = height + this.size;
                        this.x = Math.random() * width;
                    }
                }
                
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x, this.y, this.size, this.size);
                }
            }
            
            function initSquares() {
                squares = [];
                const count = Math.floor(width * height / 20000); 
                for (let i = 0; i < count; i++) {
                    squares.push(new Square());
                }
            }
            
            function animate() {
                ctx.clearRect(0, 0, width, height);
                squares.forEach(sq => {
                    sq.update();
                    sq.draw();
                });
                requestAnimationFrame(animate);
            }
            
            window.addEventListener('resize', resize);
            resize();
            animate();
        });