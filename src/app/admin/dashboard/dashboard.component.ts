import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../../environments/environment';
import {ReportService} from '../../@core/services/report.service';
import {Router} from '@angular/router';
import {fromEvent, Subscription} from 'rxjs';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dataSource: any;
  fileUrl = 'assets/pdf.png';
  displayedColumns: string[] = ['image', 'name', 'amount', 'status', 'dates'];


  constructor(private reportService: ReportService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.reportService.getAll().subscribe(response => {
      console.log(response);
      this.dataSource = response;
      let days = '';
      this.dataSource.forEach(element => {
        if (element.generateInMonday) {
          days = 'ПН ';
        }
        if (element.generateInTuesday) {
          days += 'ВТ ';
        }
        if (element.generateInWednesday) {
          days += 'СР ';
        }
        if (element.generateInThursday) {
          days += 'ЧТ ';
        }
        if (element.generateInFriday) {
          days += 'ПТ ';
        }
        if (element.generateInSaturday) {
          days += 'СБ ';
        }
        if (element.generateInSunday) {
          days += 'ВС ';
        }
        element.days = days;
      });
    }, error => {
      console.error(error);
    });
  }

  test(row: any) {
    this.router.navigateByUrl(`/admin/counter-parties/${row.id}`);
  }


}
