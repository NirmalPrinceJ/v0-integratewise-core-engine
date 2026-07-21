# AI Integration Guide

Complete documentation for AI models, agents, and insights throughout the Integratewise application.

## Overview

The application now has comprehensive AI integration providing:

- Real-time metric insights and analysis
- Predictive forecasting and trends
- AI-powered recommendations
- Conversational AI agent interface
- Tool-based agent capabilities

## Architecture

### Core Components

1. **AI Hooks** - React hooks for AI features
   - `useAIInsights` - Generate insights from metrics
   - `useWorkbenchAI` - Comprehensive workbench AI
   - `useAIAgent` - Chat-based agent interaction

2. **API Endpoints** - Backend services
   - `POST /api/ai/insights` - Generate insights
   - `POST /api/ai/analyze` - Stream analysis
   - `POST /api/ai/predict` - Generate predictions
   - `GET /api/ai/recommendations/[workbench]/[metricId]` - Get recommendations
   - `POST /api/ai/compare` - Compare metrics
   - `POST /api/ai/agent/chat` - Agent chat interface

3. **AI Components** - Reusable UI components
   - `AIMetricCard` - Enhanced metric display with insights
   - `CustomerSuccessWithAI` - Complete example workbench

4. **Agent Tools** - Tool definitions for agents
   - `analyze_metric` - Deep metric analysis
   - `get_metric_data` - Metric retrieval
   - `get_recommendations` - AI recommendations
   - `generate_forecast` - Predictions
   - `compare_metrics` - Comparison
   - `create_action_plan` - Action planning
   - `get_department_health` - Health assessment

## Quick Start

### Using AI Insights in a Component

```tsx
import { useWorkbenchAI } from "@/lib/hooks/useWorkbenchAI";
import { AIMetricCard } from "@/components/workbench/ai-metric-card";

export function MyWorkbench() {
  const { insights, recommendations, analysis } = useWorkbenchAI({
    workbench: "customer-success",
    metricContext: {
      nrr: { current: 108, trend: 2.5 },
      "health-score": { current: 78, trend: -1.2 },
    },
  });

  return (
    <div>
      {insights.map((insight) => (
        <div key={insight.id}>
          <h3>{insight.title}</h3>
          <p>{insight.description}</p>
        </div>
      ))}

      <AIMetricCard
        workbench="customer-success"
        metricId="nrr"
        title="NRR"
        value="108%"
        showRecommendations={true}
      />
    </div>
  );
}
```

### Using AI Agent

```tsx
import { useAIAgent } from "@/lib/hooks/useAIAgent";

export function AIAssistant() {
  const { messages, sendMessage, isLoading } = useAIAgent({
    workbench: "customer-success",
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input
        onKeyDown={(e) => e.key === "Enter" && sendMessage(e.currentTarget.value)}
        placeholder="Ask the AI agent..."
      />
    </div>
  );
}
```

### Displaying Predictions

```tsx
import { useWorkbenchAI } from "@/lib/hooks/useWorkbenchAI";

export function PredictionDisplay() {
  const { predictions, generatePredictions } = useWorkbenchAI({
    workbench: "sales-operations",
    metricContext: {
      /* ... */
    },
  });

  return (
    <div>
      <button onClick={generatePredictions}>Generate Forecast</button>
      {Object.entries(predictions).map(([key, pred]) => (
        <div key={key}>
          <p>
            {pred.metric}: {pred.current} → {pred.predicted}
          </p>
          <p>Confidence: {(pred.confidence * 100).toFixed(0)}%</p>
        </div>
      ))}
    </div>
  );
}
```

## Hook Reference

### useWorkbenchAI

Comprehensive AI integration for workbenches.

```ts
const {
  insights, // AIInsight[]
  recommendations, // Record<string, string[]>
  analysis, // string
  predictions, // Record<string, any>
  isLoading, // boolean
  error, // string | null
  generateAnalysis, // (focusArea?: string) => Promise<string>
  generatePredictions, // () => Promise<Record<string, any>>
  hasInsights, // boolean
  hasAnalysis, // boolean
  hasPredictions, // boolean
} = useWorkbenchAI({
  workbench: "customer-success",
  metricContext: {
    /* metrics data */
  },
  enableAnalysis: true,
  enablePredictions: true,
  enableRecommendations: true,
  refreshInterval: 60000,
});
```

### useAIInsights

Generate insights from metric context.

```ts
const {
  insights, // AIInsight[]
  isLoading, // boolean
  error, // Error | null
  refetch, // () => void
} = useAIInsights(
  {
    workbench: "customer-success",
    context: {
      /* metrics */
    },
    metricType: "health-score",
    includeRecommendations: true,
    includePredictions: true,
  },
  {
    enabled: true,
    refetchInterval: 60000,
    staleTime: 30000,
  }
);
```

### useAIAgent

Chat interface with AI agent.

```ts
const {
  messages, // Message[]
  isLoading, // boolean
  error, // string | null
  sendMessage, // (msg: string) => Promise<Message>
  clearMessages, // () => void
  retryLastMessage, // () => Promise<void>
} = useAIAgent({
  workbench: "customer-success",
  onMessageReceived: (msg) => console.log(msg),
  onError: (err) => console.error(err),
});
```

## API Reference

### POST /api/ai/insights

Generate AI insights from metrics.

**Request:**

```json
{
  "workbench": "customer-success",
  "context": { "nrr": 108, "health": 78 },
  "metricType": "health-score",
  "includeRecommendations": true,
  "includePredictions": false
}
```

**Response:**

```json
[
  {
    "id": "insight-123456",
    "workbench": "customer-success",
    "title": "NRR is Above Target",
    "description": "Your NRR is performing 8% above target...",
    "severity": "info",
    "actionItems": ["Continue current strategy", "Identify expansion opportunities"],
    "confidence": 0.85,
    "generatedAt": 1234567890
  }
]
```

### POST /api/ai/analyze

Stream AI analysis response.

**Request:**

```json
{
  "workbench": "customer-success",
  "context": {
    /* metrics */
  },
  "focusArea": "account health"
}
```

**Response:** Streaming text/event-stream

### POST /api/ai/predict

Generate predictions and forecasts.

**Request:**

```json
{
  "workbench": "sales-operations",
  "context": {
    /* historical data */
  },
  "timeframe": "1month",
  "confidenceThreshold": 0.7
}
```

**Response:**

```json
{
  "predictions": [
    {
      "metric": "pipeline",
      "current": 500000,
      "predicted": 580000,
      "change": 80000,
      "changePercent": 16,
      "confidence": 0.82,
      "timeframe": "1month",
      "reasoning": "Based on historical trends..."
    }
  ],
  "timeframe": "1month",
  "generatedAt": "2026-07-01T00:00:00Z"
}
```

### GET /api/ai/recommendations/[workbench]/[metricId]

Get AI recommendations for a metric.

**Response:**

```json
{
  "recommendations": [
    "Increase EBR frequency to 2x monthly",
    "Implement automated health score reviews",
    "Create expansion playbook for high-growth segments"
  ]
}
```

### POST /api/ai/agent/chat

Chat with AI agent.

**Request:**

```json
{
  "workbench": "customer-success",
  "message": "What are the top expansion opportunities?",
  "context": [
    { "role": "user", "content": "Previous message..." },
    { "role": "assistant", "content": "Previous response..." }
  ]
}
```

**Response:**

```json
{
  "message": "Based on your data, I identified 3 expansion opportunities...",
  "toolCalls": [],
  "toolResults": {}
}
```

## Component Reference

### AIMetricCard

Enhanced metric card with AI insights.

```tsx
<AIMetricCard
  workbench="customer-success"
  metricId="nrr"
  title="Net Revenue Retention"
  value="108%"
  unit="YoY"
  trend={2.5}
  threshold={100}
  thresholdType="above"
  context={
    {
      /* optional */
    }
  }
  showRecommendations={true}
  showPrediction={false}
/>
```

**Props:**

- `workbench`: Workbench name
- `metricId`: Unique metric identifier
- `title`: Display title
- `value`: Metric value
- `unit`: Unit of measurement
- `trend`: Change percentage (positive/negative)
- `threshold`: Target/threshold value
- `thresholdType`: "above" | "below"
- `context`: Optional additional context
- `showRecommendations`: Show AI recommendations
- `showPrediction`: Show prediction (if available)

### CustomerSuccessWithAI

Complete example workbench with AI integration.

Shows:

- AI-enhanced metric cards
- Real-time analysis
- Predictions
- Recommendations
- Conversational AI agent

Use as template for other workbenches.

## Agent Tools

### analyze_metric

Deep analysis of a specific metric.

```ts
await analyze_metric({
  workbench: "customer-success",
  metricId: "nrr",
  timeframe: "1month",
  focusArea: "enterprise segment",
});
```

### get_recommendations

AI-powered recommendations.

```ts
await get_recommendations({
  workbench: "sales-operations",
  metricId: "pipeline_coverage",
  priorityLevel: "high",
});
```

### generate_forecast

Predictive forecasting.

```ts
await generate_forecast({
  workbench: "finance",
  metricId: "arpu",
  forecastPeriod: "3month",
  includeConfidenceInterval: true,
});
```

### create_action_plan

Automated action plan generation.

```ts
await create_action_plan({
  workbench: "customer-success",
  objective: "Reduce churn from 5% to 2%",
  timeframe: "1month",
  resources: ["CS team", "Product"],
});
```

## Configuration

### Environment Variables

Ensure these are set in your environment:

```env
# AI Gateway (optional, uses Vercel AI Gateway by default)
AI_GATEWAY_API_KEY=your_api_key

# Agent Provider (defaults to 'vercel-ai')
NEXT_PUBLIC_AGENT_PROVIDER=vercel-ai
```

### Feature Flags

AI features are controlled via feature flags in `lib/ai-features.ts`:

```ts
import { isFeatureEnabled, updateFeatureConfig } from "@/lib/ai-features";

// Check if feature is enabled
if (isFeatureEnabled("insight_generation", userId)) {
  // Use insights feature
}

// Enable feature for rollout
updateFeatureConfig("insight_generation", {
  enabled: true,
  rolloutPercentage: 50,
});
```

## Performance Considerations

1. **Caching**: Insights are cached for 30 seconds by default
2. **Streaming**: Analysis uses streaming for better UX
3. **Parallel Requests**: Multiple insights can be fetched in parallel
4. **Rate Limiting**: Consider implementing rate limiting for agent calls

## Error Handling

All hooks provide error states:

```tsx
const { insights, error, isLoading } = useWorkbenchAI({
  /* ... */
});

if (error) {
  return <div>Error: {error}</div>;
}

if (isLoading) {
  return <div>Loading...</div>;
}
```

## Examples

See `components/workbench/examples/customer-success-with-ai.tsx` for a complete working example showing:

- Multi-tab interface
- Metric cards with insights
- Streaming analysis
- Predictions display
- Recommendations
- Agent chat UI

## Best Practices

1. **Start with insights** - Enable chat_interface first, then gradually enable other features
2. **Cache aggressively** - Reuse insights within their TTL
3. **Stream large responses** - Use streaming for analysis instead of waiting
4. **Provide context** - Include relevant metrics in context for better insights
5. **Handle errors gracefully** - Always have fallbacks for when AI features fail
6. **Monitor costs** - Track API usage and adjust rollout percentages
7. **Test with real data** - Validate insights against actual business outcomes

## Troubleshooting

### "AI_GATEWAY_API_KEY is not set"

Set the environment variable in your `.env.local`:

```env
AI_GATEWAY_API_KEY=your_api_key_here
```

### "Unauthorized" errors

Ensure you're authenticated via Clerk before making requests to AI endpoints.

### Slow responses

- Check network latency to AI Gateway
- Consider caching results longer
- Enable streaming for large responses
- Check model availability

### No insights generated

- Verify context data is being passed correctly
- Check feature flags in `ai-features.ts`
- Ensure workbench name is recognized
- Check agent logs for errors

## Future Enhancements

- [ ] Real-time metric streaming
- [ ] Custom model selection per workbench
- [ ] Advanced tool definitions for specific departments
- [ ] Workflow automation based on AI recommendations
- [ ] Multi-turn complex workflows
- [ ] Integration with external data sources
- [ ] Custom agent training

## References

- AI SDK: https://ai-sdk.dev
- Vercel AI Gateway: https://vercel.com/ai-gateway
- Feature Flags: See `lib/ai-features.ts`
- Agent Tools: See `lib/agent/tools.ts`
