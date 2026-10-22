package com.querify.dto;

public class ChartSuggestionDto {

    private String type; // "bar", "line", "pie", or "table"
    private String xAxis;
    private String yAxis;
    private String title;

    public ChartSuggestionDto() {
    }

    public ChartSuggestionDto(String type, String xAxis, String yAxis, String title) {
        this.type = type;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getXAxis() {
        return xAxis;
    }

    public void setXAxis(String xAxis) {
        this.xAxis = xAxis;
    }

    public String getYAxis() {
        return yAxis;
    }

    public void setYAxis(String yAxis) {
        this.yAxis = yAxis;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
