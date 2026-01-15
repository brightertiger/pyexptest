# timing

**Timing Effects** — *When* it happens

The `timing` module provides tools for analyzing experiments where you care about *when* an event occurs: time to first purchase, time to churn, time to activation.

!!! warning "Coming Soon"
    The timing module is under development. This page describes the planned API.

## Planned Features

### Survival Analysis

```python
from pyexptest import timing

result = timing.analyze(
    control_times=[...],      # Time values
    control_events=[...],     # 1 = event occurred, 0 = censored
    treatment_times=[...],
    treatment_events=[...],
)

print(f"Hazard ratio: {result.hazard_ratio:.2f}")
print(f"Median time (control): {result.control_median_time}")
print(f"Median time (treatment): {result.treatment_median_time}")
print(f"Significant: {result.is_significant}")
```

### Kaplan-Meier Curves

```python
curve = timing.kaplan_meier(
    times=[...],
    events=[...],
    confidence=95,
)

# Returns survival probabilities at each time point
print(curve.times)
print(curve.survival_probabilities)
```

### Statistical Methods

The timing module will support:

| Method | Purpose |
|--------|---------|
| **Kaplan-Meier** | Non-parametric survival curve estimation |
| **Log-rank test** | Compare survival between groups |
| **Cox proportional hazards** | Estimate hazard ratios |
| **Restricted mean survival time (RMST)** | Compare average time-to-event |

## Use Cases

- **Time to first purchase** — Does a welcome email speed up first purchase?
- **Time to churn** — Does a new feature reduce churn rate?
- **Time to activation** — Does onboarding UX speed up activation?
- **Time to open email** — Does subject line affect open timing?

## Why Timing Effects Matter

A treatment might not change *whether* users convert, but it might change *when* they convert. Standard A/B tests miss this entirely.

Example:
- Control: 50% purchase within 30 days
- Treatment: 50% purchase within 30 days

Same conversion rate! But:
- Control: Median time to purchase = 14 days
- Treatment: Median time to purchase = 7 days

The treatment *doubles* the speed of conversion. That's a huge business impact that conversion effects alone would miss.

## Subscribe for Updates

The timing module is planned for Q2 2026. Watch the GitHub repo for updates.
