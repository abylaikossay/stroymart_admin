import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CategoryService} from '../../../../@core/services/category.service';

@Component({
  selector: 'ngx-additional-info-mat-dialog',
  templateUrl: './additional-info-mat-dialog.component.html',
  styleUrls: ['./additional-info-mat-dialog.component.scss'],
})
export class AdditionalInfoMatDialogComponent implements OnInit {
  displayedColumns: string[] = ['name', 'bin', 'email', 'phone'];
  categories: any;

  constructor(
    public dialogRef: MatDialogRef<AdditionalInfoMatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.getCategoriesByReportId();
  }

  getCategoriesByReportId() {
    this.categoryService.getById(this.data).subscribe(response => {
      console.log(response);
      this.categories = response;
    }, error => {
      console.error(error);
    });
  }

  closeDialog() {
    this.dialogRef.close('SALAM');
  }
}
