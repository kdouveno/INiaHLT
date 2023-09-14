class FileItem {
	canvas;
	name;
	index;
	e = document.querySelector("#template>.file_item").cloneNode(true);
	e_n = this.e.querySelector(".name");
	e_v = this.e.querySelector(".visible");
	e_s = this.e.querySelector(".status");

	constructor(canvas, fileName, index){
		this.name = fileName;
		this.index = index;
		this.canvas = canvas;
		this.changeName(fileName);
		this.canvas.fl.append(this.e);

		this.e_n.addEventListener("dblclick", ()=>{
			this.openThis();
		})
	}

	changeName(name){
		this.name = name;

		this.e_n.innerText = name + " [" + (this.index + 1) + "]";
		this.e_n.setAttribute("title", name);
	}

	openThis(){
		this.canvas.openImage(this.name);
	}
	setCurrent(){
		this.e.classList.addClass("current");
	}
	unsetCurrent(){
		this.e.classList.removeClass("current");
	}
}