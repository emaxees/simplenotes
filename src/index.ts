import * as jQuery from 'jquery'
import * as _ from 'lodash';
import * as dragula from 'dragula';

interface INotes {
  id: number,
  title: string,
  description: string,
  image: Blob
}

export default class Main {

  notes: INotes[] = [];

  constructor() {

    let notes = localStorage.getItem('notes');

    if (notes) {
      this.notes = JSON.parse(notes);
      this.initApp();
      this.renderList();
    } else {
      this.initApp();
    }
  }

  private initApp() {
    jQuery(document).ready(() => {
      this.clickListener();
      this.initDrag();
    });
  };

  private clickListener() {
    jQuery("#add-target").click(() => {
      this.addNote();
    });
  };

  private onChageListener() {
    jQuery("input[type='text']").keyup(($event) => {
      this.updateInput($event.target.id, $event.target.value);
      this.updateLocalStorage();
    });

    jQuery("textarea").keyup(($event) => {
      this.updateTextArea($event.target.id, $event.target.value);
      this.updateLocalStorage();
    });

    jQuery("input[type='file']").change(($event) => {
      this.uploadImage($event.target.id,$event.target.files);
    });
  };

  public initDrag() {
    let drag = dragula([document.querySelector('#note-list')], {
      revertOnSpill: true
    }).on('drop', (el) => {

      let order = _.map(drag.containers[0].children, (ele: any) => {
        return ele.id;
      });
      this.notes = this.orderNotes(order);
      this.updateLocalStorage();
    });
  }

  public orderNotes(order: number[]): INotes[] {
    let result = []

    _.forEach(order, (value) => {
      _.forEach(this.notes, (ele) => {
        if (ele.id == value) result.push(ele);
      });
    });

    return result;
  };

  public updateInput(id: number, value: string) {
    let index = _.findIndex(this.notes, (ele) => { return ele.id == id; });

    if (index != -1) {
      this.notes[index].title = value;
    };
  };

  public updateTextArea(id: number, value: string) {
    let index = _.findIndex(this.notes, (ele) => { return ele.id == id; });

    if (index != -1) {
      this.notes[index].description = value;
    };
  };

  public updateLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  public renderList() {
    for (let note of this.notes) {
      let ele = `<li id="` + note.id + `">
                    <a>
                      <input id="`+ note.id + `" type="text" placeholder="Enter title" value="` + note.title + `"></input>
                      <textarea id="`+ note.id + `" placeholder="Enter description">` + note.description + `</textarea>
                      <img <img id="image-`+note.id+`" src="data:image/png;base64,`+ note.image + `">
                      <label for="load-file">Load a file:</label>
                      <input type="file" id="load-file-`+note.id+`">
                </li>`;
      jQuery("#note-list").append(ele);
    }
    this.onChageListener();
  }

  public addNote() {

    this.notes.push({
      id: this.notes.length,
      title: undefined,
      description: undefined,
      image: undefined
    });

    let index = this.notes.length - 1;
    let ele = `<li id="` + this.notes[index].id + `">
                  <a>
                    <input id="`+ this.notes[index].id + `" type="text" placeholder="Enter title" value="` + this.notes[index].title + `"></input>
                    <textarea id="`+ this.notes[index].id + `" placeholder="Enter description">` + this.notes[index].description + `</textarea>
                    <img id="image-`+this.notes[index].id+`" src="data:image/png;base64,`+ this.notes[index].image + `">
                    <label for="load-file">Load a file:</label>
                    <input type="file" id="load-file">
                  </a>
              </li>`;

    jQuery("#note-list").append(ele);

    this.onChageListener();
  };

  public uploadImage(id:string,files:File[]) {

    let selector = "image-"+id;
    let preview = jQuery(selector);

    let file = files[0]
    let reader  = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
      console.log(preview.src);
    }

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }

  };
}

let start = new Main();
