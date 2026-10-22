package com.querify.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "companies")
public class Company implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_name", nullable = false, unique = true, length = 100)
    private String companyName;

    @Column(name = "industry", nullable = false, length = 100)
    private String industry;

    @Column(name = "country", nullable = false, length = 50)
    private String country;

    @Column(name = "founded_year", nullable = false)
    private Integer foundedYear;

    @Column(name = "company_type", nullable = false, length = 50)
    private String companyType;

    @Column(name = "headquarters_city", nullable = false, length = 100)
    private String headquartersCity;

    public Company() {
    }

    public Company(Long companyId, String companyName, String industry, String country, Integer foundedYear, String companyType, String headquartersCity) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.industry = industry;
        this.country = country;
        this.foundedYear = foundedYear;
        this.companyType = companyType;
        this.headquartersCity = headquartersCity;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Integer getFoundedYear() {
        return foundedYear;
    }

    public void setFoundedYear(Integer foundedYear) {
        this.foundedYear = foundedYear;
    }

    public String getCompanyType() {
        return companyType;
    }

    public void setCompanyType(String companyType) {
        this.companyType = companyType;
    }

    public String getHeadquartersCity() {
        return headquartersCity;
    }

    public void setHeadquartersCity(String headquartersCity) {
        this.headquartersCity = headquartersCity;
    }
}
