
Strategist Structured Intake / Task Packet Blueprint
Why structured intake

Strategist quality depends on clear context.

The user can still chat freely, but AI Command should convert requests into a structured strategy task packet.

Minimum intake fields
project
product/service
objective
target audience
market
offer
main benefit
key objection
channels
timeline
assets available
constraints
compliance sensitivity
Strategy task packet

Example internal packet shape:

{
  "specialist": "strategist",
  "intent": "create_campaign_strategy",
  "project": "selected_project",
  "input": {
    "product": "",
    "objective": "",
    "audience": "",
    "market": "",
    "offer": "",
    "benefit": "",
    "objection": "",
    "channels": [],
    "timeline": "",
    "assets": [],
    "constraints": []
  },
  "output": {
    "type": "campaign_brief",
    "include": [
      "objective",
      "audience_segments",
      "positioning",
      "offer_angles",
      "message_pillars",
      "channel_mix",
      "launch_phases",
      "creative_direction",
      "handoff_packet"
    ]
  },
  "safety": {
    "preview_only": true,
    "approval_required": true,
    "no_publish": true,
    "no_workflow_run": true
  }
}
Missing context behavior

If essential fields are missing, Strategist should not block the user with a long form.

It should show:

"I can start with assumptions"
"Answer 3 quick questions for a stronger plan"
"Use project defaults"
Field priority

Required:

product/service
objective
audience or market
offer or benefit

Helpful:

competitors
budget
channels
deadline
evidence

Optional:

brand tone
prior performance
compliance notes
