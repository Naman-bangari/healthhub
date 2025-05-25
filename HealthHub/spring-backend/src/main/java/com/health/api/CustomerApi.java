package com.health.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.health.dto.ConfidenceReport;
import com.health.dto.CustomerDTO;
import com.health.dto.DetectionUpdateRequest;
import com.health.exception.HealthHubException;
import com.health.service.CustomerService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/health")
public class CustomerApi {
	@Autowired
	CustomerService customerService;

	@GetMapping(value = "/checkMail/{email}")
	public ResponseEntity<Boolean> checkCustomer(@PathVariable String email)
			throws HealthHubException {

		Boolean isPresent = false;
		try {
			isPresent = customerService.getCustomerByMail(email);
		} catch (HealthHubException e) {
			throw new HealthHubException("no customer found " + e.getMessage());
		}
		return new ResponseEntity<>(isPresent, HttpStatus.OK);
	}

	@GetMapping("/check/{id}")
	public ResponseEntity<CustomerDTO> getCustomer(@PathVariable Integer id)
			throws HealthHubException {
		return new ResponseEntity<>(customerService.getCustomerById(id),
				HttpStatus.OK);
	}

	@PostMapping("/addCustomer")
	public ResponseEntity<CustomerDTO> addCustomer(
			@Valid @RequestBody CustomerDTO customerDTO, BindingResult result)
			throws HealthHubException {
		if (result.hasErrors()) {
			StringBuilder errorMessage = new StringBuilder("Invalid input: ");
			result.getAllErrors().forEach(error -> errorMessage
					.append(error.getDefaultMessage()).append(" "));
			throw new HealthHubException(errorMessage.toString().trim());
		}

		CustomerDTO customer = customerService.saveCustomer(customerDTO);
		return new ResponseEntity<>(customer, HttpStatus.CREATED);
	}

	@GetMapping("/checkAuth/{email}/{password}")
	public ResponseEntity<Integer> checkAuth(@PathVariable String email,
			@PathVariable String password) throws HealthHubException {

		return new ResponseEntity<>(customerService.checkAuth(email, password),
				HttpStatus.OK);
	}

	@PutMapping("/updateDetection/{customerId}")
	public ResponseEntity<Boolean> putDetails(@PathVariable Integer customerId,
			@RequestBody DetectionUpdateRequest detection)
			throws HealthHubException {
		boolean success = customerService.updateDetection(customerId,
				detection);

		return new ResponseEntity<>(success, HttpStatus.OK);
	}

	@GetMapping("/getAllDetection/{id}")
	public ResponseEntity<ConfidenceReport> getAllDetection(
			@PathVariable Integer id) throws HealthHubException {

		return new ResponseEntity<>(customerService.getAllDetection(id),
				HttpStatus.OK);
	}

}
