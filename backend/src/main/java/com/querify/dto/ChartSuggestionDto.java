package com.querify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ChartSuggestionDto {

    @JsonProperty("type")
    private String type; // "bar", "line", "pie", or "table"

    @JsonProperty("xAxis")
    private String xAxis;

    @JsonProperty("yAxis")
    private String yAxis;

    @JsonProperty("title")
    private String title;

    public ChartSuggestionDto() {
    }

    public ChartSuggestionDto(String type, String xAxis, String yAxis, String title) {
        this.type = type;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.title = title;
    }

    @JsonProperty("type")
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @JsonProperty("xAxis")
    public String getXAxis() {
        return xAxis;
    }

    public void setXAxis(String xAxis) {
        this.xAxis = xAxis;
    }

    @JsonProperty("yAxis")
    public String getYAxis() {
        return yAxis;
    }

    public void setYAxis(String yAxis) {
        this.yAxis = yAxis;
    }

    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
