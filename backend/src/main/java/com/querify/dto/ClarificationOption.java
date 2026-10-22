package com.querify.dto;

public class ClarificationOption {

    private String id;
    private String label;
    private String description;
    private String value;

    public ClarificationOption() {
    }

    public ClarificationOption(String id, String label, String description, String value) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.value = value;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
