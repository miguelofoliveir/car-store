import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedInLayoutRoutingModule } from './logged-in-layout-routing.module';
import { LoggedInLayoutComponent } from './logged-in-layout.component';
import { SharedModule } from './../../shared/shared.module';

@NgModule({
  declarations: [LoggedInLayoutComponent],
  imports: [
    CommonModule,
    LoggedInLayoutRoutingModule,
    SharedModule
  ],
})
export class LoggedInLayoutModule {}
