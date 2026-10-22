package com.querify.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "ai_models")
public class AiModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "model_id")
    private Long modelId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "model_category", nullable = false, length = 50)
    private String modelCategory;

    @Column(name = "release_year", nullable = false)
    private Integer releaseYear;

    @Column(name = "parameter_count_billions", precision = 10, scale = 2)
    private BigDecimal parameterCountBillions;

    @Column(name = "performance_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal performanceScore;

    public AiModel() {
    }

    public Long getModelId() {
        return modelId;
    }

    public void setModelId(Long modelId) {
        this.modelId = modelId;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getModelCategory() {
        return modelCategory;
    }

    public void setModelCategory(String modelCategory) {
        this.modelCategory = modelCategory;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public BigDecimal getParameterCountBillions() {
        return parameterCountBillions;
    }

    public void setParameterCountBillions(BigDecimal parameterCountBillions) {
        this.parameterCountBillions = parameterCountBillions;
    }

    public BigDecimal getPerformanceScore() {
        return performanceScore;
    }

    public void setPerformanceScore(BigDecimal performanceScore) {
        this.performanceScore = performanceScore;
    }
}
