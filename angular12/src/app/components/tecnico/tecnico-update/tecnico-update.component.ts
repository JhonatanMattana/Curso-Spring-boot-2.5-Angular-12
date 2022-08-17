import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {

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

  update(): void {
    this.serviceTecnico.update(this.tecnico).subscribe(resposta => {
      this.toast.success('Técnico atualizado com sucesso!', 'Update');
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