import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AdditionalInfoDialogComponent} from './dialog/additional-info-dialog/additional-info-dialog.component';
import {NewCategoryDialogComponent} from './dialog/new-category-dialog/new-category-dialog.component';
import {CategoryService} from '../../@core/services/category.service';
import {ReportService} from '../../@core/services/report.service';
import {NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-recipients',
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.scss'],
})
export class RecipientsComponent implements OnInit {
  id: number;
  categories: any = [];
  chosenCategories: any = [];

  constructor(private activateRoute: ActivatedRoute,
              public matDialog: MatDialog,
              private router: Router,
              private categoryService: CategoryService,
              private reportService: ReportService,
              private toastService: NbToastrService) {
    this.id = this.activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getChosenCategories();
  }

  async getCategories() {
    this.categoryService.getAll().subscribe(response => {
      this.categories = response;
      //
      // response.forEach(element => {
      //   if (!this.chosenCategories.some(chosenCategory => chosenCategory.id === element.id)) {
      //     this.categories.push(element);
      //   }
      // });
      console.log(this.categories);
    }, error => {
      console.error(error);
    });
  }

  async getChosenCategories() {
    this.categoryService.getByReportId(this.id).subscribe(async response => {
      this.chosenCategories = response;
      console.log(this.chosenCategories);
      await this.getCategories();
    }, error => {
      console.error(error);
    });
  }

  goToInfo(category: any) {
    const dialogRef = this.matDialog.open(AdditionalInfoDialogComponent, {
      data: category,
      panelClass: 'additional-info-modal',
      width: '100vw',
      height: '100vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getChosenCategories();
    });
  }

  deleteChosen(chosenCategory: any, i: any) {
    this.chosenCategories.splice(i, 1);
    // this.categories.push(chosenCategory);
  }

  addToChosen(category: any, i: any) {
    // this.categories.splice(i, 1);
    let exists = false;
    this.chosenCategories.forEach(element => {
      if (element.id === category.id) {
        exists = true;
      }
    });
    if (!exists) {
      this.chosenCategories.push(category);
    }
  }

  addNewCategory() {
    const newCategoryDialog = this.matDialog.open(NewCategoryDialogComponent, {
      data: this.id,
      panelClass: 'additional-info-modal',
      width: '100vw',
      height: '100vh',
    });
    newCategoryDialog.afterClosed().subscribe(result => {
      this.getCategories();
    });
  }

  saveAndReturn() {
    const categories = [];
    this.chosenCategories.forEach(category => {
      categories.push(category.id);
    });
    this.reportService.addCategoriesList(categories, this.id).subscribe(response => {
      this.toastService.success('Категории успешно обновлены');
      this.router.navigateByUrl(`/admin/report-settings/${this.id}`);
    }, error => {
      console.error(error);
      this.toastService.danger('Ошибка при добавлении категории');
    });
    // this.router.navigateByUrl(`/admin/report-settings/${this.id}`);
  }
}
