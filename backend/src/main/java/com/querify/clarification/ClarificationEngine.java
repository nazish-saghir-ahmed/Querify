package com.querify.clarification;

import com.querify.dto.ClarificationOption;
import com.querify.dto.ClarificationQuestion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Intelligent Clarification Engine.
 * Analyzes natural language queries for missing parameters, conflicting interpretations,
 * and semantic ambiguity. Generates focused, multi-turn clarification questions
 * and maintains conversational context until unambiguous SQL can be generated.
 */
@Service
public class ClarificationEngine {

    private static final Logger log = LoggerFactory.getLogger(ClarificationEngine.class);
    private static final long SESSION_TTL_MS = 30 * 60 * 1000L; // 30 minutes

    private final Map<String, ClarificationSession> sessionStore = new ConcurrentHashMap<>();

    /**
     * Inspects a user's natural language question.
     * Returns an Optional ClarificationQuestion if ambiguity is detected; empty if unambiguous.
     */
    public Optional<ClarificationQuestion> detectAmbiguity(String question, int turnCount) {
        if (question == null || question.trim().isEmpty() || turnCount >= 2) {
            return Optional.empty(); // Prevent looping beyond 2 turns
        }

        String q = question.toLowerCase(Locale.ROOT).trim();

        // 1. Ambiguity: "best performing", "top company", "best company", "leading company"
        // (Only trigger if the specific metric like "revenue", "profit", "growth", "score" is NOT already explicitly stated)
        if (containsAny(q, "best performing", "top performing company", "best company", "leading ai company", "leading company", "top company") 
                && !containsAny(q, "revenue", "profit", "investment", "score", "market share", "growth")) {
            return Optional.of(new ClarificationQuestion(
                    "clarify_best_performing",
                    "What would you like to use to measure company performance?",
                    "The term 'best performing' can refer to several different business and financial metrics in the database.",
                    Arrays.asList(
                            new ClarificationOption("opt_highest_rev", "Highest Revenue", "Rank companies by their 2024 annual revenue (USD Millions)", "highest_revenue"),
                            new ClarificationOption("opt_highest_profit", "Highest Net Profit", "Rank companies by their net profitability in fiscal 2024", "highest_profit"),
                            new ClarificationOption("opt_highest_growth", "Highest Revenue Growth Rate", "Rank companies by year-over-year revenue growth percentage", "highest_revenue_growth"),
                            new ClarificationOption("opt_highest_roi", "Highest AI Investment Return", "Rank companies by estimated ROI on their AI initiatives", "highest_investment_roi")
                    )
            ));
        }

        // 2. Ambiguity: "most money", "made the most money", "financial leader", "richest"
        if (containsAny(q, "most money", "made the most", "financial leader", "richest", "who made the most")
                && !containsAny(q, "revenue", "profit", "investment")) {
            return Optional.of(new ClarificationQuestion(
                    "clarify_most_money",
                    "By 'making the most money', which financial metric do you want to analyze?",
                    "Revenue measures total gross income, whereas profit measures what remains after all operational costs.",
                    Arrays.asList(
                            new ClarificationOption("opt_rev", "Total Revenue (Top Line)", "Rank companies by total sales/revenue in fiscal year 2024", "highest_revenue"),
                            new ClarificationOption("opt_profit", "Net Profit (Bottom Line)", "Rank companies by net income after operating costs in 2024", "highest_profit"),
                            new ClarificationOption("opt_invest", "Highest Capital Investment in AI", "Total capital spent on computing, chips, and AI data centers", "highest_investment")
                    )
            ));
        }

        // 3. Ambiguity: "top ai models", "best models", "top models", "highest rated models"
        if (containsAny(q, "top ai models", "best ai models", "top models", "best models", "highest rated models")
                && !containsAny(q, "parameter", "benchmark", "score", "multimodal", "2024", "llm")) {
            return Optional.of(new ClarificationQuestion(
                    "clarify_top_models",
                    "How would you like to rank the AI models?",
                    "Models can be evaluated based on objective benchmark performance scores or overall parameter scale.",
                    Arrays.asList(
                            new ClarificationOption("opt_score", "Benchmark Performance Score", "Rank models by synthetic standard benchmark score (0-100)", "highest_score"),
                            new ClarificationOption("opt_params", "Parameter Count (Model Size)", "Rank models by scale in billions of parameters", "largest_parameters"),
                            new ClarificationOption("opt_multi", "Multimodal Models Only", "Filter specifically for multimodal AI systems released recently", "multimodal_models")
                    )
            ));
        }

        // 4. Ambiguity: "growing fast", "highest growth", "fastest growing"
        if (containsAny(q, "growing fast", "fastest growing", "high growth", "fastest company")
                && !containsAny(q, "revenue growth", "customer growth", "market share")) {
            return Optional.of(new ClarificationQuestion(
                    "clarify_growth_type",
                    "Which growth dimension would you like to evaluate?",
                    "Querify tracks both business financial revenue growth and market customer/user growth.",
                    Arrays.asList(
                            new ClarificationOption("opt_rev_growth", "Revenue Growth (%)", "Year-over-year percentage increase in company revenue", "revenue_growth"),
                            new ClarificationOption("opt_cust_growth", "Customer / User Growth (%)", "Percentage increase in adoption and user base", "customer_growth")
                    )
            ));
        }

        // 5. Ambiguity: "recent investments", "who invested the most", "investments"
        if (containsAny(q, "recent investments", "show investments", "biggest investments", "who invested")
                && !containsAny(q, "average", "category", "chips", "roi", "amount")) {
            return Optional.of(new ClarificationQuestion(
                    "clarify_investments",
                    "How would you like to evaluate AI investments?",
                    "Investment data can be sorted by capital volume or projected investment return.",
                    Arrays.asList(
                            new ClarificationOption("opt_inv_amount", "Highest Capital Amount (USD Millions)", "Rank the largest single AI capital allocations in 2024", "investment_amount"),
                            new ClarificationOption("opt_inv_roi", "Highest Estimated ROI (%)", "Rank investments by highest projected return percentage", "investment_roi"),
                            new ClarificationOption("opt_inv_infra", "Compute & Infrastructure Only", "Filter for investments in AI data centers and hardware chips", "investment_infra")
                    )
            ));
        }

        // 6. Ambiguity: "compare company performance", "compare companies"
        if (containsAny(q, "compare company performance", "compare companies", "performance comparison")
                && !containsAny(q, "revenue", "profit", "models", "2024", "share")) {
            return Optional.of(new ClarificationQuestion(
                    "clarify_compare",
                    "Which key performance indicators would you like to compare?",
                    "Select the primary comparison dimensions for evaluating company performance.",
                    Arrays.asList(
                            new ClarificationOption("opt_comp_fin", "Revenue and Net Profit (2024)", "Side-by-side comparison of top-line revenue and net profit", "compare_financials"),
                            new ClarificationOption("opt_comp_market", "Market Share and Performance Index", "Comparison of market dominance and overall health index", "compare_market"),
                            new ClarificationOption("opt_comp_invest", "AI Investments and ROI", "Comparison of total AI capital spent and estimated return", "compare_investments")
                    )
            ));
        }

        // 7. Ambiguity: "successful ai projects", "research projects"
        if (containsAny(q, "successful ai projects", "successful projects", "best research projects")
                && !containsAny(q, "budget", "completed", "active", "robotics")) {
            return Optional.of(new ClarificationQuestion(
                    "clarify_projects",
                    "How would you like to define successful research projects?",
                    "Research initiatives can be prioritized by budget scale or execution status.",
                    Arrays.asList(
                            new ClarificationOption("opt_proj_budget", "Largest Research Budgets", "Order projects by total budget allocation in millions USD", "project_budget"),
                            new ClarificationOption("opt_proj_completed", "Completed High-Impact Projects", "Filter for successfully completed research projects", "project_completed"),
                            new ClarificationOption("opt_proj_active", "Active Frontier Initiatives", "Filter for active research in areas like Reasoning and Robotics", "project_active")
                    )
            ));
        }

        return Optional.empty();
    }

    private boolean containsAny(String input, String... phrases) {
        for (String phrase : phrases) {
            if (input.contains(phrase)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Retrieves or creates a conversational session.
     */
    public ClarificationSession getOrCreateSession(String sessionId, String originalQuestion) {
        cleanupExpiredSessions();
        if (sessionId != null && sessionStore.containsKey(sessionId)) {
            return sessionStore.get(sessionId);
        }
        String id = sessionId != null && !sessionId.trim().isEmpty() ? sessionId : UUID.randomUUID().toString();
        ClarificationSession session = new ClarificationSession(id, originalQuestion);
        sessionStore.put(id, session);
        return session;
    }

    public ClarificationSession getSession(String sessionId) {
        return sessionStore.get(sessionId);
    }

    /**
     * Resolves the clarification option and synthesizes an augmented query intent.
     */
    public String buildResolvedIntent(ClarificationSession session, String optionId, String customInput) {
        ClarificationQuestion pending = session.getPendingQuestion();
        ClarificationOption chosenOption = null;

        if (pending != null && pending.getOptions() != null) {
            for (ClarificationOption opt : pending.getOptions()) {
                if (opt.getId().equalsIgnoreCase(optionId) || opt.getValue().equalsIgnoreCase(optionId)) {
                    chosenOption = opt;
                    break;
                }
            }
        }

        if (chosenOption == null) {
            chosenOption = new ClarificationOption(optionId, optionId, "User selected option", optionId);
        }

        session.resolve(chosenOption, customInput);

        String original = session.getOriginalQuestion();
        String metric = chosenOption.getValue();

        log.info("Clarification resolved: Session '{}', Metric '{}', Label '{}'", 
                session.getSessionId(), metric, chosenOption.getLabel());

        // Return a combined, definitive semantic instruction for SQL generation
        return original + " [Clarified Requirement: Filter/Rank by " + chosenOption.getLabel() + " (" + metric + ")]";
    }

    private void cleanupExpiredSessions() {
        sessionStore.entrySet().removeIf(entry -> entry.getValue().isExpired(SESSION_TTL_MS));
    }
}
