import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeleteInfoDialogComponent} from '../delete-info-dialog/delete-info-dialog.component';
import {EditInfoDialogComponent} from '../edit-info-dialog/edit-info-dialog.component';
import {AddInfoDialogComponent} from '../add-info-dialog/add-info-dialog.component';
import {ContractorService} from '../../../../@core/services/contractor.service';
import {CategoryService} from '../../../../@core/services/category.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'ngx-additional-info-dialog',
  templateUrl: './additional-info-dialog.component.html',
  styleUrls: ['./additional-info-dialog.component.scss'],
})
export class AdditionalInfoDialogComponent implements OnInit {
  displayedColumns: string[] = ['name', 'bin', 'email', 'phone', 'actions'];
  editableCategory: boolean = false;
  MATERIALS_DATA: [] = [];
  dataSource = new MatTableDataSource(this.MATERIALS_DATA);

  constructor(public dialogRef: MatDialogRef<AdditionalInfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public matDialog: MatDialog,
              private contractorService: ContractorService,
              private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getAllContractors();
  }

  getAllContractors() {
    this.contractorService.getByCategoryId(this.data.id).subscribe(response => {
      console.log(response);
      this.MATERIALS_DATA = response;
      this.dataSource = new MatTableDataSource(this.MATERIALS_DATA);
    }, error => {
      console.error(error);
    });
  }

  closeDialog() {
    this.dialogRef.close('SALAM');
  }

  deleteCategory() {
    console.log(this.data);
    this.deleteRecipient(this.data, 'category');
  }

  deleteRecipient(recipient: any, type: string) {
    const deleteDialog = this.matDialog.open(DeleteInfoDialogComponent, {
      data: {element: recipient, type: type},
      width: '450px',
      panelClass: 'delete-recipient-dialog',
    });
    deleteDialog.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'delete') {
        this.closeDialog();
      } else {
        this.getAllContractors();
      }
    });
  }

  editRecipient(recipient: any) {
    const editDialog = this.matDialog.open(EditInfoDialogComponent, {
      data: recipient,
      panelClass: 'additional-info-modal',
      width: '80vw',
      height: '80vh',
    });
    editDialog.afterClosed().subscribe(result => {
      this.getAllContractors();
    });
  }

  addNewRecipient() {
    const addInfoDialog = this.matDialog.open(AddInfoDialogComponent, {
      panelClass: 'additional-info-modal',
      data: {element: this.data, type: 'exists'},
      width: '75vw',
    });
    addInfoDialog.afterClosed().subscribe(result => {
      this.getAllContractors();
    });
  }

  editCategory() {
    console.log(this.data);
    this.categoryService.editCategory(this.data).subscribe(resp => {
      console.log(resp);
      this.editableCategory = false;
    }, error => {
      console.error(error);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
