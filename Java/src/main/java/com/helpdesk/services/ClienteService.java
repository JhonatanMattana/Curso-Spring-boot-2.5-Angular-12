package com.helpdesk.services;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.helpdesk.domain.Cliente;
import com.helpdesk.domain.Pessoa;
import com.helpdesk.domain.dto.ClienteDTO;
import com.helpdesk.repositories.ClienteRepository;
import com.helpdesk.repositories.PessoaRepository;
import com.helpdesk.services.exceptions.DataIntegrityViolationException;
import com.helpdesk.services.exceptions.ObjectNotFoundException;

@Service
public class ClienteService {

	@Autowired
	private ClienteRepository tecnicoRepository;
	
	@Autowired
	private PessoaRepository pessoaRepository;
	
	@Autowired
	BCryptPasswordEncoder encoder;
	
	public Cliente findById(Integer id) {
		Optional<Cliente> obj = tecnicoRepository.findById(id);
		
		return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado! ID: " + id));
	}

	public List<Cliente> findAll() {
		return tecnicoRepository.findAll();
	}
	
	public Cliente create(ClienteDTO clienteDTO) {
		clienteDTO.setId(null);
		
		clienteDTO.setSenha(encoder.encode(clienteDTO.getSenha()));
		
		validaPorCpfEEMail(clienteDTO);
		
		Cliente tecnico = new Cliente(clienteDTO);
		
		return tecnicoRepository.save(tecnico);
	}
	
	public Cliente update(Integer id, @Valid ClienteDTO clienteDTO) {
		clienteDTO.setId(id);
		
		Cliente oldCliente = findById(id);
		
		if (!clienteDTO.getSenha().equals(oldCliente.getSenha())) {
			clienteDTO.setSenha(encoder.encode(clienteDTO.getSenha()));
		}
		
		validaPorCpfEEMail(clienteDTO);
		
		oldCliente = new Cliente(clienteDTO);
		
		return tecnicoRepository.save(oldCliente);
	}
	
	public void delete(Integer id) {
		Cliente obj = findById(id);
		
		if (obj.getChamados().size() > 0) {
			throw new DataIntegrityViolationException("Técnico possui ordens de serviço e não pode ser deletado!");
		}

		tecnicoRepository.deleteById(id);
	}

	private void validaPorCpfEEMail(ClienteDTO clienteDTO) {
		Optional<Pessoa> pessoaByCpf = pessoaRepository.findByCpf(clienteDTO.getCpf());
		
		if (pessoaByCpf.isPresent() && pessoaByCpf.get().getId() != clienteDTO.getId()) {
			throw new DataIntegrityViolationException("CPF já cadastrado no sistema!");
		}
		
		Optional<Pessoa> pessoaByEmail = pessoaRepository.findByEmail(clienteDTO.getEmail());

		if (pessoaByEmail.isPresent() && pessoaByEmail.get().getId() != clienteDTO.getId()) {
			throw new DataIntegrityViolationException("E-Mail já cadastrado no sistema!");
		}
	}

}