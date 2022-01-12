import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ModalFormRoutingModule } from "./modal-form-routing.module";
import { ModalFormComponent } from "./modal-form.component";

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, ModalFormRoutingModule],
  declarations: [ModalFormComponent]
})
export class ModalFormModule { }
