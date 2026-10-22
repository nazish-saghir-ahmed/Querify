package com.querify.dto;

public class ColumnSchemaDto {

    private String name;
    private String type;
    private boolean nullable;
    private boolean isPrimaryKey;
    private boolean isForeignKey;
    private String comment;

    public ColumnSchemaDto() {
    }

    public ColumnSchemaDto(String name, String type, boolean nullable, boolean isPrimaryKey, boolean isForeignKey, String comment) {
        this.name = name;
        this.type = type;
        this.nullable = nullable;
        this.isPrimaryKey = isPrimaryKey;
        this.isForeignKey = isForeignKey;
        this.comment = comment;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isNullable() {
        return nullable;
    }

    public void setNullable(boolean nullable) {
        this.nullable = nullable;
    }

    public boolean isPrimaryKey() {
        return isPrimaryKey;
    }

    public void setPrimaryKey(boolean primaryKey) {
        isPrimaryKey = primaryKey;
    }

    public boolean isForeignKey() {
        return isForeignKey;
    }

    public void setForeignKey(boolean foreignKey) {
        isForeignKey = foreignKey;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
