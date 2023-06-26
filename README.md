# Send Text Infra

I intended to use this code to deploy and run SMS based alerting from some apps I was developing for a series of fun smart-home projects. I have abandoned that work for now for a few reasons.

1. The Terraform Provider for AWS does not yet (as of writing this) support auto-generating new Phone Numbers for SNS to use
1. The Terraform Provider for AWS also does not allow you to break out of the SNS SMS Sandbox environment
1. Even if Terraform could automate the process, you need to register the 10 digit long code phone number with AWS's carrier (T-Mobile). There is a form for this, but it is annoying to say the least when all I want to do is send a message to my phone every once in a while from some code I wrote
1. Also phone numbers of any kind are not free even if you only plan on sending a few messages to a few numbers a few times a month

I looked into Twilio and they have the same issue where SMS Carriers are being required to have toll-free phone numbers registered with them or else the numbers will get blocked. This is likely a regulatory reaction to the abuse we all have endured thanks to spam/scam call/text bots over the last few years. On the one hand this is great and on the other this sucks for my use case.

## What's here?

It is a CDKTF (Terraform Cloud Development Kit) repo written in Typescript that gets most of this off of the ground.

- sets up the S3 Backend and applies it to all stacks
- wires up IAM Roles
- creates SNS resources and IAM User that will be used from a non-AWS application and grants it assume role privileges to the sns publish role

## Does it work?

I mean no. Because of all of the reasons described above.

## What is it good for?

I plan to keep it around if only to expedite any future setups of remote S3 backends and other IAM Policy related things in terraform. (Can you believe they want IAM Policies to be specified entirely as JSON strings? Ew. I made a few classes for that.)
