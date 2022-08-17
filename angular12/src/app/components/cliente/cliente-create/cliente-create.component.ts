import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {

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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  create(): void {
    this.serviceCliente.create(this.cliente).subscribe(resposta => {
      this.toast.success('Cliente cadastrado com sucesso!', 'Cadastrado');
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