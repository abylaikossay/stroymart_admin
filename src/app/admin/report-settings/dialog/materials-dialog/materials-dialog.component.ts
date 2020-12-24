import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MaterialService} from '../../../../@core/services/material.service';
import {SelectionModel} from '@angular/cdk/collections';
import {NbToastrService} from '@nebular/theme';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  mtCode: string;
  mtLink: number;
  mtMeasure: string;
  mtName: string;
  mtOwner: number;
}

@Component({
  selector: 'ngx-materials-dialog',
  templateUrl: './materials-dialog.component.html',
  styleUrls: ['./materials-dialog.component.scss'],
})
export class MaterialsDialogComponent implements OnInit {
  MATERIALS_DATA: PeriodicElement[] = [];
  dataSource = new MatTableDataSource(this.MATERIALS_DATA);
  displayedColumns: string[] = ['name', 'code', 'unit'];
  selection = new SelectionModel(true, []);


  constructor(public dialogRef: MatDialogRef<MaterialsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private materialService: MaterialService,
              private toastService: NbToastrService) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getAllMaterials(this.data.chosenMaterial.mcCode);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  getAllMaterials(id: number) {
    this.materialService.getAllMaterials(id).subscribe(response => {
      this.MATERIALS_DATA = response;
      this.dataSource = new MatTableDataSource(this.MATERIALS_DATA);
      this.data.materials.forEach(material => {
        this.dataSource.filteredData.forEach(element => {
          if (material.mtCode === element.mtCode) {
            this.selection.select(element);
          }
        });
      });
    }, error => {
      console.error(error);
    });
  }

  closeDialog() {
    this.dialogRef.close('close');
  }

  submitAndClose() {
    if (this.selection.selected.length > 10) {
      this.toastService.danger('Количество материалов превышает 10!');
    } else {
      this.dialogRef.close(this.selection.selected);

    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
