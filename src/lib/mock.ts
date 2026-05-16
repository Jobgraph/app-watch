import type { AnalysisType, Signal, WatchResult } from './types';

const performanceReview: Signal[] = [
  {
    severity: 'high',
    title: 'Revenue trend declining',
    detail:
      'Weekly revenue has dropped 23% over the past 4 weeks (from $182k to $140k). The decline accelerated in week 3 with a 12% single-week drop coinciding with the pricing page redesign.',
    action:
      'Roll back or A/B test the pricing page changes. Review conversion funnel stage-by-stage for the drop-off point and compare against the pre-change baseline.',
  },
  {
    severity: 'medium',
    title: 'Customer acquisition cost rising',
    detail:
      'CAC has increased from $34 to $51 (+50%) over the last 30 days. Paid search CPC is up 18% while organic traffic is flat. Cost per qualified lead is now $12.40 vs. target of $8.00.',
    action:
      'Audit underperforming ad groups and pause keywords with CPA above $60. Shift 20% of paid budget to retargeting campaigns which currently show 3x better ROI.',
  },
  {
    severity: 'medium',
    title: 'Conversion rate below target',
    detail:
      'Overall conversion rate is 2.1% against a 3.0% target. Mobile conversion (1.4%) is dragging the average down. Cart abandonment rate on mobile is 78% vs. 62% on desktop.',
    action:
      'Prioritise mobile checkout UX improvements. Implement one-click checkout for returning customers and test simplified mobile payment flow.',
  },
  {
    severity: 'low',
    title: 'Average order value stable',
    detail:
      'AOV is $67.30, within the normal range of $62-$72. Cross-sell uptake is 14%, slightly above the 12% benchmark.',
    action:
      'No immediate action required. Consider testing bundle offers to push AOV above $75 in Q3.',
  },
  {
    severity: 'low',
    title: 'Customer lifetime value on track',
    detail:
      'Projected 12-month CLV is $412, up 3% from last quarter. Repeat purchase rate is 38%, consistent with the 6-month trend.',
    action:
      'Continue current retention programmes. Monitor for impact of the loyalty tier changes launching next month.',
  },
];

const trendAnalysis: Signal[] = [
  {
    severity: 'high',
    title: 'Market share shift detected',
    detail:
      'Your category share has dropped from 18.4% to 15.7% over 90 days. Competitor X has gained 3.1 points, primarily in the mid-market segment where they launched a freemium tier.',
    action:
      'Conduct competitive pricing analysis for the mid-market segment. Consider a response strategy: either a competitive tier or enhanced feature differentiation.',
  },
  {
    severity: 'medium',
    title: 'Emerging competitor activity',
    detail:
      'Three new entrants have appeared in the past 60 days, collectively raising $47M in funding. Two are targeting your enterprise segment with AI-first positioning.',
    action:
      'Brief the product team on competitor capabilities. Accelerate your AI feature roadmap and strengthen enterprise customer relationships with proactive QBRs.',
  },
  {
    severity: 'medium',
    title: 'Seasonal pattern detected',
    detail:
      'Historical data shows a consistent 15-22% revenue dip in weeks 24-28 (late June to mid-July). Current trajectory is tracking toward the lower end at -20%.',
    action:
      'Pre-schedule promotional campaigns for the dip window. Adjust Q2 forecasts to account for seasonality and brief the board on expected temporary decline.',
  },
  {
    severity: 'low',
    title: 'Customer sentiment trending positive',
    detail:
      'Social mention sentiment has improved from 62% to 71% positive over 30 days. Product review average is 4.3 stars (up from 4.1). Main driver: recent reliability improvements.',
    action:
      'Amplify positive sentiment through case studies and testimonials. Maintain investment in reliability engineering that is driving the improvement.',
  },
  {
    severity: 'low',
    title: 'Product adoption rate increasing',
    detail:
      'Feature adoption for the new dashboard is 34% at day 14, ahead of the 25% benchmark. Power users are creating 2.8 custom views on average.',
    action:
      'Plan a broader rollout. Create guided tutorials for the remaining 66% of users and consider making the new dashboard the default experience.',
  },
];

const anomalyDetection: Signal[] = [
  {
    severity: 'high',
    title: 'Unusual traffic spike detected',
    detail:
      'Traffic surged 340% between 02:00-04:00 UTC, with 89% of requests originating from three IP ranges. Bot-like behaviour pattern: 98% bounce rate, 1.2s average session, no conversions.',
    action:
      'Implement rate limiting for the identified IP ranges immediately. Review WAF rules and consider adding CAPTCHA for suspicious traffic patterns. Check for infrastructure cost impact.',
  },
  {
    severity: 'high',
    title: 'Payment failure rate anomaly',
    detail:
      'Payment failures jumped from the baseline 2.3% to 11.8% in the last 6 hours. 73% of failures are "card_declined" errors concentrated on Stripe processor route B.',
    action:
      'Contact Stripe support regarding processor route B issues. Enable automatic failover to route A. Notify affected customers with retry instructions.',
  },
  {
    severity: 'medium',
    title: 'Login attempt anomaly',
    detail:
      'Failed login attempts are 4.7x the daily average (2,340 vs. typical 500). The attempts are distributed across 180+ accounts, suggesting a credential-stuffing attack.',
    action:
      'Enable enhanced rate limiting on the auth endpoint. Force password resets for accounts with failed attempts. Review and enable MFA prompts for affected users.',
  },
  {
    severity: 'low',
    title: 'Data quality issue detected',
    detail:
      'The "country" field in new sign-ups has 12% null values today vs. the usual 1-2%. Appears correlated with the v3.2 API update deployed at 10:00 UTC.',
    action:
      'Check the v3.2 API changes for missing field validation. Deploy a hotfix to enforce the required field. Backfill the null records from IP geolocation data.',
  },
];

const kpiHealthCheck: Signal[] = [
  {
    severity: 'high',
    title: 'NPS score critical',
    detail:
      'Net Promoter Score has dropped from 42 to 28 over 60 days. Detractors (scores 0-6) increased from 18% to 31%. Top complaint themes: "slow support response" and "missing features".',
    action:
      'Launch a detractor recovery programme with personalised outreach. Address the top two complaint categories: hire additional support staff and publish a feature roadmap.',
  },
  {
    severity: 'high',
    title: 'Churn rate above threshold',
    detail:
      'Monthly churn rate is 6.2% against a 4.0% target. Enterprise churn is 2.1% (healthy), but SMB churn is 9.8%. The 14 SMB churns this month cited "price vs. value" as the primary reason.',
    action:
      'Review SMB pricing and packaging urgently. Consider an SMB-specific tier with reduced scope. Implement churn prediction alerts to enable proactive retention outreach.',
  },
  {
    severity: 'medium',
    title: 'Monthly recurring revenue growth slowing',
    detail:
      'MRR is $1.24M, up 2.1% MoM vs. the 5% target. Net new MRR was $26k against $62k target. Expansion revenue ($18k) partially offset by contraction ($9k) and churn ($47k).',
    action:
      'Focus on expansion revenue: identify accounts with low feature adoption that could benefit from upselling. Launch a win-back campaign targeting recent churns with a limited offer.',
  },
  {
    severity: 'medium',
    title: 'Support ticket resolution time degraded',
    detail:
      'Average first-response time is 8.4 hours vs. the 4-hour SLA. Resolution time is 2.6 days vs. 1.5-day target. Ticket volume is up 34% but team capacity has not changed.',
    action:
      'Approve the two pending support hires immediately. Implement AI-assisted ticket triage to reduce first-response time. Escalate SLA breaches to team leads daily.',
  },
  {
    severity: 'low',
    title: 'Employee satisfaction stable',
    detail:
      'eNPS is 36 (target: 30+). Engagement survey participation was 82%. Areas of concern: "career growth" scored 3.1/5 and "work-life balance" scored 3.4/5.',
    action:
      'Address career growth concerns with published promotion criteria and mentorship programme. Monitor work-life balance scores following the recent workload increases.',
  },
  {
    severity: 'low',
    title: 'Cash runway healthy',
    detail:
      'Current runway is 22 months at the present burn rate of $180k/month. Cash reserves are $3.96M. Revenue covers 68% of operating costs, up from 61% last quarter.',
    action:
      'No immediate action needed. Continue tracking towards the 18-month minimum runway policy. Model the impact of planned Q3 hires on burn rate.',
  },
];

const analysisMap: Record<AnalysisType, Signal[]> = {
  'performance-review': performanceReview,
  'trend-analysis': trendAnalysis,
  'anomaly-detection': anomalyDetection,
  'kpi-health-check': kpiHealthCheck,
};

export function getMockAnalysis(
  _input: string,
  analysisType: AnalysisType,
): WatchResult {
  return {
    signals: analysisMap[analysisType],
    analysisType,
  };
}
