package com.querify.dto;

import java.util.List;

public class TableSchemaDto {

    private String tableName;
    private String description;
    private List<ColumnSchemaDto> columns;
    private List<String> foreignKeys;

    public TableSchemaDto() {
    }

    public TableSchemaDto(String tableName, String description, List<ColumnSchemaDto> columns, List<String> foreignKeys) {
        this.tableName = tableName;
        this.description = description;
        this.columns = columns;
        this.foreignKeys = foreignKeys;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<ColumnSchemaDto> getColumns() {
        return columns;
    }

    public void setColumns(List<ColumnSchemaDto> columns) {
        this.columns = columns;
    }

    public List<String> getForeignKeys() {
        return foreignKeys;
    }

    public void setForeignKeys(List<String> foreignKeys) {
        this.foreignKeys = foreignKeys;
    }
}
