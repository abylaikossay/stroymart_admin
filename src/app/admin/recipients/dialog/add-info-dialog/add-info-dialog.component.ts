import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ContractorService} from '../../../../@core/services/contractor.service';
import {NbToastrService} from '@nebular/theme';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'ngx-add-info-dialog',
  templateUrl: './add-info-dialog.component.html',
  styleUrls: ['./add-info-dialog.component.scss'],
})
export class AddInfoDialogComponent implements OnInit {
  receivers: any = [];
  selection = new SelectionModel(true, []);
  displayedColumns: string[] = ['title', 'bin', 'emailAddress', 'contactPhone'];

  constructor(public dialogRef: MatDialogRef<AddInfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private contractorService: ContractorService,
              private toastService: NbToastrService) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getAllCompanies();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.receivers.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.receivers.forEach(row => this.selection.select(row));
  }


  closeDialog(message: any) {
    this.dialogRef.close(message);
  }

  getAllCompanies() {
    this.contractorService.getAll().subscribe(response => {
      const arr = [];
      response.forEach(element => {
        if (element.categoryID === null) {
          arr.push(element);
        }
      });
      this.receivers = arr;
    }, error => {
      console.error(error);
    });
  }

  newCompany() {
    if (this.data.type === 'new') {
      this.selection.selected.forEach(element => {
        element.categoryID = this.data.element.id;
      });
      this.closeDialog(this.selection.selected);
    } else if (this.data.type === 'exists') {
      const arr = [];
      this.selection.selected.forEach(element => {
        element.categoryID = this.data.element.id;
        arr.push(this.contractorService.updateContractor(element).toPromise().then());
      });
      Promise.all(arr).then(resp => this.closeDialog(resp));
    }

    // this.receivers;
    // if (typeof this.data === 'string') {
    //   this.dialogRef.close(this.company);
    //   // this.company.category = {categoryName: this.data,
    //   //   description: ''};
    // } else if (typeof this.data === 'object') {
    //   this.company.category = this.data;
    //   this.contractorService.addNewContractor(this.company).subscribe(data => {
    //     this.toastService.success('Успешно!');
    //     this.dialogRef.close(data);
    //   }, error => {
    //     this.toastService.danger('Ошибка!');
    //     this.dialogRef.close('close');
    //   });
    // }
    // this.contractorService.addNewContractor(this.company).subscribe(data => {
    //   console.log(data);
    //   this.tostService.success('Успешно!');
    //   this.dialogRef.close(data);
    // }, error => {
    //   console.error(error);
    //   this.tostService.danger('Ошибка!');
    //   this.dialogRef.close('close');
    // });
  }
}
