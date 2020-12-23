import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddInfoDialogComponent} from '../add-info-dialog/add-info-dialog.component';
import {EditInfoDialogComponent} from '../edit-info-dialog/edit-info-dialog.component';
import {DeleteInfoDialogComponent} from '../delete-info-dialog/delete-info-dialog.component';
import {ContractorService} from '../../../../@core/services/contractor.service';
import {CategoryService} from '../../../../@core/services/category.service';
import {NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.scss'],
})
export class NewCategoryDialogComponent implements OnInit {
  categoryName: string = '';
  receivers: any = [];
  category: any = null;
  displayedColumns: string[] = ['name', 'bin', 'email', 'phone', 'actions'];


  constructor(public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public matDialog: MatDialog,
              private categoryService: CategoryService,
              private toastService: NbToastrService,
              private contractorService: ContractorService) {
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  closeDialog() {
    console.log(this.category);
    if (this.category !== null) {
      this.categoryService.deleteCategory(this.category.id).subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
    }
    this.dialogRef.close('close');
  }


  saveCategory() {
    if (this.category !== null) {
      const arr = [];
      this.receivers.forEach(element => {
        arr.push(this.contractorService.updateContractor(element).toPromise().then());
      });
      // @ts-ignore
      Promise.allSettled(arr).then(resp => {
        console.log(resp);
        resp.forEach(element => {
          if (element.status === 'rejected') {
            this.toastService.danger('Ошибка');
            throw new Error('Ошибка');
          }
        });
      }).then(resp1 => {
        this.toastService.success('Успешно добавлена категория');
        this.dialogRef.close('close');
      });
    } else {
      this.toastService.danger('Ошибка при сохранении категории!');
    }
    // const object = {
    //   categoryName: this.categoryName,
    //   description: '',
    //   contractors : this.receivers,
    // };
    // this.categoryService.addNewCategoryWithContractor(object).subscribe(response => {
    //   this.toastService.success('Успешно');
    //   console.log(response);
    //   this.dialogRef.close(response);
    // }, error => this.toastService.danger('Ошибка'));

  }

  deleteRecipient(recipient: any, i: number) {
    this.receivers.splice(i, 1);
  }

  addNewCompany() {
    const category = {
      name: this.categoryName,
      description: '',
    };
    this.categoryService.addNew(category).subscribe(response => {
      this.category = response;
      console.log(response);
      const addInfoDialog = this.matDialog.open(AddInfoDialogComponent, {
        panelClass: 'additional-info-modal',
        data: {element: response, type: 'new'},
        width: '70vw',
        maxWidth: '100vw',

      });
      addInfoDialog.afterClosed().subscribe(result => {
        if (typeof result === 'object') {
          this.receivers = result;
        }
        console.log(this.receivers);
      });
    }, error => {
      console.error(error);
      this.toastService.danger('Невозможно добавить категорию');
    });
  }
}
