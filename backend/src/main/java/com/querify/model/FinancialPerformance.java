package com.querify.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "financial_performance")
public class FinancialPerformance implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "performance_id")
    private Long performanceId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "fiscal_year", nullable = false)
    private Integer fiscalYear;

    @Column(name = "revenue_millions", nullable = false, precision = 12, scale = 2)
    private BigDecimal revenueMillions;

    @Column(name = "profit_millions", nullable = false, precision = 12, scale = 2)
    private BigDecimal profitMillions;

    @Column(name = "operating_cost_millions", nullable = false, precision = 12, scale = 2)
    private BigDecimal operatingCostMillions;

    @Column(name = "revenue_growth_percent", nullable = false, precision = 6, scale = 2)
    private BigDecimal revenueGrowthPercent;

    public FinancialPerformance() {
    }

    public Long getPerformanceId() {
        return performanceId;
    }

    public void setPerformanceId(Long performanceId) {
        this.performanceId = performanceId;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Integer getFiscalYear() {
        return fiscalYear;
    }

    public void setFiscalYear(Integer fiscalYear) {
        this.fiscalYear = fiscalYear;
    }

    public BigDecimal getRevenueMillions() {
        return revenueMillions;
    }

    public void setRevenueMillions(BigDecimal revenueMillions) {
        this.revenueMillions = revenueMillions;
    }

    public BigDecimal getProfitMillions() {
        return profitMillions;
    }

    public void setProfitMillions(BigDecimal profitMillions) {
        this.profitMillions = profitMillions;
    }

    public BigDecimal getOperatingCostMillions() {
        return operatingCostMillions;
    }

    public void setOperatingCostMillions(BigDecimal operatingCostMillions) {
        this.operatingCostMillions = operatingCostMillions;
    }

    public BigDecimal getRevenueGrowthPercent() {
        return revenueGrowthPercent;
    }

    public void setRevenueGrowthPercent(BigDecimal revenueGrowthPercent) {
        this.revenueGrowthPercent = revenueGrowthPercent;
    }
}
