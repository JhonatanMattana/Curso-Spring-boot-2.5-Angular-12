import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-list',
  templateUrl: './tecnico-list.component.html',
  styleUrls: ['./tecnico-list.component.css']
})
export class TecnicoListComponent implements OnInit {

  // tecnico fake
  // ELEMENT_DATA: Tecnico[] = [
  //   {
  //     id: 1,
  //     nome: 'Jhonatan',
  //     cpf: '056.658.756-50',
  //     email: 'jhonatan@outlook.com',
  //     senha: '1234',
  //     perfis: ['0'],
  //     dateCriacao: '01/02/2022'
  //   }
  // ]

  ELEMENT_DATA: Tecnico[] = [];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'acoes'];
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    private serice: TecnicoService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.serice.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta;
      this.dataSource = new MatTableDataSource<Tecnico>(resposta);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}