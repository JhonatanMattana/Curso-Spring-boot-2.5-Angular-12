package com.helpdesk.services;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.helpdesk.domain.Pessoa;
import com.helpdesk.domain.Tecnico;
import com.helpdesk.domain.dto.TecnicoDTO;
import com.helpdesk.repositories.PessoaRepository;
import com.helpdesk.repositories.TecnicoRepository;
import com.helpdesk.services.exceptions.DataIntegrityViolationException;
import com.helpdesk.services.exceptions.ObjectNotFoundException;

@Service
public class TecnicoService {

	@Autowired
	private TecnicoRepository tecnicoRepository;
	
	@Autowired
	private PessoaRepository pessoaRepository;
	
	public Tecnico findById(Integer id) {
		Optional<Tecnico> obj = tecnicoRepository.findById(id);
		
		return obj.orElseThrow(() -> new ObjectNotFoundException("Objeto não encontrado! ID: " + id));
	}

	public List<Tecnico> findAll() {
		return tecnicoRepository.findAll();
	}
	
	public Tecnico create(TecnicoDTO tecnicoDTO) {
		tecnicoDTO.setId(null);
		
		validaPorCpfEEMail(tecnicoDTO);
		
		Tecnico tecnico = new Tecnico(tecnicoDTO);
		
		return tecnicoRepository.save(tecnico);
	}
	
	public Tecnico update(Integer id, @Valid TecnicoDTO tecnicoDTO) {
		tecnicoDTO.setId(id);
		
		Tecnico oldTecnico = findById(id);
		
		validaPorCpfEEMail(tecnicoDTO);
		
		oldTecnico = new Tecnico(tecnicoDTO);
		
		return tecnicoRepository.save(oldTecnico);
	}
	
	public void delete(Integer id) {
		Tecnico obj = findById(id);
		
		if (obj.getChamados().size() > 0) {
			throw new DataIntegrityViolationException("Técnico possui ordens de serviço e não pode ser deletado!");
		}

		tecnicoRepository.deleteById(id);
	}

	private void validaPorCpfEEMail(TecnicoDTO tecnicoDTO) {
		Optional<Pessoa> pessoaByCpf = pessoaRepository.findByCpf(tecnicoDTO.getCpf());
		
		if (pessoaByCpf.isPresent() && pessoaByCpf.get().getId() != tecnicoDTO.getId()) {
			throw new DataIntegrityViolationException("CPF já cadastrado no sistema!");
		}
		
		Optional<Pessoa> pessoaByEmail = pessoaRepository.findByEmail(tecnicoDTO.getEmail());

		if (pessoaByEmail.isPresent() && pessoaByEmail.get().getId() != tecnicoDTO.getId()) {
			throw new DataIntegrityViolationException("E-Mail já cadastrado no sistema!");
		}
	}

}