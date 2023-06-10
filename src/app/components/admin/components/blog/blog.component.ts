import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent  {
  blogs : any[];
  listPage:boolean;
  newPage:boolean;
  constructor() {
    let me = this;
    let request = new XMLHttpRequest();
    request.open('GET', 'http://127.0.0.1:3001/articles');
    request.onload = function() {
      me.blogs = JSON.parse(this.responseText);
    };
    this.blogs=[{}];
    this.listPage=true;
    this.newPage=false;
    request.send();
  }
  newArticle(): void{
    this.listPage=false;
    this.newPage=true;
  }
  saveArticle(): void{
    const me=this;
    let request = new XMLHttpRequest();
    let title = document.getElementById("title") as HTMLInputElement;
    let text = document.getElementById("text") as HTMLTextAreaElement;
    if (title && text){
      if (title.value && text.value ){
        request.open('POST', 'http://127.0.0.1:3001/articles');
        request.onload = function() {
          me.listPage=true;
          me.newPage=false;
        };
        request.send(JSON.stringify({title:title.value,text:text.value}));
      }
    }

  }

}
