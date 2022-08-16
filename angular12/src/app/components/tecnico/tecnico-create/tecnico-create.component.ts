import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-create',
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css']
})
export class TecnicoCreateComponent implements OnInit {

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  create(): void {
    this.serviceTecnico.create(this.tecnico).subscribe(resposta => {
      this.toast.success('Técnico cadastrado com sucesso!', 'Cadastsro');
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

  addPerfil(codigoPerfil: any): void {
    if (this.tecnico.perfis.includes(codigoPerfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(codigoPerfil), 1);
    } else {
      this.tecnico.perfis.push(codigoPerfil);
    }
  }

  validaCampos(): boolean {
    return this.nome.valid
        && this.cpf.valid
        && this.email.valid
        && this.senha.valid
  }

}