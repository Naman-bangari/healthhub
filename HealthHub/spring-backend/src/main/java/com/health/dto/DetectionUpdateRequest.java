package com.health.dto;

public class DetectionUpdateRequest {

	private Integer id; // Customer ID
	private byte[] image; // Actual image bytes
	private Float confidence; // Confidence score

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	public Float getConfidence() {
		return confidence;
	}

	public void setConfidence(Float confidence) {
		this.confidence = confidence;
	}
}
