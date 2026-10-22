package com.querify.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "ai_investments")
public class AiInvestment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "investment_id")
    private Long investmentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "investment_year", nullable = false)
    private Integer investmentYear;

    @Column(name = "investment_amount_millions", nullable = false, precision = 12, scale = 2)
    private BigDecimal investmentAmountMillions;

    @Column(name = "investment_category", nullable = false, length = 100)
    private String investmentCategory;

    @Column(name = "estimated_return_percent", nullable = false, precision = 6, scale = 2)
    private BigDecimal estimatedReturnPercent;

    public AiInvestment() {
    }

    public Long getInvestmentId() {
        return investmentId;
    }

    public void setInvestmentId(Long investmentId) {
        this.investmentId = investmentId;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Integer getInvestmentYear() {
        return investmentYear;
    }

    public void setInvestmentYear(Integer investmentYear) {
        this.investmentYear = investmentYear;
    }

    public BigDecimal getInvestmentAmountMillions() {
        return investmentAmountMillions;
    }

    public void setInvestmentAmountMillions(BigDecimal investmentAmountMillions) {
        this.investmentAmountMillions = investmentAmountMillions;
    }

    public String getInvestmentCategory() {
        return investmentCategory;
    }

    public void setInvestmentCategory(String investmentCategory) {
        this.investmentCategory = investmentCategory;
    }

    public BigDecimal getEstimatedReturnPercent() {
        return estimatedReturnPercent;
    }

    public void setEstimatedReturnPercent(BigDecimal estimatedReturnPercent) {
        this.estimatedReturnPercent = estimatedReturnPercent;
    }
}
