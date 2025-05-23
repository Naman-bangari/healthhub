package com.health.service;

import com.health.dto.CustomerDTO;
import com.health.dto.DetectionUpdateRequest;
import com.health.exception.HealthHubException;

public interface CustomerService {
	public Boolean getCustomerByMail(String email) throws HealthHubException;
	public CustomerDTO getCustomerById(Integer id) throws HealthHubException;
	public CustomerDTO saveCustomer(CustomerDTO customer)
			throws HealthHubException;
	public Integer checkAuth(String email, String password)
			throws HealthHubException;
	public Boolean updateDetection(Integer customerId,
			DetectionUpdateRequest detection) throws HealthHubException;
}
