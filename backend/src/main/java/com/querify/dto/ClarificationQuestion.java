package com.querify.dto;

import java.util.List;

public class ClarificationQuestion {

    private String questionId;
    private String prompt;
    private String context;
    private List<ClarificationOption> options;

    public ClarificationQuestion() {
    }

    public ClarificationQuestion(String questionId, String prompt, String context, List<ClarificationOption> options) {
        this.questionId = questionId;
        this.prompt = prompt;
        this.context = context;
        this.options = options;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public List<ClarificationOption> getOptions() {
        return options;
    }

    public void setOptions(List<ClarificationOption> options) {
        this.options = options;
    }
}
