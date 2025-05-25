package com.health.entity;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "customers")
public class Customer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer customerId;

	@Column(name = "customerName")
	String customerName;

	@Email
	@NotNull
	@Column(name = "emailId", unique = true)
	private String emailId;

	@NotNull
	@Size(min = 6)
	private String password;

	@Column(name = "age")
	Integer age;

	@Enumerated(EnumType.STRING)
	private Gender gender;

	private Float pneumoniaConfidence;
	private Float fractureConfidence;
	private Float eyeCataractConfidence;
	private Float skinDiseaseConfidence;
	private String type;
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
	public Float getPneumoniaConfidence() {
		return pneumoniaConfidence;
	}
	public void setPneumoniaConfidence(Float pneumoniaConfidence) {
		this.pneumoniaConfidence = pneumoniaConfidence;
	}
	public Float getFractureConfidence() {
		return fractureConfidence;
	}
	public void setFractureConfidence(Float fractureConfidence) {
		this.fractureConfidence = fractureConfidence;
	}
	public Float getEyeCataractConfidence() {
		return eyeCataractConfidence;
	}
	public void setEyeCataractConfidence(Float eyeCataractConfidence) {
		this.eyeCataractConfidence = eyeCataractConfidence;
	}
	public Float getSkinDiseaseConfidence() {
		return skinDiseaseConfidence;
	}
	public void setSkinDiseaseConfidence(Float skinDiseaseConfidence) {
		this.skinDiseaseConfidence = skinDiseaseConfidence;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Override
	public String toString() {
		return "Customer [customerId=" + customerId + ", customerName="
				+ customerName + ", emailId=" + emailId + ", password="
				+ password + ", age=" + age + ", gender=" + gender
				+ ", pneumoniaConfidence=" + pneumoniaConfidence
				+ ", fractureConfidence=" + fractureConfidence
				+ ", eyeCataractConfidence=" + eyeCataractConfidence
				+ ", skinDiseaseConfidence=" + skinDiseaseConfidence + ", type="
				+ type + "]";
	}
	@Override
	public int hashCode() {
		return Objects.hash(age, customerId, customerName, emailId,
				eyeCataractConfidence, fractureConfidence, gender, password,
				pneumoniaConfidence, skinDiseaseConfidence, type);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Customer other = (Customer) obj;
		return Objects.equals(age, other.age)
				&& Objects.equals(customerId, other.customerId)
				&& Objects.equals(customerName, other.customerName)
				&& Objects.equals(emailId, other.emailId)
				&& Objects.equals(eyeCataractConfidence,
						other.eyeCataractConfidence)
				&& Objects.equals(fractureConfidence, other.fractureConfidence)
				&& gender == other.gender
				&& Objects.equals(password, other.password)
				&& Objects.equals(pneumoniaConfidence,
						other.pneumoniaConfidence)
				&& Objects.equals(skinDiseaseConfidence,
						other.skinDiseaseConfidence)
				&& Objects.equals(type, other.type);
	}

}
