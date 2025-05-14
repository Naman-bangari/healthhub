package com.health.dto;

import java.util.Objects;

import com.health.entity.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CustomerDTO {

	private Integer customerId;
	@NotNull(message = "Customer name cannot be null")
	private String customerName;

	@Email(message = "Email should be valid")
	@NotNull(message = "Email cannot be null")
	private String emailId;

	@NotNull(message = "Password cannot be null")
	@Size(min = 6, message = "Password must be at least 6 characters long")
	private String password;

	@NotNull(message = "Age cannot be null")
	private Integer age;

	@NotNull(message = "Gender cannot be null")
	private Gender gender;

	public Integer getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	@Override
	public int hashCode() {
		return Objects.hash(age, customerId, customerName, emailId, gender,
				password);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CustomerDTO other = (CustomerDTO) obj;
		return Objects.equals(age, other.age)
				&& Objects.equals(customerId, other.customerId)
				&& Objects.equals(customerName, other.customerName)
				&& Objects.equals(emailId, other.emailId)
				&& gender == other.gender
				&& Objects.equals(password, other.password);
	}

	@Override
	public String toString() {
		return "CustomerDTO [customerId=" + customerId + ", customerName="
				+ customerName + ", emailId=" + emailId + ", password="
				+ password + ", age=" + age + ", gender=" + gender + "]";
	}

}
