package com.querify.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "research_projects")
public class ResearchProject implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long projectId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "project_name", nullable = false, length = 150)
    private String projectName;

    @Column(name = "research_area", nullable = false, length = 100)
    private String researchArea;

    @Column(name = "budget_millions", nullable = false, precision = 10, scale = 2)
    private BigDecimal budgetMillions;

    @Column(name = "project_status", nullable = false, length = 50)
    private String projectStatus;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    public ResearchProject() {
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getResearchArea() {
        return researchArea;
    }

    public void setResearchArea(String researchArea) {
        this.researchArea = researchArea;
    }

    public BigDecimal getBudgetMillions() {
        return budgetMillions;
    }

    public void setBudgetMillions(BigDecimal budgetMillions) {
        this.budgetMillions = budgetMillions;
    }

    public String getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(String projectStatus) {
        this.projectStatus = projectStatus;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
}
