import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Signo } from 'src/app/model/Signo';
import { SignoService } from 'src/app/service/signo.service';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent {

  displayedColumns: string[] = ['id', 'patient', 'fecha', 'temp', 'pulso', 'ritmo', 'actions']
  dataSource: MatTableDataSource<Signo>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number = 0;

  constructor(
    private signoService: SignoService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.signoService.getSignoChange().subscribe(data => {
      this.createTable(data);
    });

    this.signoService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
    });

    this.signoService.listPageable(0, 2).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }

  createTable(data: Signo[]) {
    this.dataSource = new MatTableDataSource(data);
  }

  delete(idSigno: number) {
    this.signoService.delete(idSigno)
      .pipe(switchMap(() => this.signoService.findAll()))
      .subscribe(data => {
        this.createTable(data);
        this.signoService.setMessageChange('DELETED!');
      });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  showMore(e: any) {
    this.signoService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }

  edit(id: number) {
    this.router.navigate(['/pages/signos/edit/',id])
  }

  nuevoSigno() {
    this.router.navigateByUrl('/pages/signos/new')
  }

  checkChildren(): boolean{
    return this.route.children.length != 0;
  }
}
