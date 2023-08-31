class Label{
	canvas;
	x;
	y;
	w = 0;
	h = 0;
	tmp_img_x;
	tmp_img_y;
	tmp_x;
	tmp_y;
	tmp_w;
	tmp_h;
	
	e = document.querySelector("#template>.label").cloneNode(true);
	corners = this.e.querySelectorAll(".corner");



	constructor(x, y, canvas){
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.e.addEventListener("mousedown", e=>{
			if (e.button == 0){
				e.stopPropagation();
				this.startMoving();
			} else if (e.button == 2)
				e.preventDefault();
		});

		let i = 0;
		for (const c of this.corners){
			let f = i;
			c.addEventListener("mousedown", e=>{
				if(e.button == 0){
					e.stopPropagation();
					this.startPull(f);
				} else if (e.button == 2)
					e.preventDefault();
			});
			i++;
		}
		this.canvas.c.prepend(this.e);
		
	}
	pullC0 = ()=>{
		let dx = canvas.img_pt_x - this.tmp_img_x;
		let dy = canvas.img_pt_y - this.tmp_img_y;

		this.x = this.tmp_x + dx;
		let l_x = this.tmp_x + this.tmp_w; // Limit_x
		if (this.x > l_x) this.x = l_x;
		this.w = Math.abs(this.tmp_w - dx);
		this.y = this.tmp_y + dy;
		let l_y = this.tmp_y + this.tmp_h; // Limit_y
		if (this.y > l_y) this.y = l_y;
		this.h = Math.abs(this.tmp_h - dy);
		this.draw();
	}
	pullC1 = ()=>{
		let dx = canvas.img_pt_x - this.tmp_img_x;
		let dy = canvas.img_pt_y - this.tmp_img_y;

		this.x = this.tmp_x + this.tmp_w + dx;
		if (this.tmp_w + dx > 0) this.x = this.tmp_x;
		this.w = Math.abs(this.tmp_w + dx);
		this.y = this.tmp_y + dy;
		let l_y = this.tmp_y + this.tmp_h; // Limit_y
		if (this.y > l_y) this.y = l_y;
		this.h = Math.abs(this.tmp_h - dy);
		this.draw();
	}
	pullC2 = ()=>{
		let dx = canvas.img_pt_x - this.tmp_img_x;
		let dy = canvas.img_pt_y - this.tmp_img_y;

		this.x = this.tmp_x + this.tmp_w + dx;
		if (this.tmp_w + dx > 0) this.x = this.tmp_x;
		this.w = Math.abs(this.tmp_w + dx);
		this.y = this.tmp_y + this.tmp_h + dy;
		if (this.tmp_h + dy > 0) this.y = this.tmp_y;
		this.h = Math.abs(this.tmp_h + dy);
		this.draw();
	}
	pullC3 = ()=>{
		let dx = canvas.img_pt_x - this.tmp_img_x;
		let dy = canvas.img_pt_y - this.tmp_img_y;

		this.x = this.tmp_x + dx;
		let l_x = this.tmp_x + this.tmp_w; // Limit_x
		if (this.x > l_x) this.x = l_x;
		this.w = Math.abs(this.tmp_w - dx);
		this.y = this.tmp_y + this.tmp_h + dy;
		if (this.tmp_h + dy > 0) this.y = this.tmp_y;
		this.h = Math.abs(this.tmp_h + dy);
		this.draw();
	}
	startPull(c){
		this.tmp_img_x = this.canvas.img_pt_x;
		this.tmp_img_y = this.canvas.img_pt_y;
		this.tmp_x = this.x;
		this.tmp_y = this.y;
		this.tmp_w = this.w;
		this.tmp_h = this.h;

		this.pull = this["pullC" + c];
		this.canvas.startResizing(this);
	}
	startMoving(){
		this.tmp_img_x = this.canvas.img_pt_x;
		this.tmp_img_y = this.canvas.img_pt_y;
		this.tmp_x = this.x;
		this.tmp_y = this.y;
		this.canvas.moving = this;
	}
	move(){
		let dx = canvas.img_pt_x - this.tmp_img_x;
		let dy = canvas.img_pt_y - this.tmp_img_y;
		this.x = this.tmp_x + dx;
		this.y = this.tmp_y + dy;
		this.draw();
	}
	draw(){
		this.e.style.left = this.x + "px";
		this.e.style.top = this.y + "px";
		this.e.style.width = this.w + "px";
		this.e.style.height = this.h + "px"; 
	}

}