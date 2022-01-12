import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-modal-form',
  templateUrl: 'modal-form.component.html'
})
export class ModalFormComponent {

  form = this.fb.group({
    input: ['Red'],
    select: ['Red'],
    textarea: ['Red'],
    datetime: []
  });

  inputModel = 'Red';
  selectModel = 'Red';
  textareaModel = 'Red';
  datetimeModel = '';

  constructor(private fb: FormBuilder) { }

  onFormControlIonChange(ev: CustomEvent) {
    console.log(`[formControl][${(ev.target as HTMLElement).tagName.toLowerCase()}]`, ev.detail);
  }

  onModelIonChange(ev: CustomEvent) {
    console.log(`[ngModel][${(ev.target as HTMLElement).tagName.toLowerCase()}]`, ev.detail);
  }
}
