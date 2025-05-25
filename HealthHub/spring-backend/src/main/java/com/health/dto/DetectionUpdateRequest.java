package com.health.dto;

public class DetectionUpdateRequest {

	private Integer id; // Customer ID
	private Float confidence; // Confidence score
	private String type;
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Float getConfidence() {
		return confidence;
	}

	public void setConfidence(Float confidence) {
		this.confidence = confidence;
	}
}
