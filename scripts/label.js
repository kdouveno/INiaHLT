class Label{
	canvas;
	label;
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
	
	e_box = document.querySelector("#template>.box").cloneNode(true);
	corners = this.e_box.querySelectorAll(".corner");

	e_li = document.querySelector("#template>.list_item").cloneNode(true);
	e_in = this.e_li.querySelector('input:nth-child(2)');
	

	constructor(canvas, x, y){
		this.canvas = canvas;
		if (typeof x === "object"){
			this.fromData(x);
		} else {
			this.x = x;
			this.y = y;
			this.label = this.canvas.defaultLabel;
		}
		
		this.e_box.addEventListener("mousedown", e=>{
			if (e.button == 0 && !this.canvas.newBox){
				e.stopPropagation();
				this.startMoving();
			} else if (e.button == 2)
				e.preventDefault();
		});
		this.e_box.addEventListener("focusin", ()=>{this.focusIn()});
		this.e_li.addEventListener("focusin", ()=>{this.focusIn()});
		this.e_box.addEventListener("focusout", (e)=>{this.focusOut(e.relatedTarget)});
		this.e_li.addEventListener("focusout", (e)=>{this.focusOut(e.relatedTarget)});
		this.e_in.addEventListener("input", e=>{
			this.label = this.e_in.value;
		});
		let i = 0;
		for (const c of this.corners){
			let f = i;
			c.addEventListener("mousedown", e=>{
				if(e.button == 0 && !this.canvas.newBox){
					e.stopPropagation();
					this.startPull(f);
				} else if (e.button == 2)
					e.preventDefault();
			});
			i++;
		}
		this.e_in.value = this.label;
		this.draw();
		this.canvas.lbll.append(this.e_li);
		this.canvas.c.prepend(this.e_box);
	}
	focusIn(){
		if (this.canvas.focusLabel && this.canvas.focusLabel != this)
			this.canvas.focusLabel.focusOut();
		this.e_box.classList.add("focus");
		this.e_li.classList.add("focus");
		this.canvas.focusLabel = this;
	}
	focusOut(r){
		if (this.isFocused(r))
			return ;
		this.e_box.classList.remove("focus");
		this.e_li.classList.remove("focus");
		this.e_in.setAttribute('disabled', "");
		if (!this.e_in.value)
			this.delete();
		if (!r)
			this.canvas.focusLabel = null;
	}
	isFocused(r){
		return r == this.e_box || r == this.e_li || r == this.e_in;
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
		this.e_box.style.left = this.x + "px";
		this.e_box.style.top = this.y + "px";
		this.e_box.style.width = this.w + "px";
		this.e_box.style.height = this.h + "px"; 
	}
	editLabel(){
		this.e_in.removeAttribute('disabled');
		this.e_in.select();

		// ✅ Remove the disabled attribute
		// button.
	}
	stopEditing(){
		this.e_li.focus();
	}
	stopResizing(){
		this.trim();
		this.draw();
		if (this.label == "")
			this.editLabel();
	}
	stopMoving(){
		this.trim();
		this.draw();
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
	delete(man){
		this.e_box.remove();
		this.e_li.remove();
		this.e_in.remove();
		if (this.canvas.focusLabel == this){
			this.canvas.writing = false;
			this.canvas.focusLabel = null;
		}
		if (!man)
			this.canvas.labels.splice(this.index(), 1);
	}
	getData(){
		return new labelData(
			this.label, 
			Math.round(this.x),
			Math.round(this.y),
			Math.round(this.x + this.w),
			Math.round(this.y + this.h)
		)
	}
	trim(){
		let xmax = this.canvas.img.naturalWidth;
		let ymax = this.canvas.img.naturalHeight;
		if (this.x > xmax || this.y > ymax || this.x + this.w < 0 || this.y + this.h < 0)
			this.delete();
		if (this.x < 0) {
			this.w += this.x;
			this.x = 0;
		}
		if (this.x + this.w > xmax)
			this.w -= (this.x + this.w - xmax);
		if (this.y < 0) {
			this.h += this.y;
			this.y = 0;
		}
		if (this.y + this.h > ymax)
			this.h -= (this.y + this.h - ymax);

		
	}
	fromData(data){
		this.trim();
		this.label = data.label;
		this.e_in.value = data.label;
		this.x = data.xmin;
		this.y = data.ymin;
		this.w = data.xmax - data.xmin; 
		this.h = data.ymax - data.ymin;
		this.draw();
	}
	index(){
		return this.canvas.labels.indexOf(this);
	}
}