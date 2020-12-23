import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {MatTableModule} from '@angular/material/table';
import {NbCardModule} from '@nebular/theme';
import {AngularSplitModule} from 'angular-split';


@NgModule({
  declarations: [DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatTableModule,
        NbCardModule,
        AngularSplitModule,
    ],
})
export class DashboardModule { }
