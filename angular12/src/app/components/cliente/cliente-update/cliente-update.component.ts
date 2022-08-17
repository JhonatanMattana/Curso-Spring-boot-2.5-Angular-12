import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent implements OnInit {

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  cliente: Cliente = {
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dateCriacao: ''
  };

  constructor(
    private serviceCliente: ClienteService,
    private toast: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cliente.id = this.activeRoute.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.serviceCliente.findById(this.cliente.id).subscribe(resposta => {
      resposta.perfis = [];
      this.cliente = resposta;
    });
  }

  update(): void {
    this.serviceCliente.update(this.cliente).subscribe(resposta => {
      this.toast.success('Cliente atualizado com sucesso!', 'Update');
      this.router.navigate(['clientes']);
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
    if (this.cliente.perfis.includes(codigoPerfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(codigoPerfil), 1);
    } else {
      this.cliente.perfis.push(codigoPerfil);
    }
  }

  validaCampos(): boolean {
    return this.nome.valid
        && this.cpf.valid
        && this.email.valid
        && this.senha.valid
  }
}