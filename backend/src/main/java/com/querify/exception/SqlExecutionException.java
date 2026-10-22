package com.querify.exception;

public class SqlExecutionException extends RuntimeException {
    public SqlExecutionException(String message, Throwable cause) {
        super(message, cause);
    }

    public SqlExecutionException(String message) {
        super(message);
    }
}
