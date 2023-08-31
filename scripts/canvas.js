
class Canvas {
	// Elements
	cc = document.getElementById("canvasContainer");
	c = document.getElementById("canvas");
	cw = document.getElementById("canvasWrapper");
	img = document.getElementById("img");
	// Settings
	zim = 1; //Zoom Increment Style : 0 (addition) | 1 (multpiplication)
	// Parameters
	peakMode;
	zoomLvl = 1;
	peakZoomLvl = 4;
	// Private Data
	reScale;
	vp_pt_x;
	vp_pt_y;
	img_pt_x;
	img_pt_y;
	lst_clk_x;
	lst_clk_y;
	shifting;
	resizing;
	newBox = false;
	ctr_x = this.img.naturalWidth / 2;
	ctr_y = this.img.naturalHeight / 2;
	tmp_x;
	tmp_y;
	labels = [];
	constructor(){
		
		//EVENT LISTENERS
		window.addEventListener("resize", ()=>this.resize());
		this.cc.addEventListener("mousemove", e=>{

			// get 0->1 scale mouse pointer pos in canvas wrapper
			let rect = this.cw.getBoundingClientRect();
			let rectc = this.c.getBoundingClientRect();
			this.vp_pt_x = (e.clientX - rect.left) / rect.width;
			this.vp_pt_y = (e.clientY - rect.top) / rect.height;
			this.img_pt_x = this.frameScale(e.clientX - rectc.left);
			this.img_pt_y = this.frameScale(e.clientY - rectc.top);
			if (this.resizing){
				this.resizing.pull();
			} else if (this.shifting) {
				let x = this.tmp_x - (e.clientX - this.lst_clk_x) / this.reScale / this.zoomLvl;
				let y = this.tmp_y - (e.clientY - this.lst_clk_y) / this.reScale / this.zoomLvl;
				this.moveCtr(x, y);
			} else if (this.moving)
				this.moving.move();
			if(this.peakMode) {
				this.transform();
			}
		});
		this.cc.addEventListener('contextmenu', event => event.preventDefault());
		this.c.addEventListener('hold', event => event.preventDefault());
		this.cc.addEventListener("wheel", e=> {
			this.zoom(e.deltaY / 50);
		});
		this.cc.addEventListener("mousedown", e=> {
			if (e.button == 0)
			{
				
				this.lst_clk_x = e.clientX;
				this.lst_clk_y = e.clientY;
				this.tmp_x = this.ctr_x;
				this.tmp_y = this.ctr_y;
				if (this.newBox == true){
					this.createBox();
					this.newBox = false;
					return;
				}
				console.log("prout");
				this.shifting = true;
			} else if (e.button == 2){
				this.peakMode = true;
				this.transform()
			}

			// this.transform();
		});
		this.cc.addEventListener("mouseup", e=> {
			if (e.button == 0){
				this.shifting = false;
				this.stopResizing();
				this.moving = null;
			}
			else if (e.button == 2)
			{
				this.peakMode = false;
				this.transform();
			}
		});
		window.addEventListener("keydown", e=>{
			console.log(e.key);
			if (e.key == "l") {
				this.newBox = true;
			}
		});
		this.resize();
	}

	//COMMANDS
	reset(){
		this.ctr_x = this.img.naturalWidth / 2;
		this.ctr_y = this.img.naturalHeight / 2;
		this.zoomLvl = 1;
		this.transform();
	}

	zoom(deltaZoom){
		let oldZoom, zoom_factor;
		if(this.peakMode == true)
			return this.peakZoom(deltaZoom);
		if (this.zim == 0) {
			oldZoom = this.zoomLvl;
			this.zoomLvl -= deltaZoom;
			zoom_factor = this.zoomLvl / oldZoom;
		} else {
			zoom_factor = (deltaZoom < 1 ? -deltaZoom : 1 / deltaZoom)
			this.zoomLvl *= zoom_factor;
		}
		if (this.zoomLvl < 1)
			return this.reset();
		let delta_x = this.img_pt_x - this.ctr_x;
		let delta_y = this.img_pt_y - this.ctr_y;
		this.ctr_x = this.img_pt_x - delta_x / zoom_factor;
		this.ctr_y = this.img_pt_y - delta_y / zoom_factor;
		this.correctDrawings();
		this.transform();
	}

	peakZoom(deltaZoom){
		this.peakZoomLvl -= deltaZoom;
		if (this.peakZoomLvl < 1)
			this.peakZoomLvl = 1;
		this.correctDrawings();
		this.transform();
	}
	correctDrawings(){
		document.body.style.setProperty("--lbw", this.frameScale(1) + "px");
	}
	frameScale(nbrPx){
		return nbrPx / this.reScale / this.zoomLvl / (this.peakMode ? this.peakZoomLvl : 1);
	}
	moveCtr(x, y){
		this.ctr_x = x;
		this.ctr_y = y;
		this.transform();
	}

	createBox(){
		let nl = new Label(this.img_pt_x, this.img_pt_y, this);
		this.labels.push(nl);
		nl.startPull(0);
	}
	startResizing(label){
		this.resizing = label;
		this.cc.classList.add("resizing");
	}
	stopResizing() {
		this.resizing = false;
		this.cc.classList.remove("resizing");
	}
	// Private methods
	
	transform(){
		let x, y, zoom;
		if (this.peakMode) {
			x = this.ctr_x + (this.vp_pt_x * this.img.naturalWidth - this.img.naturalWidth / 2) / this.zoomLvl;
			y = this.ctr_y + (this.vp_pt_y * this.img.naturalHeight - this.img.naturalHeight / 2) / this.zoomLvl;
			zoom = this.zoomLvl * this.peakZoomLvl;
		}
		else {
			x = this.ctr_x;
			y = this.ctr_y;
			zoom = this.zoomLvl;
		}
		let deltaX = x - this.img.naturalWidth / 2;
		let deltaY = y - this.img.naturalHeight / 2;
		this.c.style.transform = "scale(" + zoom + ") translate("+ -deltaX +"px, " + -deltaY + "px) ";
	}
	resize(){
		let cc_rect = this.cc.getBoundingClientRect();
		let cc_r = cc_rect.width / cc_rect.height;
		let img_r = this.img.naturalWidth / this.img.naturalHeight;
		let scale, trans, way;
		if (img_r < cc_r){
			scale = cc_rect.height / this.img.naturalHeight;
			trans = (cc_rect.width - cc_rect.height * img_r) / 2;
			way = 'X';
		} else {
			scale = cc_rect.width / this.img.naturalWidth ;
			trans = (cc_rect.height - cc_rect.width / img_r) / 2;
			way = 'Y';
		}
		this.reScale = scale;
		this.cw.style.transform = "translate" + way + "(" + trans + "px) scale(" + scale + ")";
	}
}

canvas = new Canvas();