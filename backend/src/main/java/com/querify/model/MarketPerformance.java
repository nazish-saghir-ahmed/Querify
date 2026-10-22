package com.querify.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "market_performance")
public class MarketPerformance implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "market_id")
    private Long marketId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "fiscal_year", nullable = false)
    private Integer fiscalYear;

    @Column(name = "market_share_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal marketSharePercent;

    @Column(name = "customer_growth_percent", nullable = false, precision = 6, scale = 2)
    private BigDecimal customerGrowthPercent;

    @Column(name = "performance_index", nullable = false, precision = 5, scale = 2)
    private BigDecimal performanceIndex;

    public MarketPerformance() {
    }

    public Long getMarketId() {
        return marketId;
    }

    public void setMarketId(Long marketId) {
        this.marketId = marketId;
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

    public BigDecimal getMarketSharePercent() {
        return marketSharePercent;
    }

    public void setMarketSharePercent(BigDecimal marketSharePercent) {
        this.marketSharePercent = marketSharePercent;
    }

    public BigDecimal getCustomerGrowthPercent() {
        return customerGrowthPercent;
    }

    public void setCustomerGrowthPercent(BigDecimal customerGrowthPercent) {
        this.customerGrowthPercent = customerGrowthPercent;
    }

    public BigDecimal getPerformanceIndex() {
        return performanceIndex;
    }

    public void setPerformanceIndex(BigDecimal performanceIndex) {
        this.performanceIndex = performanceIndex;
    }
}
