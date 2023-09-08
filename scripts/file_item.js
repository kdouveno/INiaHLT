class FileItem {
	canvas;
	name;
	e = document.querySelector("#template>.file_item").cloneNode(true);
	e_n = this.e.querySelector(".name");
	e_v = this.e.querySelector(".visible");
	e_s = this.e.querySelector(".status");

	constructor(canvas, fileName){
		this.name = fileName;

		this.canvas = canvas;
		this.changeName(fileName);
		this.canvas.fl.append(this.e);

		this.e_n.addEventListener("dblclick", (e)=>{
			console.log(this.name + " double clicked");
		})
	}

	changeName(name){
		this.name = name;

		this.e_n.innerText = name;
		this.e_n.setAttribute("title", name);
	}

	openThis(){
		this.canvas.open(this.name);
	}
	setCurrent(){
		this.e.classList.addClass("current");
	}
	unsetCurrent(){
		this.e.classList.removeClass("current");
	}
}