# Quick Start

This guide will get you running your first A/B test analysis in under 5 minutes.

## Choose Your Module

pyexptest has two main modules:

| Module | Use When |
|--------|----------|
| `conversion_effect` | Your metric is a rate (clicks, signups, purchases) |
| `numeric_effect` | Your metric is a number (revenue, time, score) |

## Example 1: Conversion Rate Test

You ran an A/B test on your signup button. Here's what happened:

- **Control**: 10,000 visitors, 500 signups (5.0%)
- **Variant**: 10,000 visitors, 600 signups (6.0%)

```python
from pyexptest import conversion_effect

result = conversion_effect.analyze(
    control_visitors=10000,
    control_conversions=500,
    variant_visitors=10000,
    variant_conversions=600,
)

print(f"Winner: {result.winner}")
print(f"Lift: {result.lift_percent:+.1f}%")
print(f"Significant: {result.is_significant}")
```

Output:
```
Winner: variant
Lift: +20.0%
Significant: True
```

## Example 2: Revenue Test

You tested a new checkout flow. Here's what happened:

- **Control**: 5,000 orders, $50 average, $25 std dev
- **Variant**: 5,000 orders, $52.50 average, $25 std dev

```python
from pyexptest import numeric_effect

result = numeric_effect.analyze(
    control_visitors=5000,
    control_mean=50.00,
    control_std=25.00,
    variant_visitors=5000,
    variant_mean=52.50,
    variant_std=25.00,
)

print(f"Winner: {result.winner}")
print(f"Lift: {result.lift_percent:+.1f}%")
print(f"Significant: {result.is_significant}")
```

## Example 3: Plan Your Test

Before running a test, calculate how many visitors you need:

```python
from pyexptest import conversion_effect

plan = conversion_effect.sample_size(
    current_rate=5,      # Your current 5% conversion rate
    lift_percent=10,     # You want to detect a 10% improvement
)

print(f"You need {plan.visitors_per_variant:,} visitors per variant")
print(f"Total: {plan.total_visitors:,} visitors")

# Add daily traffic to estimate duration
plan.with_daily_traffic(10000)  # 10k visitors/day
print(f"Duration: {plan.test_duration_days} days")
```

## Example 4: Generate a Report

Create a shareable report for stakeholders:

```python
from pyexptest import conversion_effect

result = conversion_effect.analyze(
    control_visitors=10000,
    control_conversions=500,
    variant_visitors=10000,
    variant_conversions=600,
)

report = conversion_effect.summarize(result, test_name="Signup Button Test")
print(report)
```

Output:
```markdown
## 📊 Signup Button Test Results

### ✅ Significant Result

**The test variant performed significantly higher than the control.**

- **Control conversion rate:** 5.00% (500 / 10,000)
- **Variant conversion rate:** 6.00% (600 / 10,000)
- **Relative lift:** +20.0% increase
- **P-value:** 0.0003
- **Confidence level:** 95%

### 📝 What This Means

With 95% confidence, the difference is statistically significant.
The variant shows a **20.0%** improvement over control.
```

## Next Steps

- [Sample Size Calculator](../guide/sample-size.md) - Plan your tests properly
- [Analyzing Results](../guide/analyzing-results.md) - Deep dive into analysis
- [Multi-Variant Tests](../guide/multi-variant.md) - Test 3+ variants at once
- [API Reference](../api/conversion_effect.md) - Full function documentation
