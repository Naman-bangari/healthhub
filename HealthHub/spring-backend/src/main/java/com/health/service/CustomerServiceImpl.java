package com.health.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.health.dto.ConfidenceReport;
import com.health.dto.CustomerDTO;
import com.health.dto.DetectionUpdateRequest;
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
		Optional<Customer> optional = customerRepository
				.findByEmailId(customerDTO.getEmailId());
		if (optional.isPresent()) {
			throw new HealthHubException("customer mail already exist");
		}
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

	@Override
	public Integer checkAuth(String email, String password)
			throws HealthHubException {
		Optional<Customer> optional = customerRepository.findByEmailId(email);

		if (optional.isPresent())
			if (optional.get().getPassword().equals(password))
				return optional.get().getCustomerId();

		return -1;
	}

	@Override
	public Boolean updateDetection(Integer customerId,
			DetectionUpdateRequest detection) throws HealthHubException {

		Customer customer = customerRepository.findById(customerId).orElseThrow(
				() -> new HealthHubException("Customer not found"));

		try {

			float confidenceValue = detection.getConfidence();

			switch (detection.getId()) {
				case 1 : // Pneumonia
					customer.setPneumoniaConfidence(confidenceValue);
					break;
				case 2 : // Fracture
					customer.setFractureConfidence(confidenceValue);
					break;
				case 3 : // Eye Cataract
					customer.setEyeCataractConfidence(confidenceValue);
					break;
				case 4 : // Skin Disease
					customer.setSkinDiseaseConfidence(confidenceValue);
					customer.setType(detection.getType());
					break;
				default :
					throw new HealthHubException("Invalid detection ID");
			}

			customerRepository.save(customer);
			return true;

		} catch (Exception e) {
			throw new HealthHubException(
					"Confidence value is not a valid float");
		}
	}

	@Override
	public ConfidenceReport getAllDetection(Integer id)
			throws HealthHubException {
		Customer customerEntity = customerRepository.findById(id)
				.orElseThrow(() -> new HealthHubException(
						"Customer with ID " + id + " not found."));

		ConfidenceReport customer = new ConfidenceReport();
		customer.setPnemonia(customerEntity.getPneumoniaConfidence());
		customer.setSkin(customerEntity.getSkinDiseaseConfidence());
		customer.setEye_cataract(customerEntity.getEyeCataractConfidence());
		customer.setFracture(customerEntity.getFractureConfidence());
		customer.setType(customerEntity.getType());
		return customer;
	}

}
