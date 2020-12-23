import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CounterPartiesRoutingModule} from './counter-parties-routing.module';
import {CounterPartiesComponent} from './counter-parties.component';
import {NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbToggleModule} from '@nebular/theme';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {AdditionalInfoMatDialogComponent} from './dialog/additional-info-mat-dialog/additional-info-mat-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';


@NgModule({
  declarations: [CounterPartiesComponent,
    AdditionalInfoMatDialogComponent,
  ],
  imports: [
    CommonModule,
    CounterPartiesRoutingModule,
    NbCardModule,
    MatTableModule,
    NbButtonModule,
    NbToggleModule,
    MatDialogModule,
    FormsModule,
    NbInputModule,
    NbIconModule,
    MatSlideToggleModule,
    MatSliderModule,
  ],
  entryComponents: [AdditionalInfoMatDialogComponent],
})
export class CounterPartiesModule {
}
