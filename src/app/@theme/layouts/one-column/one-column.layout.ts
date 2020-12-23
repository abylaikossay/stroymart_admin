import {Component} from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column.layout.html',
})
export class OneColumnLayoutComponent {
  shouldRenderHeader() {
    if (window.location.pathname.includes('report-settings') || window.location.pathname.includes('recipients')) {
      return false;
    } else {
      return true;
    }
  }
}
