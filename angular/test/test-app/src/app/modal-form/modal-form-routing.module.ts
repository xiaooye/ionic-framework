import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModalFormComponent } from "./modal-form.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ModalFormComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ModalFormRoutingModule { }
