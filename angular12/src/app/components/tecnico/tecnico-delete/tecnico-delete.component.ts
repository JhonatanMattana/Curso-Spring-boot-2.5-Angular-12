import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css']
})
export class TecnicoDeleteComponent implements OnInit {

  tecnico: Tecnico = {
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dateCriacao: ''
  };

  constructor(
    private serviceTecnico: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tecnico.id = this.activeRoute.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.serviceTecnico.findById(this.tecnico.id).subscribe(resposta => {
      resposta.perfis = [];
      this.tecnico = resposta;
    });
  }

  delete(): void {
    this.serviceTecnico.delete(this.tecnico.id).subscribe(resposta => {
      this.toast.success('Técnico deletado com sucesso!', 'Delete');
      this.router.navigate(['tecnicos']);
    }, excecao => {
      if (excecao.error.errors) {
        excecao.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(excecao.error.message);
      }
    });
  }

}