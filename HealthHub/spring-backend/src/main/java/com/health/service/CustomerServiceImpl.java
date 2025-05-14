package com.health.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.health.dto.CustomerDTO;
import com.health.entity.Customer;
import com.health.exception.HealthHubException;
import com.health.repository.CustomerRepository;

import jakarta.transaction.Transactional;

@Service(value = "CustomerService")
@Transactional
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	CustomerRepository customerRepository;

	@Override
	public Boolean getCustomerByMail(String email) throws HealthHubException {
		Optional<Customer> optional;
		email = email.trim().replaceAll("\\s+", "");
		optional = customerRepository.findByEmailId(email);
		if (optional.isPresent())
			return true;

		return false;
	}

	@Override
	public CustomerDTO getCustomerById(Integer id) throws HealthHubException {
		Customer customerEntity = customerRepository.findById(id)
				.orElseThrow(() -> new HealthHubException(
						"Customer with ID " + id + " not found."));

		CustomerDTO customer = new CustomerDTO();
		customer.setCustomerId(id);
		customer.setCustomerName(customerEntity.getCustomerName());
		customer.setEmailId(customerEntity.getEmailId());
		customer.setGender(customerEntity.getGender());
		customer.setPassword(customerEntity.getPassword());
		return customer;
	}

	@Override
	public CustomerDTO saveCustomer(CustomerDTO customerDTO)
			throws HealthHubException {
		Customer customer = new Customer();
		customer.setAge(customerDTO.getAge());
		customer.setCustomerName(customerDTO.getCustomerName());
		customer.setEmailId(customerDTO.getEmailId());
		customer.setGender(customerDTO.getGender());
		customer.setPassword(customerDTO.getPassword());
		customer = customerRepository.save(customer);
		customerDTO.setCustomerId(customer.getCustomerId());
		return customerDTO;
	}

}
