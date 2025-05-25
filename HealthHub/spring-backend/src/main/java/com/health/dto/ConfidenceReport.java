package com.health.dto;

public class ConfidenceReport {
	private Float fracture;
	private Float eye_cataract;
	private Float pnemonia;
	private Float skin;
	private String type;
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Float getFracture() {
		return fracture;
	}
	public void setFracture(Float fracture) {
		this.fracture = fracture;
	}
	public Float getEye_cataract() {
		return eye_cataract;
	}
	public void setEye_cataract(Float eye_cataract) {
		this.eye_cataract = eye_cataract;
	}
	public Float getPnemonia() {
		return pnemonia;
	}
	public void setPnemonia(Float pnemonia) {
		this.pnemonia = pnemonia;
	}
	public Float getSkin() {
		return skin;
	}
	public void setSkin(Float skin) {
		this.skin = skin;
	}

}
